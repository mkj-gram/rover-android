'use strict';
const Confidence = require('confidence');


const config = new Confidence.Store({
	http: {
		port: {
			$filter: 'env',
			production: parseInt((process.env.PORT || 3000)),
			$default: 3030
		},
		host: {
			$filter: 'env',
			production: '0.0.0.0',
			$default: 'localhost'
		}
	},
	log: {
		level: {
			$filter: 'env',
			production: (process.env.LOG_LEVEL || "INFO"),
			$default: "DEBUG"
		}
	},
	memory_quota: {
		$filter: 'env',
		production: parseInt(process.env.MEMORY_QUOTA || 536870912),
		$default: 536870912
	}
});

const criteria = {
	env: ( process.env.NODE_ENV || "development" )
}

module.exports = {
	get: (key) => config.get(key, criteria)
}