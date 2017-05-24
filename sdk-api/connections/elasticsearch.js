'use strict';

const util = require('util');
const elasticsearch = require('elasticsearch');
const Joi = require('joi');
const ElasticsearchQueue = require('../lib/elasticsearch-queue');
const Config = require('../config');

module.exports.register = function(server, options, next) {
    
    const client = new elasticsearch.Client(options);

    client.ping({}, function(err) {
        if (err) {
            return next(err);
        }

        server.connections.elasticsearch = {};
        server.connections.elasticsearch.client = client;

        let queue = new ElasticsearchQueue(client, Config.get('/elasticsearch/flush_interval'), 250);
        queue.start();

        server.connections.elasticsearch.queue = queue;
        
        next();
    });

};

module.exports.register.attributes = {
    name: 'elasticsearch',
};