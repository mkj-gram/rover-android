'use strict';

const util = require('util');
const Mongodb = require('mongodb');
const Joi = require('joi');
const MongoClient = Mongodb.MongoClient;
const ObjectID = Mongodb.ObjectID;


module.exports.register = function(server, options, next) {
	
	const url = options.urls;
	// TODO
	// validate connection string
	let mongoConfig = util._extend({ sslValidate: false }, options); 

	if (!util.isNullOrUndefined(mongoConfig.sslCertFile)) {
		mongoConfig.ssl = true
		mongoConfig.sslCert = [fs.readFileSync(path.join(process.cwd(), sslCert))];
		delete mongoConfig['sslCertFile'];
	}

	MongoClient.connect(url, { mongos: mongoConfig }, function(err, db) {
		
		if (err) {
			return next(err);
		}
		server.expose('client', db);
		server.expose('ObjectId', ObjectID);
		next();
	});

};

module.exports.register.attributes = {
	name: 'mongodb',
};