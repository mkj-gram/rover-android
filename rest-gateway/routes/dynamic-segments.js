const express = require('express')
const router = express.Router()

const Helpers = require('../helpers')
const RoverApis = require("@rover/apis")
const AudienceClient = require("@rover/audience-client").v1.Client()

router.use(Helpers.mustAuthenticate)

/**
 *  List all dynamic segments
 */
router.get('/', function(req, res, next) {
    const request = new RoverApis.audience.v1.Models.ListDynamicSegmentsRequest()
    request.setAuthContext(req.auth.context)

    AudienceClient.listDynamicSegments(request, function(err, response) {
        if (err) {
            return next(err)
        }

        const segments = response.getSegmentsList()
        const jsonResponse = {
            data: segments.map(segment => {
                return {
                    'id': segment.getId(),
                    'type': 'dynamic-segments',
                    'attributes': {
                        'name': segment.getTitle()
                    }
                }
            })
        }

        return res.json(jsonResponse)
    })
})

module.exports = router
