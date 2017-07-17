const RoverApis = require('@rover/apis')
const Router = require('express').Router
const Helpers = require('../../helpers')

const Serializers = require ('../../../lib/serializers')

/*
	Helper Methods
 */
const authenticated = function(req, res, next) {
    if (req.authContext == undefined || req.authContext == null) {
        return next({ status: 401 })
    }

    return next()
}


module.exports = function(CsvProcessorClient) {
    
    if (!CsvProcessorClient) {
        throw new Error("Invalid Argument: CsvProcessorClient must be defined")
    }

    const router = Router()

    router.handlers = {}

    router.handlers.get = function(req, res, next) {
        const request = new RoverApis['csv-processor'].v1.Models.GetLoadJobRequest()

        request.setAuthContext(req._authContext)
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

    router.get('/load-jobs/:id/csv', authenticated, router.handlers.get)

    return router
}