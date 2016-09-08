'use strict';
const util = require('util');
const moment = require('moment');
const async = require('async');

const keyPrefix = 'msgrl_';
const internals = {};

internals.getMessageRateLimitKey = function(customer, messageTemplate) {
    return `${keyPrefix}${customer._id.toString()}:${messageTemplate.id}`;
};

internals.getGlobalRateLimitKey = function(customer) {
    return `${keyPrefix}${customer._id.toString()}`
};


internals.parseLimit = function(limit) {
    if (limit.number_of_minutes) {
        limit.number_of_seconds = limit.number_of_minutes * 60 
    } else if (limit.number_of_hours) {
        limit.number_of_seconds = limit.number_of_hours * 60 * 60
    } else if (limit.number_of_days) {
        limit.number_of_seconds = limit.number_of_days * 12 * 60 * 60 
    } else {
        limit.number_of_seconds = 1440;
    }

    return limit;
};

class LimitExceeded extends Error {

    constructor (message) {
        super(message);
        this.name = "LimitExceeded";
    }
}

internals.update = function(customer, messageTemplate, globalLimits, callback) {
    const server = this;
    const redis = server.plugins.redis.client;
    const messageRateLimitKey = internals.getMessageRateLimitKey(customer, messageTemplate);
    const globalRateLimitKey = internals.getGlobalRateLimitKey(customer);

    let multi = redis.multi();
    let currentTime = moment.utc(new Date).unix();
    // individual rate limit
    let messageLimits = (messageTemplate.limits || []).map(limit => internals.parseLimit(limit));

    if (messageLimits.length > 0) {
        let sortedMessageLimits = messageLimits.sort((a,b) => { return a.number_of_seconds >= b.number_of_seconds });
        let largestMessageLimit = sortedMessageLimits[sortedMessageLimits.length - 1];
       
        let expireIn = largestMessageLimit.number_of_seconds;

        multi.zadd(messageRateLimitKey, currentTime, currentTime);
        multi.expire(messageRateLimitKey, expireIn);
    }

    // global limits
    
    let parsedGlobalLimits = (globalLimits || []).map(limit => internals.parseLimit(limit));

    if (parsedGlobalLimits.length > 0) {
        let sortedGlobalLimits = parsedGlobalLimits.sort((a,b) => { return a.number_of_seconds >= b.number_of_seconds });
        let largestGlobalLimit = sortedGlobalLimits[sortedGlobalLimits.length - 1];
       
        let expireIn = largestGlobalLimit.number_of_seconds;

        multi.zadd(globalRateLimitKey, currentTime, currentTime);
        multi.expire(globalRateLimitKey, expireIn);
    }


    
    if (parsedGlobalLimits.length > 0 || messageLimits.length > 0) {
        multi.exec((err, replies) => {
            if (err) {
                return callback(err);
            }

            return callback(null, replies);
        });
    } else {
        return callback(null, null);
    }

};

internals.withinLimit = function(customer, messageTemplate, globalLimits, callback) {
    // first check the global limit
    // then check the individual limit
    const server = this;
    const redis = server.plugins.redis.client;
    const messageRateLimitKey = internals.getMessageRateLimitKey(customer, messageTemplate);
    const globalRateLimitKey = internals.getGlobalRateLimitKey(customer);
    const currentTime = moment.utc(new Date);

    let tasks = [];

    // globalLimits
    let parsedGlobalLimits = (globalLimits || []).map(limit => internals.parseLimit(limit));

    if (parsedGlobalLimits.length > 0) {
        let sortedGlobalLimits = parsedGlobalLimits.sort((a,b) => { return a.number_of_seconds >= b.number_of_seconds });
        let largestGlobalLimit = sortedGlobalLimits[sortedGlobalLimits.length - 1];
       

        let dropInterval = currentTime.subtract(largestGlobalLimit.number_of_seconds, 'seconds').unix();

        tasks.push((callback) => {
            redis.zremrangebyscore(globalRateLimitKey, "-inf", dropInterval, (err, response) => {
                if (err) {
                    return callback(err);
                }

                return callback();
            });
        });


         sortedGlobalLimits.forEach(limit => {
            tasks.push((callback) => {
                let limitInterval = currentTime.subtract(limit.number_of_seconds, 'seconds').unix();
                redis.zcount(globalRateLimitKey, limitInterval, "+inf", (err, count) => {
                    if (err) {
                        return callback(err);
                    }

                    if (count >= limit.message_limit) {
                        // we are already at our limit! don't add more
                        return callback(new LimitExceeded())
                    }

                    return callback();
                }); 
            });
        });
    }


    // message limits
    let parsedMessageLimits = (messageTemplate.limits || []).map(limit => internals.parseLimit(limit));

    if (parsedMessageLimits.length > 0) {
        let sortedMessageLimits = parsedMessageLimits.sort((a,b) => { return a.number_of_seconds >= b.number_of_seconds });
        let largestMessageLimit = sortedMessageLimits[sortedMessageLimits.length - 1];
       

        let dropInterval = currentTime.subtract(largestMessageLimit.number_of_seconds, 'seconds').unix();

        tasks.push((callback) => {
            redis.zremrangebyscore(messageRateLimitKey, "-inf", dropInterval, (err, response) => {
                if (err) {
                    return callback(err);
                }

                return callback();
            });
        });


         sortedMessageLimits.forEach(limit => {
            tasks.push((callback) => {
                let limitInterval = currentTime.subtract(limit.number_of_seconds, 'seconds').unix();
                redis.zcount(messageRateLimitKey, limitInterval, "+inf", (err, count) => {
                    if (err) {
                        return callback(err);
                    }

                    if (count >= limit.message_limit) {
                        // we are already at our limit! don't add more
                        return callback(new LimitExceeded())
                    }

                    return callback();
                }); 
            });
        });
    }

    async.series(tasks, (err, result) => {

        if (err) {
            if (err instanceof LimitExceeded) {
                return callback(null, false);
            } else {
                return callback(err, false);
            }
        }

        return callback(null, true);
    });
};

module.exports = {
    update: internals.update,
    withinLimit: internals.withinLimit
}