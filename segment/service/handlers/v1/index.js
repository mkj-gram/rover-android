const winston = require('winston')
const StaticSegmentHandler = require('./static-segment-handler')
const newrelic = require('newrelic')
const Config = require("../../config")

let Raven = null

if (Config.get('/raven/enabled')) {
    Raven = require('raven')
}

const inject = function({ name, func }) {

    return function(call, callback) {
        
        const startTime = Date.now()

        func(call, newrelic.createWebTransaction(name, function(err, response) {

            newrelic.endTransaction()

            const runTime = Date.now() - startTime

            if (err) {

                /*
                    Only log errors which are Nodejs Errors
                    gRPC validation errors are objects
                */
                if (err instanceof Error && Raven != null) {
                    Raven.captureException(err)
                }

                winston.error("GRPC: " + name + " " + runTime + "ms", err)

                let grpcError = {
                    code: parseInt(err.code) || 0,
                    message: err.message || "Unknown"
                }
                
                console.error(grpcError)

                if (callback != null && callback != undefined) {
                    return callback(grpcError)
                } else {
                    return call.emit("error", grpcError)
                }
                
            } else {
                winston.info("GRPC: " + name + " " + runTime + "ms")
                return callback(null, response)
            }
        }))
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