const util = require('util');
const moment = require('moment');
const BaseProcessor = require('./base-processor');
const log4js = require('log4js');
const logger = log4js.getLogger('[GeofenceRegionBaseProcessor]');


class GeofenceRegionBaseProcessor extends BaseProcessor {

    constructor(args) {
        super(args);

        if (this._action == "enter") {
            this._eventId = 2;
        } else if (this._action == "exit") {
            this._eventId = 3;
        } else {
            this._eventId = 1;
        }

        if (args.input.identifier) {
            let parts = args.input.identifier.split(":");
            this._latitude = parts[0];
            this._longitude = parts[1];
            this._radius = parts[2];
        } else {
            this._latitude = args.input.latitude;
            this._longitude = args.input.longitude;
            this._radius = args.input.radius;
        }
    }

    _getTriggerArguments() {
        let args = {};

        if (this._place) {
            util._extend(args, { _place: this._place });
        }

        return args;
    }

    valid() {
        if (super.valid() == false) {
            return false;
        }

        if (util.isNullOrUndefined(this._latitude)) {
            this._validationError = "Missing latitude from argument list";
            return false;
        }

        if (util.isNullOrUndefined(this._longitude)) {
            this._validationError = "Missing longitude from argument list";
            return false;
        }

        if (util.isNullOrUndefined(this._radius)) {
            this._validationError = "Missing radius from argument list";
            return false;
        }

        return true;
    }

    process(callback) {
        this.getPlace((err, place) => {
            if (err) {
                return callback(err);
            }

            this._place = place;

            return callback();
        });
    }

    getMessages(callback) {
        // base processor doesn't have any messages
        let methods = this._server.methods;

        methods.proximityMessage.geofenceTriggered(this._account.id, this._eventId, this._generationTime, this._place, (err, messages) => {
            if (err) {
                return callback(err);
            }
            
            return callback(null, messages);
        });
    }

    getPlace(callback) {
        let methods = this._server.methods;

        
        methods.place.findByCoordinates(this._account, this._latitude, this._longitude, (err, place) => {
            if (err) {
                return callback(err);
            }

            return callback(null, place);
        });

    }

    toResponse() {
        let response = super.toResponse();
        let place = this._place;

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

            if (place && place.radius <= 250) {
                this._device.location = {
                    latitude: place.latitude,
                    longitude: place.longitude,
                    accuracy: place.radius,
                    timestamp: moment.utc(new Date()).toDate()
                }
            }

            return next();
        });
        
    }
}

module.exports = GeofenceRegionBaseProcessor;
