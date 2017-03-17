const util = require('util');
const ExperienceBaseProcessor = require('../experience-base-processor');

const log4js = require('log4js');
const logger = log4js.getLogger('[ExperienceScreenViewedProcessor]');
logger.setLevel("INFO");

class ExperienceScreenViewedProcessor extends ExperienceBaseProcessor {

    constructor(args) {
        super(args);

        this._screenId = args.event.attributes["screen-id"];
        this._fromScreenId = args.event.attributes["from-screen-id"];
        this._fromBlockId = args.event.attributes["from-block-id"];
    }

    valid() {
        if (super.valid() == false) {
            return false;
        }

        if (util.isNullOrUndefined(this._screenId)) {
            this._validationError = "Missing screen-id from argument list";
            return false;
        }

        return true;
    }

    toRecord() {
        let record = super.toRecord();
        
        record.experience.screen_id = this._screenId;
        record.event.from_screen_id = this._fromScreenId;
        record.event.from_block_id = this._fromBlockId
        
        return record;
    }

}


module.exports = ExperienceScreenViewedProcessor;