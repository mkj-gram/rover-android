
import request from 'request'
import lruCache from 'lru-cache'

class CachedRequest {

    constructor(options) {
        this._request = request.defaults(options);

        // TODO: add size options
        this._httpCache = lruCache({ max: 500 })
    }


    get(options, callback) {
        const uri = options.uri
        const cachedResponse = this._httpCache.get(uri)

        if (cachedResponse) {
            return process.nextTick(function() {
                return callback(null, cachedResponse.response, cachedResponse.body)
            })
        }

        this._request(options, (err, response, body) => {
            if (err) {
                return callback(err, response, body)
            }

            if (response.statusCode == 200) {
                const cacheControl = response.headers['cache-control'] || ""
                const maxAgeMatch = cacheControl.match(/max\-age\=(\d+)/)
                const maxAge = maxAgeMatch ? parseInt(maxAgeMatch[1]) : 0

                if (maxAge > 0) {
                    const cacheableResponse = {
                        response: response,
                        body: body
                    }

                    this._httpCache.set(uri, cacheableResponse, maxAge * 1000)
                }
            }

            return callback(err, response, body)
        })
    }
}

export default CachedRequest