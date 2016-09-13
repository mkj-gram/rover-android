const util = require('util');
const BaseProcessor = require('./base-processor');
const log4js = require('log4js');
const logger = log4js.getLogger('[LocationBaseProcessor]');
const moment = require('moment');

const IOS_DEVICE_PLATFORM = 'iOS';

const radPerDeg = Math.PI / 180;

let internals = {};

// returns the distance in metres between 2 geo points using Haversine formula
internals.getDistance = function(location1, location2) {

    const dlat_rad = (location2.latitude - location1.latitude) * radPerDeg;  // Delta, converted to rad
    const dlng_rad = (location2.longitude - location1.longitude) * radPerDeg;

    const lat1_rad = location1.latitude * radPerDeg;
    const lat2_rad = location2.latitude * radPerDeg;

    const lng1_rad = location1.longitude * radPerDeg;
    const lng2_rad = location2.longitude * radPerDeg;

    const a = Math.pow(Math.sin(dlat_rad/2), 2) + Math.cos(lat1_rad) * Math.cos(lat2_rad) * Math.pow(Math.sin(dlng_rad/2), 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return 6371000 * c;
};

class LocationBaseProcessor extends BaseProcessor {

    constructor(args) {
        super(args);
        
        this._longitude = args.input.longitude;
        this._latitude = args.input.latitude;
        this._accuracy = args.input.accuracy || args.input.radius;
        if (this._device.platform == IOS_DEVICE_PLATFORM) {
            this._regionLimit = 20;
        } else {
            this._regionLimit = 100;
        }
        
    }

    initialize(callback) {

        if (this._device.gimbal_mode == true) {
            return callback();
        }
        // what is the current location we only want to update the location if they have moved more than 1km
        // we don't need to track the user as they are driving on the highway not useful info
        // until we can explore big data options the frequency at which we track updates needs to be higher
        let newLocation = {
            latitude: this._latitude,
            longitude: this._longitude,
            accuracy: this._accuracy,
            timestamp: moment.utc(new Date).toDate()
        }

        // check to see if we should update the device's location or not
        
        let updatedDevicesLocation = false;

        if (util.isNullOrUndefined(this._device.location) || (this._device.location && internals.getDistance(this._device.location, newLocation) > 1000)) {
            this._device.location = newLocation;
            updatedDevicesLocation = true;
        }

        this._getBeaconRegions(updatedDevicesLocation, (err, beaconRegions) => {
            if (err) {
                return callback(err);
            }

            this._beaconRegionsMonitoring = beaconRegions;

            this._getGeofenceRegions(updatedDevicesLocation, this._regionLimit - beaconRegions.length, (err, geofenceRegions) => {
                if (err) {
                    return callback(err);
                }

                this._geofenceRegionsMonitoring = geofenceRegions;

                return callback();
            });
        });
    }

    toResponse() {
        let json = super.toResponse();

        if (util.isNullOrUndefined(json.included)) {
            json.included = [];
        }

        if (this._beaconRegionsMonitoring) {
            let beaconRegionsResponse =  this._beaconRegionsMonitoring.map((beaconRegion) => {
                return {
                    type: 'ibeacon-regions',
                    id: beaconRegion.uuid,
                    attributes: {
                        uuid: beaconRegion.uuid,
                        'major-number': null,
                        'minor-number': null
                    }
                }
            });

            json.included = json.included.concat(beaconRegionsResponse);
        }

        if (this._geofenceRegionsMonitoring) {
            let geofenceRegionsResponse = this._geofenceRegionsMonitoring.map((geofenceRegion) => {
                return {
                    type: 'geofence-regions',
                    id: geofenceRegion.id,
                    attributes: {
                        latitude: geofenceRegion.latitude,
                        longitude: geofenceRegion.longitude,
                        radius: geofenceRegion.radius
                    }
                }
            });

            json.included = json.included.concat(geofenceRegionsResponse);
        }

        return json;
    }

        // (callback) {

        // if (this._beaconRegionsMonitoring) {
        //     this._device.beacon_regions_monitoring = this._beaconRegionsMonitoring.map(region => {
        //         return {
        //             uuid: region.uuid,
        //             major_number: region.['major-number'],
        //             minor_number: region.['minor-number']
        //         }
        //     });
        // }

        // if (this._geofenceRegionsMonitoring) {
        //     this._device.geofence_regions_monitoring = this._geofenceRegionsMonitoring.map(region => {
        //         return {
        //             id: region.id,
        //             longitude: region.longitude,
        //             latitude: region.latitude,
        //             radius: region.radius
        //         }
        //     });
        // }

        // return callback();
    // }

    _getBeaconRegions(didUpdateDeviceLocation, callback) {
        const device = this._device;
        const account = this._account;

        if (device.gimbal_mode == true) {
            return callback(null, []);
        }

        if (util.isNullOrUndefined(device.beacon_regions_monitoring_updated_at) || account.beacon_configurations_updated_at > device.beacon_regions_monitoring_updated_at) {
            this._iBeaconWildcardRegions((err, regions) => {
                if (err) {
                    return callback(err);
                }

                let beaconRegions = regions.map(region => {
                    return {
                        uuid: region.uuid,
                        major_number: region['major-number'],
                        minor_number: region['minor-number']
                    }
                });

                beaconRegions.sort((regionA, regionB) => regionA.uuid > regionB.uuid);

                device.beacon_regions_monitoring = beaconRegions;
                device.beacon_regions_monitoring_updated_at = moment.utc(new Date()).toDate();
                return callback(null, device.beacon_regions_monitoring);
            });
        } else {
            // Regions haven't updated so use the cached version
            return callback(null, device.beacon_regions_monitoring || []);
        }
    }

    _getGeofenceRegions(didUpdateDeviceLocation, limit, callback) {
        const device = this._device;
        const account = this._account;

        if (device.gimbal_mode == true) {
            return callback(null, []);
        }

        let shouldReloadGeofences = false;

        if (account.places_count <= limit) {
            if (util.isNullOrUndefined(device.geofence_regions_monitoring_updated_at) || account.places_updated_at > device.geofence_regions_monitoring_updated_at) {
                shouldReloadGeofences = false;
            }
        } else if(didUpdateDeviceLocation) {
            shouldReloadGeofences = true
        }

        if (shouldReloadGeofences) {
            this._closestGeofenceRegions(limit, (err, regions) => {
                if (err) {
                    return callback(err);
                }

                let geofenceRegions = regions.map(region => {
                    return {
                        id: region.id,
                        longitude: region.longitude,
                        latitude: region.latitude,
                        radius: region.radius
                    }
                });

                geofenceRegions.sort((regionA, regionB) => regionA.id > regionB.id);

                device.geofence_regions_monitoring = geofenceRegions;
                device.geofence_regions_monitoring_updated_at = moment.utc(new Date()).toDate();
                return callback(null, device.geofence_regions_monitoring);
            });
        } else {
            return callback(null, device.geofence_regions_monitoring);
        }
    }

    _iBeaconWildcardRegions(callback) {
        if (this._device.platform != IOS_DEVICE_PLATFORM) {
            return callback(null, []);
        }

        let methods = this._server.methods;

        methods.activeConfigurationUUID.findByAccountId(this._account.id, (err, activeUUIDs) => {
            if (err) {
                // don't error out if we can look up
                console.error(err);
                return callback(null, []);
            }

            let uuids = activeUUIDs.configuration_uuids;
            let beaconRegions = uuids.map((uuid) => {
                return { uuid: uuid, 'major-number': null, 'minor-number': null }
            });

            return callback(null, beaconRegions);
        });
    }

    _closestGeofenceRegions(limit = 20, callback) {

        if (util.isNullOrUndefined(this._longitude) || util.isNullOrUndefined(this._latitude)) {
            return callback(null, null);
        }

        const query = {
            size: limit,
            filter: {
                term: {
                    account_id: this._account.id
                }
            },
            sort: [
                {
                    '_geo_distance': {
                        location: {
                            lat: this._latitude,
                            lon: this._longitude
                        },
                        order: 'asc',
                        unit: 'km',
                        distance_type: 'plane'
                    }
                }
            ]
        }

        let elasticsearch = this._server.plugins.elasticsearch.client;
        elasticsearch.search({ index: 'places', type: 'place', body: query }, (err, response) => {
            if (err) {
                return callback(err);
            }

            let places = response.hits.hits;
            
            let geofenceRegions = places.map((place) => {
                return { id: `${place._source.location.lat}:${place._source.location.lon}:${place._source.radius}`, latitude: place._source.location.lat, longitude: place._source.location.lon, radius: place._source.radius }
            });

            return callback(null, geofenceRegions);
        });
    }
}

module.exports = LocationBaseProcessor;
