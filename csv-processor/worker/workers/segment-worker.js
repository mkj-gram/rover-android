const winston = require('winston')
const csv = require('fast-csv')
const storage = require('@google-cloud/storage')
const Config = require('../config')
const FileMeter = require('../lib/filemeter')
const RoverApis = require('@rover/apis')
const Segment = RoverApis.segment
const grpc = require('grpc')

let SegmentClient = require("@rover/segment-client").v1.Client()

const gcs = storage({
    projectId: Config.get('/storage/project_id'),
    credentials: Config.get('/storage/credentials')
})


const updateJobProgress = function(job, progress) {
    winston.info("Job: id=" + job.jobId + " progress=" + progress)
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
const loadStaticSegment = function(job, done) {
    
    const jobData = job.opts

    const authContext = new RoverApis.auth.v1.Models.AuthContext()
    authContext.setAccountId(jobData.auth_context.account_id)
    authContext.setUserId(jobData.auth_context.user_id)
    authContext.setPermissionScopesList(jobData.auth_context.scopes)

    const segmentId = jobData.segment_id
    const accountId = authContext.getAccount()

    // First we check if we have access to the static segment and it exists
    
    const getStaticSegmentRequest = new RoverApis.segment.v1.Models.GetStaticSegmentRequest()
    getStaticSegmentRequest.setAuthContext(authContext)
    getStaticSegmentRequest.setId(segmentId)

    SegmentClient.getStaticSegment(getStaticSegmentRequest, function(err, staticSegment) {
        if (err) {
            return done(err)
        }

        const gcsFile = jobData.gcs_file

        const bucket = gcs.bucket(gcsFile.bucket)

        const file = bucket.file(gcsFile.file_id)

        file.get(function(err, _, apiResponse) {
            if (err) {
                winston.error(err)
                return done(err)
            }

            let fileSize = file.metadata.size || 0
            let totalBytesProcessed = 0

            winston.debug("FileSize: " + fileSize)

            // file.metadata has been populated.
            
            const remoteReadStream = bucket.file(gcsFile.file_id).createReadStream();

            winston.debug("Started", gcsFile)

            var meta = new grpc.Metadata();
            meta.add('account_id', `${accountId}`)
            meta.add('static_segment_id', `${segmentId}`)

            let callStreamActive = true

            const call = SegmentClient.updateStaticSegmentPushIds(meta, function(err, res) {
                if (err) {
                    callStreamActive = false
                    remoteReadStream.end()
                    return done(err)
                }
                
                updateJobProgress(job, 100)

                winston.info("Segment Updated: ", res.getSegment().toObject())

                return done()
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
            }).on('error', function() {
                if (callStreamActive) {
                    call.cancel()
                    return done(err)
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
}

const init = function(context) {

    const queue = context.queues.staticSegment

    queue.process(function(job, done) {
        winston.info("Job Started: ", job.opts)
        
        let callbackHasBeenCalled = false

        loadStaticSegment(job, function(err) {
            if (err) {
                winston.error("Job Failed: jobId=" + job.jobId + " code=" + err.code , err)
            }
            
            if (callbackHasBeenCalled == false) {
                callbackHasBeenCalled = true

                if (err) {
                    const message = err.message || err.details || "unknown"
                    return done(err)
                } else {
                    return done()
                }
               
            }

        })
    })
}

module.exports = {
    init: init
}