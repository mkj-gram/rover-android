'use strict';

const util = require('util');
const Mongodb = require('mongodb');
const Joi = require('joi');
const MongoClient = Mongodb.MongoClient;
const ObjectID = Mongodb.ObjectID;
const fs = require('fs');
const path = require('path');

module.exports.register = function(server, options, next) {
    
    const url = options.urls;
    // TODO
    // validate connection string
    let mongoConfig = util._extend({ sslValidate: false, poolSize: 25 }, options); 

    if (!util.isNullOrUndefined(mongoConfig.sslCertFile)) {
        mongoConfig.ssl = true
        mongoConfig.sslCert = [fs.readFileSync(path.join(process.cwd(), mongoConfig.sslCertFile))];
        delete mongoConfig['sslCertFile'];
    }

    MongoClient.connect(url, mongoConfig, function(err, db) {
        
        if (err) {
            return next(err);
        }
        server.connections.mongodb = {};
        server.connections.mongodb.client = db;
        server.connections.mongodb.ObjectId = ObjectID;
        
        next();
    });

};

module.exports.register.attributes = {
    name: 'mongodb',
};