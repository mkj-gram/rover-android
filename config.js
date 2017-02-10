'use strict';

const Confidence = require('confidence');

const store = new Confidence.Store({
    connection: {
        host: {
            $filter: 'env',
            production: '0.0.0.0',
            $default: '0.0.0.0'
        },
        port: {
            $filter: 'env',
            production: process.env.PORT,
            $default: 3100
        }
    },
    redis: {
        url: {
            $filter: 'env',
            production: process.env.REDISCLOUD_URL,
        }
    },
    mongo: {
        urls: {
            $filter: 'env',
            production: process.env.MONGODB_URI,
            $default: 'mongodb://localhost:27017/rover-local'
        },
        sslCertFile: {
            $filter: 'env',
            production: process.env.MONGODB_SSL_CERT
        }
    },
    postgres: {
        username: {
            $filter: 'env',
            production: process.env.POSTGRESQL_DB_USERNAME,
            $default: 'rover_development'
        },
        password: {
            $filter: 'env',
            production: process.env.POSTGRESQL_DB_PASSWORD,
            $default: 'password1'
        },
        database: {
            $filter: 'env',
            production: process.env.POSTGRESQL_DB_DATABASE,
            $default: 'rover-local'
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
            $filter: 'env',
            production: true,
            $default: false
        }

    },
    elasticsearch: {
        hosts: {
            $filter: 'env',
            production: process.env.ELASTICSEARCH_URLS,
            $default: "127.0.0.1:9200"
        },
        flush_interval: {
            $filter: 'env',
            production: parseInt(process.env.ELASTICSEARCH_FLUSH_INTERVAL) || 60000,
            $default: 30000
        },
        log: 'info'
    },
    amqp: {
        url: {
            $filter: 'env',
            production: process.env.CLOUDAMQP_URL,
            $default: 'amqp://localhost'
        }
    },
    raven: {
        enabled: {
            $filter: 'env',
            production: process.env.RAVEN_ENABLED === undefined ? true : Boolean(process.env.RAVEN_ENABLED),
            $default: false
        },
        url: {
            $filter: 'env',
            production: 'https://4b0fe3b746964332954978480ac2c03c:eba7ea90434a4c68953ba5619a35a144@sentry.io/100292'
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
            $default: "c7696e27af3b14c91fdfa5eafbe8854dbdbbe57aa1af2fea2b536b6d3ed8f2b0"
        },
        prefix: {
            $filter: 'env',
            production: (process.env.LIBRATO_PREFIX || "production") + ".",
            $default: "development" + "."
        }
    },
    cruncher_buffer_client: {
        host: {
            $filter: 'env',
            production: process.env.CRUNCHER_BUFFER_CLIENT_IP || '127.0.0.1',
            $default: '127.0.0.1'
        },
        port: 24284
    },
    log: {
        level: {
            $filter: 'env',
            production: process.env.LOG_LEVEL || 'info',
            $default: 'debug'
        }
    }
});

const criteria = {
    env: process.env.NODE_ENV || "development"
};


module.exports = {
    get: (key) => store.get(key, criteria)
}