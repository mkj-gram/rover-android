'use strict';

const util = require('util');
const moment = require('moment');
const RoverApis = require('@rover/apis')
const grpc = require('grpc')

const internals = {};
const collection = 'customers';
const VersionRegex = /\d+\.\d+\.\d+|\d+\.\d+/;

const TOP_LEVEL_ATTRIBUTES = ['tags', 'first_name', 'last_name', 'email', 'gender', 'phone_number', 'age']

function isInteger(n) {
   return Number(n) === n && n % 1 === 0
}

function isFloat(n) {
    return Number(n) === n && n % 1 !== 0
}


internals.parseVersion = function(version) {
    if (!util.isNullOrUndefined(version) && util.isString(version)) {
        let capturedVersion = version.match(VersionRegex);
        if (!util.isNullOrUndefined(capturedVersion) && capturedVersion.length > 0) {
            let parsedVersion = capturedVersion[0].split('.').map(i => parseInt(i));
            return {
                major: parsedVersion[0],
                minor: parsedVersion[1],
                revision: parsedVersion[2]
            }
        } else {
            return {}
        }
    } else {
        return {};
    }
};

internals.buildAuthContext = function(accountId) {
    let authContext = new RoverApis.auth.v1.Models.AuthContext()
    authContext.setAccountId(accountId)
    authContext.setPermissionScopesList(['internal', 'app:sdk-api'])

    return authContext
}

internals.convertProtos = function(profile, devices) {

    function convertVersion(version) {
        if (version == null || version == undefined) {
            return undefined
        }

        return `${version.getMajor()}.${version.getMinor()}.${version.getRevision()}`
    }

    function convertBeaconRegion(beaconRegion) {
        let region = {
            uuid: beaconRegion.getUuid()
        }

        if (beaconRegion.getMajor() !== -1) {
            region.major = beaconRegion.getMajor()
        } else {
            region.major = null
        }

        if (beaconRegion.getMinor() !== -1) {
            region.minor = beaconRegion.getMinor()
        } else {
            region.minor = null
        }

        return region
    }

    function convertPlatform(platform, osName) {
        if (platform === 1) {
            return osName
        } else if(platform === 2) {
            return "web"
        } else {
            return null
        }
    }

    function convertGeofenceRegion(geofenceRegion) {
        return {
            id: geofenceRegion.getId(),
            latitude: geofenceRegion.getLatitude(),
            longitude: geofenceRegion.getLongitude(),
            radius: geofenceRegion.getRadius()
        }
    }

    function convertDevice(device) {

        let model = {
            _id: device.getDeviceId(),
            development: device.getApsEnvironment(),
            token: device.getDeviceTokenKey(),
            app_identifier: device.getAppNamespace(),
            manufacturer: device.getDeviceManufacturer(),
            model: device.getDeviceModel(),
            os_name: device.getOsName(),
            os_version: convertVersion(device.getOsVersion()),
            sdk_version: convertVersion(device.getFrameworksMap().get("Rover")),
            locale_lang: device.getLocaleLanguage(),
            locale_region: device.getLocaleRegion(),
            carrier: device.getCarrierName(),
            time_zone: device.getTimeZone(),
            platform: convertPlatform(device.getPlatform(), device.getOsName()),
            aid: device.getAdvertisingId(),
            ip: device.getIp(),
            is_location_monitoring_enabled: device.getIsLocationMonitoringEnabled(),
            is_bluetooth_enabled: device.getIsBluetoothEnabled(),
            is_background_enabled: device.getIsBackgroundEnabled(),
            beacon_regions_monitoring_updated_at: RoverApis.Helpers.timestampFromProto(device.getIbeaconMonitoringRegionsUpdatedAt()),
            beacon_regions_monitoring: device.getIbeaconMonitoringRegionsList().map(convertBeaconRegion),
            geofence_regions_monitoring_update_at: RoverApis.Helpers.timestampFromProto(device.getGeofenceMonitoringRegionsUpdatedAt()),
            geofence_regions_monitoring: device.getGeofenceMonitoringRegionsList().map(convertGeofenceRegion)
        }

        if (device.getLocationLatitude() !== 0 && device.getLocationLongitude() !== 0) {
            let location = {
                latitude: device.getLocationLatitude(),
                longitude: device.getLocationLongitude(),
                accuracy: device.getLocationAccuracy(),
                timestamp: device.getLocationUpdatedAt()
            }

            Object.assign(model, { location: location })
        } else {
            model.location = {}
        }

        return model
    }

    function mapToObject(map) {
        let object = {}

        let keys = map.keys().arr_
        keys.forEach(key => {
            const value = map.get(key)
            switch (value.getValueTypeCase()) {
                case 1: {
                    object[key] = value.getBooleanValue()
                    break
                }
                case 2: {
                    object[key] = value.getIntegerValue()
                    break
                }
                case 3: {
                    object[key] = value.getDoubleValue()
                    break
                }
                case 4: {
                    object[key] = value.getStringValue()
                    break
                }
                case 5: {
                    object[key] = value.getStringArrayValue().getValuesList()
                    break
                }
                case 7: {
                    object[key] = null
                    break
                }
                case 8: {
                    object[key] = RoverApis.Helpers.timestampFromProto(value.getTimestampValue())
                    break
                }
                default: {
                    object[key] = undefined
                }
            }
        })

        return object
    }

    function convertProfile(profile) {
       let attributes = mapToObject(profile.getAttributesMap())

       let topLevelAttributes = Object.keys(attributes).filter(key => TOP_LEVEL_ATTRIBUTES.includes(key)).reduce((obj, key) => { obj[key] = attributes[key]; return obj }, {})
       let traits = Object.keys(attributes).filter(key => !TOP_LEVEL_ATTRIBUTES.includes(key)).reduce((obj, key) => { obj[key] = attributes[key]; return obj }, {})

       let model = {
            _id: profile.getId(),
            account_id: profile.getAccountId(),
            identifier: profile.getIdentifier() === '' ? null : profile.getIdentifier(),
            updated_at: RoverApis.Helpers.timestampFromProto(profile.getUpdatedAt()),
            created_at: RoverApis.Helpers.timestampFromProto(profile.getCreatedAt())
       }

       return Object.assign(model, topLevelAttributes, { traits: traits })
    }

    let model = Object.assign(convertProfile(profile), { devices: devices.map(convertDevice) })

    return model
}

internals.findByDeviceId = function(accountId, deviceId, callback) {

    const server = this
    const client = server.connections.audience.client
    const logger = server.plugins.logger.logger

    let request = new RoverApis.audience.v1.Models.GetProfileByDeviceIdRequest()
    request.setAuthContext(internals.buildAuthContext(accountId))
    request.setDeviceId(deviceId)
    
    logger.debug('getProfileByDeviceId: ' + deviceId)

    client.getProfileByDeviceId(request, function(err, reply) {
        if (err) {
            if (err.code == grpc.status.NOT_FOUND) {
                logger.debug('getProfileByDeviceId: NOT_FOUND')
                return callback(null, null)
            }

            return callback(err)
        }

        let profileProto = reply.getProfile()

        internals.getProfileDevices.bind(server)(accountId, profileProto.getId(), function(err, devicesProto) {
            if (err) {
                return callback(err)
            }

            let customer = internals.convertProtos(profileProto, devicesProto)

            return callback(null, customer)
        })
    })

}

internals.findByIdentifier = function(accountId, identifier, callback) {
    const server = this
    const client = server.connections.audience.client

    const request = new RoverApis.audience.v1.Models.GetProfileByIdentifierRequest()
    request.setAuthContext(internals.buildAuthContext(accountId))
    request.setIdentifier(identifier)

    client.getProfileByIdentifier(request, function(err, reply) {
        if (err) {
            if (err.code == grpc.status.NOT_FOUND) {
                return callback(null, null)
            }

            return callback(null)
        }

        let profileProto = reply.getProfile()

        internals.getProfileDevices.bind(server)(accountId, profileProto.getId(), function(err, devicesProto) {
            if (err) {
                return calalback(err)
            }

            let customer = internals.convertProtos(profileProto, devicesProto)

            return callback(null, customer)
        })
    })
}

internals.getProfileDevices = function(accountId, profileId, callback) {
    const server = this
    const client = server.connections.audience.client
    const logger = server.plugins.logger.logger

    let request = new RoverApis.audience.v1.Models.ListDevicesByProfileIdRequest()
    request.setAuthContext(internals.buildAuthContext(accountId))
    request.setProfileId(profileId)

    logger.debug('listDevicesByProfileId: ' + profileId)

    client.listDevicesByProfileId(request, function(err, reply) {
        if (err) {
            // TODO check to see if another error is possible here!
            return callback(err)
        }

        return callback(null, reply.getDevicesList())
    })
}

internals.findByDeviceToken = function(account_id, device_token, callback) {

}



// TODO
// rename this
internals.updateByDevice = function(id, deviceId, update, callback) {
    const server = this;
    const mongodb = server.connections.mongodb.client;
    const ObjectId = server.connections.mongodb.ObjectId;
    const logger = server.plugins.logger.logger;

    // logger.debug('Service: [customer.updateByDevice] \n' + util.inspect(update, true, null, false));
    return callback(new Error("TODO UPDATE BY DEVICE"))
    // mongodb.collection(collection).updateOne({ "_id": ObjectId(id), "devices._id": deviceId }, update, function(err, response) {
    //     if (err) {
    //         return callback(err);
    //     }

    //     return callback(null, response);
    // });

};

internals.create = function(accountId, customer, device, callback) {
    const server = this;
    const client = server.connections.audience.client
    const logger = server.plugins.logger.logger;

    const SET = RoverApis.audience.v1.Models.ValueUpdate.UpdateType.SET

    function addObjectToAttributeMap(map, object) {

        // Mutation on the map
        function addToMap(type, key, value) {
            if (key === null || key === undefined) {
                return
            }

            if (map.get(key) === undefined) {
                map.set(key, new RoverApis.audience.v1.Models.ValueUpdates())
            }

            const updates = map.get(key)

            let valueUpdate = new RoverApis.audience.v1.Models.ValueUpdate()
            valueUpdate.setUpdateType(type)
            valueUpdate.setValue(value)

            updates.addValues(valueUpdate)
        }

        Object.keys(object).forEach(key => {
            const value = object[key]
            if (util.isArray(value) || !util.isObject(value)) {
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

                if (protoValue.getValueTypeCase() !== 0) {
                    addToMap(SET, key, protoValue)
                }
                
            }
        }) 
    }

     let createProfileRequest = new RoverApis.audience.v1.Models.CreateProfileRequest()
    createProfileRequest.setAuthContext(internals.buildAuthContext(accountId))

    logger.debug("Creating blank profile")

    client.createProfile(createProfileRequest, function(err, createProfileReply) {
        if (err) {
            return callback(err)
        }


        if (customer.identifier !== null && customer.identifier !== undefined) {
            // must call update profile identifier
            logger.debug("Updating profile with identifier: " + customer.identifier)
        }

        let profile = createProfileReply.getProfile()

        // Assume for now that we good
        
        const updateProfileRequest = new RoverApis.audience.v1.Models.UpdateProfileRequest()
        updateProfileRequest.setAuthContext(internals.buildAuthContext(accountId))
        updateProfileRequest.setProfileId(profile.getId())
        // we need to update the customer
        let filteredAttributes = Object.keys(customer).filter(key => TOP_LEVEL_ATTRIBUTES.includes(key)).reduce((obj, key) => { obj[key] = customer[key]; return obj }, {})
        // Mutates the map
        addObjectToAttributeMap(updateProfileRequest.getAttributesMap(), filteredAttributes)
    
        client.updateProfile(updateProfileRequest, function(err, updateProfileReply) {
            if (err) {
                return callback(err)
            }

            let deviceCreateRequest = new RoverApis.audience.v1.Models.CreateDeviceRequest()
            deviceCreateRequest.setAuthContext(internals.buildAuthContext(accountId))
            deviceCreateRequest.setProfileId(profile.getId())
            deviceCreateRequest.setDeviceId(device._id)

            client.createDevice(deviceCreateRequest, function(err, deviceCreateReply) {
                if (err) {
                    return callback(err)
                }

                internals.updateDeviceContext.bind(server)(accountId, device, function(err, newContext) {
                    if (err) {
                        return callback(err)
                    }
                    
                    return callback(new Error("NOPE NOT YET"))
                })
            })
        })

    })
};


internals.updateDeviceContext = function(accountId, device, callback) {

    const server = this
    const client = server.connections.audience.client
    
    function buildVersion(versionString) {
        if (versionString === null || versionString === undefined) {
            return null
        }

        let parts = versionString.split(".")

        let version = new RoverApis.audience.v1.Models.Version()
        version.setMajor(parseInt(parts[0]) || 0)
        version.setMinor(parseInt(parts[1]) || 0)
        version.setRevision(parseInt(parts[2]) || 0)
        return version
    }

    let request = new RoverApis.audience.v1.Models.UpdateDeviceRequest()
    request.setAuthContext(internals.buildAuthContext(accountId))
    request.setDeviceId(device._id)
    request.setApsEnvironment(device.development)
    request.setDeviceTokenKey(device.token)
    request.setAppNamespace(device.app_identifier)
    request.setDeviceManufacturer(device.manufacturer)
    request.setOsName(device.os_name)
    request.setOsVersion(buildVersion(device.os_version))

    let frameworks = request.getFrameworksMap()
    if (device.sdk_version && buildVersion(device.sdk_version) !== null) {
        frameworks.set('Rover', buildVersion(device.sdk_version))
    }
    request.setLocaleLanguage(device.locale_lang)
    request.setLocaleRegion(device.locale_region)
    request.setCarrierName(device.carrier)
    request.setTimeZone(device.time_zone)
    request.setPlatform(RoverApis.audience.v1.Models.Platform.MOBILE)
    request.setIsBackgroundEnabled(device.is_background_enabled)
    request.setIsLocationMonitoringEnabled(device.is_location_monitoring_enabled)
    request.setIsBluetoothEnabled(device.is_bluetooth_enabled)
    request.setAdvertisingId(device.aid)
    request.setIp(device.ip)
    request.setRegionMonitoringMode(RoverApis.audience.v1.Models.Device.RegionMonitoringMode.ROVER)

    client.updateDevice(request, function(err, reply) {
       return callback(err, reply)
    })
}

internals.update = function(id, update, callback) {
    const server = this;
    const mongodb = server.connections.mongodb.client;
    const ObjectId = server.connections.mongodb.ObjectId;
    const logger = server.plugins.logger.logger;

    // logger.debug('Service: [customer.update] \n' + util.inspect(update, true, null, false));
    return callback(new Error("TODO UPDATE"))
    // mongodb.collection(collection).updateOne({ _id: ObjectId(id) }, update, function(err, response) {
    //     if (err) {
    //         return callback(err);
    //     }

    //     return callback(null, response);
    // });
};


internals.moveDeviceToCustomer = function(accountId, customerId, deviceId, callback) {
    const server = this;
    const client = server.connections.audience.client;

    let request = new RoverApis.audience.v1.Models.SetDeviceProfileRequest()
    request.setAuthContext(internals.buildAuthContext(accountId))
    request.setProfileId(customerId)
    request.setDeviceId(deviceId)

    client.setDeviceProfile(request, function(err, reply) {
        if (err) {
            return callback(err)
        }

        return callback()
    })
}

internals.delete = function(customer, callback) {
    const server = this;
    const mongodb = server.connections.mongodb.client;
    const ObjectId = server.connections.mongodb.ObjectId;
    const logger = server.plugins.logger.logger;

    // logger.debug('Service: [customer.delete] \n' + customer._id);

    mongodb.collection(collection).deleteOne({"_id": ObjectId(customer._id) }, (err, success) => {
        if (err) {
            return callback(err);
        }

        return callback(null, success);
    });
};

// TODO: this much create device and then attach it to the customer profile 
internals.pushDevice = function(customer, device, callback) {
    const server = this;

    customer.updated_at = moment.utc(new Date).toDate()
    
    let update = {"$set": { "updated_at":  customer.updated_at } , "$push": { "devices": device }}

    return callback(new Error("TODO PUSH DEVICE"))
    // internals.update.bind(server)(customer._id, update, (err, success) => {
    //     if (err) {
    //         return callback(err);
    //     }

    //     let updatedCustomer = customer;
        
    //     if (util.isNullOrUndefined(updatedCustomer.devices)) {
    //         updatedCustomer.devices = [];
    //     }

    //     updatedCustomer.devices.push(device);

    //     return callback(null, updatedCustomer);
    // });
};

internals.pullDevice = function(customer, device, callback) {
    const server = this;

    customer.updated_at = moment.utc(new Date).toDate()

    let update = { "$set": { "updated_at": customer.updated_at }, "$pull": { "devices": { "_id": device._id }}}
    return callback(new Error("TODO PULL DEVICE"))
    // internals.update.bind(server)(customer._id, update, (err, success) => {
    //     if (err) {
    //         return callback(err);
    //     }

    //     let updatedCustomer = customer;

    //     let indexOfRemovedDevice = customer.devices.findIndex((d) => { return d._id == device._id });

    //     if (indexOfRemovedDevice >= 0) {
    //         updatedCustomer.devices.splice(indexOfRemovedDevice, 1);
    //     }

    //     return callback(null, updatedCustomer);
    // });
};

internals.index = function(customer, callback) {
    const server = this;
    // const elasticsearch = server.connections.elasticsearch.client;
    const queue = server.connections.elasticsearch.queue;
    const logger = server.plugins.logger.logger;

    let doc = internals.asIndexedJson(customer);

    // logger.debug('Service: [customer.index] \n' + util.inspect(doc, true, null, false));
    
    queue.index({
        index: internals.getIndexForCustomer(customer),
        type: 'customer',
        id: customer._id.toString(),
        body: doc,
        version: moment.utc(customer.updated_at).valueOf() // Grabs unix time in milliseconds
    });

    return callback();
};

internals.deleteIndex = function(customer, callback) {
    const server = this;
    // const elasticsearch = server.connections.elasticsearch.client;
    const queue = server.connections.elasticsearch.queue;
    const logger = server.plugins.logger.logger;

    // logger.debug('Service: [customer.deleteIndex] id: ' + customer._id);
    
    queue.delete({
        index: internals.getIndexForCustomer(customer),
        type: 'customer',
        id: customer._id.toString(),
        version: moment.utc(customer.updated_at).valueOf()
    });

    return callback();
};

internals.getIndexForCustomer = function(customer) {
    return "customers_account_" + customer.account_id;
};

internals.getRandomIntInclusive = function (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

internals.asIndexedJson = function(customer) {

    let devicesIndexedJson = (customer.devices || []).map((device) => internals.deviceAsIndexedJson(device));

    return {
        account_id: customer.account_id,
        identifier: customer.identifier,
        first_name: customer.first_name,
        last_name: customer.last_name,
        email: customer.email,
        phone_number: customer.phone_number,
        tags: customer.tags,
        traits: customer.traits,
        age: customer.age,
        gender: customer.gender,
        document_bucket: customer.document_bucket,
        devices: devicesIndexedJson
    };

};

internals.deviceAsIndexedJson = function(device) {
    let json =  {
        _id: device._id,
        token: device.token,
        locale_lang: device.locale_lang,
        locale_region: device.locale_region,
        time_zone: device.time_zone,
        sdk_version: internals.parseVersion(device.sdk_version),
        app_identifier: device.app_identifier,
        platform: device.platform,
        os_name: device.os_name,
        os_version: internals.parseVersion(device.os_version),
        model: device.model,
        manufacturer: device.manufacturer,
        carrier: device.carrier,
        background_enabled: device.background_enabled,
        notifications_enabled: device.notifications_enabled,
        location_monitoring_enabled: device.location_monitoring_enabled,
        bluetooth_enabled: device.bluetooth_enabled,
        development: device.development
    }

    if (device.location && device.location.latitude && device.location.longitude) {
        json.location = {
            lat: device.location.latitude,
            lon: device.location.longitude
        }
    }

    return json;
};

module.exports = {
    findByDeviceId: internals.findByDeviceId,
    findByIdentifier: internals.findByIdentifier,
    moveDeviceToCustomer: internals.moveDeviceToCustomer,
    update: internals.update,
    updateByDevice: internals.updateByDevice,
    create: internals.create,
    delete: internals.delete,
    pushDevice: internals.pushDevice,
    pullDevice: internals.pullDevice,
    index: internals.index,
    deleteIndex: internals.deleteIndex 
}