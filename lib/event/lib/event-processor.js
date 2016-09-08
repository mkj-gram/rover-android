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

        const processorName = this._processor.constructor.name;

        this._processor.beforeProcessed((err) => {

            if (err) {
                return callback(err);
            }

            logger.debug(processorName + " initializing");

            this._processor.initialize((err) => {

                if (err) {
                    logger.debug(processorName + " initialization error");
                    logger.error(err);
                    return callback(err);
                }

                logger.debug(processorName + " capturing analytics");

                this._processor.captureAnalytics();
                
                logger.debug(processorName + " getting messages");

                this._processor.getMessages((err, messageTemplates) => {
                    if (err) {
                        logger.error(err);
                        messageTemplates = [];
                    }
                    
                    logger.debug(processorName + " filtering messages");

                    this._processor.filterMessages(messageTemplates, (err, messageTemplatesToDeliver) => {

                        if (err) {
                            logger.error(err);
                            return callback(null, this._processor._customer, this._processor._device, this._processor.toResponse());
                        }

                        logger.debug(processorName + " delivering messages");

                        this._processor.deliverMessages(messageTemplatesToDeliver, (err, r) => {
                            if (err) {
                                logger.error(err);    
                            }

                            this._processor.afterProcessed((err) => {
                                if (err) {
                                    logger.error(err);
                                    return callback(err);
                                }
                                
                                return callback(null, this._processor._customer, this._processor._device, this._processor.toResponse());
                            });
                        });
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