const util = require('util');
const ExperienceBaseProcessor = require('../experience-base-processor');

const log4js = require('log4js');
const logger = log4js.getLogger('[ExperienceScreenViewedProcessor]');
logger.setLevel("INFO");

const allowedKeys = { 'type': 1, 'url': 1, 'screen-id': 1, 'screen_id': 1 };

const internals = {}

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

internals.findScreenRowBlock = function(experience, blockId) {

    if (util.isArray(experience.screens)) {
        for(const screenIndex in experience.screens) {
            const screen = experience.screens[screenIndex]
            for(const rowIndex in screen.rows) {
                const row = screen.rows[rowIndex]
                for (const blockIndex in row.blocks) {
                    const block = row.blocks[blockIndex]
                    if (block.id == blockId) {
                        return { screen: screen, row: row, block: block}
                    }
                }
            }
        }
        return {}
    } else {
        return {}
    }
}

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
    
        
        const experience = this._experience;
        const versionedExperience = this._versionedExperience

        /* Grab the screen we are viewing */
        if (experience && versionedExperience) {
            const screen = versionedExperience.screens.find(s => { return s.id == this._screenId })

            if (screen) {
                const screenRecord = {
                    screen: {
                        id: screen.id,
                        name: screen.name,
                        row_ids: screen.rows ? screen.rows.map(s => s.id) : []
                    }
                }

                Object.assign(record, screenRecord);
            }
        }
    
        /* Fill in the info if we are coming from another screen / block  */
        if (experience && versionedExperience && this._fromBlockId) {
            const { screen, row, block } = internals.findScreenRowBlock(versionedExperience, this._fromBlockId)

            if (screen) {
                const screenRecord = {
                    from_screen: {
                        id: screen.id,
                        name: screen.name,
                        row_ids: screen.rows ? screen.rows.map(s => s.id) : []
                    }
                }

                Object.assign(record, screenRecord);
            }

            if (row) {
                const rowPosition = screen.rows.indexOf(row) + 1
                const rowRecord = {
                    from_row: {
                        id: row.id,
                        name: row.name,
                        block_ids: row.blocks ? row.blocks.map(r => r.id) : [],
                        position: rowPosition
                    }
                }

                Object.assign(record, rowRecord)
            }

            if (block) {
                const blockPosition = row.blocks.indexOf(block) + 1
                const blockRecord = {
                    from_block: {
                        id: block.id,
                        name: block.name,
                        type: block.type,
                        position: blockPosition,
                        action: internals.parseBlockAction(block.action)
                    }
                }

                Object.assign(record, blockRecord)
            }
        }
       
        
        return record;
    }

}


module.exports = ExperienceScreenViewedProcessor;