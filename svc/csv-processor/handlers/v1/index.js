const winston = require('winston')

const LoadJobHandler = require('./load-job-handler')

const inject = function({ name, func }) {

    return function(call, callback) {
        
        const startTime = Date.now()

        func(call, function(err, response) {

            const runTime = Date.now() - startTime

            winston.info("GRPC: " + name + " " + runTime + "ms")
            
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