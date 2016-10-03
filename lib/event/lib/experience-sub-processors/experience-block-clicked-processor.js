const util = require('util');
const ExperienceBaseProcessor = require('../experience-base-processor');

const log4js = require('log4js');
const logger = log4js.getLogger('[ExperienceBlockClickedProcessor]');
logger.setLevel("INFO");

const allowedKeys = { 'type': 1, 'url': 1, 'screen-id': 1 };

const internals = {};

internals.parseBlockAction = function(blockAction) {

    if (!util.isObject(blockAction)) {
        return {};
    }

    let parsedBlockAction = {};

    Object.keys(blockAction).forEach(key => {
        if (allowedKeys[key] ==  1) {
            parsedBlockAction[key.replace('-', '_')] = blockAction[key]
        }
    });

    return parsedBlockAction;
};

class ExperienceBlockClickedProcessor extends ExperienceBaseProcessor {

    constructor(args) {
        super(args);

        this._screenId = args.input["screen-id"];
        this._blockId = args.input["block-id"];
        this._blockAction = internals.parseBlockAction(args.input["block-action"]);
    }

    valid() {
        if (super.valid() == false) {
            return false;
        }

        if (util.isNullOrUndefined(this._screenId)) {
            this._validationError = "Missing screen-id from argument list";
            return false;
        }

        if (util.isNullOrUndefined(this._blockId)) {
            this._validationError = "Missing block-id from argument list";
            return false;
        }

        if (util.isNullOrUndefined(this._blockAction)) {
            this._validationError = "Missing block-action from argument list";
            return false;
        }
        
        return true;
    }

    toRecord() {
        let record = super.toRecord();
                
        record.experience.screen_id = this._screenId;
        record.experience.block_id = this._blockId;
        record.experience.block_action = this._blockAction
        
        return record;
    }

}


module.exports = ExperienceBlockClickedProcessor;