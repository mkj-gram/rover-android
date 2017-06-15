const RoverApis = require("@rover/apis")
const BatchBufferedStream = require('../../lib/batch-buffered-stream')
const RedisBatchRead = require('../../lib/redis-batch-read')
const uuid = require('uuid/v1')
const grpc = require('grpc')
const squel = require("squel").useFlavour('postgres')

const AllowedScopes = ['internal', 'server', 'admin']

const hasAccess = function(authContext) {
    if (authContext == null || authContext == undefined) {
        return false
    }

    const currentScopes = authContext.getPermissionScopesList()

    if (!currentScopes.some(scope => AllowedScopes.includes(scope))) {
        return false
    }

    return true
}

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

const getAllStaticSegments = function(postgres, redis, scopes, callback) {

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

        const populatedSegments = segments.filter(segment => segment.redis_set_id)
        const redisSetIds = populatedSegments.map(segment => segment.redis_set_id)

        multi = redis.multi()

        redisSetIds.forEach(setId => {
            multi.scard(setId)
        })

        multi.exec(function(err, replies) {
            if (err) {
                return callback(err)
            }

            populatedSegments.forEach((segment, index) => {
                segment.size = replies[index]
            })

            return callback(null, segments)
        })

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

const destroyStaticSegment = function(postgres, id, callback) {
    

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
    const redis = this.clients.redis

    const AuthContext = call.request.getAuthContext()

    if (!hasAccess(AuthContext)) {
        return callback({ code: grpc.status.PERMISSION_DENIED, message: "Permission Denied" })
    }

    const order_by = call.request.getOrderBy().length == 0 ? "created_at desc" : call.request.getOrderBy()

    const scope = {
        account_id: AuthContext.getAccountId(),
        order_by: order_by,
        limit: call.request.getPageSize(),
        next_page_token: call.request.getPageToken()
    }

    getAllStaticSegments(postgres, redis, scope, function(err, segments) {
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

    if (!hasAccess(AuthContext)) {
        return callback({ code: grpc.status.PERMISSION_DENIED, message: "Permission Denied" })
    }

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

    const title = call.request.getTitle()
    const AuthContext = call.request.getAuthContext()

    if (!hasAccess(AuthContext)) {
        return callback({ code: grpc.status.PERMISSION_DENIED,  message: "Permission Denied" })
    }

    const request = {
        account_id: AuthContext.getAccountId(),
        title: title
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

const deleteStaticSegment = function(call, callback) {

    // First check we have the right permissions
    
    const AuthContext = call.request.getAuthContext()

    if (!hasAccess(AuthContext)) {
        return callback({ code: grpc.status.PERMISSION_DENIED, message: "Permission Denied"})
    }

    const postgres = this.clients.postgres
    const redis = this.clients.redis

    const id = call.request.getId()

    if (id == 0) {
        return callback({ code: grpc.status.NOT_FOUND, message: "Not Found" })
    }

    findStaticSegmentById(postgres, redis, id, function(err, segment) {
        if (err) {
            return callback(err)
        }

        if (segment == null || segment == undefined) {
            return callback({ code: grpc.status.NOT_FOUND, message: "Segment does not exist" })
        }

        if (AuthContext.getAccountId() != segment.account_id) {
            return callback({ code: grpc.status.PERMISSION_DENIED, message: "Permission Denied" })
        }

        destroyStaticSegment(postgres, id, function(err) {
            if (err) {
                return callback(err)
            }

            let reply = new RoverApis.segment.v1.Models.DeleteStaticSegmentReply()

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

    findStaticSegmentById(postgres, redis, segmentId, function(err, segment) {
        if (err) {
            return callback(err)
        }

        if (segment.account_id != accountId) {
            return callback({ code: grpc.status.PERMISSION_DENIED, message: "Permission Denied "})
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

    const batchSize = call.request.getBatchSize()
    const AuthContext = call.request.getAuthContext()
    const segmentId = call.request.getSegmentId()

    if (!hasAccess(AuthContext)) {
        return callback({ code: grpc.status.PERMISSION_DENIED, message: "Permission Denied" })
    }

    findStaticSegmentById(postgres, redis, segmentId, function(err, segment) {
        if (err) {
            return callback(err)
        }

        if (segment == null || segment == undefined) {
            return callback({ code: grpc.status.NOT_FOUND, message: "Segment not found" })
        }

        if (AuthContext && AuthContext.getAccountId() != segment.account_id) {
            return callback({ code: grpc.status.PERMISSION_DENIED, message: "Permission Denied" })
        }

        const redisSetId = segment.redis_set_id

        if (redisSetId == null || redisSetId == undefined) {
            // Return a message with no push ids and let the client know they are finished
            const reply = new RoverApis.segment.v1.Models.GetStaticSegmentPushIdsReply()
            reply.setFinished(true)
            return callback(null, reply)
        }

        const batch = new RedisBatchRead(redis, redisSetId, batchSize, {})

        batch.read(function(err, ids, nextCursor) {
            if (err) {
                return callback(err)
            }

            const reply = new RoverApis.segment.v1.Models.GetStaticSegmentPushIdsReply()

            if (nextCursor == null || nextCursor == undefined) {
                reply.setFinished(true)
            } else {
                reply.setFinished(false)
                reply.setNextCursor(nextCursor)
            }

            if (ids && isArray(ids)) {
                const pushIds = ids.map(id => {
                    const pushId = new RoverApis.segment.v1.Models.PushId()
                    pushId.setId(id)
                    pushId.setType(RoverApis.segment.v1.Models.PushIdType.ALIAS)
                })

                reply.setPushIdsList(pushIds)
            }

            return callback(null, reply)
        })

    })    
}

module.exports = {
    listStaticSegments: listStaticSegments,
    getStaticSegment: getStaticSegment,
    createStaticSegment: createStaticSegment,
    deleteStaticSegment: deleteStaticSegment,
    updateStaticSegmentPushIds: updateStaticSegmentPushIds,
    getStaticSegmentPushIds: getStaticSegmentPushIds
}