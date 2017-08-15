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

    function getIndexForAccount(accountId) {
        return "customers_account_" + accountId;
    }

    function deleteFromIndex(accountId, profileId) {
        elasticsearchQueue.delete({
            index: getIndexForAccount(accountId),
            type: 'customer',
            id: profileId,
            version: moment.utc(new Date()).valueOf()
        })
    }



    methods.index = function(profile, devices) {

        function getDocumentBucket(id) {
            return ((parseInt(id, 16) % 5) + 1)
        }

        function deviceToDoc(device) {
            const doc =  {
                token: device.push_token,
                locale_lang: device.locale_language,
                locale_region: device.locale_region,
                time_zone: device.time_zone,
                app_identifier: device.app_namespace,
                platform: device.platform,
                os_name: device.os_name,
                os_version: device.os_version,
                model: device.device_model,
                manufacturer: device.device_manufacturer,
                carrier: device.carrier_name,
                background_enabled: device.is_background_enabled,
                notifications_enabled: device.device_token_is_active,
                location_monitoring_enabled: device.is_location_monitoring_enabled,
                bluetooth_enabled: device.is_bluetooth_enabled,
                development: device.push_environment === "development",
                test_device: device.is_test_device || false
            }

            if (device.location_longitude !== 0 && device.location_latitude !== 0 && device.location_longitude !== null && device.location_latitude !== null) {
                doc.location = {
                    lat: device.location_latitude,
                    lon: device.location_longitude
                }
            }

            if (device.sdk_version) {
                doc.sdk_version = device.sdk_version
            }

            return doc
        }

        let docVersion = moment.utc(profile.updated_at).valueOf()

        devices.forEach(function(device) {
            const deviceUpdatedAt = moment.utc(device.updated_at).valueOf()
            if (deviceUpdatedAt > docVersion) {
                docVersion = deviceUpdatedAt
            }
        })

        const doc = {
            account_id: profile.account_id,
            identifier: profile.identifier,
            first_name: profile['first-name'],
            last_name: profile['last-name'],
            email: profile.email,
            phone_number: profile['phone-number'],
            age: profile.age,
            gender: profile.gender,
            tags: profile.tags || [],
            traits: {},
            document_bucket: getDocumentBucket(profile.id),
            devices: devices.map(deviceToDoc)

        }
        /*
            What do we need?
            elasticsearch queue
            and to convert to old style
         */
        elasticsearchQueue.index({
            index: getIndexForAccount(profile.account_id),
            type: 'customer',
            id: profile.id,
            body: doc,
            version: docVersion
        })

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

            deleteFromIndex(accountId, profileId)

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