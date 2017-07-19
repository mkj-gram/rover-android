const Router = require('express').Router
const RoverApis = require('@rover/apis')
const Helpers = require('../../helpers')
const Serializers = require('../../../lib/serializers')
const grpc = require('grpc')

module.exports = function(CsvProcessorClient, FilesClient, SegmentClient) {
    
    if (!CsvProcessorClient) {
        throw new Error("Invalid Argument: CsvProcessorClient must be defined")
    }

    if (!FilesClient) {
        throw new Error("Invalid Argument: FilesClient must be defined")
    }

    if (!SegmentClient) {
        throw new Error("Invalid Argument: SegmentClient must be defined")
    }


    const router = Router()

    router.handlers = {}

    /**
     * Creates a static-segment load job.
     * Input:
     *     csv-file-id: id of the csv file
     *     static-segment-id: the id of the static-segment
     * Output:
     *     load-job
     */
    router.handlers.post = function(req, res, next) {

        /*
            First check if the segment & file exists
         */

        let csvFileId = req.body.csv_file_id
        let staticSegmentId = req.body.static_segment_id

        let request = new RoverApis.files.v1.Models.GetCsvFileRequest()
        request.setAuthContext(req._authContext)
        request.setCsvFileId(csvFileId)

        FilesClient.getCsvFile(request, function(err, reply) {
            if (err) {
                if (err.code == grpc.status.NOT_FOUND) {
                    return next({ status: 400, message: "csv file with id: " + csvFileId + " does not exist" })
                }

                return next(err)
            }

            let csvFile = reply.getCsvFile()

            if (csvFile.getNumColumns() != 1) {
                return next({ status: 400, message: "csv file must only have 1 column" })
            }

            // Now lookup the static segment to make sure it exists
            
            let request = new RoverApis.segment.v1.Models.GetStaticSegmentRequest()
            request.setAuthContext(req._authContext)
            request.setId(staticSegmentId)

            SegmentClient.getStaticSegment(request, function(err, reply) {
                if (err) {
                    if (err.code == grpc.status.NOT_FOUND) {
                        return next({ status: 400, message: "static segment with id: " + staticSegmentId + " does not exist" })
                    }

                    return next(err)
                }

                let staticSegment = reply.getSegment()

                // now create a csv-file load job
                
                let loadJobConfig = new RoverApis.csv_processor.v1.Models.SegmentLoadJobWithCsvFileConfig()
                loadJobConfig.setAccountId(req.authContext.account_id)
                loadJobConfig.setStaticSegmentId(staticSegmentId)
                loadJobConfig.setCsvFileId(csvFileId)

                let request = new RoverApis.csv_processor.v1.Models.CreateLoadJobRequest()
                request.setAuthContext(req._authContext)
                request.setType(RoverApis.csv_processor.v1.Models.JobType.SEGMENT_WITH_CSV_FILE)
                request.setSegmentLoadJobWithCsvFileConfig(loadJobConfig)

                CsvProcessorClient.createLoadJob(request, function(err, reply) {
                    if (err) {
                        return next(err)
                    }

                    let loadJob = reply.getJob()

                    let payload = Serializers.v2.loadJobProtoToJson(loadJob)

                    let response = {
                        data: payload
                    }

                    res.status(200)
                    res.send(response)
                })
            })
        })

    }

    router.post('/load/static-segment', Helpers.authenticated, router.handlers.post)

    return router
}