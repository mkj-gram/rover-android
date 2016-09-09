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
        }

    },
    elasticsearch: {
        hosts: {
            $filter: 'env',
            production: process.env.ELASTICSEARCH_URLS,
            $default: "127.0.0.1:9200"
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
});

const criteria = {
    env: process.env.NODE_ENV || "development"
};


module.exports = {
    get: (key) => store.get(key, criteria)
}