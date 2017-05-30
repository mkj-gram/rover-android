const CsvProcessor = {
    V1: {
        Models: require('../../lib/csv-processor/v1/csv-processor_pb')
    }
}

const JobStatus = CsvProcessor.V1.Models.JobStatus
const JobType = CsvProcessor.V1.Models.JobType

const getJobStatus = function(state) {
    /* 
        job states https://github.com/Automattic/kue#job-events
    */
    switch(state) {
        case "waiting":
            return JobStatus.ENQUEUED
        case "active":
            return JobStatus.PROCESSING
        case "delayed":
            return JobStatus.PROCESSING
        case "paused":
            return JobStatus.PROCESSING
        case "failed":
            return JobStatus.FAILED
        case "completed":
            return JobStatus.COMPLETED
        default:
            return JobStatus.UNKNOWN
    }
}

/**
 * Converts a date object to a grpc Timestamp object
 * @param  {Date}   date 
 * @return {Object} timestamp
 */
const buildTimestamp = function(date) {
    if (date instanceof Date) {
        let timestamp = new CsvProcessor.V1.Models.Timestamp()
        let unixTime = date.getTime()
        timestamp.setSeconds(Math.floor(unixTime / 1000 ))
        timestamp.setNanos(((unixTime % 1000) * 1000000))

        return timestamp

    } else {
        return undefined
    }
}

/**
 * Build a load job proto model
 * @param  {integer} id         the id of the load job
 * @param  {integer} account_id the account id the job was created for
 * @param  {JobType} type       type of job
 * @param  {integer} progress   a number indicating progress from 0-100
 * @return {LoadJob}            LoadJob proto
 */
const buildLoadJobProto = function({ id, account_id, type, status, progress, created_at }) {

    const proto = new CsvProcessor.V1.Models.LoadJob()

    proto.setId(id)
    proto.setAccountId(account_id)
    proto.setType(type)
    proto.setStatus(status)
    proto.setProgress(0)
    proto.setCreatedAt(buildTimestamp(created_at))

    return proto
}


/**
 * Creates a new kue job of type load-static-segment with the segment config passed in from caller
 * @param  {Object}   call     the call object
 * @param  {Function} callback 
 */
const createSegmentLoadJob = function(call, callback) {

    const queue = this.queues.staticSegment
    const segmentLoadJobConfig = call.request.getSegmentLoadJobConfig()


    queue.add('load-static-segment', {
        type: JobType.SEGMENT,
        account_id: segmentLoadJobConfig.getAccountId(),
        segment_id: segmentLoadJobConfig.getSegmentId(),
        gcs_file: {
            project_id: segmentLoadJobConfig.getCsv().getProjectId(),
            bucket: segmentLoadJobConfig.getCsv().getBucket(),
            file_id: segmentLoadJobConfig.getCsv().getFileId()
        }
    }).then(function(job) {

        const reply = new CsvProcessor.V1.Models.CreateLoadJobReply()

        const loadJob = buildLoadJobProto({
            id: job.jobId,
            account_id: segmentLoadJobConfig.getAccountId(),
            type: JobType.SEGMENT,
            status: getJobStatus("enqueue"),
            progress: 0,
            created_at: new Date(job.timestamp)
        })


        
        reply.setJob(loadJob)

        return callback(null, reply)

    }).catch(function(err) {
        return callback(err)
    })
}


/**
 * Retrieves a kue job from redis and returns it back to the caller
 * @param  {Object}   call     the call object
 * @param  {Function} callback 
 */
const getLoadJob = function(call, callback) {

    const queue = this.queues.staticSegment

    const loadJobQuery = call.request
    const loadJobId = loadJobQuery.getLoadJobId()

    queue.getJob(loadJobId.toString())
        .then(function(job) {

            if (!job) {
                return callback({ code: 5, message: "LoadJob Not Found"})
            }

            job.getState()
                .then(function(jobState) {

                    const reply = new CsvProcessor.V1.Models.GetLoadJobReply()
                    
                    console.log(jobState)

                    const loadJob = buildLoadJobProto({
                        id: job.jobId,
                        account_id: job.opts.account_id,
                        type: JobType.SEGMENT,
                        status: getJobStatus(jobState),
                        progress: job.progress() || 0,
                        created_at: new Date(job.timestamp)
                    })

                    reply.setJob(loadJob)

                    return callback(null, reply)   
                })
                .catch(function(err) {
                    return callback(err)
                })
        })
        .catch(function(err) {
            return callback(err)
        })
}

/**
 * Creates a csv load job depending on the type passed in
 * @param  {Object}   call     the call object
 * @param  {Function} callback 
 */
const createLoadJob = function(call, callback) {

    const jobType = call.request.getType()

    switch(jobType) {
        case CsvProcessor.V1.Models.JobType.SEGMENT:
            return createSegmentLoadJob.bind(this)(call, callback)
            break
        default:
            return callback({message: "Unknown job type", status: 400})
    }
}


module.exports = {
    getLoadJob: getLoadJob,
    createLoadJob: createLoadJob
}