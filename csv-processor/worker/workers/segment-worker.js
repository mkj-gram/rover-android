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
const JobTypes = RoverApis['csv-processor'].v1.Models.JobType
const through = require('through2')

let SegmentClient = require("@rover/segment-client").v1.Client()
let FilesClient = require("@rover/files-client").v1.Client()

const gcs = storage({
    projectId: Config.get('/storage/project_id'),
    credentials: Config.get('/storage/credentials')
})

const updateJobProgress = function(job, logger, progress) {
    logger.info("progress=" + progress)
    job.progress(progress)
}

const retryableError = function(err) {
    if (!err) {
        return false
    }

    if (err.code == 14 || err.code == 4 || err.code == 8 || err.code == 13) {
        return true
    }

    return false
}

const getFirstDefined = function (/* ...input */) {
    for(index in arguments) {
        let arg = arguments[index]
        if (arg !== undefined) {
            return arg
        }
    }

    return undefined
}

const loadStaticSegmentWithCsvFile = function(job, logger) {
    /*
        Job -> 
        {
            account_id: 1,
            static_segment_id: 123,
            csv_file_id: 12
        }
    */
    return new Promise((resolve, reject) => {

        logger.info("Worker function started with input: ", job.data)

        let jobAuthContext = job.data.auth_context
        let jobArguments = job.data.arguments

        let accountId = jobArguments.account_id
        let staticSegmentId = jobArguments.static_segment_id
        let csvFileId = jobArguments.csv_file_id

        let request = new RoverApis.files.v1.Models.GetCsvFileRequest()
        let authContext = new RoverApis.auth.v1.Models.AuthContext()

        authContext.setAccountId(jobAuthContext.account_id)
        authContext.setUserId(jobAuthContext.user_id)
        authContext.setPermissionScopesList(jobAuthContext.scopes)

        request.setAuthContext(authContext)
        request.setCsvFileId(csvFileId)

        logger.info("Retrieving CsvFile")

        FilesClient.getCsvFile(request, function(err, reply) {
            if (err) {
                return reject(err)
            }

            logger.info("CsvFile retrieved")

            let csvFile = reply.getCsvFile()
            var rowsProcessed = 0
            var totalRows = csvFile.getNumRows()

            var meta = new grpc.Metadata()
            meta.add('account_id', `${accountId}`)
            meta.add('static_segment_id', `${staticSegmentId}`)

            // csv-file exists lets read it
            let request = new RoverApis.files.v1.Models.ReadCsvFileRequest()
            request.setAuthContext(authContext)
            request.setCsvFileId(csvFileId)

            logger.info("Csv read stream opened")
            let csvFileReadStream = FilesClient.readCsvFile(request)

            logger.info("Segment write stream opened")
            const updateStaticSegmentWriteStream = SegmentClient.updateStaticSegmentPushIds(meta, function(err, res) {

                if (err) {
                    csvFileReadStream.cancel()

                    if (retryableError(err)) {
                        return reject(new Errors.RetryableError(err))
                    } else {
                        return reject(err)
                    }
                }
                

                updateJobProgress(job, logger, 100)

                logger.info("Segment Updated: ", res.getSegment().toObject())

                return resolve()
            })

            let currentProgress = 0

            csvFileReadStream
                .on('error', function(err) {
                    if (csvFileReadStream.cancelled === false) {
                        return reject(err)
                    }
                })
                .pipe(through({ objectMode: true }, function (chunk, encoding, callback) {
                    // this refers to the wrapper through transform stream
                    // chunk is RoverApis.files.v1.ReadCsvFileResponse()
                    
                    const pushId = new RoverApis.segment.v1.Models.PushId()
                    pushId.setId(chunk.getLinesList()[0])
                    pushId.setType(Segment.v1.Models.PushIdType.ALIAS)
                    this.push(pushId) 

                    rowsProcessed += 1

                    const newProgress = Math.min(Math.floor(((rowsProcessed / totalRows) * 100)), 99)

                    if (newProgress > currentProgress) {
                        currentProgress = newProgress
                        updateJobProgress(job, logger, currentProgress)
                    }

                    callback()
                    
                }))
                .pipe(updateStaticSegmentWriteStream)
                .on('error', function(err) {
                    return reject(err)
                })
        })
    })
}

/*
    Job ->
    {
        account_id: 1,
        segment_id: 123,
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
                if (retryableError(err)) {
                    return reject(new Errors.RetryableError(err))
                } else {
                    return reject(err)
                }
                
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

                        if (retryableError(err)) {
                            return reject(new Errors.RetryableError(err))
                        } else {
                            return reject(err)
                        }
                    }
                    
                    updateJobProgress(job, logger, 100)

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
                        updateJobProgress(job, logger, 90)
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
                        updateJobProgress(job, logger, Math.min(progress, 90))
                    }
                    
                    totalBytesProcessed += bytesRead
                })

                return remoteReadStream.pipe(meter).pipe(csvStream)
            });
        })
    })
}

module.exports = {
    loadStaticSegmentWithCsvFile: loadStaticSegmentWithCsvFile,
    loadStaticSegment: loadStaticSegment
}