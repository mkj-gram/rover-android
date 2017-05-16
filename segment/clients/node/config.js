const Confidence = require('confidence');

const store = new Confidence.Store({
    segment: {
        host: process.env.SEGMENT_V1_SERVICE_HOST || '0.0.0.0',
        port: process.env.SEGMENT_V1_SERVICE_PORT || 5100
    }
})


module.exports = {
    get: (key) => store.get(key)
}