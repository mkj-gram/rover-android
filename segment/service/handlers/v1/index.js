const winston = require('winston')

const StaticSegmentHandler = require('./static-segment-handler')

const inject = function({ name, func }) {

    return function(call, callback) {
        
        const startTime = Date.now()

        func(call, function(err, response) {

            const runTime = Date.now() - startTime

            if (err) {
                winston.error("GRPC: " + name + " " + runTime + "ms", err)
                let grpcError = {
                    code: parseInt(err.code) || 0,
                    message: err.message || "Unknown"
                }
                console.log(grpcError)
                if (callback != null && callback != undefined) {
                    return callback(grpcError)
                } else {
                    return call.emit("error", grpcError)
                }
                
            } else {
                winston.info("GRPC: " + name + " " + runTime + "ms")
                return callback(null, response)
            }
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

    Object.assign(handles, bindHandler(StaticSegmentHandler, context))


    return handles
}

module.exports = {
    build: build
}