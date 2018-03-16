const expect = require('chai').expect
const utils = require('../../../support/utils')
const RoverApis = require('@rover/apis')
const CsvProcessor = RoverApis['csv-processor']
const Files = RoverApis.files
const Auth = RoverApis.auth.v1.Models
const Router = require('../../../../routes/v2/profile-tag')



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

describe('profile-tag', function() {

    it('throws an error when CsvProcessorClient is null', function() {
        expect(() => Router(null)).to.throw("Invalid Argument: CsvProcessorClient must be defined")
    })

    it('returns 400 when both tag and tags are defined', function(done) {
        
        let router = buildRouter({}, {})
        
        const req = {
            body: {
                'csv-file-id': '123',
                'tag': 'hello',
                'tags': ['hello']
            },
            auth: {
                context: defaultAuthContext 
            }
        }
        
        router.handlers.post(req, {}, function(err) {
            expect(err).to.be.an('object')
            expect(err.status).to.equal(400)
            expect(err.message).to.equal('tag and tags cannot be set at the same time')
            return done()
        })

    })

    it('returns 400 when both neither tag or tags is defined', function(done) {
        
        let router = buildRouter({}, {})
        
        const req = {
            body: {
                'csv-file-id': '123',
            },
            auth: {
                context: defaultAuthContext 
            }
        }
        
        router.handlers.post(req, {}, function(err) {
            expect(err).to.be.an('object')
            expect(err.status).to.equal(400)
            expect(err.message).to.equal('tag or tags must be defined')
            return done()
        })

    })

    it('returns 412 when csv file has too many columns', function(done) {
        
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
                'tags': ['hello']
            },
            auth: {
                context: defaultAuthContext 
            }
        }
        
        router.handlers.post(req, {}, function(err) {
            expect(err).to.be.an('object')
            expect(err.status).to.equal(412)
            expect(err.message).to.equal("CsvFile must have 1 column got: 2")
            return done()
        })

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
                'csv-file-id': '123',
                'tag': 'nope'
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

    


    it('returns 200 and creates a profile tag load job', function(done) {
        let jobCreatedAt = new Date('2016-07-07T00:10:12Z')

        let filesClient = stubClient('getCsvFile', function(request, callback) {
            expect(request).to.be.an.instanceof(Files.v1.Models.GetCsvFileRequest)
            let res = new Files.v1.Models.GetCsvFileResponse
            let file = new Files.v1.Models.CsvFile()

            file.setId(123)
            file.setNumColumns(1)
            res.setCsvFile(file)
            return callback(null, res)
        })

        let processorClient = stubClient('createLoadJob', function(request, callback) {
            expect(request).to.be.an.instanceof(CsvProcessor.v1.Models.CreateLoadJobRequest)
            expect(request.getType()).to.equal(CsvProcessor.v1.Models.JobType.PROFILE_TAG)

            let config = request.getProfileTagJobConfig()
            expect(config.getCsvFileId()).to.equal(123)
            expect(config.getTagsList()).to.deep.equal(['a', 'b', 'c'])

            let res = new CsvProcessor.v1.Models.CreateLoadJobReply
            let job = new CsvProcessor.v1.Models.LoadJob

            job.setId(1)
            job.setAccountId(1)
            job.setType(CsvProcessor.v1.Models.JobType.PROFILE_TAG)
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
                'tags': ['a', 'b', 'c']
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