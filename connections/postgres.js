'use strict';

const extend = require('util')._extend;
const pg = require('pg');
const Joi = require('joi');

const optionsSchema = Joi.object().keys({
    user: Joi.string(),
    password: Joi.string(),
    database: Joi.string(),
    host: Joi.string(),
    port: Joi.number().integer(),
    max: Joi.number().integer(),
    idleTimeoutMillis: Joi.number().integer()
});

module.exports.register = function(server, connectionOptions, next) {

    const config = extend({ max: 100, idleTimeoutMillis: 30000, ssl: true }, connectionOptions);

    Joi.validate(config, optionsSchema, function(err, value) {
        if (err) {
            return next(err);
        }

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
    });
};

module.exports.register.attributes = {
    name: 'postgres'
};