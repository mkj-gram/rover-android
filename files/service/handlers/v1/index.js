const winston = require('winston')
winston.level = (process.env.LOG_LEVEL || 'info')

const build = function(StorageClient, PGClient) {
    const handlers = {}

    let CsvFileHandler = require('./csv-file-handler')(StorageClient, PGClient)

    Object.assign(handlers, CsvFileHandler)

    return handlers
}

module.exports = {
    build: build
}