const util = require('util');
const BaseProcessor = require('./base-processor');
const Config = require('../../../config');
const log4js = require('log4js');
const logger = log4js.getLogger('[XenioZoneBaseProcessor]');
const moment = require('moment');

logger.setLevel(Config.get('/log/level'));

class XenioZoneBaseProcessor extends BaseProcessor {

    constructor(args) {
        super(args);

        if (this._action == "enter") {
            this._eventId = 200;
        } else if (this._action == "exit") {
            this._eventId = 201;
        } else {
            this._eventId = 200;
        }

        this._zoneId = args.input['zone-id'];

    }
    
    valid() {
        if (super.valid() == false) {
            return false;
        }

        if (util.isNullOrUndefined(this._zoneId)) {
            this._validationError = "Missing zone id"
            return false;
        }

        return true;
    }

    process(callback) {
        logger.debug("Initializing");
        let methods = this._server.methods;

        this.getXenioZone((err, xenioZone) => {
            if (err) {
                return callback(err);
            }

            this._xenioZone = xenioZone;

            if (util.isNullOrUndefined(this._xenioZone)) {
                return callback(null, null);
            }

            this.getXenioPlace(this._xenioZone.place_id, (err, xenioPlace) => {
                if (err) {
                    return callback(err);
                }

                this._xenioPlace = xenioPlace;
                logger.debug("Initialized");
                return callback(null, this._xenioZone);
            });
        });
    }

    getMessages(callback) {
        logger.debug("Getting messages for raw input: " + util.inspect(this._rawInput, true, null, false));
        // grabs messages from db
        // filters them if they have shit
        let methods = this._server.methods;

        methods.proximityMessage.xenioZoneTriggered(this._account.id, this._eventId, this._generationTime, this._xenioZone, this._xenioPlace, (err, messages) => {
            if (err) {
                return callback(err);
            }

            return callback(null, messages);
        });
    }

    getXenioZone(callback) {
        let methods = this._server.methods;

        if (this._zoneId) {

            methods.xenioZone.findById(this._zoneId, (err, xenioZone) => {
                if (err) {
                    return callback(err);
                }

                return callback(null, xenioZone);
            });
        } else {

            return callback(null, null);
        }
    }

    getXenioPlace(id, callback) {
        let methods = this._server.methods;

        if (id) {
            methods.xenioPlace.findById(id, (err, xenioPlace) => {
                if (err) {
                    return callback(err);
                }

                return callback(null, xenioPlace);
            });
        } else {
            return callback(null, null);
        }
    }

    toResponse() {
        let response = super.toResponse();
        let xenioZone = this._xenioZone;
        let xenioPlace = this._xenioPlace;

        if (xenioZone) {
            response.data.attributes["xenio-zone"] = {
                "id": xenioZone.id,
                "name": xenioZone.name,
                "tags": xenioZone.tags,
                "place-id": xenioZone.place_id
            }
        }

        if (xenioPlace) {
            response.data.attributes["xenio-place"] = {
                id: xenioPlace.id,
                name: xenioPlace.name,
                tags: xenioPlace.tags
            }
        }

        return response;
    }
}


module.exports = XenioZoneBaseProcessor;