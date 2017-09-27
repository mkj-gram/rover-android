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
        } else if(moment(value, moment.ISO_8601).isValid()) {
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


    function profileFromProto(p) {
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


    methods.profileToProto = function(profile) {
        var p = new RoverApis.audience.v1.Models.Profile()

        // pull out the ones we know are not a part of the profile
        p.setId(profile.id)
        p.setAccountId(profile.account_id)
        p.setIdentifier(p.identifier)

        p.setUpdatedAt(RoverApis.Helpers.timestampToProto(profile.updated_at))
        p.setCreatedAt(RoverApis.Helpers.timestampToProto(profile.created_at))

        // id, account_id, identifier, updated_at, created_at are all top level everything else is an attribute
        var roverKeys = ["id", "account_id", "identifier", "updated_at", "created_at"]

        var attributes = p.getAttributesMap()
        Object.keys(profile).forEach(function(key) {
            if (!roverKeys.includes(key)) {
                const value = valueToProto(profile[key])
                attributes.set(key, value)
            }
        })

        return p
    }

    // Deprecated
    methods.index = function(profile, devices) {
    }

    methods.findById = function(accountId, profileId, callback) {
        let request = new RoverApis.audience.v1.Models.GetProfileRequest()
        request.setAuthContext(buildAuthContext(accountId))
        request.setProfileId(profileId)

        AudienceClient.getProfile(request, function(err, reply) {
            if (err) {
                if (err.code === grpc.status.NOT_FOUND) {
                    return callback(null, null)
                }

                return callback(err)
            }

            let profileProto = reply.getProfile()
            if (profileProto === null) {
                return callback(new Error("Was expecting profile in response but got nothing"))
            }

            let profile = profileFromProto(profileProto)
            return callback(null, profile)
        })
    }

    methods.findByDeviceId = function(accountId, deviceId, callback) {
        let request = new RoverApis.audience.v1.Models.GetProfileByDeviceIdRequest()
        request.setAuthContext(buildAuthContext(accountId))
        request.setDeviceId(deviceId)

        AudienceClient.getProfileByDeviceId(request, function(err, reply) {
            if (err) {
                if (err.code === grpc.status.NOT_FOUND) {
                    return callback(null, null)
                }

                return callback(err)
            }

            let profileProto = reply.getProfile()
            if (profileProto === null || profileProto === undefined) {
                return callback(new Error("Was expecting profile in response but got nothing"))
            }

            let profile = profileFromProto(profileProto)

            return callback(null, profile)
        })
    }

    methods.findByIdentifier = function(accountId, identifier, callback) {

        let request = new RoverApis.audience.v1.Models.GetProfileByIdentifierRequest()
        request.setAuthContext(buildAuthContext(accountId))
        request.setIdentifier(identifier)

        AudienceClient.getProfileByIdentifier(request, function(err, reply) {
            if (err) {
                if (err.code === grpc.status.NOT_FOUND) {
                    return callback(null, null)
                }
                return callback(err)
            }

            let profileProto = reply.getProfile()
            if (profileProto === null) {
                // Really bad!
                return callback(new Error("Was expecting profile in response but got nothing"))
            }

            let profile = profileFromProto(profileProto)

            return callback(null, profile)
        })
    }

    methods.createAnonymousProfile = function(accountId, callback) {
        let request = new RoverApis.audience.v1.Models.CreateProfileRequest()
        request.setAuthContext(buildAuthContext(accountId))

        AudienceClient.createProfile(request, function(err, reply) {
            if (err) {
                return callback(err)
            }

            let profileProto = reply.getProfile()
            if (profileProto === null) {
                return callback(new Error("Was expecting profile in response but got nothing"))
            }

            let profile = profileFromProto(profileProto)

            return callback(null, profile)
        })
    }

    methods.createIdentifiedProfile = function(accountId, identifier, callback) {
        methods.createAnonymousProfile(accountId, function(err, profile) {
            if (err) {
                return callback(err)
            }

            let request = new RoverApis.audience.v1.Models.UpdateProfileIdentifierRequest()
            request.setAuthContext(buildAuthContext(accountId))
            request.setIdentifier(identifier)
            request.setProfileId(profile.id)

            AudienceClient.updateProfileIdentifier(request, function(err, reply) {
                if (err) {
                    return callback(err)
                }

                profile.identifier = identifier

                return callback(null, profile)
            })

        })
    }

    methods.delete = function(accountId, profileId, callback) {
        let request = new RoverApis.audience.v1.Models.DeleteProfileRequest()
        request.setAuthContext(buildAuthContext(accountId))
        request.setProfileId(profileId)

        AudienceClient.deleteProfile(request, function(err, reply) {
            if (err) {
                return callback(err)
            }

            return callback()
        })
    }

    methods.updateAttributes = function(accountId, profileId, attributeUpdates, callback) {
        if (Object.keys(attributeUpdates).length === 0) {
            // NO-OP
            logger.debug("updateAttributes NOOP")
            return callback()
        }

        let request = new RoverApis.audience.v1.Models.UpdateProfileRequest()
        request.setAuthContext(buildAuthContext(accountId))
        request.setProfileId(profileId)

        let updates = request.getAttributesMap()

        Object.keys(attributeUpdates).forEach(key => {
            const value = valueToProto(attributeUpdates[key])
            const valueUpdates = new RoverApis.audience.v1.Models.ValueUpdates()
            const setOperation = new RoverApis.audience.v1.Models.ValueUpdate()
            setOperation.setUpdateType(RoverApis.audience.v1.Models.ValueUpdate.UpdateType.SET)
            setOperation.setValue(value)
            valueUpdates.setValuesList([setOperation])
            updates.set(key, valueUpdates)
        })

        logger.debug(JSON.stringify(request.toObject()))
        AudienceClient.updateProfile(request, function(err, reply) {
            if (err) {
                return callback(err)
            }

            return callback()
        })
    }



    return methods
}