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
            $default: null
        },
        prefix: {
        	$filter: 'env',
        	production: process.env.REDIS_PREFIX || 'kue',
        	$default: 'kue'
        }
    }
})


const criteria = {
    env: process.env.APP_ENVIRONMENT || "development"
};


module.exports = {
    get: (key) => store.get(key, criteria)
}