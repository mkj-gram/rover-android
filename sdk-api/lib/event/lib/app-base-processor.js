const util = require('util');
const BaseProcessor = require('./base-processor');

const log4js = require('log4js');
const logger = log4js.getLogger('[AppBaseProcessor]');
logger.setLevel("INFO");

class AppBaseProcessor extends BaseProcessor {

    constructor(args) {
        super(args);
    }

}


module.exports = AppBaseProcessor;