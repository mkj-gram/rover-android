const util = require('util');
const log4js = require('log4js');
const logger = log4js.getLogger('[ElasticsearchQueue]');


logger.setLevel("DEBUG");

class ElasticsearchQueue {

    constructor(client, interval, maximumSize) {
        this._client = client;
        this._interval = interval;
        this._max = maximumSize;
        this._flushing = false;
        this._queue = {};
        this._time = null;
    }

    index({ index, type, id, body, version }) {
        if (util.isNullOrUndefined(this._queue[id]) || this._queue[id] && version > this._queue[id].index._version) {
            this._queue[id] = {
                index: { _index: index, _type: type, _id: id, _version: version, _version_type: 'external' },
                body: body
            }
        }
    }

    delete({ index, type, id, version }) {
        this._queue[id] = {
            delete: { _index: index, _type: type, _id: id, _version: version, _version_type: 'external' }
        }
    }

    start() {
        if (util.isNullOrUndefined(this._timer)) {
            logger.info("Started with flush interval " + this._interval + "ms");
            this._timer = setInterval(this.flush.bind(this), this._interval);
        }
    }

    stop() {
        if (this._timer) {
            logger.info("Stopped");
            clearInterval(this._timer);
            this._timer = null;
        }
    }

    flush(callback) {
        

        let requestQueue = this._queue;
        this._queue = {};

        let bulk = [];
        
        Object.keys(requestQueue).forEach(key => {
            let request = requestQueue[key];
            if (request.index) {
                bulk.push({
                    index: request.index
                });
                bulk.push(request.body);
            } else if (request.delete) {
                bulk.push({
                    delete: request.delete
                });
            }
        });

        if (bulk.length == 0) {
            if (util.isFunction(callback)) {
                return callback();
            }
            return;
        }

        logger.info("Flushing queue");
        
        this._client.bulk({ body: bulk }, (err, response) => {
            if (err) {
                logger.error(err);
            }

            logger.info("Bulk request finished");

            if (util.isFunction(callback)) {
                return callback();
            }
        });

        return;
    }
}

module.exports = ElasticsearchQueue;