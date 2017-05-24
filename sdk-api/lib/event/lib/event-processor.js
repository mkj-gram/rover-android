'use strict';
const log4js = require('log4js');
const logger = log4js.getLogger('[EventProcessor]');
const Config = require('../../../config');
let ProcessorMap = {};
let internals = {};


logger.setLevel(Config.get('/log/level'));

internals.getProcessor = function(args) {

    let eventName = args.event.name;

    let processorConfig = ProcessorMap[eventName]

    if (processorConfig) {
        args.event.id = processorConfig.id;

        return new processorConfig.processor(args);
    }

   

    let defaultProcessorConfig = ProcessorMap.default;
     args.event.id = 0;

    return new defaultProcessorConfig.processor(args);
};

internals.initializeProcessorMap = function(map) {
    logger.debug("Setting processor map");
    ProcessorMap = map;
}

class EventProcessor {

    constructor(args) {
        this._processor = internals.getProcessor(args);
    }


    getTransactionName() {
        return this._processor.getTransactionName();
    }

    assignProcessorAttributes(attributes) {
        Object.assign(this._processor, attributes);
    }
    
    process(callback) {

        const processorName = this._processor.constructor.name;

        if (this._processor.valid() == false) {
            logger.error(this._processor._validationError);
            logger.error(this._processor._rawInput);

            return callback({ status: 400 , message: this._processor._validationError});
        }

        this._processor.beforeProcessed((err) => {

            if (err) {
                return callback(err);
            }

            logger.debug(processorName + " processing");
            
            this._processor.shouldProcessEvent((yes) => {
                if (yes) {
                    logger.debug(yes);
                    this._processor.process((err) => {

                        if (err) {
                            logger.debug(processorName + " error");
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
                } else {
                    return callback(null, this._processor._customer, this._processor._device, this._processor.toDroppedResponse());
                }
            });

        });


    }
}

module.exports = {
    map: EventProcessor,
    initializeProcessorMap: internals.initializeProcessorMap
}