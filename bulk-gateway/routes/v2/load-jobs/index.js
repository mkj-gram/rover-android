const Router = require('express').Router
const RoverApis = require('@rover/apis')
const Helpers = require('../../helpers')
const Serializers = require('../../../lib/serializers')

module.exports = function(CsvProcessorClient) {
    
    if (!CsvProcessorClient) {
        throw new Error("Invalid Argument: CsvProcessorClient must be defined")
    }


    const router = Router()

    router.handlers = {}

    router.handlers.get = function(req, res, next) {

        let request = new RoverApis.csv_processor.v1.Models.GetLoadJobRequest()
        request.setAuthContext(req._authContext)
        request.setLoadJobId(parseInt(req.params.id) || 0)
        // Use version 2 queue
        request.setQueueVersion(2)

        CsvProcessorClient.getLoadJob(request, function(err, reply) {
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
    }

    router.get('/load-jobs/:id', Helpers.authenticated, router.handlers.get)

    return router
}