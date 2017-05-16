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
        $default: 5100
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
        username: {
            $filter: 'env',
            production: process.env.POSTGRESQL_DB_USERNAME,
            $default: 'segment_service_dev'
        },
        password: {
            $filter: 'env',
            production: process.env.POSTGRESQL_DB_PASSWORD,
            $default: 'password'
        },
        database: {
            $filter: 'env',
            production: process.env.POSTGRESQL_DB_DATABASE,
            $default: 'segment_service_dev'
        },
        host: {
            $filter: 'env',
            production: process.env.POSTGRESQL_DB_HOST,
            $default: 'localhost'
        },
        port: {
            $filter: 'env',
            production: process.env.POSTGRESQL_DB_PORT,
            $default: 5432
        },
        ssl: {
            enabled: {
                $filter: 'env',
                production: true,
                $default: false
            },
            cert: {
                $filter: 'env',
                production: process.env.POSTGRESQL_DB_SSL_CERT,
                default: null
            }
        }
    }
})


const criteria = {
    env: process.env.APP_ENVIRONMENT || "development"
};


module.exports = {
    get: (key) => store.get(key, criteria)
}