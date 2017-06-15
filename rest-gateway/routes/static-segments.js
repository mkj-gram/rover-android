const express = require('express')
const router = express.Router()

const RoverApis = require("@rover/apis")
const SegmentClient = require("@rover/segment-client").v1.Client()


function makeError(status, message) {
    const error = new Error(message)
    error.status = status
    return error
}


function mustAuthenticate(req, res, next) {
    if (req.authContext == null || req.authContext == undefined) {
        return next(makeError(401, "Unauthorized"))
    }

    return next()
}

/*
    We force all routes inside this router to be authenticated. If we can't authenticate with auth
    we just throw and Unauthorized error which will be picked up by the main router's error logic
 */
router.use(mustAuthenticate)

/* 
    ROUTE: /v1/static-segments
    SCOPES: server, admin
*/

function getISOString(timestamp) {
    let date = new Date(timestamp.getSeconds() * 1000)
    return date.toISOString()
}

function serialize(segment) {
    return {
        'id': segment.getId(),
        'type': "static-segments",
        'attributes': {
            'name': segment.getTitle(),
            'size': segment.getSize(),
            'updated-at': getISOString(segment.getUpdatedAt()),
            'created-at': getISOString(segment.getCreatedAt())
        }
    }
}

/**
 *  List all static segments
 */
router.get('/', function(req, res, next) {

    const request = new RoverApis.segment.v1.Models.ListStaticSegmentRequest()

    request.setAuthContext(req._authContext)

    if (req.query.sort) {
        request.setOrderBy(req.query.sort)
    } else {
        request.setOrderBy("created_at DESC")
    }

    // Default for now. We can customize later if we want to support pagination
    // http://jsonapi.org/format/#fetching-pagination
    request.setPageSize(500)

    SegmentClient.listStaticSegments(request, function(err, response) {
        if (err) {
            return next(err)
        }

        const segments = response.getSegmentsList()

        const jsonResponse = {
            data: segments.map(serialize)
        }

        return res.json(jsonResponse)
    })
})

/**
 *  Returns a single static segment
 */
router.get('/:id', function(req, res, next) {

    const id = parseInt(req.params.id)

    if (isNaN(id)) {
        return next(makeError(400, "Id must be an integer but got " + req.params.id))
    }

    const request = new RoverApis.segment.v1.Models.GetStaticSegmentRequest()

    request.setAuthContext(req._authContext)
    request.setId(id)

    SegmentClient.getStaticSegment(request, function(err, response) {
        if (err) {
            return next(err)
        }

        const jsonResponse = {
            data: serialize(response.getSegment())
        }

        return res.json(jsonResponse)

    })
})

/**
 *  Updates a single static segment
 */
router.post('/', function(req, res, next) {

    // Parsed json body
    const body = req.body

    /* 
        Example JSON why are we using json api spec again?
        {
          "data": {
            "type": "static-segments",
            "attributes": {
              "title": "Ember Hamster"
            }
          }
        }
    */
   
    if (body == null || body.data == undefined || body.data == null) {
        return next(makeError(400, "Invalid JSON API"))
    }

    if (body.data.type != 'static-segments') {
        return next(makeError(400, "Invalid type"))
    }

    if (body.data.attributes == undefined || body.data.attributes == null) {
        return next(makeError(400, "Attributes cannot be left blank"))
    }

    if (body.data.attributes.name == undefined || body.data.attributes.name == null) {
        return next(makeError(400, "Name must be set and cannot be null"))
    }

    const request = new RoverApis.segment.v1.Models.CreateStaticSegmentRequest()

    
    request.setAuthContext(req._authContext)
    request.setTitle(body.data.attributes.name)

    SegmentClient.createStaticSegment(request, function(err, response) {
        if (err) {
            return next(err)
        }

        const jsonResponse = {
            data: serialize(response.getSegment())
        }

        return res.json(jsonResponse)
    })
})

/**
 *  Deletes a single static segment
 */
router.delete('/:id', function(req, res, next) {

    const id = parseInt(req.params.id)

    if (isNaN(id)) {
        return next(makeError(400, "ID must be an integer"))
    }

    const request = new RoverApis.segment.v1.Models.DeleteStaticSegmentRequest()

    request.setAuthContext(req._authContext)
    request.setId(id)

    SegmentClient.deleteStaticSegment(request, function(err, response) {
        if (err) {
            return next(err)
        }

        // response is empty 
        
        res.writeHead(204)
        return res.end()
    })

})

module.exports = router