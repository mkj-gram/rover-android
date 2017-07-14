const util = require('util')

class PrefixedLogger {

    constructor(prefix) {
        this._prefix = `[${prefix}]`
    }

    info() {
        let args = Array.from(arguments)
        args.unshift(this._prefix)
        console.info.apply(console, args)
    }

    debug(message) {
        let args = Array.from(arguments)
        args.unshift(this._prefix)
        console.log.apply(console, args)
    }

    warn(message) {
        let args = Array.from(arguments)
        args.unshift(this._prefix)
        console.warn.apply(console, args)
    }

    error() {
        let args = Array.from(arguments)
        args.unshift(this._prefix)
        console.error.apply(console, args)
    }
}



module.exports = PrefixedLogger