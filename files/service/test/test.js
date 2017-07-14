const expect = require('Chai').expect
const squel = require('squel').useFlavour('postgres')
const Path = require('path')
const RoverApis = require('@rover/apis')

describe('Handlers', function() {
    describe('csv-file-handler', function() {
        
        let PGClient = null; 
        let CsvHandler = require('../handlers/v1/csv-file-handler')

        let LocalStorageClient = {
            CsvFileBucket: {
                file: function(name) {
                    return {
                        createWriteStream: function(opts) {
                            return require('fs').createWriteStream(Path.join("tmp", name))
                        }
                    }
                }
            }
        }

        let clearDB = function(done) {
            PGClient.query("TRUNCATE csv_files", function(err, result) {
                if (err) {
                    return done(err)
                }
                return done()
            })
        }

        let insertStatement = "INSERT INTO csv_files (account_id, file_size, num_rows, filename, generated_filename, samples, updated_at, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *"
        
        before('setup PGClient', function(cb) {
            let dbDSN = process.env.POSTGRES_DSN || "postgres://postgres:@localhost/files-service-test?sslmode=disable"

            let defaultConfig = {
                min: 1,
                max: 1,
                idleTimeoutMillis: 30000
            }

            const parse = require("@rover-common/pg-connection-string")
            let config = Object.assign({}, defaultConfig, parse(dbDSN))

            let pg = require('pg')

            const pool = new pg.Pool(config)

            pool.connect(function(err, client, done) {
                if (err) {
                    return cb(err)
                }

                done()

                PGClient = pool

                return cb()
            })
        })



        describe('listCsvFiles', function() {
            let date = "2017-07-13T14:00:41.00Z"
            // account_id, file_size, num_rows, samples, updated_at, created_at
            
            let testData = [
                [1, 200, 10, 'test.csv', '123123.csv', '{{"abc","123"},{"efg","456"}}' , date, date],
                [1, 30, 2, 'test.csv', '123123.csv','{{"abc","123"},{"efg","456"}}' , date, date],
                [2, 5000, 2403, 'test.csv', '123123.csv', '{{"abc","123"},{"efg","456"}}' , date, date],
                [2, 102, 33, 'test.csv', '123123.csv', '{{"abc","123"},{"efg","456"}}' , date, date],
            ]

            before('insert test data',function(cb) {
                let promises = testData.map(data => { 
                    return new Promise((resolve, reject) => {
                        PGClient.query(insertStatement, data, function(err) {
                            if (err) {
                                return reject(err)
                            }

                            return resolve()
                        })
                    })
                })

                Promise.all(promises)
                    .then(_ => cb())
                    .catch(err => cb(err))
                
            })

            after('truncate db', clearDB)

            it('returns a list of csv files', function(done) {
                let service = CsvHandler(PGClient, LocalStorageClient)
                let request = new RoverApis.files.v1.Models.ListCsvFilesRequest()

                let authContext = new RoverApis.auth.v1.Models.AuthContext()
                authContext.setAccountId(1)
                authContext.setPermissionScopesList(['server'])

                request.setAuthContext(authContext)

                service.listCsvFiles({ request: request }, function(err, reply) {
                    expect(err).to.be.null
                    expect(reply).to.be.an.instanceof(RoverApis.files.v1.Models.ListCsvFilesResponse)

                    let csvFiles = reply.getCsvFilesList()

                    expect(csvFiles).to.not.be.null
                    expect(csvFiles.length).to.equal(2)

                    return done()
                })
            })

            it('returns permission denied when scopes are not sufficient', function(done) {
                let service = CsvHandler(PGClient, LocalStorageClient)
                let request = new RoverApis.files.v1.Models.ListCsvFilesRequest()

                let authContext = new RoverApis.auth.v1.Models.AuthContext()
                authContext.setAccountId(1)
                authContext.setPermissionScopesList([])

                request.setAuthContext(authContext)

                service.listCsvFiles({ request: request }, function(err, reply) {
                    expect(err).not.to.be.null
                    expect(err.code).to.equal(7)
                    return done()
                })
            })
        })

        describe('getCsvFile', function() {

            before('truncate db', clearDB)
            after('truncate db', clearDB)    

            it('returns a csv file', function(done) {
                let data = [1, 50, 10, 'test.csv', '123123.csv', '{{"abc","123"},{"efg","456"}}' , "2017-07-13T14:00:41.00Z", "2017-07-13T14:00:41.00Z"]
                
                PGClient.query(insertStatement, data, function(err, result) {
                    if (err) {
                        return done(err)
                    }

                    let service = CsvHandler(PGClient, LocalStorageClient)
                    let request = new RoverApis.files.v1.Models.GetCsvFileRequest()

                    let authContext = new RoverApis.auth.v1.Models.AuthContext()
                    authContext.setAccountId(1)
                    authContext.setPermissionScopesList(['server'])

                    request.setAuthContext(authContext)
                    request.setCsvFileId(result.rows[0].id)

                    service.getCsvFile({ request: request }, function(err, reply) {
                        expect(err).to.be.null
                        expect(reply).not.to.be.null

                        expect(reply).to.be.an.instanceof(RoverApis.files.v1.Models.GetCsvFileResponse)

                        let csvFile = reply.getCsvFile()
                        expect(csvFile).to.not.be.null
                        expect(csvFile.getId()).to.equal(result.rows[0].id)
                        expect(csvFile.getAccountId()).to.equal(data[0])
                        expect(csvFile.getFileSize()).to.equal(data[1])
                        expect(csvFile.getNumRows()).to.equal(data[2])
                        expect(csvFile.getFilename()).to.equal(data[3])
                        // expect(csvFile.getSamples())
                        // expect


                        return done()
                    })
                })
            })

            it('returns permission denied when scopes are not sufficient', function(done) {
                let service = CsvHandler(PGClient, LocalStorageClient)
                let request = new RoverApis.files.v1.Models.GetCsvFileRequest()

                let authContext = new RoverApis.auth.v1.Models.AuthContext()
                authContext.setAccountId(1)
                authContext.setPermissionScopesList([])

                request.setAuthContext(authContext)
                request.setCsvFileId(1)

                service.getCsvFile({ request: request }, function(err, reply) {
                    expect(err).not.to.be.null;
                    expect(err.code).to.equal(7)
                    return done()
                })
            })

            it('returns permission denied when the auth context is a different account id', function(done) {

                PGClient.query(insertStatement,[1, 50, 10, 'test.csv', '123123.csv', '{{"abc","123"},{"efg","456"}}' , "2017-07-13T14:00:41.00Z", "2017-07-13T14:00:41.00Z"], function(err, result) {
                    if (err) {
                        return done(err)
                    }

                    let service = CsvHandler(PGClient, LocalStorageClient)
                    let request = new RoverApis.files.v1.Models.GetCsvFileRequest()

                    let authContext = new RoverApis.auth.v1.Models.AuthContext()
                    authContext.setAccountId(2)
                    authContext.setPermissionScopesList(['server'])

                    request.setAuthContext(authContext)
                    request.setCsvFileId(result.rows[0].id)

                    service.getCsvFile({ request: request }, function(err, reply) {
                        expect(err).not.to.be.null;
                        expect(err.code).to.equal(7)

                        return done()
                    })
                })
               
            })

            it('returns not found when no csv file exists with the id', function(done) {

                let service = CsvHandler(PGClient, LocalStorageClient)
                let request = new RoverApis.files.v1.Models.GetCsvFileRequest()

                let authContext = new RoverApis.auth.v1.Models.AuthContext()
                authContext.setAccountId(1)
                authContext.setPermissionScopesList(['server'])

                request.setAuthContext(authContext)
                request.setCsvFileId(38383838)

                service.getCsvFile({ request: request }, function(err, reply) {
                    expect(err).not.to.be.null;
                    expect(err.code).to.equal(5)

                    return done()
                })

            })
        })

        describe('deleteCsvFile', function() {

            before('truncate db', clearDB)
            after('truncate db', clearDB)    

            it('deletes the csv file', function() {
                let data = [1, 50, 10, 'test.csv', '123123.csv', '{{"abc","123"},{"efg","456"}}' , "2017-07-13T14:00:41.00Z", "2017-07-13T14:00:41.00Z"]
                
                PGClient.query(insertStatement, data, function(err, result) {
                    if (err) {
                        return done(err)
                    }

                    let service = CsvHandler(PGClient, LocalStorageClient)
                    let request = new RoverApis.files.v1.Models.GetCsvFileRequest()

                    let authContext = new RoverApis.auth.v1.Models.AuthContext()
                    authContext.setAccountId(1)
                    authContext.setPermissionScopesList(['server'])

                    request.setAuthContext(authContext)
                    request.setCsvFileId(result.rows[0].id)

                    service.deleteCsvFile({ request: request }, function(err, reply) {
                        expect(err).to.be.null
                        expect(reply).not.to.be.null

                        expect(reply).to.be.instanceof(RoverApis.files.v1.Models.DeleteCsvFileResponse)

                        return done()
                    })
                })
            })

            it('returns permission denied when scopes are not sufficient', function(done) {
                let service = CsvHandler(PGClient, LocalStorageClient)
                let request = new RoverApis.files.v1.Models.GetCsvFileRequest()

                let authContext = new RoverApis.auth.v1.Models.AuthContext()
                authContext.setAccountId(1)
                authContext.setPermissionScopesList([])

                request.setAuthContext(authContext)
                request.setCsvFileId(1)

                service.deleteCsvFile({ request: request }, function(err, reply) {
                    expect(err).not.to.be.null;
                    expect(err.code).to.equal(7)
                    return done()
                })
            })

            it('returns permission denied when the auth context is a different account id', function(done) {
                PGClient.query(insertStatement,[1, 50, 10, 'test.csv', '123123.csv', '{{"abc","123"},{"efg","456"}}' , "2017-07-13T14:00:41.00Z", "2017-07-13T14:00:41.00Z"], function(err, result) {
                    if (err) {
                        return done(err)
                    }

                    let service = CsvHandler(PGClient, LocalStorageClient)
                    let request = new RoverApis.files.v1.Models.GetCsvFileRequest()

                    let authContext = new RoverApis.auth.v1.Models.AuthContext()
                    authContext.setAccountId(2)
                    authContext.setPermissionScopesList(['server'])

                    request.setAuthContext(authContext)
                    request.setCsvFileId(result.rows[0].id)

                    service.deleteCsvFile({ request: request }, function(err, reply) {
                        expect(err).not.to.be.null;
                        expect(err.code).to.equal(7)

                        return done()
                    })
                })
            })

            it('returns not found when no csv file exists with the id', function(done) {

                let service = CsvHandler(PGClient, LocalStorageClient)
                let request = new RoverApis.files.v1.Models.GetCsvFileRequest()

                let authContext = new RoverApis.auth.v1.Models.AuthContext()
                authContext.setAccountId(1)
                authContext.setPermissionScopesList(['server'])

                request.setAuthContext(authContext)
                request.setCsvFileId(38383838)

                service.deleteCsvFile({ request: request }, function(err, reply) {
                    expect(err).not.to.be.null;
                    expect(err.code).to.equal(5)

                    return done()
                })

            })
        });

        describe('uploadCsvFile', function() {
            it('uploads a csv file', function(done) {
                done("TODO")
            })
        })

    })
})