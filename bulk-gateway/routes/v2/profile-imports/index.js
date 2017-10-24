const Router = require('express').Router
const RoverApis = require('@rover/apis')
const Helpers = require('../../helpers')
const Serializers = require('../../../lib/serializers')
const grpc = require('grpc')

const types = ['id', 'string', 'integer', 'float', 'boolean', 'timestamp', 'list']

function validateSchema(schema, inputName) {
    if (schema.length === 0) {
        return `${inputName} must have at least 1 column definition`
    }

    let idColumnIndex = schema.findIndex(function(s) {
        return s.type === 'id'
    })

    if (idColumnIndex <= -1) {
        return `${inputName} must define a column with type id`
    }

    for (var i = 0; i < schema.length; i++) {
        let s = schema[i]

        if (!types.includes(s.type)) {
            return `unsupported type '${s.type}' in ${inputName}`
        }

        if (s.type !== 'id' && (s.field === null || s.field === undefined || typeof s.field !== 'string' || s.field.length === 0)) {
            return `field at position [${i}] was not defined`
        }
    }

    return
}

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
     * Creates a profiles load job.
     * Input:
     *     csv-file-id: id of the csv file
     *     schema: the import schema
     * Output:
     *     load-job
     */
    router.handlers.post = function(req, res, next) {

        /*
            Make sure the csv file exists
         */

        let fileId = req.body['csv-file-id'] || req.body['csv_file_id']
        let schema = req.body['schema'] || req.body['columns']
        let schemaInputName = req.body['schema'] ? 'schema' : 'columns'

        let request = new RoverApis.files.v1.Models.GetCsvFileRequest()
        request.setAuthContext(req.auth.context)
        request.setCsvFileId(fileId)

        // We can't promisify FilesClient since it has a mix of streaming and normal calls
        
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

            /*
                Validate the schema against the csv file
             */

            if (typeof schema !== 'object' || schema === null || schema === undefined) {
                return next({ status: 400, message: '[schema | columns] is either not defined or not an object'})
            }
            
            

            let schemaError = validateSchema(schema, schemaInputName)
            if (schemaError) {
                return next({ status: 400, message: schemaError })
            }

            let numColumns = csvFile.getNumColumns()
            if (schema.length > numColumns) {
                return next({ status: 400, message: `${schemaInputName} defines too many columns has: '${schema.length}' csv-file has: '${numColumns}'`})
            }

            let profileImportConfig = new RoverApis.csv_processor.v1.Models.ProfileLoadJobConfig()
            profileImportConfig.setCsvFileId(csvFile.getId())

            let importSchema = schema.map(function(s) {
                let i = new RoverApis.csv_processor.v1.Models.ProfileLoadJobConfig.Schema()
                i.setType(s.type)
                i.setField(s.field)
                i.setDescription(s.description || s.field)
                return i
            })

            profileImportConfig.setSchemaList(importSchema)


            let loadJobRequest = new RoverApis.csv_processor.v1.Models.CreateLoadJobRequest()
            loadJobRequest.setAuthContext(req.auth.context)
            loadJobRequest.setType(RoverApis.csv_processor.v1.Models.JobType.PROFILE_IMPORT)
            loadJobRequest.setProfileLoadJobConfig(profileImportConfig)

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

    router.post('/load/profiles', Helpers.authenticated, router.handlers.post)

    return router
}