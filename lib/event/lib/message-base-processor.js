const util = require('util');
const BaseProcessor = require('./base-processor');
const moment = require('moment');

const log4js = require('log4js');
const logger = log4js.getLogger('[MessageBaseProcessor]');
logger.setLevel("INFO");

class MessageBaseProcessor extends BaseProcessor {

    constructor(args) {
        super(args);
        if (this._action == "added-to-inbox") {
        	this._eventId = 102
        } else if (this._action == "open") {
            this._eventId = 103;
        } else if (this._action == "deleted") {
            this._eventId = 104;
        } else {
            this._eventId = 101;
        }

        this._source = args.input.source;

        if (args.input["message-id"]) {
        	this._messageId = args.input["message-id"];
        } else if(args.input.message) {
        	this._message = args.input.message;
        	delete this._rawInput["message"];
        }
    }

    initialize(callback) {

    	if (this._messageId) {
    		let server = this._server;
    		let methods = server.methods;

    		methods.message.find(this._messageId, {}, (err, message) => {
    			if (err) {
    				return callback(err);
    			}

    			if (message) {
                    
    				if (!message.customer_id.equals(this._customer._id)) {
    					return callback("Cannot open message not belonging to you");
    				}

    				this._message = message;

    				return callback();
    			}
    		});
    	}

    	if (this._message) {
    		return callback();
    	}

        return callback("Message was not defined");
    }

    toRecord() {
    	let record = super.toRecord();
    	let message = this._message;
    	
    	if (message) {
    		
    		record["event"].source = this._source;

    		let messageRecord = {
    			message: {
                    id: message.id,
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

    	return record;
    }
}


module.exports = MessageBaseProcessor;