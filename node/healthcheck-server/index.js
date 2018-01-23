const http = require('http')

function HealthCheckServer(/* hostname?: string, port: int */) {
    if (!(this instanceof HealthCheckServer)) {
        return new HealthCheckServer(port)
    }

    if (typeof arguments[0] === 'string') {
        this._host = arguments[0]
        this._port = parseInt(arguments[1]) || 8080
    } else {
        this._host = "0.0.0.0"
        this._port = parseInt(arguments[0]) || 8080
    }

    

    this._clearConditionals()

    this._server = http.createServer(this._handleRequest.bind(this))
    this._serverIsListening = false
}



HealthCheckServer.prototype.on = function(name, conditionFunction) {
    if (name === 'readiness' || name === 'liveliness') {
        this._conditionals[name].push(conditionFunction)
    } else {
        console.warn("[HealthCheckServer] added unsuported conditional check " + name)
    }
}


HealthCheckServer.prototype.start = function() {
    if (!this._serverIsListening) {
        this._serverIsListening = true

        let self = this

        this._server.listen(this._port, this._host, function(err) {
            if (err) {
                self._serverIsListening = false
                return console.error(err)
            }

            return
        })
    }
}

HealthCheckServer.prototype.close = function(callback) {
    if (this._serverIsListening) {
        this._serverIsListening = false
        this._server.close(function() {
            if (typeof callback === 'function') {
                return callback();
            }
        })
    }
}


/*
    Helper Test Functions
 */

HealthCheckServer.prototype._clearConditionals = function() {
    this._conditionals = {
        readiness: [],
        liveliness: []
    }
};

/*
    Private Functions
*/


HealthCheckServer.prototype._handleRequest = function(req, res) {
    if (req.url === '/readiness') {
        this._checkConditionals('readiness', function(err) {
            res.writeHead(err === null || err === undefined ? 200 : 404)
            return res.end()
        })
        
    } else if (req.url === '/liveliness') {
        this._checkConditionals('liveliness', function(err) {
            res.writeHead(err === null || err === undefined ? 200 : 404)
            return res.end()
        })
    } else {
        res.writeHead(404)
        return res.end()
    }
};


HealthCheckServer.prototype._checkConditionals = function(name, cb) {
    let conditionalFunctions = this._conditionals[name]

    // Check each conditional function one by one. Break checks early if a callback returns an error
    conditionalFunctions.reduceRight(function(chain, fn) {
        return function(err) {
            if (err !== null && err !== undefined) {
                return cb(err) 
            }
            return fn(chain)
        }
    }, cb)()
};

module.exports = HealthCheckServer