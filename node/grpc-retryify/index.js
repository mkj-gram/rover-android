var retry = require('retry')

/**
 * Default retry configuration
 * @type {Object}
 */
const defaults = {
    retries: 5,
    factor: 2,
    minTimeout: 1 * 1000,
    maxTimeout: 60 * 1000,
    randomize: false,
}

/**
 * GRPC error codes which are retryable
 * @type {Array}
 */
const codes = [2, 8, 10, 13, 14]

/**
 * Checks if the error is retryable
 * @param  {Error} err 
 * @return {Boolean}
 */
function retryableError(err) {
    if (err === null || err === undefined) {
        return false
    }

    if (err.code === null || err.code === undefined) {
        return false
    }

    return codes.includes(err.code)
}

function retryify(client) {
    Object.keys(Object.getPrototypeOf(client)).forEach(functionName => {
        const originalFunction = client[functionName]

        client[functionName] = (...args) => {
            let callOpts = args[1]
            // Callback is the original callback
            let callback = args[args.length - 1]

            let overrides = typeof callOpts === 'object' && typeof callOpts['retry'] === 'object' && callOpts['retry']
            let retryOpts = Object.assign({}, defaults, overrides)

            let retryChecker = typeof overrides.on === 'function' ? overrides.on : retryableError

            let requestArgs = args
            if (typeof requestArgs[requestArgs.length - 1] === 'function') {
                // We are replacing the callback with our own
                requestArgs = requestArgs.slice(0, requestArgs.length - 1)
            }

            let operation = retry.operation(retryOpts)

            operation.attempt(function(currentAttempt) {
                originalFunction.call(client, ...requestArgs, function(err, response) {
                    
                    // Abort early if its not retryable
                    if (err && !retryChecker(err)) {
                        operation.stop()
                        return callback(err)
                    }

                    if (operation.retry(err)) {
                        return
                    }

                    return callback(err ? operation.mainError() : null, response)
                })
            })
        }
    })
}

module.exports = retryify