const http = require('http')

function HealthCheckServer(/* hostname?: string, port: int */) {
    if (!(this instanceof HealthCheckServer)) {
        return new HealthCheckServer(port)
    }

    if (typeof arguments[0] === 'string') {
        this._host = arguments[0]
        this._port = parseInt(porarguments[1]) || 8080
    } else {
        this._host = "localhost"
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

HealthCheckServer.prototype.close = function() {
    if (this._serverIsListening) {
        this._serverIsListening = false
        this._server.close()
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
        let isReady = this._checkConditionals('readiness')
        res.writeHead(isReady == true ? 200 : 404)
    } else if (req.url === '/liveliness') {
        let isAlive = this._checkConditionals('liveliness')
        res.writeHead(isAlive == true ? 200 : 404)
    } else {
        res.writeHead(404)
    }

    return res.end()
};


HealthCheckServer.prototype._checkConditionals = function(name) {
    let conditionalFunctions = this._conditionals[name]

    var passed = true

    for (var i = 0; i < conditionalFunctions.length; i++) {
        let func = conditionalFunctions[i]
        if (func() !== true) {
            passed = false
            break
        }
    }
    return passed
};

module.exports = HealthCheckServer