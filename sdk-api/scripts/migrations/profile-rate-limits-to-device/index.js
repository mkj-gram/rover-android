const redis     = require('redis')
const through2  = require('through2')

const MongoClient   = require('mongodb').MongoClient
const ObjectId      = require('mongodb').ObjectId
const ScanStream    = require('./lib/redis-scan')

const client1   = redis.createClient(process.env.REDIS_URL)
const client2   = redis.createClient(process.env.COPY_REDIS_URL)
const mongoDSN  = process.env.MONGO_DSN

const isMessageRateLimit = new RegExp(/^msgrl_(\w{24}):(\d*)$/)


const scanner = new ScanStream(client1, 1000, { match: "msgrl_*:*"})

MongoClient.connect(mongoDSN, function(err, db) {

    if (err) {
        throw err
    }

    const collection = db.collection('devices');

    scanner.pipe(through2({ objectMode: true }, function(chunk, enc, callback) {
        let self = this

        let limitKeys = chunk.filter(key => key.match(isMessageRateLimit))
        let profileIds = limitKeys.map(key => new ObjectId(key.match(isMessageRateLimit)[1]))

        let limitReadBatch = limitKeys.reduce(function(batch, key) {
            return batch.zrange(key, 0, -1)
        }, client1.batch())

        // msgrl_(57d51086e35e160043b739ec):(597)
        
        // Read all the data from the rate limits already stored
        limitReadBatch.exec(function(err, replies) {
            if (err) {
                return callback(err)
            }

            if (replies.length == 0) {
                return callback()
            }

            /*
                limitData = 
                {
                    57d51086e35e160043b739ec: {
                        597: { 1:1, 2:2, 3:3 }
                        771: { 3:3, 3:3, 2:2 }
                    }
                }
             */
            const limitData = replies.reduce(function(index, data, i) {
                let key = limitKeys[i]
                let profileId = key.match(isMessageRateLimit)[1]
                let messageTemplateId = key.match(isMessageRateLimit)[2]

                if (!index[profileId]) {
                    index[profileId] = {}
                }

                index[profileId][messageTemplateId] = data
                return index
            }, {})
            
            // Look up currently associated devices to the profiles that match
            collection.find({ profile_id: {"$in" : profileIds }}, { fields: ["device_id", "account_id", "profile_id"] }).toArray(function(err, docs) {
                if (err) {
                    return callback(err)
                }

                let chunk = []
                docs.forEach(function(doc) {
                    let profileId = doc.profile_id.toString()
                    let dataIndex = limitData[profileId]
                    Object.keys(dataIndex).forEach(key => {
                        let data = dataIndex[key]
                        chunk.push({ key: `${doc.account_id}:${doc.device_id}:${key}`, data: data })
                    })
                })
                
                self.push(chunk)

                return callback()
            })

            
        })
        
        
    }))
    .pipe(through2({ objectMode: true }, function(chunk, enc, callback) {

        let transfer = chunk.reduce(function(batch, data) {
            data.data.forEach(d => {
                batch.zadd(data.key, d, d)
            })
            return batch
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