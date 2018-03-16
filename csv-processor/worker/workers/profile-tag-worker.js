const Promise = require('bluebird')
const RoverApis = require('@rover/apis')
const through = require('through2')
const throughConcurrent = require('through2-concurrent')

function to(promise) {
   return promise.then(data => {
      return [null, data];
   })
   .catch(err => [err]);
}

module.exports = function(FilesClient, AudienceClient) {

    if (!FilesClient) {
        throw new Error("Invalid Argument: FilesClient must be defined")
    }
    
    if (!AudienceClient) {
        throw new Error("Invalid Argument: AudienceClient must be defined")
    }

    const handlers = {}

    function updateJobProgress(job, logger, progress) {
        logger.info("progress=" + progress)
        job.progress(progress)
    }

    /**
     * Load a csv of profiles and tag them
     * @param  {Object} job    The bull job from redis
     * @param  {Class} logger  Prefixed logger
     */
    handlers.tagProfiles = function(job, logger) {
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
            const tags = jobArguments.tags
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


                logger.info("Opening read stream for csv file: " + csvFile.getId())

                let readRequest = new RoverApis.files.v1.Models.ReadCsvFileRequest()
                readRequest.setAuthContext(authContext)
                readRequest.setCsvFileId(csvFileId)

                let csvFileReadStream = FilesClient.readCsvFile(readRequest)

                let currentProgress = 0
                let currentRow = 0

                csvFileReadStream
                    .pipe(throughConcurrent.obj(async function(row, _, callback) {
                        
                        // Function is always called in sequential order
                        currentRow += 1

                        let identifier = row.getLinesList()[0]

                        // quicker way of doing this is calling TagProfile if we get 404  not found we do create and re-run a few times till we blow up
                        let tagRequest = new RoverApis.audience.v1.Models.TagProfileRequest()
                        tagRequest.setAuthContext(authContext)
                        tagRequest.setIdentifier(identifier)
                        tagRequest.setTagsList(tags)

                        let createReq = new RoverApis.audience.v1.Models.CreateProfileRequest()
                        createReq.setAuthContext(authContext)
                        createReq.setIdentifier(identifier)

                        let profileTagged = false
                        let err // represents the last error we ran into

                        // Try to tag the profile up to 5 times before giving up
                        for (var i = 0; i < 5; i++) {
                            [err] = await to(AudienceClient.tagProfile(tagRequest))
                            if (err) {
                                if (err.code == 5) {
                                    [err] = await to(AudienceClient.createProfile(createReq))
                                }
                            } else {
                                profileTagged = true
                                break
                            }
                        }

                        if (profileTagged) {
                            this.push({ rowNumber: currentRow, id: identifier })
                        } else {
                            this.push({ rowNumber: currentRow, failed: true, error: err })
                        }

                        callback()
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