const util = require('util');
const BaseProcessor = require('./base-processor');

const log4js = require('log4js');
const logger = log4js.getLogger('[ExperienceBaseProcessor]');
logger.setLevel("INFO");

class ExperienceBaseProcessor extends BaseProcessor {

    constructor(args) {
        super(args);

        this._experienceId = args.event.attributes["experience-id"];
        // bug with sdk on launch experience the spelling is veresion-id
        this._versionId = args.event.attributes["version-id"] || args.event.attributes["veresion-id"];
        this._experienceSessionId = args.event.attributes["experience-session-id"];

        this._versionedExperienceFields = ['title', 'screens.id', 'screens.name', 'screens.rows.id', 'screens.rows.name', 'screens.rows.blocks.id', 'screens.rows.blocks.type', 'screens.rows.block.name', 'screens.rows.blocks.action']
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
        let methods = this._server.methods

        methods.experience.find(this._experienceId, { fields: ['live_version_id', 'title' ] }, (err, experience) => {
            if (err) {
                logger.error(err);
                return callback(err);
            }

            this._experience = experience;

            if (this._experience) {

                if (util.isNullOrUndefined(this._versionId)) {
                    this._versionId = experience.live_version_id
                }

                methods.experience.findVersion(this._versionId, { fields: this._versionedExperienceFields }, (err, versionedExperience) => {
                    if (err) {
                        return callback(err)
                    }
                    
                    this._versionedExperience = versionedExperience

                    return callback()
                })
            } else {
                return callback();
            }
        });
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
        
        const experience = this._experience

        if (experience) {
            let experienceRecord = {
                experience: {
                    id: experience._id,
                    version_id: this._versionId,
                    name: experience.title
                }
            }

            const versionedExperience = this._versionedExperience;

            if (versionedExperience) {
                experienceRecord.experience.screen_ids = versionedExperience.screens.map(s => s.id)
            }

            record.event.experience_session_id = this._experienceSessionId;

            Object.assign(record, experienceRecord);
        }
        
        
        return record;
    }

}


module.exports = ExperienceBaseProcessor;