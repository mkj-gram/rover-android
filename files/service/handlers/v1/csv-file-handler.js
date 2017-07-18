const RoverApis = require('@rover/apis')
const StreamCounter = require('@rover-common/stream-counter')
const csv = require('fast-csv')
const grpc = require('grpc')
const squel = require('squel').useFlavour('postgres')
const crypto = require('crypto')

function serializeArrayForPostgres(input, width) {
    
    function serialize(array) {
        
        // Ensure the array is always expanded to the full width
        if (array.length < width) {
            let previousWidth = array.length
            array.length = width
            array.fill('', previousWidth, width)
        }

        let formatted = array.reduce(function(builder, value, index) {
            if (typeof value === 'string') {
                builder = builder.concat(`"${value}"`)
            } else {
                builder = builder.concat(value)
            }

            if (index != array.length - 1) {
                builder = builder.concat(",")
            }

            return builder

        }, '{')

        return formatted.concat('}')

    }

    if (input[0] instanceof Array) {
       return "{" + input.map(serialize).join(",") + "}"
    } else {
        return serialize(input)
    }

}

module.exports = function(PGClient, StorageClient) {

    if (StorageClient === null || StorageClient === undefined) {
        throw new Error("Invalid Argument: StorageClient must be defined")
    }

    if (StorageClient.CsvFileBucket === null || StorageClient.CsvFileBucket === undefined) {
        throw new Error("Invalid Argument: StorageClient must define CsvFileBucket")
    }

    if (PGClient === null || PGClient === undefined) {
        throw new Error("Invalid Argument: PGClient must be defined")
    }

    let handlers = {}
   

    /**
     * Converts a sample to CsvFile.Sample
     * @param  {Array[string]} csv_samples a single row of samples
     * @return {Protobuf[CsvFile.Sample]}
     */
    function csvSamplesToProto(csv_samples) {
        let proto = new RoverApis.files.v1.Models.CsvFile.Sample()
        proto.setDataList(csv_samples)
        return proto
    }

    function csvFileToProto(csv_file) {
        let proto = new RoverApis.files.v1.Models.CsvFile()

        proto.setId(csv_file.id)
        proto.setAccountId(csv_file.account_id)
        proto.setFilename(csv_file.filename)
        proto.setNumRows(csv_file.num_rows)
        proto.setNumColumns(csv_file.num_columns)
        proto.setFileSize(csv_file.file_size)
        // samples is of type TEXT[][]
        if (csv_file.samples && csv_file.samples.length > 0) {
            let samplesProto = csv_file.samples.map(csvSamplesToProto)
            proto.setSamplesList(samplesProto)
        }
        
        proto.setCreatedAt(RoverApis.Helpers.timestampToProto(csv_file.created_at))

        return proto
    }
    
    function hasAccess(auth_context) {

        if (auth_context === null || auth_context === undefined) {
            return false
        }

        if (auth_context.getAccountId() === 0) {
            return false
        }

        // Only tokens with the server or user scope have access
        if (!(auth_context.getPermissionScopesList().includes('server') || auth_context.getPermissionScopesList().includes('user'))) {
            return false
        }

        return true
    }

    function getCsvFile(id, callback) {

        let query = squel.select()
                            .from("csv_files")
                            .where("csv_files.id = ?", id)
                            .limit(1)
                            .toParam()

        let text = query.text
        let values = query.values

        PGClient.query(text, values, function(err, result) {
            if (err) {
                console.error(err)
                return callback(err)
            }

            let row = result.rows[0]

            if (row && row.file_size) {
                // BIGINT returns a string in pg driver
                row.file_size = parseInt(row.file_size)
            }
            

            return callback(null, row)

        })

    }
    /**
     * handler for ListCsvFiles rpc call
     * @param  {ListCsvFilesRequest}   req
     * @param  {Function} callback 
     */
    handlers.listCsvFiles = function(call, callback) {

        const req = call.request

        if (!hasAccess(req.getAuthContext())) {
            return callback({ code: grpc.status.PERMISSION_DENIED, message: "Forbidden" })
        }

        let accountId = req.getAuthContext().getAccountId()
        let limit = Math.min(req.getPageSize(), 100)

        // TODO implement paginitation
        let query = squel.select()
                            .from("csv_files")
                            .where("csv_files.account_id = ?", accountId)
                            .order("created_at", false)
                            .limit(limit)
                            .toParam()

        let text = query.text
        let values = query.values

        PGClient.query(text, values, function(err, result) {
            if (err) {
                console.error(err)
                return callback(err)
            }

            let response = new RoverApis.files.v1.Models.ListCsvFilesResponse()

            let csv_files = result.rows

            response.setCsvFilesList(csv_files.map(csvFileToProto))

            return callback(null, response)
        })

        
    }

    handlers.getCsvFile = function(call, callback) {
        const req = call.request

        if (!hasAccess(req.getAuthContext())) {
            return callback({ code: grpc.status.PERMISSION_DENIED, message: "Forbidden" })
        }

        let csvFileId = req.getCsvFileId()

        // Do not call db for no reason. An id of 0 cannot exist
        if (csvFileId === 0) {
            return callback({ code: grpc.status.NOT_FOUND, message: "Not Found" })
        }

        getCsvFile(csvFileId, function(err, csvFile) {
            if (err) {
                return callback(err)
            }

            if (csvFile === null || csvFile === undefined) {
                return callback({ code: grpc.status.NOT_FOUND, message: "Not Found" })
            }

            if (csvFile.account_id !== req.getAuthContext().getAccountId()) {
                return callback({ code: grpc.status.PERMISSION_DENIED, message: "Forbidden" })
            }

            let response = new RoverApis.files.v1.Models.GetCsvFileResponse()

            response.setCsvFile(csvFileToProto(csvFile))

            return callback(null, response)
        })
    }

    handlers.deleteCsvFile = function(call, callback) {
        const req = call.request

        if (!hasAccess(req.getAuthContext())) {
            return callback({ code: grpc.status.PERMISSION_DENIED, message: "Forbidden" })
        }

        let csvFileId = req.getCsvFileId()

        // Do not call db for no reason. An id of 0 cannot exist
        if (csvFileId === 0) {
            return callback({ code: grpc.status.NOT_FOUND, message: "Not Found" })
        }

        getCsvFile(csvFileId, function(err, csvFile) {
            if (err) {
                return callback(err)
            }

            if (csvFile === null || csvFile === undefined) {
                return callback({ code: grpc.status.NOT_FOUND, message: "Not Found" })
            }

            if (csvFile.account_id !== req.getAuthContext().getAccountId()) {
                return callback({ code: grpc.status.PERMISSION_DENIED, message: "Forbidden" })
            }

            let destroy = squel.delete()
                                .from("csv_files")
                                .where("csv_files.id = ?", csvFileId)
                                .toParam()

            let text = destroy.text
            let values = destroy.values

            PGClient.query(text, values, function(err) {
                if (err) {
                    return callback(err)
                }

                let response = new RoverApis.files.v1.Models.DeleteCsvFileResponse()

                return callback(null, response)
            })
        })
    }
    
    /**
     * handler for UploadCsvFile rpc call
     * @param  {Stream}   stream   [description]
     * @param  {Function} callback [description]
    */
    handlers.uploadCsvFile = function(stream, callback) {
        // create remote filestream
        

        /*
            meta is of type UploadCsvFileRequest.Meta -> {
                auth_context
            }
         */
        let meta = null;
        let numRows = 0
        let numColumns = 0
        let samples = []
        let fileSize = 0
        let streamCancelled = false
        let generatedFileName = crypto.randomBytes(16).toString('hex') + '.csv'
        // TODO: use the filename in the meta property
        let filename = generatedFileName

        function onFinished() {
            // called when above variables have been populated
            let currentTime = new Date().toISOString()

            let insert = squel.insert()
                .into('csv_files')
                .set('account_id', meta.getAuthContext().getAccountId())
                .set('file_size', fileSize)
                .set('num_rows', numRows)
                .set('num_columns', numColumns)
                .set('filename', filename)
                .set('generated_filename', generatedFileName)
                .set('samples', serializeArrayForPostgres(samples, numColumns))
                .set('updated_at', currentTime)
                .set('created_at', currentTime)
                .returning('*')
                .toParam()
                
            let text = insert.text
            let values = insert.values

            PGClient.query(text, values, function(err, result) {
                if (err) {
                    console.log(err)
                    return callback({ code: grpc.status.UNAVAILABLE, message: err.message })
                }

                let response = new RoverApis.files.v1.Models.UploadCsvFileResponse()

                let csv_file = result.rows[0]
                response.setCsvFile(csvFileToProto(csv_file))

                return callback(null, response)
            })

        }

        
        let remoteFile = StorageClient.CsvFileBucket.file(generatedFileName)
        let remoteFileWriteStream = remoteFile.createWriteStream({ gzip: true, resumable: false, metadata: { contentType: 'text/csv' }})

        remoteFileWriteStream.on('finish', function() {
            fileSize = streamCounter.bytes
            if (streamCancelled == false) {
                return onFinished()  
            }
        }).on('error', function(err) {
            return callback(err)
        })

        let streamCounter = new StreamCounter()

        // convert the parsed csv lines back to bytes for a file
        // at the same time count the number of bytes we will be writing to the file
        let csvWriteStream = csv.format({ headers: false })
        csvWriteStream.pipe(streamCounter).pipe(remoteFileWriteStream)

       

        /*
            Process the csv data line by line
         */
        let csvReadStream = csv()
        .on('data', function(data) {
            numRows += 1

            if (data.length > numColumns) {
                numColumns = data.length
            }

            if (samples.length < 100) {
                samples.push(data)
            }
            
            csvWriteStream.write(data)
        })
        .on('end', function() {
            csvWriteStream.end()
        })
        .on('error', function(err) {
            return callback(err)
        })

        /*
            First chunk should always be of type UploadCsvFileRequest.Meta
            Once the first chunk has been detected the rest of chunks will be of type UploadCsvFileRequest.Chunk
         */
        let hasReceivedFirstChunk = false

        stream.on('data', function(data) {
            // data is a base64 encoded string
            if (hasReceivedFirstChunk == false) {
                if (data.getValueCase() !== 1 || data.hasMeta() === false) {
                    streamCancelled = true
                    return callback({ code: grpc.status.CANCELLED, message: "First chunk must be of type Meta" })
                }
                hasReceivedFirstChunk = true

                // make sure we have a proper filled out context
                meta = data.getMeta()

                if (meta.hasAuthContext() === false) {
                    streamCancelled = true
                    return callback({ code: grpc.status.CANCELLED, message: "Unable to get AuthContext from data" })
                }

                if (meta.getAuthContext().getAccountId() == 0) {
                    streamCancelled = true
                    return callback({ code: grpc.status.CANCELLED, message: "AuthContext account_id is not set" })
                }
            } else {
                // Decode the base64 string back to bytes
                let buffer = new Buffer(data.getChunk().getData(), 'base64')
                csvReadStream.write(buffer)
            }
        })

        stream.on('end', function() {
            csvReadStream.end()
        })

        // There was an underlying error that caused the stream to crash
        stream.on('error', function(err) {
            return callback(err)
        })

        // The client aborted the stream request we should just clean up and return
        stream.on('cancelled', function() {
            return callback({ code: grpc.status.CANCELLED, message: "Stream was cancelled" })
        })
    }

    /**
     * handler for ReadCsvFile rpc call
     * @param  {Object}   call      ReadCsvFileRequest grpc input
     * @param  {Function} callback 
    */
   
    handlers.readCsvFile = function(call, callback) {
        const req = call.request
        const res = call

        if (!hasAccess(req.getAuthContext())) {
            return callback({ code: grpc.status.PERMISSION_DENIED, message: "Forbidden" })
        }

        let csvFileId = req.getCsvFileId()

        if (csvFileId == 0) {
            return callback({ code: grpc.status.NOT_FOUND, message: "Not Found" })
        }

        getCsvFile(csvFileId, function(err, csvFile) {
            if (err) {
                return callback(err)
            }

            if (!csvFile) {
                return callback({ code: grpc.status.NOT_FOUND, message: "Not Found" })
            }

            if (csvFile.account_id !== req.getAuthContext().getAccountId()) {
                return callback({ code: grpc.status.PERMISSION_DENIED, message: "Permission Denied" })
            }

            let remoteFileStream = StorageClient.CsvFileBucket.file(csvFile.generated_filename).createReadStream()

            // start reading and parsing the csv lines 
            let csvReadStream = csv()
            .on('data', function(data) {
                let response = new RoverApis.files.v1.Models.ReadCsvFileResponse()
                response.setLinesList(data)
                res.write(response)
            })
            .on('end', function() {
                res.end()
            })
            .on('error', function(err) {
                remoteFileStream.unpipe(csvReadStream)
                remoteFileStream.destroy(err)
                return callback(err)
            })

            remoteFileStream.pipe(csvReadStream)
        
        })
    }


    return handlers
}