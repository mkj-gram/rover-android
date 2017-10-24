const http   = require('http')
const Router = require('./routes')
const Config = require('./config')
const express = require('express')

const app = express()

function normalizePort() {

    let port = parseInt(Config.get('/port'))

    if (isNaN(port)) {
        return 3000
    }

    return port
}

/*
    Initialize all routes
*/
Router(function(err, router) {
    if (err) {
        console.error(err)
        process.exit(1)
    }

    app.use(router)
    
    const port = normalizePort()

    app.listen(port, function () {
        console.log('Bulk-Gateway listening on port: ' + port)
    })

})