const util = require('util')

const formatArguments = function() {

}

class PrefixedLogger {

    constructor(prefix) {
        this._prefix = `[${prefix}]`
    }

    info() {
        let args = Array.from(arguments)
        args.unshift(this._prefix)
        console.info.apply(this, args)
    }

    debug(message) {
        let args = Array.from(arguments)
        args.unshift(this._prefix)
        console.log.apply(this, args)
    }

    warn(message) {
        let args = Array.from(arguments)
        args.unshift(this._prefix)
        console.warn.apply(this, args)
    }

    error() {
        let args = Array.from(arguments)
        args.unshift(this._prefix)
        console.error.apply(this, args)
    }
}



module.exports = PrefixedLogger