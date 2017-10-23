function promisify(client) {
    Object.keys(Object.getPrototypeOf(client)).forEach(functionName => {
        const originalFunction = client[functionName]

        client[functionName] = (...args) => {

            const request = args[0]
            const opts = typeof args[1] === 'object' ? args[1] : undefined
            const callback = args[args.length - 1]

            if (callback && typeof callback === 'function') {
                args = args.slice(0, args.length - 1)
            }
            
            if (callback && typeof callback === 'function') {
                return originalFunction.call(
                    client,
                    ...args,
                    (error, response) => {
                        callback(error, response)
                    }
                )
            }
 
            return new Promise((resolve, reject) => {
                originalFunction.call(client, ...args, (error, response) => {
                    if (error) {
                        return reject(error)
                    } else {
                        return resolve(response)
                    }
                })
            })
        }
    })
}

module.exports = promisify
