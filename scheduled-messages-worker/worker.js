'use strict';

var Promise = require('bluebird');
const util = require('util');
const JobProcessor = require('./job-processor');
const JobError = require('./errors/job-error');
const RoverApis = require("@rover/apis");
const async = require("async");
const retry = require('retry');

const RETRY_TIMEOUT = 500;
const MAX_RETRY = 10;

function Worker(server) {
    if (!(this instanceof Worker)) {
        return new Worker(server);
    }

    this._server = server;
    this._activeJobs = [];
    // this._metricsDisplayTimer = setInterval(this.displayMetrics.bind(this), 5000);
};

Worker.prototype.shutdown = function(callback) {
    if (!util.isNullOrUndefined(arg)) {
        clearInterval(this._metricsDisplayTimer);
    }

    Promise.map(this._activeJobs, function(activeJob) {
        activeJob.job.shutdown();
        // TODO:
        // figure out a solution to shutdown
        return Promise.resolve();
    }, {})
    .timeout(30000)
    .then(() => {
        return callback();
    })
    .catch(err => {
        console.error(err);
        return callback();
    });
};


Worker.prototype.displayMetrics = function() {
    if (this._activeJobs.length == 0 ) {
        return;
    }

    let logger = this._server.plugins.logger.logger;

    logger.info("Active Jobs: " + this._activeJobs.length);

    for (var i = this._activeJobs.length - 1; i >= 0; i--) {
        let job = this._activeJobs[i].job;
        let currentStateTime = (Date.now() - job.getStateUpdatedAt())/ 1000;
        logger.info(`${job.getId()}: in state ${job.getState() + 1} for  ${currentStateTime}s`);
    }

    return;
}







Worker.prototype.generateStaticSegmentJobs = function(msg, args) {
        
    // Args are the original payload
    // 
    // First start streaming the customer identifiers from segment service
    


    let channel = this._server.connections.rabbitmq.channel;
    let workerQueue = this._server.connections.rabbitmq.workerQueue;
    let logger = this._server.plugins.logger.logger;
    let SegmentClient = this._server.connections.segment;

    let nextCursor = ''
    let authContext = new RoverApis.auth.v1.Models.AuthContext()

    authContext.setAccountId(msg.account.id)
    authContext.setPermissionsScopeList(["internal", "app:smw"])


    // somehow we keep going till 
    let finished = false

    const readbatch = function(request, callback) {

        const operation = retry.operation({
            retries: 5,
            factor: 2,
            minTimeout: 1 * 1000,
            maxTimeout: 60 * 1000,
            randomize: false,
        });

        operation.attempt(function(current) {
            // 20 second timeout
            const deadline = new Date(Date.now() + 20 * 1000)

            SegmentClient.getStaticSegmentPushIds(request, { deadline: deadline }, function(err, response) {
                /* Check if we should retry */
                if (operation.retry(err)) {
                    return;
                }

                if (err) {
                    return callback(err)
                }

                return callback(null, response)
            })
        })
    }


    async.doWhilst(function(next) {
        const request = new RoverApis.segment.v1.Models.GetStaticSegmentPushIdsRequest()

        request.setAuthContext(authContext)
        request.setCursor(nextCursor)

        readbatch(request, function(err, response) {
            if (err) {
                finished = true
                return next(err)
            }

            /* 
                repeated PushId push_ids = 1;
                string next_cursor = 2;
                bool finished = 3;
            */
            
            nextCursor = response.getNextCursor()
            finished = response.getFinished()

            const identifiers = response.getPushIdsList().map(pushId => return pushId.id)

            let jobArgs = Object.assign({}, args, { customer_identifiers: identifiers })

            delete jobArgs["static_segment_id"]

            channel.sendToQueue(workerQueue.queue, new Buffer(JSON.stringify(jobArgs)), {})

            return next()
            
        })
    }, function() {
        return finished == true
    }, function(err) {
        if (err) {
            console.error("Error: Static Segment Push failed", err)
        }
        
        // TODO: add in backoff at the queue level it could be that this one worker instance is bugged
        channel.ack(msg)
    })
};

Worker.prototype.work = function(msg) {

    // check to see the type of segment being passed in is
    // if args.static_segment_id exists
    // we branch

    let logger = this._server.plugins.logger.logger;

    let args = JSON.parse(msg.content);


    if (!util.isNullOrUndefined(args.static_segment_id)) {
        return this.generateStaticSegmentJobs(msg, args);
    }

    let context = {
        messageTemplate: args.message_template,
        account: args.account,
        query: args.query,
        testCustomerIds: args.test_customer_ids,
        customerIdentifiers: args.customer_identifiers,
        scrollId: args.scroll_id,
        offset: args.offset,
        platformCredentials: args.platform_credentials,
        segment: args.segment,
        preference: args.preference,
        testMessage: !util.isUndefined(args.test_customer_ids) && args.test_customer_ids.length > 0,
    }

    if (context.messageTemplate && context.messageTemplate.properties && context.messageTemplate.properties.noop) {
        context.noop = true;
    }

    if (context.account.message_limits) {
        context.account.message_limits.map(limit => {
            if (limit.number_of_minutes) {
                limit.number_of_seconds = limit.number_of_minutes * 60 
            } else if (limit.number_of_hours) {
                limit.number_of_seconds = limit.number_of_hours * 60 * 60
            } else if (limit.number_of_days) {
                limit.number_of_seconds = limit.number_of_days * 12 * 60 * 60 
            } else {
                limit.number_of_seconds = 1440;
            }
        });
    }

    let previousState = null;
    let jobId = null;

    if (!util.isNullOrUndefined(msg.properties) && !util.isNullOrUndefined(msg.properties.headers)) {
        previousState = msg.properties.headers['x-job-state'];
        jobId = msg.properties.headers['x-job-id'];
    }

    



    let job = new JobProcessor(jobId, this._server, context, previousState);

    this._activeJobs.push({ job: job, message: msg });

    let startTime = Date.now();

    let self = this;

    job.process(function(err) {
        
        if (err) {
            logger.error(err);
            return self._handleFailedJob(job, err);
        }
        
        let totalTime = Date.now() - startTime;
        let librato = self._server.plugins.librato.client;
        logger.debug("worker job finished in " + totalTime + "ms");
        librato.measure('send_message_to_customers.processed.time', totalTime);

        return self._handleCompletedJob(job);
    });

    return;
}


Worker.prototype._handleFailedJob = function(job, error) {
    let logger = this._server.plugins.logger.logger;
    let index = this._activeJobs.findIndex(activeJob => activeJob.job.getId() == job.getId());
    let channel = this._server.connections.rabbitmq.channel;
    let workerQueue = this._server.connections.rabbitmq.workerQueue;
    let rabbitmqMessage = this._activeJobs[index].message;

    if (error instanceof JobError && error.retryable == true) {
        let retryCount = 1;

        if (!util.isNullOrUndefined(rabbitmqMessage.properties) && !util.isNullOrUndefined(rabbitmqMessage.properties.headers)) {
            retryCount = ((parseInt(rabbitmqMessage.properties.headers['x-retry-count']) || 0) + 1);
        }
        
        if (retryCount <= MAX_RETRY) {
            let timeout = Math.pow(2, retryCount) * RETRY_TIMEOUT;
            logger.info(`Job ${job.getId()} Delaying retry job for ${timeout} ms`);

            let content = rabbitmqMessage.content;
            let jobState = job.getState();
            
            logger.info(`Job ${job.getId()} failed in state: ${jobState}`);
            let newHeaders = util._extend(rabbitmqMessage.properties.headers || {}, { 'x-retry-count': retryCount, 'x-job-state': jobState, 'x-job-id': job.getId(), 'x-delay': timeout });
            channel.publish("delayed_exchange", workerQueue.queue, content, { headers: newHeaders });
            logger.info(`Job ${job.getId()} requeued for processing`);
        } else {
            logger.warn(`Job ${job.getId()} reached max-retry count ${MAX_RETRY}`);
            if (!util.isNullOrUndefined(this._server.plugins.raven)) {
                let raven = this._server.plugins.raven.client;
                raven.setExtraContext({ job: job.getErrorContext() });
                raven.captureException(error);
            }
        }
        

        channel.nack(rabbitmqMessage, false, false);
        this._activeJobs.splice(index, 1);

    } else {
        // all we can do is acknowledge the message as we don't know what state job crashed in
        channel.ack(rabbitmqMessage);
        this._activeJobs.splice(index, 1);
    }

    return;
}

Worker.prototype._handleCompletedJob = function(job) {
    let index = this._activeJobs.findIndex(activeJob => activeJob.job.getId() == job.getId());
    let channel = this._server.connections.rabbitmq.channel;
    let rabbitmqMessage = this._activeJobs[index].message;
    
    channel.ack(rabbitmqMessage);
    // channel.ack(rabbitmqMessage);
    // job.shutdown();
    // job.cleanup();
    this._activeJobs.splice(index, 1);
    return;
}




module.exports = Worker;