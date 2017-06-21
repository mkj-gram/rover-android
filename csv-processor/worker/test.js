const Queue = require('bull')
const Config = require('./config')

const staticSegmentQueue = Queue('static-segments', Config.get('/redis/url'))


staticSegmentQueue.add('load-static-segment', 
{
    "type": 0,
    "auth_context": {
        "account_id": 65,
        "user_id": 0,
        "scopes": ["server"]
    },
    "account_id": 65,
    "segment_id": 108,
    "gcs_file": {
        "project_id": "rover-production",
        "bucket": "bulk-gateway-uploads",
        "file_id": "c284c7252329568afdf6b965e1df33e38e52ab6e886bd5a39475e21b1bcbbe53.csv"
    }
})