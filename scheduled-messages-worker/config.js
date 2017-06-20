var Confidence = require('confidence');

var store = new Confidence.Store({
	amqp: {
		url: {
			$filter: 'env',
			production: process.env.CLOUDAMQP_URL,
			$default: 'amqp://localhost'
		}
	},
	elasticsearch: {
        hosts: {
            $filter: 'env',
            production: (process.env.ELASTICSEARCH_URLS || '').split(','),
            $default: "127.0.0.1:9200"
        },
        flush_interval: {
            $filter: 'env',
            production: parseInt(process.env.ELASTICSEARCH_FLUSH_INTERVAL) || 60000,
            $default: 30000
        },
        log: 'info'
    },
	mongo: {
		urls: {
			$filter: 'env',
			production: process.env.MONGODB_URI,
			$default: 'mongodb://localhost:27017/rover-local'
		},
		sslCert: {
			$filter: 'env',
			production: process.env.MONGODB_SSL_CERT
		}
	},
	redis: {
		url: {
			$filter: 'env',
			production: process.env.REDIS_URL,
		}
	},
	librato: {
		email: {
			$filter: 'env',
			production: process.env.LIBRATO_EMAIL,
			$default: "sean@rover.io"
		},
		token: {
			$filter: 'env',
			production: process.env.LIBRATO_TOKEN,
			$default: "b1aabade40ac7752e94f687929e37cb05d54c4dc89559ee0f2e590861bb4f368"
		},
		prefix: {
			$filter: 'env',
			production: (process.env.LIBRATO_PREFIX || "production") + ".",
			$default: "development" + "."
		}
	},
	worker: {
		concurrency: {
			$filter: 'env',
			production: (isNaN(process.env.WORKER_CONCURRENCY) ? 1 : parseInt(process.env.WORKER_CONCURRENCY)),
			$default: 1
		},
		batch_size: {
			$filter: 'env',
			production: (parseInt(process.env.WORKER_BATCH_SIZE) || 5000),
			$default: 10000
		},
		read_batch_size: {
			$filter: 'env',
			production: (parseInt(process.env.WORKER_READ_BATCH_SIZE) || 500),
			$default: 500
		},
		apns_concurrency: {
			$filter: 'env',
			production:  (parseInt(process.env.WORKER_APNS_CONCURRENCY) || 30),
			$default: 30
		}
	},
	raven: {
		enabled: {
			$filter: 'env',
			production: process.env.RAVEN_ENABLED === undefined ? true : Boolean(process.env.RAVEN_ENABLED),
			$default: false
		},
		url: 'https://0930fbc1dc134f6588ff76b633a02ac0:cdcce6d6a22e408b96a6d5d679940368@app.getsentry.com/85918'
	},
	cruncher_buffer_client: {
        host: {
            $filter: 'env',
            production: process.env.CRUNCHER_BUFFER_CLIENT_HOST || '127.0.0.1',
            $default: '127.0.0.1'
        },
        port: 24284
    },
	log: {
		level: {
			$filter: 'env',
			production: (process.env.LOG_LEVEL || "INFO"),
			$default: "debug"
		}
	}
});


const criteria = {
	env: process.env.NODE_ENV
};

exports.get = function(key) {
	return store.get(key, criteria);
}