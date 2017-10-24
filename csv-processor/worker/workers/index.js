const Config = require('../config')
const RoverApis = require('@rover/apis')
const JobTypes = RoverApis.csv_processor.v1.Models.JobType
const Errors = require('../lib/errors')
const PrefixedLogger = require('@rover-common/prefixed-logger')
const Promise = require('bluebird')

const JOB_DEFAULT_TIMEOUT = Config.get('/job/timeout')
const JOB_CONCURRENCY = Config.get('/job/concurrency')

function getFirstDefined(val, val2) {
    if (val !== undefined) {
        return val
    }

    return val2
}

module.exports = function(context) {

	const FilesClient = require('@rover/files-client').v1.Client()
    const AudienceClient = require('@rover/audience-client').v1.Client()


	const SegmentWorker = require('./segment-worker')
	const ProfileWorker = require('./profile-import-worker')(FilesClient, AudienceClient)

	const jobFunctions = {}
    jobFunctions[JobTypes.SEGMENT] = SegmentWorker.loadStaticSegment
    jobFunctions[JobTypes.SEGMENT_WITH_CSV_FILE] = SegmentWorker.loadStaticSegmentWithCsvFile
    jobFunctions[JobTypes.PROFILE_IMPORT] = ProfileWorker.loadProfiles


    console.info("Work map initialized", jobFunctions)
    
    const Raven = context.raven

    function work(jobFunction, job, logger, attempt) {

    	let jobTimeout = job.data.timeout || JOB_DEFAULT_TIMEOUT

        return jobFunction(job, logger)
        .timeout(jobTimeout)
        .then(() => {
            logger.info("Completed")
            return Promise.resolve()
        })
        .catch(Promise.TimeoutError, (err) => {
            logger.error("timed out")
            return Promise.reject(err)
        })
        .catch(Errors.EmptyFileError, (err) => {
            logger.error(err)
            return Promise.reject(err)
        })
        .catch(Errors.RetryableError, (err) => {
            if (attempt > 5) {
                // err.err is the original error
                return Promise.reject(err.err)
            } else {
                logger.info("job failed retrying", err)
                updateJobProgress(job, logger, 0)
                return Promise.delay(2000 * attempt).then(() => {
                    return work(jobFunction, job, logger, attempt + 1)
                })
            }
        })
        .catch(err => {
            /*
                Bluebird bubbles up promise rejections. We only want to act on the first work request    
             */
            if (attempt == 1) {
                if (Raven && !(err.hasOwnProperty('code') && err.hasOwnProperty('metadata'))) {
                    // This is not a grpc error
                    Raven.captureException(err);
                }
                
                logger.error("failed", err)
            }
            
            

            return Promise.reject(err)
        })
    }

    let queues = [context.queues.staticSegment, context.queues.loadJob]

    queues.forEach(queue => {
        queue.process(JOB_CONCURRENCY, function(job, done) {

            const logger = new PrefixedLogger(queue.name + " job:" + job.jobId)

            logger.info("Job received")

            const jobType = getFirstDefined(job.opts.type, job.data.type)

            const workFunction = jobFunctions[jobType]

            if (!workFunction) {
                
                if (job.data) {
                    logger.debug(job.data)
                }

                if (job.opts) {
                    logger.debug(job.opts)
                }

                let error = new Error("No matching job function for: " + jobType)
                logger.error(error)
                return done(error)
            }
            
            logger.info("started")

            work(workFunction, job, logger, 1)
            .then(() => {
                return done()
            })
            .catch(err => {
                logger.error("finished in failed state")
                return done(err)
            })
        })
    })
}