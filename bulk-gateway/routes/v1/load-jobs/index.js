const RoverApis = require('@rover/apis')
const Router = require('express').Router
const Helpers = require('../../helpers')

const Serializers = require ('../../../lib/serializers')

module.exports = function(CsvProcessorClient) {
    
    if (!CsvProcessorClient) {
        throw new Error("Invalid Argument: CsvProcessorClient must be defined")
    }

    const router = Router()

    router.handlers = {}

    router.handlers.get = function(req, res, next) {
        const request = new RoverApis['csv-processor'].v1.Models.GetLoadJobRequest()

        request.setAuthContext(req.auth.context)
        request.setLoadJobId(req.params.id)

        CsvProcessorClient.getLoadJob(request, function(err, response) {
            if (err) {
                return next({ status: Helpers.getHTTPCode(err.code), message: err.message })
            }

            const loadJob = response.getJob()

            const payload = {
                data: Serializers.v1.serializeLoadJob(loadJob, 'csv')
            }

            res.status(200)
            res.send(payload)
        })
    }

    router.get('/load-jobs/:id/csv', Helpers.authenticated, router.handlers.get)

    return router
}