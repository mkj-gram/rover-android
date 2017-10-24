const crypto = require('crypto')
const Router = require('express').Router

const RoverApis = require('@rover/apis')
const Helpers = require('../../helpers')
const Serializers = require ('../../../lib/serializers')

const uploadfile = function(UploaderClient) {
    return function(req, res, next) {
        const filename = crypto.randomBytes(32).toString('hex') + ".csv"

        UploaderClient.upload(req, filename, function(err, uploadedFile) {
            if (err) {
                return next(err)
            }

            req.file = {}
            req.file.cloudStorageObject = uploadedFile;

            return next()
        })
    }
}

module.exports = function(CsvProcessorClient, UploaderClient) {

    if (!CsvProcessorClient) {
        throw new Error("Invalid Argument: CsvProcessorClient must be defined")
    }

    if (!UploaderClient) {
        throw new Error("Invalid Argument: UploaderClient must be defined")
    }

    const router = Router()

    router.handlers = {}

    router.handlers.put = function(req, res, next) {
        
        if (isNaN(req.params.id)) {
            return next({ status: 400, message: "ID must be an integer" })
        }

        const gcsObject = new RoverApis['csv-processor'].v1.Models.GCSObject()

        gcsObject.setProjectId(req.file.cloudStorageObject.bucket.storage.projectId)
        gcsObject.setBucket(req.file.cloudStorageObject.bucket.id)
        gcsObject.setFileId(req.file.cloudStorageObject.id)

        const segmentLoadJobConfig = new RoverApis['csv-processor'].v1.Models.SegmentLoadJobConfig()

        segmentLoadJobConfig.setAccountId(req.auth.context.getAccountId())
        segmentLoadJobConfig.setSegmentId(parseInt(req.params.id))
        segmentLoadJobConfig.setCsv(gcsObject)


        const loadJobRequest = new RoverApis['csv-processor'].v1.Models.CreateLoadJobRequest()
  
        loadJobRequest.setAuthContext(req.auth.context)
        loadJobRequest.setType(RoverApis['csv-processor'].v1.Models.JobType.SEGMENT)
        loadJobRequest.setSegmentLoadJobConfig(segmentLoadJobConfig)

        const deadline = new Date()
        deadline.setSeconds(deadline.getSeconds() + 10)

        CsvProcessorClient.createLoadJob(loadJobRequest, { deadline: deadline }, function(err, response) {

            if (err) {
                return next({ status: Helpers.getHTTPCode(err.code), message: "csv-processor: " + err.message, err: err })
            }

            const loadJob = response.getJob()

            const payload = {
                data: Serializers.v1.serializeLoadJob(loadJob, 'csv')
            }

            res.status(200)
            res.send(payload)

        });
    }

    /* Is used by /bulk/segments and /bulk/v1/segments */

    router.put('/segments/:id/csv', Helpers.authenticated, uploadfile(UploaderClient), router.handlers.put)

    return router
}