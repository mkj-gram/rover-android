const util = require('util');
const BaseProcessor = require('./base-processor');
const Config = require('../../../config');
const log4js = require('log4js');
const logger = log4js.getLogger('[BeaconRegionBaseProcessor]');

logger.setLevel(Config.get('/log/level'));

class BeaconRegionBaseProcessor extends BaseProcessor {

    constructor(args) {
        super(args);

        if (this._action == "enter") {
            this._eventId = 22;
        } else if (this._action == "exit") {
            this._eventId = 23;
        } else {
            this._eventId = 21;
        }

        this._configurationId = args.input['configuration-id'];
        this._uuid = args.input.uuid
        this._majorNumber = args.input['major-number'];
        this._minorNumber = args.input['minor-number'];

        this._namespace = args.input['namespace'];
        this._instanceId = args.input['instance-id'];

        if (this._uuid && this._majorNumber && this._minorNumber) {
            this._protocol = 'ibeacon';
        } else if (this._namespace && this._instanceId) {
            this._protocol = 'eddystone-namespace';
        }

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
        logger.debug("Getting messages for raw input: " + util.inspect(this._rawInput, true, null, false));
        // grabs messages from db
        // filters them if they have shit
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


    toRecord() {
        let record = super.toRecord();
        let beaconConfiguration = this._beaconConfiguration;
        let place = this._place;

        if (beaconConfiguration) {
            let beaconConfigurationRecord = {
                configuration: {
                    id: beaconConfiguration.id,
                    place_id: beaconConfiguration.place_id,
                    title: beaconConfiguration.title,
                    protocol: beaconConfiguration.protocol,
                    tags: beaconConfiguration.tags,
                    enabled: beaconConfiguration.enabled,
                    shared: beaconConfiguration.shared,
                    uuid: beaconConfiguration.uuid,
                    major_number: beaconConfiguration.major,
                    minor_number: beaconConfiguration.minor,
                    namespace: beaconConfiguration.namespace,
                    instance_id: beaconConfiguration.instance_id,
                    url: beaconConfiguration.url
                }
            }

            record = Object.assign(record, beaconConfigurationRecord);
        }

        if (place) {
            let placeRecord = {
                place: {
                    id: place.id,
                    title: place.title,
                    address: place.address,
                    city: place.city,
                    province: place.province,
                    country: place.country,
                    postal_code: place.postal_code,
                    latitude: place.latitude,
                    longitude: place.longitude,
                    radius: place.radius,
                    tags: place.tags,
                    google_place_id: place.google_place_id,
                    enabled: place.enabled,
                    shared: place.shared,
                    beacon_configurations_count: place.beacon_configurations_count
                }
            }

            record = Object.assign(record, placeRecord);
        }


        return record;
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
                shared: beaconConfiguration.shared
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

     afterProcessed(callback) {
        let place = this._place;
        let device = this._device;

        if (util.isNullOrUndefined(place)) {
            return callback();
        }
        // Only if the place exists
        if (place.radius <= 250 && util.isNullOrUndefined(device.location) || ( device.location && ( device.location.latitude != place.latitude || device.location.longitude != place.longitude ))) {
            this._device.location = {
                latitude: place.latitude,
                longitude: place.longitude,
                accuracy: place.radius,
                timestamp: moment.utc(new Date()).toDate()
            }
        }

        return callback();
    }
}


module.exports = BeaconRegionBaseProcessor;