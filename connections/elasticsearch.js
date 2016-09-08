'use strict';

const util = require('util');
const elasticsearch = require('elasticsearch');
const Joi = require('joi');


module.exports.register = function(server, options, next) {
    
    const client = new elasticsearch.Client(options);

    client.ping({}, function(err) {
        if (err) {
            return next(err);
        }

        server.expose('client', client);
        next();
    });

};

module.exports.register.attributes = {
    name: 'elasticsearch',
};