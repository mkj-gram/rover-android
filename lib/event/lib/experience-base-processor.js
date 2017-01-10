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
        // bug with sdk on launch experience the spelling is veresion-id
        this._versionId = args.input["version-id"] || args.input["veresion-id"];
        this._experienceSessionId = args.input["experience-session-id"];
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

                if (!util.isNullOrUndefined(experience.live_version_id)) {
                    this._versionId = experience.live_version_id.toString();
                } else {
                    this._versionId = undefined;
                }
                
                return callback();
            });

        } else {
            return callback();
        }
    }

    afterProcessed(next) {
        super.afterProcessed((err) => {
            if (err) {
                return next(err);
            }

            const methods = this._server.methods;

            if (this._eventId == 162) {
                // launched the experience track the stats
                methods.experienceStats.incrementCounter(this._experienceId, 'total_opens', 1, (err) => {
                    if (err) {
                        return next(err);
                    }

                    return next();
                });
            } else {
                return next();
            }
        });
    }

    toRecord() {
        let record = super.toRecord();
        
        let experienceRecord = {
            experience: {
                id: this._experienceId,
                version_id: this._versionId
            }
        }

        record.event.experience_session_id = this._experienceSessionId;

        Object.assign(record, experienceRecord);
        
        return record;
    }

}


module.exports = ExperienceBaseProcessor;