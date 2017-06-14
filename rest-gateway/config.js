'use strict';

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
        $default: 3100
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
});

const criteria = {
    env: process.env.APP_ENVIRONMENT || "development"
};


module.exports = {
    get: (key) => store.get(key, criteria)
}