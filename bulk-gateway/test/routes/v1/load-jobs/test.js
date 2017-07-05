const expect = require('Chai').expect
const utils = require('../../../support/utils')
const CsvProcessor = require('@rover/apis')['csv-processor']

const Router = require('../../../../routes/v1/load-jobs')


    
function buildRouter(csvclient) {
    return Router(csvclient)
}

function stubClient(funcName, returnFunc) {
    let client = {}
    client[funcName] = returnFunc
    return client
}

describe('load-jobs', function() {

    it('throws an error when CsvProcessorClient is null', function() {
        expect(() => Router(null)).to.throw("Invalid Argument: CsvProcessorClient must be defined")
    });

    it('returns 404 when no load job exists', function(done) {
        let date = new Date("2017-06-28T15:17:10.621Z")

        let client = stubClient('getLoadJob', function(input, callback) {
            expect(input).to.be.an.instanceof(CsvProcessor.v1.Models.GetLoadJobRequest)
            return callback({ code: 5, message: "My Message"})
        })

        let router = buildRouter(client)
        
        const req = {
            params: {
                id: "1"
            }
        }
        
        router.handlers.get(req, {}, function(err) {
            expect(err).to.be.an('object')
            expect(err.status).to.equal(404)
            expect(err.message).to.equal("My Message")
            return done()
        })
    });

    it('returns 500 when a grpc error occurs', function(done) {
        let date = new Date("2017-06-28T15:17:10.621Z")

        let client = stubClient('getLoadJob', function(input, callback) {
            expect(input).to.be.an.instanceof(CsvProcessor.v1.Models.GetLoadJobRequest)
            return callback(new Error("My Message"))
        })

        let router = buildRouter(client)
        
        const req = {
            params: {
                id: "1"
            }
        }
        
        router.handlers.get(req, {}, function(err) {
            expect(err).to.be.an('object')
            expect(err.status).to.equal(500)
            expect(err.message).to.equal("My Message")
            return done()
        })
    });

    it('returns 200 and the load job', function(done) {
        let date = new Date("2017-06-28T15:17:10.621Z")

        let client = stubClient('getLoadJob', function(input, callback) {
            expect(input).to.be.an.instanceof(CsvProcessor.v1.Models.GetLoadJobRequest)

            let job = utils.buildJobProto("1", 100, CsvProcessor.v1.Models.JobStatus.COMPLETED, date)

            const reply = new CsvProcessor.v1.Models.GetLoadJobReply()
            reply.setJob(job)

            return callback(null, reply)
        })

        let router = buildRouter(client)
        
        const req = {
            params: {
                id: "1"
            }
        }

        const res = {
            status: function(status) {
                return this
            },
            send: function(json) {
                expect(json).to.be.an('object')
                expect(json.id).to.equal('1')
                expect(json.type).to.equal("load-jobs")

                let attributes = json.attributes

                expect(attributes).to.be.an('object')
                expect(attributes.progress).to.equal(100)
                expect(attributes.format).to.equal("csv")
                expect(attributes.status).to.equal("completed")
                expect(attributes['created-at']).to.equal(date.toISOString())
                return done()
            }
        }
        
        router.handlers.get(req, res, function(err) { return done(err) })

    })
})