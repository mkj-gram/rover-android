var Promise = require('bluebird')
const csv = require('fast-csv')
const storage = require('@google-cloud/storage')
const Config = require('../config')
const FileMeter = require('../lib/filemeter')
const RoverApis = require('@rover/apis')
const Segment = RoverApis.segment
const grpc = require('grpc')
const PrefixedLogger = require('../lib/prefixed-logger')
const Errors = require('../lib/errors')

let SegmentClient = require("@rover/segment-client").v1.Client()

const gcs = storage({
    projectId: Config.get('/storage/project_id'),
    credentials: Config.get('/storage/credentials')
})

const JOB_TIMEOUT = Config.get('/job/timeout')
const JOB_CONCURRENCY = Config.get('/job/concurrency')

const updateJobProgress = function(job, progress) {
    job.progress(progress)
}

/*
    Job ->
    {
        account_id: 1,
        segemt_id: 123,
        gcs_file: {
            project_id: "hello",
            bucket: "bulk-services",
            file_id: '123123123.csv'
        }
    }
 */
const loadStaticSegment = function(job, logger) {
    
    return new Promise((resolve, reject) => {
        const jobData = job.opts

        const authContext = new RoverApis.auth.v1.Models.AuthContext()
        authContext.setAccountId(jobData.auth_context.account_id)
        authContext.setUserId(jobData.auth_context.user_id)
        authContext.setPermissionScopesList(jobData.auth_context.scopes)

        const segmentId = jobData.segment_id
        const accountId = authContext.getAccountId()

        // First we check if we have access to the static segment and it exists
        
        const getStaticSegmentRequest = new RoverApis.segment.v1.Models.GetStaticSegmentRequest()
        getStaticSegmentRequest.setAuthContext(authContext)
        getStaticSegmentRequest.setId(segmentId)

        logger.info("Getting static segment")

        SegmentClient.getStaticSegment(getStaticSegmentRequest, function(err, staticSegment) {
            if (err) {
                return reject(err)
            }

            const gcsFile = jobData.gcs_file

            const bucket = gcs.bucket(gcsFile.bucket)

            const file = bucket.file(gcsFile.file_id)

            file.get(function(err, _, apiResponse) {
                if (err) {
                    return reject(err)
                }

                let fileSize = file.metadata.size || 0
                let totalBytesProcessed = 0

                logger.info("FileSize: " + fileSize)

                if (fileSize == 0) {
                    return reject(new Errors.EmptyFileError("file has 0 bytes"))
                }
                
                // file.metadata has been populated.
                
                const remoteReadStream = bucket.file(gcsFile.file_id).createReadStream();

                logger.info("Started", gcsFile)

                var meta = new grpc.Metadata();
                meta.add('account_id', `${accountId}`)
                meta.add('static_segment_id', `${segmentId}`)

                let callStreamActive = true

                const call = SegmentClient.updateStaticSegmentPushIds(meta, function(err, res) {
                    if (err) {
                        callStreamActive = false
                        remoteReadStream.end()
                        return reject(err)
                    }
                    
                    updateJobProgress(job, 100)

                    logger.info("Segment Updated: ", res.getSegment().toObject())

                    return resolve()
                })
                
                const csvStream = csv().on('data', function(data) {
                    // data is an array of columns per line
                    const pushId = new Segment.v1.Models.PushId()
                    pushId.setId(data[0])
                    pushId.setType(Segment.v1.Models.PushIdType.ALIAS)
                    if (callStreamActive) {
                        call.write(pushId)   
                    } else {
                        csvStream.close()
                    }
                }).on('end', function() {
                    if (callStreamActive) {
                        updateJobProgress(job, 90)
                        call.end()
                    }
                }).on('error', function(err) {
                    if (callStreamActive) {
                        call.cancel()
                        return reject(err)
                    }
                })

                
                /* 
                    FileMeter gives us events whenever we read in new data
                    We use this to update the job progress
                */

                const meter = new FileMeter()

                meter.on("bytesRead", function(bytesRead) {
                    const progress = Math.floor(Math.min(((totalBytesProcessed / fileSize) * 100)))
                    // We update progress up to 90% since the last 10% is waiting for the grpc call to finish
                    if (callStreamActive) {
                        updateJobProgress(job, Math.min(progress, 90))
                    }
                    
                    totalBytesProcessed += bytesRead
                })

                return remoteReadStream.pipe(meter).pipe(csvStream)
            });
        })
    })
}

const init = function(context) {

    const queue = context.queues.staticSegment
    const Raven = context.raven

    queue.process(JOB_CONCURRENCY, function(job, done) {
        

        const logger = new PrefixedLogger("JOB " + job.jobId)

        logger.info("started")

        loadStaticSegment(job, logger)
        .timeout(JOB_TIMEOUT)
        .then(() => {
            logger.info("Completed")
            return done()
        })
        .catch(Promise.TimeoutError, (err) => {
            logger.error("timed out")
            return done(err)
        })
        .catch(Errors.EmptyFileError, (err) => {
            logger.error(err)
            return done(err)
        })
        .catch(err => {
            if (Raven && !(err.hasOwnProperty('code') && err.hasOwnProperty('metadata'))) {
                // This is not a grpc error
                Raven.captureException(err);
            }
            logger.error("failed", err)
            return done(err)
            
        })
    })
}

module.exports = {
    init: init
}