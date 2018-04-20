const util = require('util');
const BaseProcessor = require('./base-processor');
const log4js = require('log4js');
const logger = log4js.getLogger('[LocationBaseProcessor]');
const moment = require('moment');
var _ = require('underscore');

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
        
        this._longitude = args.event.attributes.longitude;
        this._latitude = args.event.attributes.latitude;
        this._accuracy = parseInt(args.event.attributes.accuracy || args.event.attributes.radius) || null;

        if (this._device.os_name == "iOS") {
            this._regionLimit = 20;
        } else {
            this._regionLimit = 100;
        }
        
        this._location = {
            latitude: this._latitude,
            longitude: this._longitude,
            accuracy: this._accuracy || 5000,
            timestamp: moment.utc(new Date).toDate()
        };

        this._geofenceRegionsChanged = false;
        this._beaconRegionsChanged = false;
    }

    valid() {
        if (super.valid() == false) {
            return false;
        }

        if (util.isNullOrUndefined(this._location.latitude)) {
            this._validationError = "Missing latitude from argument list";
            return false;
        }

        if (!(this._location.latitude >= -90 && this._location.latitude <= 90)) {
            this._validationError = "Latitude must be between -90 and 90";
            return false;
        }

        if (!(this._location.longitude >= -180 && this._location.longitude <= 180)) {
            this._validationError = "Longitude must be between -180 and 180";
            return false;
        }

        if (util.isNullOrUndefined(this._location.accuracy)) {
            this._validationError = "Missing accuracy from argument list";
            return false
        }

        return true;
    }

    process(callback) {

        this._device.location_accuracy = this._location.accuracy
        this._device.location_longitude = this._location.longitude
        this._device.location_latitude = this._location.latitude

        this._getBeaconRegions((err, beaconRegions) => {
            if (err) {
                return callback(err);
            }

            this._beaconRegionsMonitoring = beaconRegions;

            if (!_.isEqual(this._device.ibeacon_monitoring_regions, this._beaconRegionsMonitoring)) {
                this._beaconRegionsChanged = true;
                this._device.ibeacon_monitoring_regions = this._beaconRegionsMonitoring;
            }
                

            this._getGeofenceRegions(this._regionLimit - this._beaconRegionsMonitoring.length, (err, geofenceRegions) => {
                if (err) {
                    return callback(err);
                }

                this._geofenceRegionsMonitoring = geofenceRegions;

                if (!_.isEqual(this._device.geofence_monitoring_regions, this._geofenceRegionsMonitoring)) {
                    this._geofenceRegionsChanged = true;
                    this._device.geofence_monitoring_regions = this._geofenceRegionsMonitoring;
                }


                return callback();
            });
        });    
    }

    shouldProcessEvent(callback) {


        if (this._device.location_longitude !== 0 && this._device.location_latitude !== 0 && !util.isNullOrUndefined(this._device.location_longitude) && !util.isNullOrUndefined(this._device.location_latitude)) {
            let distance = internals.getDistance({ latitude: this._device.location_latitude , longitude: this._device.location_longitude }, this._location);
            let shouldProcess = this._device.os_name == "iOS" || distance > 5000 || (distance >= 50 && this._location.accuracy <= 200)
            return callback(shouldProcess);
        } else if ((this._device.location_longitude === 0 && this._device.location_latitude === 0) || (util.isNullOrUndefined(this._device.location_longitude) && util.isNullOrUndefined(this._device.location_latitude)) ) {
            // Always process events from devices which don't currently have a location
            return callback(true);
        }
        
        return callback(false);
    }

    toResponse() {
        let json = super.toResponse();

        let included = [];

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

            included = included.concat(beaconRegionsResponse);
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

            included = included.concat(geofenceRegionsResponse);
        }

        if (included.length > 0) {
            if (util.isNullOrUndefined(json.included)) {
                json.included = included;
            } else {
                json.included = json.included.concat(included);
            }
        }

        return json;
    }

    _getBeaconRegions(callback) {
        const device = this._device;
        const account = this._account;

        if (util.isNullOrUndefined(device.ibeacon_monitoring_regions_updated_at) || account.beacon_configurations_updated_at > device.ibeacon_monitoring_regions_updated_at) {
            this._iBeaconWildcardRegions((err, regions) => {
                if (err) {
                    return callback(err);
                }

                regions.sort((regionA, regionB) => regionA.uuid > regionB.uuid);

                return callback(null, regions);
            });
        } else {
            // Regions haven't updated so use the cached version
            return callback(null,  this._device.ibeacon_monitoring_regions || []);
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
            if (util.isNullOrUndefined(device.geofence_monitoring_regions_updated_at) || account.places_updated_at > device.geofence_monitoring_regions_updated_at) {
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

                return callback(null, geofenceRegions);
            });
        } else {
            return callback(null, device.geofence_monitoring_regions);
        }
    }

    _iBeaconWildcardRegions(callback) {
        if (this._device.os_name != IOS_DEVICE_PLATFORM) {
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
                return { uuid: uuid, 'major': null, 'minor': null }
            });

            return callback(null, beaconRegions);
        });
    }

    _closestGeofenceRegions(limit = 20, callback) {
        const methods = this._server.methods;
        const logger = this._server.plugins.logger.logger;

        if (util.isNullOrUndefined(this._longitude) || util.isNullOrUndefined(this._latitude)) {
            return callback(null, null);
        }

        methods.place.closestPlaces(this._account, this._latitude, this._longitude, limit, (err, places) => {
            if (err) {
                return callback(err);
            }

            let geofenceRegions = places.map((place) => {
                return { id: `${place.latitude}:${place.longitude}:${place.radius}`, latitude: place.latitude, longitude: place.longitude, radius: place.radius }
            });

            geofenceRegions = geofenceRegions.filter(region => !util.isNullOrUndefined(region.id) && util.isString(region.id) && region.id.length > 0 );

            return callback(null, geofenceRegions);
        });
    }
}

module.exports = LocationBaseProcessor;
