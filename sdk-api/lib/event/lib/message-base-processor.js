const util = require('util');
const BaseProcessor = require('./base-processor');
const moment = require('moment');

const log4js = require('log4js');
const logger = log4js.getLogger('[MessageBaseProcessor]');
logger.setLevel("INFO");

class MessageBaseProcessor extends BaseProcessor {

    constructor(args) {
        super(args);

        this._source = args.event.attributes.source;
        
        if (args.event.attributes["message-id"]) {
            this._messageId = args.event.attributes["message-id"];
        } else if(args.event.attributes.message) {
            this._message = args.event.attributes.message;
            delete this._rawInput["message"];
        }

        if (args.message_template) {
            this._messageTemplate = args.message_template
        }
    }

    shouldProcessEvent(callback) {
        const server = this._server
        const methods = server.methods

        if (methods.message.isV1Id(this._messageId || this._message.id)) {
            return callback(true)
        }
        
        return callback(false);
    }

    valid() {
        if (super.valid() == false) {
            return false;
        }

        if (util.isNullOrUndefined(this._messageId) && util.isNullOrUndefined(this._message)) {
            this._validationError = "Missing message-id from argument list";
            return false;
        }

        return true;
    }

    process(callback) {

        let server = this._server;
        let methods = server.methods;
        let ObjectId = server.connections.mongodb.ObjectId;

        if (this._messageId) {
            methods.message.find(this._messageId, {}, (err, message) => {
                if (err) {
                    return callback(err);
                }

                if (message) {

                    this._message = message;
                    
                    methods.messageTemplate.find(message.message_template_id, { useCache: true}, (err, template) => {
                        if (err) {
                            logger.error(err)
                            return callback()
                        }

                        this._messageTemplate = template
                        return callback()
                    })
                }
            })
        } else if (this._message) {
            if (!this._messageTemplate) {
                methods.messageTemplate.find(this._message.message_template_id, { useCache: true }, (err, template) => {
                    if (err) {
                        logger.error(err)
                        return callback()
                    }

                    this._messageTemplate = template
                    return callback()
                })
            } else {
                return callback();
            }
        } else {
            return callback("Message was not defined");
        }
    }

    toRecord() {
        let record = super.toRecord();
        let message = this._message;
        
        if (message) {
            
            record["event"].source = this._source;

            let messageRecord = {
                message: {
                    id: message._id.toString(),
                    message_template_id: message.message_template_id,
                    notification_text: message.notification_text,
                    ios_title: message.ios_title,
                    android_title: message.android_title,
                    ios_sound_file: message.ios_sound_file,
                    tags: message.tags,
                    read: message.read,
                    viewed: message.viewed,
                    saved_to_inbox: message.saved_to_inbox,
                    content_type: message.content_type,
                    website_url: message.website_url,
                    deeplink_url: message.deeplink_url,
                    timestamp: moment.utc(message.timestamp).unix(),
                    landing_page: null, // JSON.stringify(message.landing_page),
                    properties: JSON.stringify(message.properties),
                }
            }

            if (!util.isNullOrUndefined(message.experience_id)) {
                messageRecord["experience"] = {
                    id: message.experience_id.toString()
                }
            }

            record = Object.assign(record, messageRecord);
        }


        function parseDateSchedule(d) {
            if (d === null || d === undefined || d === '(,)') {
                return {}
            }

            let parts = d.replace(/\[|\)/g, '').split(',').map(r => parseInt(r)).filter(r => !isNaN(r))

            let start = moment.unix(parts[0]).utc().toISOString()
            // Since postgres range is saved as (,] we need to subract 1 seconds from the end
            let end = moment.unix(parts[1] - 1).utc().toISOString()

            return {
                start:  start,
                end:    end
            }
        }

        function parseTimeSchedule(t) {
            if (t === null || t === undefined || t === '(,)') {
                return {
                    start: 0,
                    end: 1440
                }
            }

            let parts = t.replace(/\[|\)/g, '').split(',').map(r => parseInt(r)).filter(r => !isNaN(r))

            let start = parts[0]
            // Since postgres range is saved as (,] we need to subract 1 seconds from the end
            let end = parts[1]

            return {
                start: start,
                end: end,
            }
        }

        let template = this._messageTemplate
        if (template) {
            let templateRecord = {
                message_template: {
                    id:     template.id,
                    type:   template.type,
                    title:  template.title,

                    save_to_inbox:      template.save_to_inbox,
                    notification_text:  template.notification_text,
                    date_schedule:      parseDateSchedule(template.date_schedule),
                    time_schedule:      parseTimeSchedule(template.time_schedule),
                    schedule_monday:    template.schedule_monday,
                    schedule_tuesday:   template.schedule_tuesday,
                    schedule_wednesday: template.schedule_wednesday,
                    schedule_thursday:  template.schedule_thursday,
                    schedule_friday:    template.schedule_friday,
                    schedule_saturday:  template.schedule_saturday,
                    schedule_sunday:    template.schedule_sunday,

                    trigger_event_id: template.trigger_event_id,

                    filter_beacon_configuration_tags:   template.filter_beacon_configuration_tags,
                    filter_beacon_configuration_ids:    template.filter_beacon_configuration_ids,

                    filter_place_tags:  template.filter_place_tags,
                    filter_place_ids:   template.filter_place_ids,

                    content_type:   template.content_type,
                    website_url:    template.website_url,
                    deeplink_url:   template.deeplink_url,
                    experience_id:  template.experience_id,
                    properties:     template.properties,


                    scheduled_at:           template.scheduled_at ? moment(template.scheduled_at).toISOString() : null,
                    scheduled_local_time:   template.scheduled_local_time,
                    scheduled_time_zone:    template.scheduled_time_zone,

                    limits: template.limits
                }
            }

            record = Object.assign(record, templateRecord);
        }

        return record;
    }
}


module.exports = MessageBaseProcessor;