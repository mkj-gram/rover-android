const Confidence = require('confidence');

const store = new Confidence.Store({
    host: {
        $filter: 'env',
        production: '0.0.0.0',
        $default: '0.0.0.0'
    },
    port: {
        $filter: 'env',
        production: process.env.PORT,
        $default: process.env.PORT || 5100
    },
    redis: {
        url: {
            $filter: 'env',
            production: process.env.REDIS_URL,
        },
        prefix: {
            $filter: 'env',
            production: process.env.REDIS_PREFIX,
            $default: 'segment-service'
        }
    },
    postgres: {
        dsn: {
            $filter: 'env',
            production: process.env.POSTGRESQL_DSN,
            $default: "postgres://postgres:@localhost:5432/segment_service_dev?sslmode=disable"
        }
    },
    raven: {
        enabled: {
            $filter: 'env',
            production: process.env.RAVEN_ENABLED == 'true',
            $default: false
        },
        dsn: {
            $filter: 'env',
            production: process.env.RAVEN_DSN,
            $default: ''
        }
    }
})


const criteria = {
    env: process.env.APP_ENVIRONMENT || "development"
};


module.exports = {
    get: (key) => store.get(key, criteria)
}