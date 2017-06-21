const Confidence = require('confidence');

const store = new Confidence.Store({
    job: {
        timeout: {
            $filter: 'env',
            production: parseInt(process.env.JOB_TIMEOUT) || 1000 * 60 * 10, // 10 mins
            $default: 1000 * 60 * 10 // 10 mins
        },
        concurrency: {
            $filter: 'env',
            production: parseInt(process.env.JOB_CONCURRENCY) || 5,
            $default: 5
        }
    },
    raven: {
        enabled: {
            $filter: 'env',
            production: process.env.RAVEN_ENABLED === 'true',
            $default: false
        },
        dsn: {
            $filter: 'env',
            production: process.env.RAVEN_DSN,
            $default: ''
        }
    },
    redis: {
        url: {
            $filter: 'env',
            production: process.env.REDIS_URL,
            $default: null
        },
        prefix: {
        	$filter: 'env',
        	production: process.env.REDIS_PREFIX || 'bull',
        	$default: 'bull'
        }
    }
})


const criteria = {
    env: process.env.APP_ENVIRONMENT || "development"
};


module.exports = {
    get: (key) => store.get(key, criteria)
}