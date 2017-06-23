'use strict';

const RoverApis = require("@rover/apis");
const util = require('util');
const internals = {};


internals.withinSegment = function(accountId, staticSegmentId, identifier, callback) {

    if (util.isNullOrUndefined(staticSegmentId)) {
        return callback(false)
    }

    if (util.isNullOrUndefined(identifier)) {
        return callback(false)
    }

    let server = this

    let segmentClient = server.connections.segment
    
    let pushId = new RoverApis.segment.v1.Models.PushId()
    pushId.setId(identifier)
    pushId.setType(RoverApis.segment.v1.Models.PushIdType.ALIAS)

    let authContext = new RoverApis.auth.v1.Models.AuthContext()
    authContext.setAccountId(accountId)
    authContext.setPermissionScopesList(["internal", "app:sdk-api"])

    let request = new RoverApis.segment.v1.Models.IsInStaticSegmentRequest()

    request.setAuthContext(authContext)
    request.setSegmentId(staticSegmentId)
    request.setPushId(pushId)

    segmentClient.isInStaticSegment(request, function(err, reply) {
        if (err) {
            console.warn(err)
            return callback(false)
        }

        return callback(reply.getYes())
    })

};

module.exports = {
    withinSegment: internals.withinSegment
}