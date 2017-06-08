const winston = require('winston')

winston.level = (process.env.LOG_LEVEL || 'info')

const LoadJobHandler = require('./load-job-handler')

function getCurrentMicroSeconds() {
    const hrTime = process.hrtime()
    return (hrTime[0] * 1000000 + hrTime[1] / 1000)
}

function formatRunTime(microseconds) {
    
    let symbol = "μs"
    let clockTime = microseconds

    if (clockTime >= 1000) {
        symbol = "ms"
        clockTime = clockTime / 1000
    }

    return `${clockTime.toFixed(2)}μs`
}

const inject = function({ name, func }) {

    return function(call, callback) {
        
        const startTime = getCurrentMicroSeconds()

        func(call, function(err, response) {

            const runTime = getCurrentMicroSeconds() - startTime

            
            const log = {
                name: name,
                runTime: formatRunTime(runTime)
            }

            if (response && typeof response.toObject == 'function') {
                winston.log("debug", response.toObject())
            }

            if (err) {
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