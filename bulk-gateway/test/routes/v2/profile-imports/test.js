const expect = require('chai').expect
const utils = require('../../../support/utils')
const RoverApis = require('@rover/apis')
const CsvProcessor = RoverApis['csv-processor']
const Files = RoverApis.files
const Auth = RoverApis.auth.v1.Models
const Router = require('../../../../routes/v2/profile-imports')



const defaultAuthContext = new Auth.AuthContext()
defaultAuthContext.setAccountId(0)
defaultAuthContext.setPermissionScopesList(['server'])

function buildRouter(csvClient, filesClient) {
    return Router(csvClient, filesClient)
}

function stubClient(funcName, returnFunc) {
    let client = {}
    client[funcName] = returnFunc
    return client
}

describe('profile-imports', function() {

    it('throws an error when CsvProcessorClient is null', function() {
        expect(() => Router(null)).to.throw("Invalid Argument: CsvProcessorClient must be defined")
    })

    it('returns 404 when csv file does not exist', function(done) {
        

        let client = stubClient('getCsvFile', function(request, callback) {
            expect(request).to.be.an.instanceof(Files.v1.Models.GetCsvFileRequest)
            let err = new Error("Not Found")
            err.code = 5
            return callback(err)
        })

        let router = buildRouter({}, client)
        
        const req = {
            body: {
                'csv-file-id': '123'
            },
            auth: {
                context: defaultAuthContext 
            }
        }
        
        router.handlers.post(req, {}, function(err) {
            expect(err).to.be.an('object')
            expect(err.status).to.equal(404)
            return done()
        })

    })

    it('returns 400 when schema is not defined', function(done) {
        

        let client = stubClient('getCsvFile', function(request, callback) {
            expect(request).to.be.an.instanceof(Files.v1.Models.GetCsvFileRequest)
            let res = new Files.v1.Models.GetCsvFileResponse
            let file = new Files.v1.Models.CsvFile()
            res.setCsvFile(file)
            return callback(null, res)
        })

        let router = buildRouter({}, client)
        
        const req = {
            body: {
                'csv-file-id': '123'
            },
            auth: {
                context: defaultAuthContext 
            }
        }
        
        router.handlers.post(req, {}, function(err) {
            expect(err).to.be.an('object')
            expect(err.status).to.equal(400)
            expect(err.message).to.equal('[schema | columns] is either not defined or not an object')
            return done()
        })

    })

    it('returns 400 when schema does not define an id type', function(done) {
        

        let client = stubClient('getCsvFile', function(request, callback) {
            expect(request).to.be.an.instanceof(Files.v1.Models.GetCsvFileRequest)
            let res = new Files.v1.Models.GetCsvFileResponse
            let file = new Files.v1.Models.CsvFile()
            res.setCsvFile(file)
            return callback(null, res)
        })

        let router = buildRouter({}, client)
        
        const req = {
            body: {
                'csv-file-id': '123',
                'schema': [
                    {
                        'type': 'string',
                        'field': 'hello'
                    }
                ]
            },
            auth: {
                context: defaultAuthContext 
            }
        }
        
        router.handlers.post(req, {}, function(err) {
            expect(err).to.be.an('object')
            expect(err.status).to.equal(400)
            expect(err.message).to.equal('schema must define a column with type id')
            return done()
        })

    })

    it('returns 400 when schema is empty', function(done) {
        
        let client = stubClient('getCsvFile', function(request, callback) {
            expect(request).to.be.an.instanceof(Files.v1.Models.GetCsvFileRequest)
            let res = new Files.v1.Models.GetCsvFileResponse
            let file = new Files.v1.Models.CsvFile()
            res.setCsvFile(file)
            return callback(null, res)
        })

        let router = buildRouter({}, client)
        
        const req = {
            body: {
                'csv-file-id': '123',
                'schema': []
            },
            auth: {
                context: defaultAuthContext 
            }
        }
        
        router.handlers.post(req, {}, function(err) {
            expect(err).to.be.an('object')
            expect(err.status).to.equal(400)
            expect(err.message).to.equal('schema must have at least 1 column definition')
            return done()
        })

    })

    it('returns 400 when the schema defines an unsupported type', function(done) {
        
        let client = stubClient('getCsvFile', function(request, callback) {
            expect(request).to.be.an.instanceof(Files.v1.Models.GetCsvFileRequest)
            let res = new Files.v1.Models.GetCsvFileResponse
            let file = new Files.v1.Models.CsvFile()
            res.setCsvFile(file)
            return callback(null, res)
        })

        let router = buildRouter({}, client)
        
        const req = {
            body: {
                'csv-file-id': '123',
                'schema': [
                    {
                        'type': 'id'
                    },
                    {
                        'type': 'balsamic'
                    }
                ]
            },
            auth: {
                context: defaultAuthContext 
            }
        }
        
        router.handlers.post(req, {}, function(err) {
            expect(err).to.be.an('object')
            expect(err.status).to.equal(400)
            expect(err.message).to.equal("unsupported type 'balsamic' in schema")
            return done()
        })

    })

    it('returns 400 when the schema is missing the mapping field', function(done) {
        
        let client = stubClient('getCsvFile', function(request, callback) {
            expect(request).to.be.an.instanceof(Files.v1.Models.GetCsvFileRequest)
            let res = new Files.v1.Models.GetCsvFileResponse
            let file = new Files.v1.Models.CsvFile()
            res.setCsvFile(file)
            return callback(null, res)
        })

        let router = buildRouter({}, client)
        
        const req = {
            body: {
                'csv-file-id': '123',
                'schema': [
                    {
                        'type': 'id'
                    },
                    {
                        'type': 'string'
                    }
                ]
            },
            auth: {
                context: defaultAuthContext 
            }
        }
        
        router.handlers.post(req, {}, function(err) {
            expect(err).to.be.an('object')
            expect(err.status).to.equal(400)
            expect(err.message).to.equal("field at position [1] was not defined")
            return done()
        })

    })


    it('returns 400 when the schema has too many column definitions', function(done) {
        
        let client = stubClient('getCsvFile', function(request, callback) {
            expect(request).to.be.an.instanceof(Files.v1.Models.GetCsvFileRequest)
            let res = new Files.v1.Models.GetCsvFileResponse
            let file = new Files.v1.Models.CsvFile()
            file.setNumColumns(2)
            res.setCsvFile(file)
            return callback(null, res)
        })

        let router = buildRouter({}, client)
        
        const req = {
            body: {
                'csv-file-id': '123',
                'schema': [
                    {
                        'type': 'id'
                    },
                    {
                        'type': 'string',
                        'field': 'hello'
                    },
                    {
                        'type': 'string',
                        'field': 'too-many-columns'
                    }
                ]
            },
            auth: {
                context: defaultAuthContext 
            }
        }
        
        router.handlers.post(req, {}, function(err) {
            expect(err).to.be.an('object')
            expect(err.status).to.equal(400)
            expect(err.message).to.equal("schema defines too many columns has: '3' csv-file has: '2'")
            return done()
        })

    })


    it('returns 200 and creates a profile import load job', function(done) {
        let jobCreatedAt = new Date('2016-07-07T00:10:12Z')

        let filesClient = stubClient('getCsvFile', function(request, callback) {
            expect(request).to.be.an.instanceof(Files.v1.Models.GetCsvFileRequest)
            let res = new Files.v1.Models.GetCsvFileResponse
            let file = new Files.v1.Models.CsvFile()
            file.setNumColumns(2)
            res.setCsvFile(file)
            return callback(null, res)
        })

        let processorClient = stubClient('createLoadJob', function(request, callback) {
            expect(request).to.be.an.instanceof(CsvProcessor.v1.Models.CreateLoadJobRequest)
            let res = new CsvProcessor.v1.Models.CreateLoadJobReply
            let job = new CsvProcessor.v1.Models.LoadJob
            job.setId(1)
            job.setAccountId(1)
            job.setType(CsvProcessor.v1.Models.JobType.PROFILE_IMPORT)
            job.setStatus(CsvProcessor.v1.Models.JobStatus.ENQUEUED)
            job.setProgress(0)
            job.setCreatedAt(RoverApis.Helpers.timestampToProto(jobCreatedAt))

            res.setJob(job)
            return callback(null, res)
        })

        let router = buildRouter(processorClient, filesClient)
        
        const req = {
            body: {
                'csv-file-id': '123',
                'schema': [
                    {
                        'type': 'id'
                    },
                    {
                        'type': 'string',
                        'field': 'first-name'
                    }
                ]
            },
            auth: {
                context: defaultAuthContext 
            }
        }
        


        router.handlers.post(req, {
            status: function(status) {
                expect(status).to.equal(200)
            },
            send: function(output) {
                expect(output).to.be.an('object')
                expect(output).to.deep.equal({
                     data: {
                         id: '1',
                         progress: 0,
                         status: 'enqueued',
                         created_at: '2016-07-07T00:10:12.000Z',
                         failed_reason: ''
                     }
                 })
                return done()
            }
        }, function(err) { return done(err) })

    })

})