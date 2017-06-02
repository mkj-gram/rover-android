const RoverApis = require("@rover/apis")
const BatchBufferedStream = require('../../lib/batch-buffered-stream')
const RedisSetStream = require('../../lib/redis-set-stream')
const uuid = require('uuid/v1')
const grpc = require('grpc')
const squel = require("squel").useFlavour('postgres')


const parseOrderQuery = function(order_by) {

    /*
        Query should be in the form of
        column asc/desc, column2 asc/desc
     */
    
    function getOrder(order) {
        if (order == null || order == undefined) {
            return "ASC"
        } else if (order.toLowerCase() == "desc") {
            return "DESC"
        } else if(order.toLowerCase() == "asc") {
            return "ASC"
        } else {
            return "ASC"
        }
    }

    const columns = order_by.split(',')

    const orderQuery = []

    columns.forEach(column => {
        const columnParts = column.split(' ')
        const columnName = columnParts[0]
        const order = getOrder(columnParts[1])

        if (columnName.length != 0) {
            orderQuery.push({ column: columnName, order: order })
        }
    })

    return orderQuery
}

const getAllStaticSegments = function(postgres, scopes, callback) {

    /*
        scopes -> {
            account_id
            order_by
            limit
            page_token
        }
     */
    
    // TODO add paging support
    
    let query = squel.select({ autoQuoteFieldNames: true }).from("static_segments")

    if (scopes.account_id) {
        query.where("account_id = ?", scopes.account_id)
    }

    if (scopes.order_by) {
        const orderQuery = parseOrderQuery(scopes.order_by)
        orderQuery.forEach(order => {
            query.order(order.column, order.order == "DESC" ? false : true)
        })
    }

    const limit = Math.min(scopes.limit, 500)

    if (limit > 0) {
        query.limit(limit)
    }

    const { text, values } = query.toParam()

    postgres.query(text, values, function(err, result) {
        if (err) {
            return callback(err)
        }

        const segments = result.rows

        return callback(null, segments)
    })

}

const findStaticSegmentById = function(postgres, redis, id, callback) {

    let query = squel.select({ autoQuoteFieldNames: true })
                    .from("static_segments")
                    .where("id = ?", id)
                    .limit(1)

    const { text, values } = query.toParam()

    postgres.query(text, values, function(err, result) {
         if (err) {
            return callback(err)
        }

        const segment = result.rows[0]

        if (segment == null || segment == undefined) {
            return callback(null, null)
        }

        if (segment.redis_set_id == null || segment.redis_set_id == undefined) {
            segment.size = 0
            return callback(null, segment)
        }

        redis.scard(segment.redis_set_id, function(err, reply) {
            if (err) {
                return callback(err)
            }

            segment['size'] = reply

            return callback(null, segment)
        })
    })
}

const createNewStaticSegment = function(postgres, segment, callback) {
    let { account_id, title } = segment

    const currentTime = new Date()

    const doc = {
        account_id: account_id,
        title: title,
        created_at: currentTime,
        updated_at: currentTime
    }

    let insert = squel.insert()
                        .into("static_segments")
                        .set("account_id", account_id)
                        .set("title", title)
                        .set("updated_at", currentTime.toISOString())
                        .set("created_at", currentTime.toISOString())
                        .returning('id')

    const { text, values } = insert.toParam()

    postgres.query(text, values, function(err, result) {
        
        if (err) {
            return callback(err)
        }

        const segmentId = result.rows[0].id

        const doc = {
            id: segmentId,
            account_id: account_id,
            type: 'static',
            redis_set_id: undefined,
            title: title,
            created_at: currentTime,
            updated_at: currentTime
        }

        return callback(null, doc)
    })
}

const deleteStaticSegment = function(postgres, id, callback) {
    

    let deleteQuery = squel.delete()
                            .from("static_segments")
                            .where("id = ?", id)

    let { text, values } = deleteQuery.toParam()
    
    postgres.query(text, values, function(err, result) {
        if (err) {
            return callback(err)
        }

        return callback(null)
    })
}

const buildTimestamp = function(date) {
    if (date instanceof Date) {
        let timestamp = new RoverApis.Models.Timestamp()
        let unixTime = date.getTime()
        timestamp.setSeconds(Math.floor(unixTime / 1000 ))
        timestamp.setNanos(((unixTime % 1000) * 1000000))

        return timestamp

    } else {
        return undefined
    }
}

const buildStaticSegmentProto = function(segment) {
    let proto = new RoverApis.segment.v1.Models.StaticSegment()
    
    proto.setId(segment.id)
    proto.setAccountId(segment.account_id)
    proto.setTitle(segment.title)
    proto.setSize(segment.size)

    if (segment.updated_at) {
        let timestamp = buildTimestamp(segment.updated_at)
        proto.setUpdatedAt(timestamp)
    }

    if (segment.created_at) {
        let timestamp = buildTimestamp(segment.created_at)
        proto.setCreatedAt(timestamp)
    }
    

    return proto

}

const listStaticSegments = function(call, callback) {

    const postgres = this.clients.postgres

    const AuthContext = call.request.getAuthContext()
    const accountId = call.request.getAccountId()

    if (accountId === 0) {
        return callback({ code: grpc.status.FAILED_PRECONDITION, message: "Account id can not be 0"})
    }

    if (AuthContext && AuthContext.getAccountId() != accountId) {
        return callback({ code: grpc.status.PERMISSION_DENIED, message: "Permission Denied" })
    }

    const order_by = call.request.getOrderBy().length == 0 ? "created_at desc" : call.request.getOrderBy()

    const scope = {
        account_id: accountId,
        order_by: order_by,
        limit: call.request.getPageSize(),
        next_page_token: call.request.getPageToken()
    }

    getAllStaticSegments(postgres, scope, function(err, segments) {
        if (err) {
            return callback(err)
        }

        const reply = new RoverApis.segment.v1.Models.ListStaticSegmentResponse()

        const segmentProtos = segments.map(buildStaticSegmentProto)

        reply.setSegmentsList(segmentProtos)

        return callback(null, reply)    
    })
}

const getStaticSegment = function(call, callback) {


    const postgres = this.clients.postgres
    const redis = this.clients.redis
    const AuthContext = call.request.getAuthContext()
    const segmentId = call.request.getId()


    findStaticSegmentById(postgres, redis, segmentId, function(err, segment) {
        if (err) {
            return callback(err)
        }

        if (segment) {

            if (AuthContext && AuthContext.getAccountId() != segment.account_id) {
                return callback({ code: grpc.status.PERMISSION_DENIED, message: "Permission Denied" })
            }

            let reply = new RoverApis.segment.v1.Models.GetStaticSegmentReply()

            const segmentProto = buildStaticSegmentProto(segment)

            reply.setSegment(segmentProto)

            return callback(null, reply)

        } else {
            /* 404 NOT_FOUND */
            return callback({ code: grpc.status.NOT_FOUND, message: "Not Found" })
        }
    })

}

const createStaticSegment = function(call, callback) {

    const postgres = this.clients.postgres

    const accountId = call.request.getAccountId()
    const title = call.request.getTitle()

    const request = {
        account_id: accountId,
        title: title
    }

    if (accountId == 0) {
        return callback({ code: grpc.status.INVALID_ARGUMENT, message: "Account ID cannot be 0" })
    }

    if (AuthContext && AuthContext.getAccountId() != accountId) {
        return callback({ code: grpc.status.PERMISSION_DENIED, message: "Permission Denied" })
    }

    createNewStaticSegment(postgres, request, function(err, segment) {

        if (err) {
            return callback(err)
        }

        let segmentProto = buildStaticSegmentProto(segment)

        let reply = new RoverApis.segment.v1.Models.CreateStaticSegmentReply()

        reply.setSegment(segmentProto)

        return callback(null, reply)
    })

}

const destroyStaticSegment = function(call, callback) {

    const postgres = this.clients.postgres
    const redis = this.clients.redis

    const id = call.request.getId()

    if (id == 0) {
        return callback({ code: grpc.status.INVALID_ARGUMENT, message: "ID cannot be 0" })
    }

    findStaticSegmentById(postgres, redis, id, function(err, segment) {
        if (err) {
            return callback(err)
        }

        if (segment == null || segment == undefined) {
            return callback({ code: grpc.status.NOT_FOUND, message: "Segment does not exist" })
        }

        if (AuthContext && AuthContext.getAccountId() != segment.account_id) {
            return callback({ code: grpc.status.PERMISSION_DENIED, message: "Permission Denied" })
        }

        deleteStaticSegment(postgres, id, function(err) {
            if (err) {
                return callback(err)
            }

            let reply = new RoverApis.segment.v1.Models.DestroyStaticSegmentReply()

            return callback(null, reply)
        })
    })
}

/* Internal RPC calls that don't need authentication */
const updateStaticSegmentPushIds = function(call, callback) {

    const redis = this.clients.redis
    const postgres = this.clients.postgres
    /*
        Metadata: {
            account_id: 1,
            segment_id: 2
        }
     */
    
    const accountId = parseInt(call.metadata.get('account_id')) || 0
    const segmentId = parseInt(call.metadata.get('static_segment_id')) || 0

    let idsAddedToSet = 0

    const scope = {}

    if (accountId != 0) {
        scope.account_id = accountId
    }

    findStaticSegmentById(postgres, redis, segmentId, scope, function(err, segment) {
        if (err) {
            return callback(err)
        }

        if (segment == null || segment == undefined) {
            return callback({ code: grpc.status.NOT_FOUND, message: "Segment not found" })
        }

        /*
            First we create a temporary set in redis to store all of our ids
         */
        const redisSetId = uuid()

        /*
            Create a batch buffered stream with a large batch size
            This ensures we won't overload redis by processing too many batches at once
            It also helps since we are limiting network round trips
         */
        const stream = new BatchBufferedStream(call, { batchSize: 10000 })

        stream.on('data', function(data, done) {

            let ids = data.map(function(d) { return d.getId() })

            /* 
                Insert the list of ids into the redis set
                Once complete we call done() to finish the batch
            */
            redis.sadd(redisSetId, ids, function(err, reply) {
                if (err) {
                    return done(err)
                }
                idsAddedToSet += reply // reply is the number of ids added to the set
                return done()
            }) 
        })

        stream.on('end', function() {

            segment.size = idsAddedToSet

            /* All batches have been inserted and processed */
            const currentTime = new Date()
            let update = squel.update()
                                .table("static_segments")
                                .set("redis_set_id", redisSetId)
                                .set("updated_at", currentTime.toISOString())
                                .where("id = ?", segment.id)
            
            const { text, values } = update.toParam()

            postgres.query(text, values, function(err, result) {
                if (err) {
                    return callback(err)
                }

                const reply = new RoverApis.segment.v1.Models.UpdateStaticSegmentIdsReply()

                reply.setSegment(buildStaticSegmentProto(segment))

                return callback(null, reply)

            })
        })

        stream.on('error', function(err) {
            /* An error occured on the stream this could be because of redis or the grpc stream */
            return callback({ code: grpc.status.INTERNAL, message: err.message })
        })

        stream.on('cancelled', function() {
            /*  
                The client for some reason cancelled the request
                this could be because it was shutdown abruptly
            */
            return callback({ code: grpc.status.CANCELLED, message: "Stream Cancelled" })
        })

    })
}

const getStaticSegmentPushIds = function(call, callback) {

    const postgres = this.clients.postgres
    const redis = this.clients.redis

    const accountId = call.request.getAccountId()
    const segmentId = call.request.getSegmentId()
    const scope = {}

    if (accountId != 0) {
        scope.account_id = accountId
    }

    findStaticSegmentById(postgres, redis, segmentId, scope, function(err, segment) {
        if (err) {
            return callback(err)
        }

        if (segment == null || segment == undefined) {
            return callback({ code: grpc.status.NOT_FOUND, message: "Segment not found" })
        }

        const redisSetId = segment.redis_set_id

        if (redisSetId == null || redisSetId == undefined) {
            return call.end()
        }

        const stream = new RedisSetStream(redis, redisSetId, 10000, {})

        var start = Date.now()

        stream.on('data', function(ids) {
            /*
                We immediatly pause the stream because well Node...
                Node won't give grpc the chance to begin streaming because it gets in a tight loop
                where its reading from redis and buffering all the write calls. We use process.nextTick
                to allow grpc to breath and begin streaming the request
             */
            stream.pause()
            ids.forEach(function(id) {
                var r = new RoverApis.segment.v1.Models.PushId()
                r.setId(id)
                call.write(r)
            })

            process.nextTick(function() { 
                stream.resume()
            })
            
        })

        stream.on('end', function() {
            return call.end()       
        })

    })    
}

module.exports = {
    listStaticSegments: listStaticSegments,
    getStaticSegment: getStaticSegment,
    createStaticSegment: createStaticSegment,
    destroyStaticSegment: destroyStaticSegment,
    updateStaticSegmentPushIds: updateStaticSegmentPushIds,
    getStaticSegmentPushIds: getStaticSegmentPushIds
}