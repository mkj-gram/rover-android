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

        if (this._action == "update") {
            this._eventId = 62;
        } else {
            this._eventId = 61;
        }
        
        this._location = {
            latitude: this._latitude,
            longitude: this._longitude,
            accuracy: this._accuracy || 5000,
            timestamp: moment.utc(new Date).toDate()
        };
    }

    process(callback) {

        this._device.location = this._location;

        this._getBeaconRegions((err, beaconRegions) => {
            if (err) {
                return callback(err);
            }

            this._beaconRegionsMonitoring = beaconRegions;

            this._getGeofenceRegions(this._regionLimit - beaconRegions.length, (err, geofenceRegions) => {
                if (err) {
                    return callback(err);
                }

                this._geofenceRegionsMonitoring = geofenceRegions;

                return callback();
            });
        });    
    }

    shouldProcessEvent(callback) {

        if (this._device.gimbal_mode == true) {
            return callback(false);
        }

        if (this._device.location) {
            let distance = internals.getDistance(this._device.location, this._location);
            if ((distance >= 50 && this._location.accuracy <= 200) || distance > 5000) {
               return callback(true);
            }
        } else if (util.isNullOrUndefined(this._device.location)) {
            return callback(true);
        }
        
        return callback(false);
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

    _getBeaconRegions(callback) {
        const device = this._device;
        const account = this._account;

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

    _getGeofenceRegions(limit, callback) {
        const device = this._device;
        const account = this._account;

        if (device.gimbal_mode == true) {
            return callback(null, []);
        }

        let shouldReloadGeofences = false;

        if (account.places_count <= limit) {
            if (util.isNullOrUndefined(device.geofence_regions_monitoring_updated_at) || account.places_updated_at > device.geofence_regions_monitoring_updated_at) {
                shouldReloadGeofences = true;
            }
        } else {
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

        const logger = this._server.plugins.logger.logger;

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
            
            logger.debug(places);

            let geofenceRegions = places.map((place) => {
                return { id: `${place._source.location.lat}:${place._source.location.lon}:${place._source.radius}`, latitude: place._source.location.lat, longitude: place._source.location.lon, radius: place._source.radius }
            });

            logger.debug(geofenceRegions);

            geofenceRegions = geofenceRegions.filter(region => !util.isNullOrUndefined(region.id));

            return callback(null, geofenceRegions);
        });
    }
}

module.exports = LocationBaseProcessor;
