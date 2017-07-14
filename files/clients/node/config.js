const Confidence = require('confidence');

const store = new Confidence.Store({
    files: {
        host: process.env.FILES_V1_SERVICE_HOST || process.env.FILES_SERVICE_HOST || '0.0.0.0',
        port: process.env.FILES_V1_SERVICE_PORT || process.env.FILES_SERVICE_PORT || 5100
    }
})


module.exports = {
    get: (key) => store.get(key)
}