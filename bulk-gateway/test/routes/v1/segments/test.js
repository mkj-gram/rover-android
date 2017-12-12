const expect = require('chai').expect
const utils = require('../../../support/utils')
const RoverApis = require("@rover/apis")
const CsvProcessor = RoverApis['csv-processor']


const router = require('../../../../routes/v1/segments')

function buildRouter(csvclient, uploader) {
    return router(csvclient, uploader)
}

describe('segments', function() {
    

    it('throws an error when CsvProcessorClient is null', function() {
        expect(() => router(null, null)).to.throw("Invalid Argument: CsvProcessorClient must be defined")
    });

    it('throws an error when UploaderClient is null', function() {
        expect(() => router({}, null)).to.throw("Invalid Argument: UploaderClient must be defined")
    });

    it('return 200 and the load job when successfully creating one ', function(done) {
        
        let date = new Date("2017-06-28T15:17:10.621Z")

        let csvclient = {
            createLoadJob: function(input, opts, callback) {

                expect(input).to.be.an.instanceof(CsvProcessor.v1.Models.CreateLoadJobRequest)
                expect(callback).to.be.an('function')

                let job = utils.buildJobProto("1", 100, CsvProcessor.v1.Models.JobStatus.COMPLETED, date)

                const reply = new CsvProcessor.v1.Models.GetLoadJobReply()
                reply.setJob(job)

                return callback(null, reply)
            }
        }

        let uploadclient = {
            upload: function(req, res, next) {
                return next()
            }
        }


        let router = buildRouter(csvclient, uploadclient)

        const req = {
            params: {
                id: 1
            },
            auth: {
                context: new RoverApis.auth.v1.Models.AuthContext()
            },
            file: {
                cloudStorageObject: {
                    id: 'test-file',
                    bucket: {
                        id: 'test-bucket',
                        storage: {
                            projectId: 'test'
                        }
                    }
                }
            }
        }

        const res = {
            status: function(status) {
                expect(status).to.equal(200)
                return this
            },
            send: function(json) {

               expect(json).to.be.an('object')
                
                let expected = {
                    data: {
                        id: '1',
                        type: 'load-jobs',
                        attributes: {
                            progress: 100,
                            format: 'csv',
                            status: 'completed',
                            'created-at': date.toISOString()
                        }
                    }
                }

                expect(json).to.deep.equal(expected)
                
                return done()
            }
        }

        router.handlers.put(req, res, function(err) { return done(err) })
    });

    it('returns 500 when an unknown error occurs with grpc', function(done) {
        let date = new Date("2017-06-28T15:17:10.621Z")

        let csvclient = {
            createLoadJob: function(input, opts, callback) {

                expect(input).to.be.an.instanceof(CsvProcessor.v1.Models.CreateLoadJobRequest)
                expect(callback).to.be.an('function')

                return callback({ code: 13, message: "Internal Error" }, null)
            }
        }

        let uploadclient = {
            upload: function(req, res, next) {
                return next()
            }
        }


        let router = buildRouter(csvclient, uploadclient)

        const req = {
            params: {
                id: 1
            },
            auth: {
                context: new RoverApis.auth.v1.Models.AuthContext()
            },
            file: {
                cloudStorageObject: {
                    id: 'test-file',
                    bucket: {
                        id: 'test-bucket',
                        storage: {
                            projectId: 'test'
                        }
                    }
                }
            }
        }

        const res = {}

        router.handlers.put(req, res, function(err) {
            expect(err).to.be.an('object')
            expect(err.status).to.equal(500)
            return done() 
        })
    });

    it('returns 403 when the user does not have the proper permissions', function(done) {
        let date = new Date("2017-06-28T15:17:10.621Z")

        let csvclient = {
            createLoadJob: function(input, opts, callback) {

                expect(input).to.be.an.instanceof(CsvProcessor.v1.Models.CreateLoadJobRequest)
                expect(callback).to.be.an('function')

                return callback({ code: 7, message: "PermissionDenied" }, null)
            }
        }

        let uploadclient = {
            upload: function(req, res, next) {
                return next()
            }
        }


        let router = buildRouter(csvclient, uploadclient)

        const req = {
            params: {
                id: 1
            },
            auth: {
                context: new RoverApis.auth.v1.Models.AuthContext()
            },
            file: {
                cloudStorageObject: {
                    id: 'test-file',
                    bucket: {
                        id: 'test-bucket',
                        storage: {
                            projectId: 'test'
                        }
                    }
                }
            }
        }

        const res = {}

        router.handlers.put(req, res, function(err) {
            expect(err).to.be.an('object')
            expect(err.status).to.equal(403)
            return done() 
        })
    })
})
