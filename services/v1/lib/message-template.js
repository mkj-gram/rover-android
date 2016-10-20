'use strict';

const util = require('util');
const LRU = require('lru-cache');
const async = require('async');

const internals = {};

const templateCacheOptions = { 
    max: 1000, // can store upto 1000 templates in memory 
    length: function(n, key) { return 1; }
};

const templateCache = LRU(templateCacheOptions);

internals.getById = function(server, id, callback) {
    const logger = server.plugins.logger.logger;
    const postgres = server.connections.postgres.client;

	postgres.connect((err, client, done) => {
    	if (err) {
    		return callback(err);
    	}

    	client.query({
    		text: 'SELECT  "message_templates".* FROM "message_templates" WHERE "message_templates"."id" = $1 LIMIT 1',
            values: [id],
            name: 'find-message-template-by-id'
    	}, function(err, result) {
    		done();

    		if (err) {
    			return callback(err);
    		}

    		const template = result.rows[0];

    		return callback(null, template);
    	});
    });   
}

internals.find = function(id, args, callback) {
	const server = this;
	const logger = server.plugins.logger.logger;

    logger.debug(`Service: [message-template.find: ${id}] ` + util.inspect(args, true, null, false));

    if (args && args.useCache == true) {
    	let cacheKey = id.toString();
    	if (!templateCache.has(cacheKey)) {
    		internals.getById(server, id, (err, template) => {
    			if (err) {
    				return callback(err);
    			}
    			templateCache.set(cacheKey, template);
    			return callback(null, template);
    		});
    	} else {
    		return callback(null, templateCache.get(cacheKey));
    	}
    } else {
    	return internals.getById(server, id, callback);
    }
};

internals.findAll = function(ids, args, callback) {
	const server = this;
	const methods = server.methods;

	let findOperations = ids.map(id => function(callback) {
		return methods.messageTemplate.find(id, args, callback);
	});


	async.parallel(findOperations, (err, results) => {
		if (err) {
			return callback(err);
		}
		
		return callback(null, results.filter(template => !util.isNullOrUndefined(template)));
	});

	
    // TODO:
    // implement batch get instead of single gets
};


module.exports = {
    find: internals.find,
    findAll: internals.findAll,
}



