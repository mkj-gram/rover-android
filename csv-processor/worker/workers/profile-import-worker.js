const Promise = require('bluebird')
const RoverApis = require('@rover/apis')
const through = require('through2')

const retryify = require('@rover-common/grpc-retryify')
const promisify = require('@rover-common/grpc-promisify')

/**
 * Takes a single row in csv file and converts them to ValueUpdates to update the profile's attributes
 * @param  {Array} row       
 * @param  {Object} rowSchema 
 * @return {Object}             key value mapping of field name to protobuf ValueUpdate
 */
function rowToAttributeUpdates(row, rowSchema) {
    
    let parsedRow = {}

    function stringToBoolean(string){
        switch(string.toLowerCase().trim()){
            case "true": case "yes": case "1": return true;
            case "false": case "no": case "0": case "": case null: return false;
            default: return false;
        }
    }

    row.forEach((value, index) => {
        const schema = rowSchema[index]
        const type = schema.type
        const field = schema.field

        const protoValue = new RoverApis.audience.v1.Models.Value()

        switch (type) {
            case 'id': {
                // Skip id
                break
            }
            case 'string': {
                protoValue.setStringValue(value.toString())
                break
            }
            case 'integer': {
                const integerValue = parseInt(value)
                if (isNaN(integerValue)) {
                    throw new Error("Unable to parse integer: ", value)
                }

                protoValue.setIntegerValue(integerValue)
                break
            }
            case 'float': {
                const floatValue = parseFloat(value)
                if (isNaN(floatValue)) {
                    throw new Error("Unable to parse float: ", value)
                }

                protoValue.setDoubleValue(floatValue)
                break
            }
            case 'boolean': {
                const v = stringToBoolean(value)
                protoValue.setBooleanValue(v)
                break
            }
            case 'list': {
                const v = value.toString().split("|")
                const arrayString = new RoverApis.audience.v1.Models.Value.StringArray()
                arrayString.setValuesList(v)
                protoValue.setStringArrayValue(arrayString)
                break
            }
            case 'timestamp': {
                const dateValue = new Date(value)
                if (isNaN(dateValue)) {
                    throw new Error("Unable to parse timestamp: ", value)
                }

                protoValue.setTimestampValue(RoverApis.Helpers.timestampToProto(dateValue))
                break
            }
            default: {
                // Skip
                console.warn("Invalid schema: ", schema)
            }
        }

        // Only add to map if the protovalue was actually set
        if (protoValue.getValueTypeCase() !== 0) {
            parsedRow[field] = protoValue
        }

    })

    return parsedRow
}

module.exports = function(FilesClient, AudienceClient) {

    if (!FilesClient) {
        throw new Error("Invalid Argument: FilesClient must be defined")
    }
    
    if (!AudienceClient) {
        throw new Error("Invalid Argument: AudienceClient must be defined")
    }

    retryify(AudienceClient)
    promisify(AudienceClient)

    const handlers = {}

    function updateJobProgress(job, logger, progress) {
        logger.info("progress=" + progress)
        job.progress(progress)
    }

    /**
     * Load a csv of profiles and import them
     * @param  {Object} job    The bull job from redis
     * @param  {Class} logger  Prefixed logger
     */
    handlers.loadProfiles = function(job, logger) {
        return new Promise((resolve, reject) => {

            if (job === null || job === undefined) {
                return reject(new Error("Invalid Argument: job is not defined"))
            }


            const JobData = job.data
            logger.info("LoadProfiles started with input: ", JobData)

            const jobArguments = job.data.arguments
            const authContext = new RoverApis.auth.v1.Models.AuthContext()
            authContext.setAccountId(job.data.auth_context.account_id)
            authContext.setUserId(job.data.auth_context.user_id)
            authContext.setPermissionScopesList(job.data.auth_context.scopes)
            const importSchema = jobArguments.import_schema
            const csvFileId = jobArguments.csv_file_id

            let errors = []
            let numSuccess = 0
            let numFailed = 0

            logger.info("Getting CsvFile info")

            let request = new RoverApis.files.v1.Models.GetCsvFileRequest()
            request.setAuthContext(authContext)
            request.setCsvFileId(csvFileId)

            FilesClient.getCsvFile(request, function(err, reply) {
                if (err) {
                    return reject(err)
                }

                logger.info("CsvFile info retrieved")

                let csvFile = reply.getCsvFile()

                const totalRows = csvFile.getNumRows()
                let rowsProcessed = 0

                const idColumn = importSchema.findIndex(function(i) { return i.type === 'id' })

                logger.info("Opening read stream for csv file: " + csvFile.getId())

                let readRequest = new RoverApis.files.v1.Models.ReadCsvFileRequest()
                readRequest.setAuthContext(authContext)
                readRequest.setCsvFileId(csvFileId)

                let csvFileReadStream = FilesClient.readCsvFile(readRequest)

                let currentProgress = 0
                let currentRow = 0

                csvFileReadStream
                    .pipe(through({ objectMode: true }, function (chunk, encoding, callback) {
                        /*
                            Keep track of which line we are parsing in the csv file
                            This function call is called in sequential order
                         */ 
                        currentRow += 1
                        
                        /*
                            importSchema = [{ type: "identifier" name: "Collector Number" }, { type: 'string', name: 'First Name'}]
                         */
                        
                        let row = chunk.getLinesList()

                        let id = row[idColumn]
                        if (id === null || id === undefined) {
                            console.warn("Row: ", row, " did not specify an id")
                            // This is bad
                            return callback()
                        }

                        try {
                            // this should be in value updates
                            let parsedRow = rowToAttributeUpdates(row, importSchema)
                        
                            this.push({ rowNumber: currentRow, id: id, attributes: parsedRow })
                        } catch(err) {
                            this.push({ rowNumber: currentRow, failed: true, error: err })
                        } finally {
                            return callback()
                        }
                    }))
                    .resume()
                    .pipe(through({ objectMode: true }, function(row, encoding, callback) {
                        
                        async function updateProfile(profileId, attributes) {
                            let request = new RoverApis.audience.v1.Models.UpdateProfileRequest()
                            request.setAuthContext(authContext)
                            request.setIdentifier(profileId)

                            let updates = request.getAttributesMap()
                            Object.keys(attributes).forEach(a => {
                                updates.set(a,attributes[a])
                            })

                            function retryOn(err) {
                                const codes = [2, 4, 5, 8, 10, 13, 14]
                                if (err === null || err === undefined) {
                                    return false
                                }

                                if (err.code === null || err.code === undefined) {
                                    return false
                                }

                                return codes.includes(err.code)
                            }
                            
                            return await AudienceClient.updateProfile(request, { retry: { on: retryOn, minTimeout: 1 * 1000, factor: 2, retries: 10 } })
                        }

                        async function createIdentifiedProfile(id) {
                            let request = new RoverApis.audience.v1.Models.CreateProfileRequest()
                            request.setAuthContext(authContext)
                            request.setIdentifier(id)

                            let res = await AudienceClient.createProfile(request)
                            return res.getProfile()
                        }

                        async function update() {

                            const id = row.id

                            let findRequest = new RoverApis.audience.v1.Models.GetProfileByIdentifierRequest()
                            findRequest.setAuthContext(authContext)
                            findRequest.setIdentifier(id)

                            let res
                            let profile
                            try {
                                res = await AudienceClient.getProfileByIdentifier(findRequest)
                                profile = res.getProfile()
                            } catch(err) {
                                if (err.code == 5) {
                                    // not found
                                    profile = await createIdentifiedProfile(id)
                                } else {
                                    throw err
                                }
                            }

                            return await updateProfile(profile.getId(), row.attributes)
                        }

                        let self = this
                        const rowNumber = row.rowNumber

                        // If we were unable to parse from first stage just push it to the last stage so it can count number of errors
                        if (row.failed === true) {
                            self.push(row)
                            return callback()
                        }

                        update()
                            .then(_ => {
                                self.push(row)
                                return callback() 
                            })
                            .catch(err => {
                                if (err.code) {
                                    // Track grpc errors
                                    self.push({ rowNumber: rowNumber, failed: true, error: err })
                                    return callback()
                                } else {
                                    // Cancel the job if we get an error that isn't a grpc one
                                    return reject(err)
                                }
                            })
                            
                
                        
                    }))
                    .pipe(through({ objectMode: true }, function(row, encoding, callback) {
                        /*
                            Row can be of the following
                            failed:
                                { rowNumber: <int>, failed: <boolean>, error: <Error> }
                            success:
                                { rowNumber: <int>, id: <string>, attributes: <Object> }
                         */
                        if (row.failed === true) {
                            numFailed += 1
                            errors.push({ rowNumber: row.rowNumber, error: row.error })
                        } else {
                            numSuccess += 1
                        }

                        rowsProcessed += 1

                        const newProgress = Math.min(Math.floor(((rowsProcessed / totalRows) * 100)), 100)

                        if (newProgress > currentProgress) {
                            currentProgress = newProgress
                            updateJobProgress(job, logger, currentProgress)
                        }

                        return callback()
                    }))
                    .resume()
                    .on('end', function() {
                        logger.info("FINISHED")
                        // TODO once we have a proper job tracker submit the results on number of success, failed, errors
                        logger.info("Success:", numSuccess)
                        logger.info("Failed:", numFailed)
                        logger.info("Errors:", errors.reduce(function(acc, input) { return acc.concat(`row: ${input.rowNumber} error: ${input.error}\n`)}, "") )
                        return resolve()
                    })
                    .on('error', function(err) {
                        return reject(err)
                    })
            })
            

        })
    }

    return handlers
}