const redis     = require('redis')
const through2  = require('through2')

const MongoClient   = require('mongodb').MongoClient
const ObjectId      = require('mongodb').ObjectId
const ScanStream    = require('./lib/redis-scan')

const client1   = redis.createClient(process.env.REDIS_URL)
const client2   = redis.createClient(process.env.COPY_REDIS_URL)
const mongoDSN  = process.env.MONGO_DSN

const isInbox = new RegExp(/^inbox\_(\w{24})$/)
const isCacheKey = new RegExp(/^inbox\_(\w{24})\_updated\_at$/)

const scanner = new ScanStream(client1, 1000, {})

MongoClient.connect(mongoDSN, function(err, db) {

    if (err) {
        throw err
    }

    const collection = db.collection('devices');

    scanner.pipe(through2({ objectMode: true }, function(chunk, enc, callback) {
        let self = this
        let inboxes = chunk.filter(key => key.match(isInbox))
        let cacheKeys = chunk.filter(key => key.match(isCacheKey))
        let profileIds = inboxes.map(key => new ObjectId(key.match(isInbox)[1]))

        let inboxBatch = inboxes.reduce(function(batch, key) {
            return batch.lrange(key, 0, -1)
        }, client1.batch())

        inboxBatch.exec(function(err, replies) {
            if (err) {
                return callback(err)
            }

            const inboxData = replies.reduce(function(index, data, i) {
                index[inboxes[i]] = data
                return index
            }, {})
            
            collection.find({ profile_id: {"$in" : profileIds }}, { fields: ["device_id", "account_id", "profile_id"] }).toArray(function(err, docs) {
                if (err) {
                    return callback(err)
                }

                let chunk = []
                docs.forEach(function(doc) {
                    chunk.push({ key: `${doc.account_id}:${doc.device_id}`, data: inboxData[`inbox_${doc.profile_id.toString()}`]})
                })
                
                self.push(chunk)

                return callback()
            })

            
        })
        
        
    }))
    .pipe(through2({ objectMode: true }, function(chunk, enc, callback) {

        let transfer = chunk.reduce(function(batch, data) {
            return batch
                        // .del(data.key)
                        .rpush(data.key, ...data.data)
        }, client2.batch())

        transfer.exec(function(err, replies) {
            if (err) {
                return callback(err)
            }

            return callback()
        })
       
    }))
    .resume()
    .on('end', function() {
        console.log("FINISHED!")
        process.exit(0)
    })
})