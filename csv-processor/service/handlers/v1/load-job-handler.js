const RoverApis = require("@rover/apis")
const CsvProcessor = RoverApis['csv-processor']
const grpcCodes = require("@rover-common/grpc-codes")

const JobStatus = CsvProcessor.v1.Models.JobStatus
const JobType = CsvProcessor.v1.Models.JobType

const AllowedScopes = ["internal", "server"]

const permissionDeniedGrpcStatus = { code: grpcCodes.status.PERMISSION_DENIED, message: "You do not have permission to access this resource" }

const hasAccess = function(authContext) {
    if (authContext == null || authContext == undefined) {
        return false
    }

    const currentScopes = authContext.getPermissionScopesList()

    if (!currentScopes.some(scope => AllowedScopes.includes(scope))) {
        return false
    }

    return true
}

const getJobStatus = function(state) {

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
        let timestamp = new RoverApis.Models.Timestamp()
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

    const proto = new CsvProcessor.v1.Models.LoadJob()

    proto.setId(id)
    proto.setAccountId(account_id)
    proto.setType(type)
    proto.setStatus(status)
    proto.setProgress(progress)
    proto.setCreatedAt(buildTimestamp(created_at))

    return proto
}

const buildCreateLoadJobReply = function(job, account_id, type) {
    let reply = new CsvProcessor.v1.Models.CreateLoadJobReply()

    const loadJob = buildLoadJobProto({
        id: job.jobId,
        account_id: account_id,
        type: type,
        status: getJobStatus("waiting"),
        progress: 0,
        created_at: new Date(job.timestamp)
    })

    reply.setJob(loadJob)

    return reply
}

/**
 * Creates a new job to import a list of profiles
 * @param  {Object}   call     
 * @param  {Function} callback
 */
const createProfileLoadJob = function(call, callback) {
    const request = call.request
    const queue = this.queues.loadJob
    const AuthContext = request.getAuthContext()
    const profileLoadJob = request.getProfileLoadJobConfig()
    
    let jobData = {
        type: JobType.PROFILE_IMPORT,
        auth_context: {
            account_id: AuthContext.getAccountId(),
            user_id: AuthContext.getUserId(),
            scopes: AuthContext.getPermissionScopesList()
        },
        arguments: {
            csv_file_id: profileLoadJob.getCsvFileId(),
            import_schema: profileLoadJob.getSchemaList().map(s => { return { type: s.getType(), field: s.getField(), description: s.getDescription() }})
        }
    }

    queue.add(jobData)
        .then(function(job) {
            let reply = buildCreateLoadJobReply(job, profileLoadJob.getAccountId(), JobType.PROFILE_IMPORT)
            return callback(null, reply)
        })
        .catch(function(err) {
            return callback(err)
        })
}

/**
 * Creates a new job to tag a list of profiles
 * @param  {Object}   call     
 * @param  {Function} callback
 */
const createProfileTagJob = function(call, callback) {
    const request = call.request
    const queue = this.queues.loadJob
    const AuthContext = request.getAuthContext()
    const profileTagJob = request.getProfileTagJobConfig()
    
    let jobData = {
        type: JobType.PROFILE_TAG,
        auth_context: {
            account_id: AuthContext.getAccountId(),
            user_id: AuthContext.getUserId(),
            scopes: AuthContext.getPermissionScopesList()
        },
        arguments: {
            csv_file_id: profileTagJob.getCsvFileId(),
            tags: profileTagJob.getTagsList()
        }
    }

    queue.add(jobData)
        .then(function(job) {
            let reply = buildCreateLoadJobReply(job, profileTagJob.getAccountId(), JobType.PROFILE_TAG)
            return callback(null, reply)
        })
        .catch(function(err) {
            return callback(err)
        })
}

/**
 * Creates a new job of type load-static-segment-with-csv
 * @param  {Object}   call     grpc call
 * @param  {Function} callback 
 */
const createSegmentLoadJobWithCsvFile = function(call, callback) {
    const request = call.request
    const queue = this.queues.loadJob
    const AuthContext = request.getAuthContext()
    const segmentLoadJobConfig = request.getSegmentLoadJobWithCsvFileConfig()

    let jobData = {
        type: JobType.SEGMENT_WITH_CSV_FILE,
        auth_context: {
            account_id: AuthContext.getAccountId(),
            user_id: AuthContext.getUserId(),
            scopes: AuthContext.getPermissionScopesList()
        },
        arguments: {
            account_id: segmentLoadJobConfig.getAccountId(),
            static_segment_id: segmentLoadJobConfig.getStaticSegmentId(),
            csv_file_id: segmentLoadJobConfig.getCsvFileId()
        }  
    }
    
    queue.add(jobData)
        .then(function(job) {
            let reply = buildCreateLoadJobReply(job, segmentLoadJobConfig.getAccountId(), JobType.SEGMENT_WITH_CSV_FILE)
            return callback(null, reply)
        })
        .catch(function(err) {
            return callback(err)
        })
}

/**
 * Creates a new kue job of type load-static-segment with the segment config passed in from caller
 * @param  {Object}   call     the call object
 * @param  {Function} callback 
 */
const createSegmentLoadJob = function(call, callback) {

    const queue = this.queues.staticSegment
    const segmentLoadJobConfig = call.request.getSegmentLoadJobConfig()
    const AuthContext = call.request.getAuthContext()

    queue.add('load-static-segment', {
        type: JobType.SEGMENT,
        auth_context: {
            account_id: AuthContext.getAccountId(),
            user_id: AuthContext.getUserId(),
            scopes: AuthContext.getPermissionScopesList()
        },
        account_id: AuthContext.getAccountId(),
        segment_id: segmentLoadJobConfig.getSegmentId(),
        gcs_file: {
            project_id: segmentLoadJobConfig.getCsv().getProjectId(),
            bucket: segmentLoadJobConfig.getCsv().getBucket(),
            file_id: segmentLoadJobConfig.getCsv().getFileId()
        }
    }).then(function(job) {

        const reply = new CsvProcessor.v1.Models.CreateLoadJobReply()

        const loadJob = buildLoadJobProto({
            id: job.jobId,
            account_id: segmentLoadJobConfig.getAccountId(),
            type: JobType.SEGMENT,
            status: getJobStatus("waiting"),
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

    const req = call.request

    const loadJobId = req.getLoadJobId()
    const queueVersion = req.getQueueVersion()

    const AuthContext = req.getAuthContext()

    if (!hasAccess(AuthContext)) {
        return callback(permissionDeniedGrpcStatus)
    }

    let queue;

    if (queueVersion == 2) {
        queue = this.queues.loadJob
    } else {
        queue = this.queues.staticSegment
    }


    queue.getJob(loadJobId.toString())
        .then(function(job) {

            if (!job) {
                return callback({ code: grpcCodes.status.NOT_FOUND, message: "LoadJob Not Found"})
            }

            let jobAccountId = job.opts.account_id !== undefined ? job.opts.account_id : job.data.auth_context.account_id
            
            if ( jobAccountId != AuthContext.getAccountId()) {
                return callback(permissionDeniedGrpcStatus)
            }

            job.getState()
                .then(function(jobState) {

                    const reply = new CsvProcessor.v1.Models.GetLoadJobReply()

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

    
    const AuthContext = call.request.getAuthContext()

    if (!hasAccess(AuthContext)) {
        return callback(permissionDeniedGrpcStatus)
    }
    const jobType = call.request.getType()

    switch(jobType) {
        case CsvProcessor.v1.Models.JobType.SEGMENT:
            return createSegmentLoadJob.bind(this)(call, callback)
            break
        case CsvProcessor.v1.Models.JobType.SEGMENT_WITH_CSV_FILE:
            return createSegmentLoadJobWithCsvFile.bind(this)(call, callback)
            break
        case CsvProcessor.v1.Models.JobType.PROFILE_IMPORT:
            return createProfileLoadJob.bind(this)(call, callback)
            break
        case CsvProcessor.v1.Models.JobType.PROFILE_TAG:
            return createProfileTagJob.bind(this)(call, callback)
            break
        default:
            return callback({message: "Unknown job type", status: grpcCodes.status.INVALID_ARGUMENT })
    }
}


module.exports = {
    getLoadJob: getLoadJob,
    createLoadJob: createLoadJob
}