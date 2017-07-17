const async = require("async")

module.exports = function(callback) {
    const setupTasks = []

    const Config = require('../config')
    const Router = require('express').Router

    /***********************************
              Helper Methods
    ***********************************/

    const GrpcCodes = require("@rover-common/grpc-codes")

    const getHTTPCode = function(grpcCode) {
        return GrpcCodes.grpcToHttp(grpcCode)
    }

    /***********************************
                 Routes
    ***********************************/

    const router = Router()

    if (Config.get('/raven/enabled')) {
        console.info("Setting up Sentry Raven")

        const Raven = require('raven')

        Raven.config(Config.get('/raven/dsn')).install();

        // The request handler must be the first middleware on the app
        router.use(Raven.requestHandler());

        router.use(Raven.errorHandler());
    }

    /*
        Add generic logging
    */
    const morgan = require('morgan')
    const logger = morgan(':method :url :status :res[content-length] - :response-time ms')
    router.use(logger)
    
    /* 
        Add Cors support 
    */
    const cors = require('cors')
    router.use(cors())

    /*
        Setup Auth Client & Middleware
    */
    const Auth = require("@rover/auth-client")
    const AuthClient = Auth.v1.Client()
    const AuthMiddleware = Auth.v1.Middleware(AuthClient)
    router.use(AuthMiddleware)

    /*
        Remove X-Powered-By header
    */
    
    router.use(function(req, res, next) {
        res.removeHeader("x-powered-by")
        next()
    })
    

    /*
        Healthchecking used by kubernetes
     */

    router.get('/healthcheck', function(req, res, next) {
        res.writeHead(200)
        return res.end()
    })

   
   let errorHandler = function(err, req, res, next) {

        /*
            Only errors with a code property are grpc errors
        */ 
        if (err.code) {
            err.status = getHTTPCode(err.code)
        }

        console.error(err)

        res.writeHead(err.status || 500)
        res.end()
    }


    

    /*
        Setup Clients
    */
    const CsvProcessorClient = require("@rover/csv-processor-client").v1.Client()
    const FilesClient = require("@rover/files-client").v1.Client()

    const Uploader = require('../lib/uploader')
    const UploaderClient = new Uploader(
        require('@google-cloud/storage'),
        {
            projectId: Config.get('/storage/project_id'),
            credentials: Config.get('/storage/credentials'),
            bucketName: Config.get('/storage/bucket_name')
        }
    )
    setupTasks.push(function(cb) {
         return UploaderClient.connect(cb)
    })

    async.series(setupTasks, function(err) {
        if (err) {
            return callback(err)
        }

         /*
            Setup routes
         */

        router.use('/bulk/', require('./v1')(CsvProcessorClient, UploaderClient))
        router.use('/bulk/v1/', require('./v1')(CsvProcessorClient, UploaderClient))
        router.use('/bulk/v2/', require('./v2')(CsvProcessorClient, FilesClient))

        router.use(errorHandler)

        return callback(null, router)
    })
}