const Router = require('express').Router
const RoverApis = require('@rover/apis')
const Helpers = require('../../helpers')
const Serializers = require('../../../lib/serializers')

module.exports = function(FilesClient) {
    
    if (!FilesClient) {
        throw new Error("Invalid Argument: FilesClient must be defined")
    }


    const router = Router()

    router.handlers = {}

    // List all csv-files
    router.handlers.index = function(req, res, next) {
        let request = new RoverApis.files.v1.Models.ListCsvFilesRequest()

        request.setAuthContext(req._authContext)
        request.setPageSize(100)

        FilesClient.listCsvFiles(request, function(err, reply) {
            if (err) {
                return next(err)
            }

            let payload = reply.getCsvFilesList().map(Serializers.v2.csvFileProtoToJson)

            let response = {
                data: payload
            }

            res.status(200)
            res.send(response)
        })
    }

    router.handlers.get = function(req, res, next) {
        let request = new RoverApis.files.v1.Models.GetCsvFileRequest()

        request.setAuthContext(req._authContext)
        request.setCsvFileId(parseInt(req.params.id) || 0)

        FilesClient.getCsvFile(request, function(err, reply) {
            if (err) {
                return next(err)
            }

            let payload = Serializers.v2.csvFileProtoToJson(reply.getCsvFile())

            let response = {
                data: payload
            }

            res.status(200)
            res.send(response)
        })
    }

    router.handlers.post = function(req, res, next) {

        let request = new RoverApis.files.v1.Models.UploadCsvFileRequest()

        /* First chunk must be the meta or Files Service throws an error */
        let meta = new RoverApis.files.v1.Models.UploadCsvFileRequest.Meta()
        meta.setAuthContext(req._authContext)

        request.setMeta(meta)


        let uploadStream = FilesClient.uploadCsvFile(function(err, reply) {
            if (err) {
                return next(err)
            }

            let payload = Serializers.v2.csvFileProtoToJson(reply.getCsvFile())

            let response = {
                data: payload
            }

            res.status(200)
            res.send(response)
        })

        uploadStream.write(request)

        req.on('data', function(data) {
            let chunkRequest = new RoverApis.files.v1.Models.UploadCsvFileRequest()
            let chunk = new RoverApis.files.v1.Models.UploadCsvFileRequest.Chunk()
            chunk.setData(data)

            chunkRequest.setChunk(chunk)
            uploadStream.write(chunkRequest)
        })

        req.on('error', function(err) {
            uploadStream.cancel()
        })

        req.on('end', function() {
            uploadStream.end()
        })
    }

    router.handlers.delete = function(req, res, next) {
        let request = new RoverApis.files.v1.Models.DeleteCsvFileRequest()

        request.setAuthContext(req._authContext)
        request.setCsvFileId(parseInt(req.params.id) || 0)

        FilesClient.deleteCsvFile(request, function(err, reply) {
            if (err) {
                return next(err)
            }

            res.status(204)
            res.end()
        })
    }


    router.get('/csv-files', Helpers.authenticated, router.handlers.index)
    router.get('/csv-files/:id', Helpers.authenticated, router.handlers.get)
    router.post('/csv-files', Helpers.authenticated, router.handlers.post)
    router.delete('/csv-files/:id', Helpers.authenticated, router.handlers.delete)

    return router
}