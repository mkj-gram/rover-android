const winston = require('winston')

winston.level = (process.env.LOG_LEVEL || 'info')

const LoadJobHandler = require('./load-job-handler')

const inject = function({ name, func }) {

    return function(call, callback) {
        
        const startTime = Date.now()

        func(call, function(err, response) {

            const runTime = Date.now() - startTime

            const log = {
                name: name,
                runTime: runTime
            }

            if (response && typeof response.toObject == 'function') {
                winston.log("debug", response.toObject())
            }

            if (err) {
                winston.error(err)

                if (err.code) {
                    log.status = err.code
                }

                if (err.message) {
                    log.message = err.message
                }
            } else {
                log.status = "ok"
            }

            winston.info("GRPC", log)
            
            return callback(err, response)
        })
    }
}

const bindHandler = function(handler, context) {

    const boundHandler = {}

    Object.keys(handler).forEach(function(functionName) {
        // handler => { getLoadJob: [Function] }
        boundHandler[functionName] = inject({ name: functionName, func: handler[functionName].bind(context) })
    })

    return boundHandler
}

const build = function(context) {
    const handles = {}

    Object.assign(handles, bindHandler(LoadJobHandler, context))


    return handles
}

module.exports = {
    build: build
}