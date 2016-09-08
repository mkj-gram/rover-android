const util = require('util');
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

    initialize(callback) {
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

        methods.proximityMessage.geofenceTriggered(this._account.id, this._eventId, this._timestamp, this._place, (err, messages) => {
            if (err) {
                return callback(err);
            }
            
            return callback(null, messages);
        });
    }

    getPlace(callback) {
        let methods = this._server.methods;

        
        methods.place.findByCoordinates(this._latitude, this._longitude, (err, place) => {
            if (err) {
                return callback(err);
            }

            return callback(null, place);
        });

    }

    toRecord() {
        let record = super.toRecord();
        let place = this._place;

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
}

module.exports = GeofenceRegionBaseProcessor;
