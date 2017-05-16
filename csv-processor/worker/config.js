const Confidence = require('confidence');

const store = new Confidence.Store({
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