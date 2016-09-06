'use strict';
const log4js = require('log4js');
const logger = log4js.getLogger('[EventProcessor]');
let ProcessorMap = {};
let internals = {};

internals.getProcessor = function(args) {
    let object = args.input.object;
    let action = args.input.action;

    let subProcessor = ProcessorMap[object];
    if (subProcessor) {
        let processor = subProcessor[action];
        if (processor) {
            return new processor(args);
        }
        return new ProcessorMap.default(args);
    } else {
        return new ProcessorMap.default(args);
    }
};

internals.initializeProcessorMap = function(map) {
	logger.debug("Setting processor map");
	ProcessorMap = map;
}

class EventProcessor {

    constructor(args) {
        this._processor = internals.getProcessor(args);
    }


    process(callback) {
        this._processor.initialize((err) => {
            if (err) {
                return callback(err);
            }

            this._processor.captureAnalytics();
            
            this._processor.getMessages((err, messageTemplates) => {
                if (err) {
                    logger.error(err);
                    messageTemplates = [];
                }
                
                if (messageTemplates.length == 0) {
                    return callback(null, this._processor.toResponse());
                }

                this._processor.filterMessages(messageTemplates, (err, messageTemplatesToDeliver) => {
                    if (err) {
                        logger.error(err);
                        return callback(null, this._processor.toResponse());
                    }

                    this._processor.deliverMessages(messageTemplates, (err, r) => {
                        if (err) {
                            logger.error(err);    
                        }

                        return callback(null, this._processor.toResponse());
                    });
                });
            });
        });
    }
}

module.exports = {
	map: EventProcessor,
	initializeProcessorMap: internals.initializeProcessorMap
}