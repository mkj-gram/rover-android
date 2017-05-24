const util = require('util');
const BaseProcessor = require('./base-processor');

const log4js = require('log4js');
const logger = log4js.getLogger('[GimbalPlaceBaseProcessor]');
logger.setLevel("INFO");

class GimbalPlaceBaseProcessor extends BaseProcessor {

    constructor(args) {
        super(args);
        
        this._gimbalPlaceId = args.event.attributes['gimbal-place-id'];
    }

    valid() {
        if (super.valid() == false) {
            return false;
        }

        if (util.isNullOrUndefined(this._gimbalPlaceId)) {
            this._validationError = "Missing gimbal-place-id from argument list";
            return false;
        }

        return true;
    }

    process(callback) {
        this.getGimbalPlace((err, gimbalPlace) => {
            if (err) {
                return callback(err);
            }

            this._gimbalPlace = gimbalPlace;
            
            return callback();
        });
    }

    getMessages(callback) {
        logger.debug("Getting messages for raw input: " + util.inspect(this._rawInput, true, null, false));
        // grabs messages from db
        // filters them if they have shit
        let methods = this._server.methods;

        methods.proximityMessage.gimbalPlaceTriggered(this._account.id, this._eventId, this._generationTime, this._gimbalPlace, (err, messages) => {
            if (err) {
                return callback(err);
            }

            return callback(null, messages);
        });
    }

    getGimbalPlace(callback) {
        let methods = this._server.methods;

        if (this._gimbalPlaceId) {
            methods.gimbalPlace.findByAccountIdAndGimbalPlaceId(this._account.id, this._gimbalPlaceId, (err, gimbalPlace) => {
                if (err) {
                    return callback(err);
                }

                return callback(null, gimbalPlace);
            });
        } else {
            return callback(null, null);  
        }
        
    }
}


module.exports = GimbalPlaceBaseProcessor;