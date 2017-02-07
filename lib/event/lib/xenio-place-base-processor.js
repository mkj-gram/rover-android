const util = require('util');
const BaseProcessor = require('./base-processor');
const Config = require('../../../config');
const log4js = require('log4js');
const logger = log4js.getLogger('[XenioPlaceBaseProcessor]');
const moment = require('moment');

logger.setLevel(Config.get('/log/level'));

class XenioPlaceBaseProcessor extends BaseProcessor {

    constructor(args) {
        super(args);

        if (this._action == "enter") {
            this._eventId = 202;
        } else if (this._action == "exit") {
            this._eventId = 203;
        } else {
            this._eventId = 202;
        }

        this._placeId = args.input['place-id'];

    }
    
    valid() {
        if (super.valid() == false) {
            return false;
        }

        if (util.isNullOrUndefined(this._placeId)) {
            this._validationError = "Missing place id"
            return false;
        }

        return true;
    }

    process(callback) {
        logger.debug("Initializing");
        let methods = this._server.methods;

        this.getXenioPlace(this._placeid, (err, xenioPlace) => {
            if (err) {
                return callback(err);
            }

            this._xenioPlace = xenioPlace;
            logger.debug("Initialized");
            return callback(null, this._xenioPlace);
        });
    }

    getMessages(callback) {
        logger.debug("Getting messages for raw input: " + util.inspect(this._rawInput, true, null, false));
        // grabs messages from db
        // filters them if they have shit
        let methods = this._server.methods;

        methods.proximityMessage.xenioZoneTriggered(this._account.id, this._eventId, this._generationTime, this._xenioPlace, (err, messages) => {
            if (err) {
                return callback(err);
            }

            return callback(null, messages);
        });
    }

    getXenioPlace(id, callback) {
        let methods = this._server.methods;

        if (id) {
            methods.xenioPlace.findById(this._accountId, id, (err, xenioPlace) => {
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
        let xenioPlace = this._xenioPlace;

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


module.exports = XenioPlaceBaseProcessor;