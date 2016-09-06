const util = require('util');
const BaseProcessor = require('./base-processor');

const log4js = require('log4js');
const logger = log4js.getLogger('[AppBaseProcessor]');
logger.setLevel("INFO");

class AppBaseProcessor extends BaseProcessor {

    constructor(args) {
        super(args);

        if (this._action == "open") {
            this._eventId = 42;
        } else if (this._action == "close") {
            this._eventId = 43;
        } else {
            this._eventId = 41;
        }
    }

}


module.exports = AppBaseProcessor;