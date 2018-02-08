var chai = require('chai')
var Promise = require('bluebird')
var expect = chai.expect
var sinon = require('sinon')
var assert = require('assert')
var Worker = require('../workers/profile-import-worker')
var csv = require('fast-csv')
var fs = require('fs')
const { Readable } = require('stream');

let RoverApis = require('@rover/apis')
let Audience = require('@rover/apis').audience.v1.Models
let Files = require('@rover/apis').files.v1.Models
let Auth = require('@rover/apis').auth.v1.Models


function stubClient(funcName, returnFunc) {
    let client = {}
    client[funcName] = returnFunc
    return client
}

describe('ProfileImportJob', function() {

	const logger = {
		info: function(...args) {
			// do nothing
		}
	}

	function newFilesClient() {
		return {
			getCsvFile: function() {}
		}
	}

	describe('loadProfiles', function() {

		it('should return a promise', function() {
			let worker = Worker({}, {})
			let res = worker.loadProfiles(null, null)
			// Silent Unhandled promise rejections
			res.catch(_ => {})

			expect(Promise.resolve(res)).to.equal(res)
		})


		it('correctly parses job data and request file from files service', function(done) {
			
			var client = stubClient('getCsvFile', function(request, callback) {
				assert.equal(request.getCsvFileId(), 1)
				return callback("allow")
			})
			

			let worker = Worker(client, {})

			worker.loadProfiles({
				data: {
					auth_context: {
						account_id: 1
					},
					arguments: {
						csv_file_id: 1
					}
				}
			}, logger).catch(e => {
				if (e === 'allow') {
					return done()
				}
				
				return done(e)
			})
		})

		it('looks up profiles by identifier', function(done) {
			let job = {
				data: {
					auth_context: {
						account_id: 1
					},
					arguments: {
						csv_file_id: 1,
						import_schema: [
							{
								type: "id"
							},
							{
								type: "string",
								field: "name"
							},
							{
								type: "integer",
								field: "age"
							}
						],
					}
				},
				progress: function() {}
			}

			var fclient = {

				getCsvFile: function(request, callback) {
					let res = new Files.GetCsvFileResponse()
					let file = new Files.CsvFile()

					file.setId(1)
					file.setAccountId(1)
					file.setFilename("example.csv")
					file.setNumRows(1)
					file.setNumColumns(3)
					file.setFileSize(1024)

					res.setCsvFile(file)
					return callback(null, res)
				},

				readCsvFile: function(request) {
					let s = new Readable({ objectMode: true })
					let res = new Files.ReadCsvFileResponse()
					res.setLinesList(['abc', 'bob', '123'])

					s.push(res)
					s.push(null)
					
					return s
				}
			}

			var aclient = {
				getProfileByIdentifier: async function(request) {
					assert(request !== null)
					assert.equal(request.getIdentifier(), "abc")

					let res = new Audience.GetProfileByIdentifierResponse()
					let profile = new Audience.Profile()

					profile.setId("123")
					res.setProfile(profile)

					return res
				},
				updateProfile: async function(request) {
					return null
				}
			}

			let worker = Worker(fclient, aclient)
			worker.loadProfiles(job, logger)
				.then(_ => done())
				.catch(e => done(e))
		})


		it('calls updateProfile with the correctly parsed line', function(done) {
			let updateProfileCalled = false
			let getProfileByIdentifierCalled = false

			let job = {
				data: {
					auth_context: {
						account_id: 1
					},
					arguments: {
						csv_file_id: 1,
						import_schema: [
							{
								type: "id"
							},
							{
								type: "string",
								field: "string"
							},
							{
								type: "integer",
								field: "integer"
							},
							{
								type: "float",
								field: "float"
							},
							{
								type: "boolean",
								field: "boolean"
							},
							{
								type: "list",
								field: "list"
							},
							{
								type: "timestamp",
								field: "timestamp"
							}
						],
					}
				},
				progress: function() {}
			}

			var fclient = {

				getCsvFile: function(request, callback) {
					let res = new Files.GetCsvFileResponse()
					let file = new Files.CsvFile()

					file.setId(1)
					file.setAccountId(1)
					file.setFilename("example.csv")
					file.setNumRows(1)
					file.setNumColumns(3)
					file.setFileSize(1024)

					res.setCsvFile(file)
					return callback(null, res)
				},

				readCsvFile: function(request) {
					let s = new Readable({ objectMode: true })
					let res = new Files.ReadCsvFileResponse()
					res.setLinesList(['id', 'string', '1', '1.234', 'true', 'tag1|tag2|tag3', '2017-07-07T11:00:00Z'])

					s.push(res)
					s.push(null)
					
					return s
				}
			}

			var aclient = {
				getProfileByIdentifier: async function(request) {
					getProfileByIdentifierCalled = true
					assert(request !== null)
					assert.equal(request.getIdentifier(), "id")

					let res = new Audience.GetProfileByIdentifierResponse()
					let profile = new Audience.Profile()

					profile.setId("5a7d165d0000000000000000")
					profile.setIdentifier("123")
					res.setProfile(profile)
					return res
				},
				updateProfile: async function(request) {
					updateProfileCalled = true
					expect(request).to.be.an.instanceof(Audience.UpdateProfileRequest)
					expect(request.getIdentifier()).to.equal("123")
					let updates = request.getAttributesMap()

					expect(updates.get('string').getStringValue()).to.equal("string")
					expect(updates.get('integer').getIntegerValue()).to.equal(1)
					expect(updates.get('float').getDoubleValue()).to.equal(1.234)
					expect(updates.get('boolean').getBooleanValue()).to.equal(true)
					expect(updates.get('list').getStringArrayValue().getValuesList()).to.deep.equal(['tag1', 'tag2', 'tag3'])
					expect(updates.get('timestamp').getTimestampValue().getSeconds()).to.equal(1499425200)
					expect(updates.get('timestamp').getTimestampValue().getNanos()).to.equal(0)

					return null
				}
			}

			let worker = Worker(fclient, aclient)
			worker.loadProfiles(job, logger)
				.then(_ => {
					expect(getProfileByIdentifierCalled).to.equal(true)
					expect(updateProfileCalled).to.equal(true)
					
					done()
				})
				.catch(done)
		})


		it('calls createprofile when the profile is not found', function(done) {
			let job = {
				data: {
					auth_context: {
						account_id: 1
					},
					arguments: {
						csv_file_id: 1,
						import_schema: [
							{
								type: "id"
							},
							{
								type: "string",
								field: "name"
							},
							{
								type: "integer",
								field: "age"
							}
						],
					}
				},
				progress: function() {}
			}

			var fclient = {

				getCsvFile: function(request, callback) {
					let res = new Files.GetCsvFileResponse()
					let file = new Files.CsvFile()

					file.setId(1)
					file.setAccountId(1)
					file.setFilename("example.csv")
					file.setNumRows(1)
					file.setNumColumns(3)
					file.setFileSize(1024)

					res.setCsvFile(file)
					return callback(null, res)
				},

				readCsvFile: function(request) {
					let s = new Readable({ objectMode: true })
					let res = new Files.ReadCsvFileResponse()
					res.setLinesList(['abc', 'bob', '123'])

					s.push(res)
					s.push(null)
					
					return s
				}
			}

			var aclient = {
				getProfileByIdentifier: async function(request) {
					assert(request !== null)
					assert.equal(request.getIdentifier(), "abc")
					let error = new Error("Not Found")
					error.code = 5
					throw error
				},
				updateProfile: async function(request) {
					// Doesn't get hit
				},
				createProfile: async function(request) {
					expect(request).to.be.an.instanceof(Audience.CreateProfileRequest)
					let res = new Audience.CreateProfileResponse()
					let profile = new Audience.Profile()
					res.setProfile(profile)
					return res
				}
			}

			let worker = Worker(fclient, aclient)
			worker.loadProfiles(job, logger)
				.then(_ => done())
				.catch(e => done(e))
		})
	})
})