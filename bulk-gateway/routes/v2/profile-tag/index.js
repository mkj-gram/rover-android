const Router = require('express').Router
const RoverApis = require('@rover/apis')
const Helpers = require('../../helpers')
const Serializers = require('../../../lib/serializers')
const grpc = require('grpc')

module.exports = function(CsvProcessorClient, FilesClient) {
    
    if (!CsvProcessorClient) {
        throw new Error("Invalid Argument: CsvProcessorClient must be defined")
    }

    if (!FilesClient) {
        throw new Error("Invalid Argument: FilesClient must be defined")
    }


    const router = Router()

    router.handlers = {}

    /**
     * Creates a profile tag job.
     * Input:
     *     csv-file-id: id of the csv file
     *     tag?: the tag to add
     *     tags?: the list of tags to add
     * Output:
     *     load-job
     */
    router.handlers.post = function(req, res, next) {

        /*
            Make sure the csv file exists
         */

        let fileId = req.body['csv-file-id'] || req.body['csv_file_id']
        let tag = req.body['tag']
        let tags = req.body['tags']

        if (tag === undefined && tags == undefined) {
            return next({ status: 400, message: "tag or tags must be defined"})
        }

        if (tag && tags) {
            return next({ status: 400, message: "tag and tags cannot be set at the same time"})
        }

        // always use tags and make sure its an array
        tags = tag ? [tag] : tags
       

        let request = new RoverApis.files.v1.Models.GetCsvFileRequest()
        request.setAuthContext(req.auth.context)
        request.setCsvFileId(fileId)
        
        FilesClient.getCsvFile(request, function(err, response) {
            if (err) {
                if (err.code === grpc.status.NOT_FOUND) {
                    return next({ status: 404, message: "csv file with id: " + fileId + " does not exist" })
                }
                return next(err)
            }

            const csvFile = response.getCsvFile()

            if (csvFile === undefined) {
                return next({ status: 404, message: "CsvFile Not Found"})
            }

            if (csvFile.getAccountId() !== req.auth.context.getAccountId()) {
                return next({ status: 403, message: "permission denied" })
            }

            let numColumns = csvFile.getNumColumns()
            if (numColumns !== 1) {
                return next({ status: 412, message: "CsvFile must have 1 column got: " + numColumns.toString()})
            }

            let profileTagJob = new RoverApis.csv_processor.v1.Models.ProfileTagJobConfig()
            profileTagJob.setCsvFileId(csvFile.getId())
            profileTagJob.setTagsList(tags)


            let loadJobRequest = new RoverApis.csv_processor.v1.Models.CreateLoadJobRequest()
            loadJobRequest.setAuthContext(req.auth.context)
            loadJobRequest.setType(RoverApis.csv_processor.v1.Models.JobType.PROFILE_TAG)
            loadJobRequest.setProfileTagJobConfig(profileTagJob)

            CsvProcessorClient.createLoadJob(loadJobRequest, function(err, response) {
                if (err) {
                    return next(err)
                }

                const loadJob = response.getJob()

                let payload = Serializers.v2.loadJobProtoToJson(loadJob)
                
                res.status(200)
                res.send({
                    data: payload
                })
            })
        })
    }

    router.post('/tag/profiles', Helpers.authenticated, router.handlers.post)

    return router
}