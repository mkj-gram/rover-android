const util = require('util');
const MessageBaseProcessor = require('../message-base-processor');
const Config = require('../../../config');
const log4js = require('log4js');
const logger = log4js.getLogger('[MessageOpenedProcessor]');


logger.setLevel(Config.get('/log/level'));

class MessageOpenedProcessor extends MessageBaseProcessor {

    constructor(args) {
        super(args);
    }

    afterProcessed(next) {
        if (this._message) {
            let counters = { total_opens: 1 }
            let updates = Promise.resolve(this._message);
            let message = this._message;
            let methods = this._server.methods;

            if (this._source == "notification") {
                counters.total_notification_opens = 1
            } else if (this._source == "inbox") {
                counters.total_inbox_opens = 1
            }

            if (message.viewed == false) {
                counters.unique_opens = 1;
                updates.then(message => new Promise((resolve, reject) => {
                    methods.message.update(message._id, { "$set": { "viewed": true }}, (err) => {
                        if (err) {
                            return reject(err);
                        }

                        return resolve(message);
                    });
                }));
            }

            updates.then(message => {
                methods.messageTemplateStats.update(message.message_template_id, { "$inc": counters}, (err) => {
                    if (err) {
                        return next(err);
                    }

                    return next();
                });
            }).catch(err => {
                return next(err);
            });
        }
    }
}


module.exports = MessageOpenedProcessor;