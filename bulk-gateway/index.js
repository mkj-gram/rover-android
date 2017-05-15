const http = require('http')
const util = require('util')
const Config = require('./config')
const finalhandler = require('finalhandler')
const morgan = require('morgan')
const logger = morgan('tiny')
const crypto = require('crypto')
const Router = require('router')
const async = require('async')
const moment = require('moment')
const UploaderClient = require('./uploader')
const uploader = new UploaderClient({
    projectId: Config.get('/storage/project_id'),
    credentials: Config.get('/storage/credentials'),
    bucketName: Config.get('/storage/bucket_name')
})

const Auth = require('./auth')

const { CsvProcessor } = require("@rover/csv-processor-client")
const JobStatus = CsvProcessor.V1.Models.JobStatus

let CsvProcessorClient = null

const tasks = []

const server = {
    connections: {}
}

const grpcCodeToHttpCode =
{
    4: 408,
    5: 404,
    6: 409,
    7: 403,
    8: 429,
    9: 428,
    12: 501,
    13: 500,
    14: 503,
    15: 500,
    16: 401
}

/***********************************
          Helper Methods
***********************************/

const getHTTPCode = function(grpcCode) {
    return (grpcCodeToHttpCode[grpcCode] || 500)
}

const loggableError = function(err) {
    const status = err.status || 500

    return (status != 401 && status != 403 && status != 404)
}

const getJobStatusString = function(job_state) {
    switch(job_state) {
        case JobStatus.ENQUEUED:
            return "enqueued"
        case JobStatus.PROCESSING:
            return "processing"
        case JobStatus.FAILED:
            return "failed"
        case JobStatus.COMPLETED:
            return "completed"
        default:
            return "unknown"
    }
}

const serializeLoadJob = function(loadJob, format) {
    return {
        id: loadJob.getId().toString(),
        type: "load-jobs",
        attributes: {
            'format': format,
            'progress': loadJob.getProgress(),
            'status': getJobStatusString(loadJob.getStatus()),
            'created-at': moment.utc(loadJob.getCreatedAt()).toISOString()
        }
    }
}


/***********************************
             Middleware
***********************************/

const authenticate = function(req, res, next) {
    Auth.authenticate(req, function(err, account) {
        if (err) {
            return next({ status: 401 })
        }

        req.credentials = { account: account }

        return next()
    })
}

const upload = function(req, res, next) {

    const filename = crypto.randomBytes(32).toString('hex') + ".csv"

    uploader.upload(req, filename, function(err, uploadedFile) {
        if (err) {
            return next(err)
        }

        req.file = {}
        req.file.cloudStorageObject = uploadedFile;

        return next()
    })
}


/***********************************
             Routes
***********************************/

const router = Router()

router.put('/bulk/segments/:id/csv', authenticate, upload, function(req, res, next) {

    const gcsObject = new CsvProcessor.V1.Models.GCSObject()

    gcsObject.setProjectId(req.file.cloudStorageObject.bucket.storage.projectId)
    gcsObject.setBucket(req.file.cloudStorageObject.bucket.id)
    gcsObject.setFileId(req.file.cloudStorageObject.id)

    const segmentLoadJobConfig = new CsvProcessor.V1.Models.SegmentLoadJobConfig()

    segmentLoadJobConfig.setAccountId(req.credentials.account.id)
    segmentLoadJobConfig.setSegmentId(req.params.id)
    segmentLoadJobConfig.setCsv(gcsObject)


    const loadJobRequest = new CsvProcessor.V1.Models.CreateLoadJobRequest()

    loadJobRequest.setType(CsvProcessor.V1.Models.JobType.SEGMENT)
    loadJobRequest.setSegmentLoadJobConfig(segmentLoadJobConfig)

    const deadline = moment().add(15, 'seconds').toDate()

    CsvProcessorClient.createLoadJob(loadJobRequest, { deadline: deadline }, function(err, response) {
        if (err) {
            return next({ status: getHTTPCode(err.code), message: err.message })
        }

        const loadJob = response.getJob()

        const payload = serializeLoadJob(loadJob, 'csv')

        res.writeHead(200, { 'content-type': 'application/json' })
        res.write(JSON.stringify(payload))
        res.end()

    });
})

router.get('/bulk/load-job/:id/csv', authenticate, function(req, res, next) {
    const request = new CsvProcessor.V1.Models.GetLoadJobRequest()

    request.setLoadJobId(req.params.id)
    
    CsvProcessorClient.getLoadJob(request, function(err, response) {
        if (err) {
            return next({ status: getHTTPCode(err.code), message: err.message })
        }

        const loadJob = response.getJob()

        if (loadJob.getAccountId() !== req.credentials.account.id) {
            return next({ status: 403, message: "Forbidden" })
        }

        const payload = serializeLoadJob(loadJob, 'csv')

        res.writeHead(200, { 'content-type': 'application/json' })
        res.write(JSON.stringify(payload))
        res.end()

    })
})


/*
    Healthchecking used by kubernetes
 */

router.get('/healthcheck', function(req, res, next) {
    res.writeHead(200)
    return res.end()
})

/* 
    File cleanup handler

    If the application has uploaded a file and errored out it will make sure to delete the file that was uploaded
    this is to prevent a bloat of dead files sitting in the gcs bucket
*/
router.use(function(err, req, res, next) {
    if (!util.isNullOrUndefined(err) && !util.isNullOrUndefined(req.file) && !util.isNullOrUndefined(req.file.cloudStorageObject)) {
        uploader.cleanUp(req.file.cloudStorageObject, function(uploadError) {
            if (uploadError) {
                console.error("Cleanup error: " + uploadError)
            }

            // return the original error
            return next(err)
        })
    } else {
        return next(err)
    }
})

// error handler
router.use(function(err, req, res, next) {

    if (loggableError(err)) {
        console.error(err);
    }

    res.writeHead(err.status || 500)
    res.end()
})



const httpServer = http.createServer(function(req, res) {
    const done = finalhandler(req, res)

    req.server = server

    logger(req, res, function(err) {
        if (err) return done(err);
        return router(req, res, done)
    })
})



/***********************************
          Setup Postgres
***********************************/

const postgresConnectionOptions = {
    host: Config.get('/postgres/host'),
    port: Config.get('/postgres/port'),
    user: Config.get('/postgres/username'),
    password: Config.get('/postgres/password'),
    database: Config.get('/postgres/database'),
    ssl: Config.get('/postgres/ssl')
};

tasks.push(function(callback) {
    let postgres = require('./connections/postgres');
    postgres.register(server, postgresConnectionOptions, (err) => {
        if (err) {
            return callback(err);
        }
        return callback();
    });
});

/***********************************
          Connect to GCS
***********************************/

tasks.push(function(callback) {
    uploader.connect(function(err) {
        if (err) {
            return callback(err)
        }
        return callback()
    })
})

tasks.push(function(callback) {
    try {
        CsvProcessorClient = CsvProcessor.V1.Client()
    } catch(err) {
        return callback(err)
    }

    return callback()
})

/***********************************
           Boot Server
***********************************/

async.series(tasks, function(err) {
    if (err) {
        console.error(err)
        process.exit()
    }
    
    httpServer.listen({
        host: Config.get("/host"),
        port: Config.get("/port")
    }, function(err) {
        if (err) {
            console.error(err)
            process.exit()
        }

        console.info("Server started " + Config.get("/host") + ":" + Config.get("/port"))
    })
})