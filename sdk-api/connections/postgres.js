'use strict';

const extend = require('util')._extend;
const pg = require('pg').native;

module.exports.register = function(server, connectionOptions, next) {

    const config = extend({ max: 10, idleTimeoutMillis: 30000 }, connectionOptions);

    console.log(config)
    
    const pool = new pg.Pool(config);

    pool.connect((err, cient, done) => {
        if (err) {
            return next(err);
        }
        done();
        server.connections.postgres = {};
        server.connections.postgres.client = pool;
        next();
    });

};

module.exports.register.attributes = {
    name: 'postgres'
};