'use strict';

const extend = require('util')._extend
const pg = require('pg')

module.exports.register = function(server, connectionOptions, next) {

    const config = extend({ max: 10, idleTimeoutMillis: 30000, ssl: true }, connectionOptions)

    const pool = new pg.Pool(config)

    pool.connect((err, cient, done) => {
        if (err) {
            return next(err)
        }
        done()
        server.connections.postgres = {}
        server.connections.postgres.client = pool
        return next()
    })

};

module.exports.register.attributes = {
    name: 'postgres'
};