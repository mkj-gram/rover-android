const RoverApis = require('@rover/apis')
const grpc = require('grpc')
const util = require('util')
const moment = require('moment')

module.exports = function(AudienceClient, logger, elasticsearchQueue) {
    let methods = {}

    function isInteger(n) {
       return Number(n) === n && n % 1 === 0
    }

    function isFloat(n) {
        return Number(n) === n && n % 1 !== 0
    }

    function buildAuthContext(accountId) {
        const context = new RoverApis.auth.v1.Models.AuthContext()
        context.setAccountId(accountId)
        context.setPermissionScopesList(['internal', 'app:sdk-api'])
        return context
    }

    function valueFromProto(value) {
        switch (value.getValueTypeCase()) {
            case 1: {
                return value.getBooleanValue()
            }
            case 2: {
                return value.getIntegerValue()
            }
            case 3: {
                return value.getDoubleValue()
            }
            case 4: {
                return value.getStringValue()
            }
            case 5: {
                return value.getStringArrayValue().getValuesList()
            }
            case 7: {
                return null
            }
            case 8: {
                return RoverApis.Helpers.timestampFromProto(value.getTimestampValue())
            }
            default: {
                return undefined
            }
        }
    }

    function valueToProto(value) {
        const protoValue = new RoverApis.audience.v1.Models.Value()

        if(util.isBoolean(value)) {
            protoValue.setBooleanValue(value)
        } else if(isFloat(value)) {
            protoValue.setDoubleValue(value)
        } else if(isInteger(value)) {
            protoValue.setIntegerValue(value)
        } else if(!isNaN(Date.parse(value))) {
            protoValue.setTimestampValue(RoverApis.Helpers.timestampToProto(new Date(value)))
        } else if(util.isString(value)) {
            protoValue.setStringValue(value)
        } else if(value === null) {
            protoValue.setNullValue(RoverApis.audience.v1.Models.Null.NULL)
        } else if(util.isArray(value)) {
            const strings  = value.filter(v => { return util.isString(v) })
            const stringArray = new RoverApis.audience.v1.Models.Value.StringArray()
            stringArray.setValuesList(strings)
            protoValue.setStringArrayValue(stringArray)
        }

        return protoValue        
    }


    methods.fromProto = function(p) {
        let profile = {}
        profile.id = p.getId()
        profile.account_id = p.getAccountId()
        profile.identifier = p.getIdentifier() === "" ? null : p.getIdentifier()

        const attributes = p.getAttributesMap()

        attributes.keys().arr_.forEach(key => {
            const value = valueFromProto(attributes.get(key))
            profile[key] = value
        })

        profile.updated_at = RoverApis.Helpers.timestampFromProto(p.getUpdatedAt())
        profile.created_at = RoverApis.Helpers.timestampFromProto(p.getCreatedAt())
        return profile
    }

    methods.findAllByIdentifiers = function(accountId, identifiers, callback) {
        let request = new RoverApis.audience.v1.Models.ListProfilesByIdentifiersRequest()
        request.setAuthContext(buildAuthContext(accountId))
        request.setProfileIdentifiersList(identifiers)

        AudienceClient.listProfilesByIdentifiers(request, function(err, reply) {
            if (err) {
                return callback(err)
            }

            let profileProtos = reply.getProfilesList()
        

            let profiles = profileProtos.map(methods.fromProto)

            return callback(null, profiles)
        })
    }


    return methods
}