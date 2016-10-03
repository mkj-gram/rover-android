const util = require('util');
const BaseProcessor = require('./base-processor');

const log4js = require('log4js');
const logger = log4js.getLogger('[ExperienceBaseProcessor]');
logger.setLevel("INFO");

class ExperienceBaseProcessor extends BaseProcessor {

    constructor(args) {
        super(args);

        switch (this._action) {
            case "launched":
                this._eventId = 162;
                break;
            case "dismissed":
                this._eventId = 163;
                break;
            case "screen-viewed":
                this._eventId = 164;
                break;
            case "screen-closed":
                this._eventId = 165;
                break;
            case "block-clicked":
                this._eventId = 166;
                break;
            default:
                this._eventId = 161;
        }

        this._experienceId = args.input["experience-id"];
        this._versionId = args.input["version-id"];
    }
    
    valid() {
        if (super.valid() == false) {
            return false;
        }

        if (util.isNullOrUndefined(this._experienceId)) {
            this._validationError = "Missing experience-id in argument list";
            return false;
        }

        return true;
    }

    process(callback) {

        let methods = this._server.methods;

        if (util.isNullOrUndefined(this._versionId)) {
            
            methods.experience.find(this._experienceId, { fields: ['live_version_id' ] }, (err, experience) => {
                if (err) {
                    logger.error(err);
                    return callback(err);
                }

                this._versionId = experience.live_version_id;
                return callback();
            });

        } else {
            return callback();
        }
    }

    toRecord() {
        let record = super.toRecord();
        
        let experienceRecord = {
            experience: {
                id: this._experienceId,
                version_id: this._versionId
            }
        }

        Object.assign(record, experienceRecord);
        
        return record;
    }

}


module.exports = ExperienceBaseProcessor;