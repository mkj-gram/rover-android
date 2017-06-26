'use strict';

const Config = require('./config');
const bwipjs = require('bwip-js');
const http = require('http');
const url  = require('url');
const LRUCache = require('lru-cache');
const util = require('util');

const log4js = require('log4js');
const logger = log4js.getLogger('app');


const maxMemory = parseInt(Config.get('/memory_quota') * 0.7);
const MegaByteRatio = 1048576;
const KiloByteRatio = 1024;

logger.info("Cache memory limit: " + ( maxMemory / MegaByteRatio ).toFixed(2) + " MB");

const cache = LRUCache({
	max: maxMemory ,
	length: function(item, key) { return item.length },
	dispose: function(key, item) { logger.info("Freeing memory: " + key + " size: " + item.length) }

});
logger.setLevel(Config.get('/log/level'));

const getBarcode = (options) => {
	return new Promise((resolve, reject) => {
		const optionsCacheKey = JSON.stringify(options);
		const cachedBarcode = cache.get(optionsCacheKey);
		if (cachedBarcode) {
			resolve(cachedBarcode);
		} else {
			logger.info("Generating PNG for " + optionsCacheKey);
			options = util._extend(options, { sizelimit: "750*750" });
			bwipjs.toBuffer(options, (err, png) => {
				if (err) {
					logger.error("Failed to generate PNG for " + optionsCacheKey);
					logger.error(err);
					return reject(err);
				}
				logger.info("Generated barcode of size: " + (png.length / KiloByteRatio).toFixed(2) + "KB");
				cache.set(optionsCacheKey, png);
				logger.info("Size of cache: " + (cache.length / MegaByteRatio).toFixed(3) + "MB");
				resolve(png)
			});
		}
	});
}

logger.info("Sarting Server");

const server = http.createServer(function(req, res) {
	if (req.method == 'GET') {
		logger.info("GET " + req.url);
		const options = url.parse(req.url, true).query;
		for (var id in options) {
			if (options[id] === '')
				options[id] = true;
		}

		const parsedOptions = {
			bcid: options.type,
			text: options.text,
			scaleX: parseInt(options.scaleX) || 2,
			scaleY: parseInt(options.scaleY) || 2
		}

		if (util.isNullOrUndefined(parsedOptions.bcid)){
			res.writeHead(400, {"Content-Type": "application/json"})
			res.end(JSON.stringify({status: 400, error: 'type is missing'}));
		} else if(util.isNullOrUndefined(parsedOptions.text)) {
			res.writeHead(400, {"Content-Type": "application/json"})
			res.end(JSON.stringify({status: 400, error: 'text is missing'}));
		} else {
			getBarcode(parsedOptions).then(png => {
				res.setHeader("Cache-Control", "public, max-age=2592000");
			    res.setHeader("Expires", new Date(Date.now() + 2592000000).toUTCString());
			    res.setHeader("Access-Control-Allow-Origin", "*");
			    res.writeHead(200);
				res.end(png, 'binary');
			}).catch(error => {
				res.writeHead(500, {"Content-Type": "application/json"});
				res.end(JSON.stringify({status: 500, error: error}));
			});
		}
	} else {
		logger.warn("Request: " + req.path + " method: " + req.method + " not supported");
	}
});

server.listen(Config.get('/http/port'), function() {
	logger.info("Server listening on: http://localhost:%s", Config.get('/http/port'));
});










