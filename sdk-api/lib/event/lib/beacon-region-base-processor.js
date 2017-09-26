const util = require('util');
const BaseProcessor = require('./base-processor');
const Config = require('../../../config');
const log4js = require('log4js');
const logger = log4js.getLogger('[BeaconRegionBaseProcessor]');
const moment = require('moment');

logger.setLevel(Config.get('/log/level'));

class BeaconRegionBaseProcessor extends BaseProcessor {

    constructor(args) {
        super(args);
        

        this._configurationId = args.event.attributes['configuration-id'];
        this._uuid = args.event.attributes.uuid
        this._majorNumber = args.event.attributes['major-number'];
        this._minorNumber = args.event.attributes['minor-number'];

        this._namespace = args.event.attributes['namespace'];
        this._instanceId = args.event.attributes['instance-id'];

        if (!util.isNullOrUndefined(this._uuid) && !util.isNullOrUndefined(this._majorNumber) && !util.isNullOrUndefined(this._minorNumber)) {
            this._protocol = 'ibeacon';
        } else if (this._namespace && this._instanceId) {
            this._protocol = 'eddystone-namespace';
        }

    }

    _getTriggerArguments() {
        let args = {};

        if (this._beaconConfiguration) {
            util._extend(args, { _beaconConfiguration: this._beaconConfiguration });
        }

        if (this._place) {
            util._extend(args, { _place: this._place });
        }

        return args;
    }

    valid() {
        if (super.valid() == false) {
            return false;
        }

        if (this._protocol == 'ibeacon') {
            if (this._configurationId) {
                return true
            } else if(!(util.isNullOrUndefined(this._uuid) && util.isNullOrUndefined(this._majorNumber) && util.isNullOrUndefined(this._minorNumber))) {
                return true
            } else {
                this._validationError = "Missing required arguments for ibeacon protocol";
                return false;
            }
        } else if(this._protocol == 'eddystone-namespace') {
            if (util.isNullOrUndefined(this._namespace) && util.isNullOrUndefined(this._instanceId)) {
                return true;
            } else {
                this._validationError = "Missing required arguments for eddystone protocol";
                return false;
            }
        } else if (!util.isNullOrUndefined(this._configurationId)) {
            return true;
        } else {
            this._validationError = "Could not determine protocol";
            return false;
        }
    }

    process(callback) {
        logger.debug("Initializing");
        this.getBeaconConfiguration((err, beaconConfiguration) => {
            if (err) {
                return callback(err);
            }

            this._beaconConfiguration = beaconConfiguration;

            if (util.isNullOrUndefined(this._beaconConfiguration)) {
                return callback(null, null);
            }

            this.getPlace(this._beaconConfiguration.place_id, (err, place) => {
                if (err) {
                    return callback(err);
                }

                this._place = place;
                logger.debug("Initialized");
                return callback(null, beaconConfiguration);
            });
        });
    }

    getMessages(callback) {
        let methods = this._server.methods;

        methods.proximityMessage.beaconTriggered(this._account.id, this._eventId, this._generationTime, this._beaconConfiguration, this._place, (err, messages) => {
            if (err) {
                return callback(err);
            }

            return callback(null, messages);
        });
    }

    getBeaconConfiguration(callback) {
        let methods = this._server.methods;

        if (this._configurationId) {

            methods.beaconConfiguration.findById(this._configurationId, (err, beaconConfiguration) => {
                if (err) {
                    return callback(err);
                }

                return callback(null, beaconConfiguration);
            });

        } else if (this._uuid && this._majorNumber && this._minorNumber) {

            methods.beaconConfiguration.findByIBeaconProtocol(this._account.id, this._uuid, this._majorNumber, this._minorNumber, (err, beaconConfiguration) => {
                if (err) {
                    return callback(err);
                }

                return callback(null, beaconConfiguration);
            });

        } else if (this._namespace && this._protocol) {

            methods.beaconConfiguration.findByIEddystoneNamespaceProtocol(this._account.id, this._namespace, this._instanceId, (err, beaconConfiguration) => {
                if (err) {
                    return callback(err);
                }

                return callback(null, beaconConfiguration);
            });

        } else {

            return callback(null, null);
        }
    }

    getPlace(id, callback) {
        let methods = this._server.methods;

        if (id) {
            methods.place.findById(id, (err, place) => {
                if (err) {
                    return callback(err);
                }

                return callback(null, place);
            });
        } else {
            return callback(null, null);
        }
    }

    toResponse() {
        let response = super.toResponse();
        let beaconConfiguration = this._beaconConfiguration;
        let place = this._place;

        if (beaconConfiguration) {
            response.data.attributes.configuration = {
                id: beaconConfiguration.id,
                name: beaconConfiguration.title,
                tags: beaconConfiguration.tags,
                shared: beaconConfiguration.shared,
                uuid: beaconConfiguration.uuid,
                "major-number": beaconConfiguration.major,
                "minor-number": beaconConfiguration.minor
            }
        }

       if (place) {
            response.data.attributes.place = {
                name: place.title,
                latitude: place.latitude,
                longitude: place.longitude,
                radius: place.radius,
                tags: place.tags,
                shared: place.shared
            }
        }

        return response;
    }

     afterProcessed(next) {
        super.afterProcessed((err) => {
            if (err) {
                return next(err);
            }
            
            let place = this._place;
            let device = this._device;

            if (util.isNullOrUndefined(place)) {
                return next();
            }
            // Only if the place exists
            if (place.radius <= 250 && util.isNullOrUndefined(device.location) || ( device.location && ( device.location.latitude != place.latitude || device.location.longitude != place.longitude ))) {
                this._device.location_accuracy = place.radius
                this._device.location_longitude = place.longitude
                this._device.location_latitude = place.latitude
            }

            return next();
        });
        
    }
}


module.exports = BeaconRegionBaseProcessor;