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

        this._placeId = args.event.attributes['xenio-place-id'];
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

        this.getXenioPlace(this._placeId, (err, xenioPlace) => {
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

        let methods = this._server.methods;

        methods.proximityMessage.xenioPlaceTriggered(this._account.id, this._eventId, this._generationTime, this._xenioPlace, (err, messages) => {
            if (err) {
                return callback(err);
            }

            return callback(null, messages);
        });
    }

    getXenioPlace(id, callback) {
        let methods = this._server.methods;

        if (id) {
            methods.xenioPlace.findById(this._account.id, id, (err, xenioPlace) => {
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