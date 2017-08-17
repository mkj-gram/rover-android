const async = require('async')
const lodash = require('lodash')
const ISO3611 = require('../../lib/iso-3611')
const IpParse = require("@rover-common/ip-parse")
const AllowedScopes = ["sdk", "web", "server"]
const Event = require('../../lib/event')


function underscore(object) {
    if (object === null || object === undefined) {
        return {}
    }

    let underscored = {}

    Object.keys(object).forEach(key => {
        let newKey = key.replace(/\-/g, '_')
        let value = obj[key]
        underscored[newKey] = value
    })

    return underscorePayload;
}

function parseEventPayload(request) {
    const payload = request.payload.data.attributes || {}

    const event = {
        timestamp: payload.timestamp || payload.time || new Date()
    }

    if (payload.name) {
        event.name = payload.name
    }

    if (payload.object && payload.action) {
        event.name = payload.object + " " + payload.action;
    }

    if (payload.attributes) {
        event.attributes = payload.attributes
    } else {
        let attributes = Object.assign({}, payload)
        delete attributes["user"]
        delete attributes["device"]
        delete attributes["timestamp"]
        delete attributes["time"]
        delete attributes["name"]

        event.attributes = attributes;
    }

    return event;
}

function parseProfilePayload(request) {
    let profile = {}
    // Do we need to underscore?
    let input = request.payload.data.attributes.user || {} //underscore(request.payload.data.attributes.user)

    if(request.headers['x-rover-customer-id']) {
        input['identifier'] = request.headers['x-rover-customer-id']
    }

    Object.keys(input).forEach(key => {
        // Flatten out traits
        if (key === 'traits') {
            Object.assign(profile, input['traits'])
        } else {
            profile[key] = input[key]
        }
    })

    if (profile["id"]) {
        delete profile["id"]
    }

    if (profile["account_id"]) {
        delete profile["account_id"]
    }

    if (profile["identifier"] === undefined || profile["identifier"] === "") {
        profile["identifier"] = null
    }

    if (profile['tags'] === null) {
        profile['tags'] = []
    }

    return profile
}


function parseDevicePayload(request) {
    if (request.payload.data.attributes.device === undefined || request.payload.data.attributes.device === null) {
        return null
    }

    const input = request.payload.data.attributes.device || {}
    
    function parseVersion(string) {
        if (string === null || string === undefined) {
            return null
        }

        let parts = string.split('.')
        let version = {
            major: parseInt(parts[0]) || 0,
            minor: parseInt(parts[1]) || 0,
            revision: parseInt(parts[2]) || 0
        }

        return version
    }

    let context = {
        push_environment: input.development === true ? "development" : "production",
        push_token: String(input.token || ""),
        app_namespace: String(input['app-identifier'] || ""),
        device_manufacturer: String(input.manufacturer || ""),
        os_name: String(input['os-name'] || ""),
        os_version: parseVersion(input['os-version']),
        device_model: String(input.model || ""),
        sdk_version: parseVersion(input['sdk-version']),
        locale_language: String((input['locale-lang'] || "")).toLowerCase(),
        locale_script: String((input['locale-script'] || "")).toLowerCase(),
        carrier_name: String((input['carrier'] || "")).toLowerCase(),
        platform: String(input['platform'] || input['os-name']),
        time_zone: String(input['time-zone'] || ""),
        is_background_enabled: input['background-enabled'] === true ? true : false,
        is_location_monitoring_enabled: input['location-monitoring-enabled'] === true ? true : false,
        is_bluetooth_enabled: input['bluetooth-enabled'] === true ? true : false,
        advertising_id: String(input.aid || "")
    }

    const localeRegion = (input['locale-region'] || "").toLowerCase()

    if (localeRegion && typeof localeRegion === 'string') {
        if (localeRegion.length === 3 && ISO3611.alpha3Exists(localeRegion)) {
            context.locale_region = ISO3611.convertAlpha3ToAlpha2(localeRegion)
        } else if (localeRegion.length === 2 && ISO3611.alpha2Exists(localeRegion)) {
            context.locale_region = localeRegion
        } else {
            context.locale_region = ""
        }
    } else {
        context.locale_region = ""
    }

    if (request.headers['x-real-ip']) {
        context.ip = IpParse(request.headers['x-real-ip'])
    }

    return context
}

// If a server or client doesn't send in the entire profile this does not mean
// the missing attributes in the payload equal to deleting them. Can only be set to null
function profileDifferences(currentProfile, newProfile) {
    let attributeUpdated = {}

    // Compare all attributes except for id, identifier, account_id
    Object.keys(currentProfile).forEach(key => {
        const value = currentProfile[key]
        if ((typeof value !== 'object' || value instanceof Array) && !lodash.isEqual(newProfile[key], value) && newProfile[key] !== undefined) {
            attributeUpdated[key] = newProfile[key]
        }
    })

    Object.keys(newProfile).forEach(key => {
        const newValue = newProfile[key]
        if (!lodash.isEqual(currentProfile[key], newValue) && !(currentProfile[key] === null && newValue === null || currentProfile[key] === undefined && newValue === null )) {
            attributeUpdated[key] = newValue
        }
    })

    if (attributeUpdated["id"]) {
        delete attributeUpdated["id"]
    }

    if (attributeUpdated["account_id"]) {
        delete attributeUpdated["account_id"]
    }

    if (attributeUpdated["identifier"]) {
        delete attributeUpdated["identifier"]
    }

    return attributeUpdated
}

function didDeviceUpdateLocation(device, newDevice) {
    if (device.location_accuracy !== newDevice.location_accuracy) {
        return true
    }

    if (device.location_latitude !== newDevice.location_latitude) {
        return true
    }

    if (device.location_longitude !== newDevice.location_longitude) {
        return true
    }


    return false
}

function didDeviceUpdateBeaconRegions(device, newDevice) {
    const oldRegions = device.ibeacon_monitoring_regions || []
    const newRegions = newDevice.ibeacon_monitoring_regions || []

    if (oldRegions.length !== newRegions.length) {
        return true
    }

    function compare(region1, region2) {
        if (region1.uuid === region2.uuid && region1.major === region2.major && region1.minor === region2.minor) {
            return 0
        }

        if (region1.uuid < region2.uuid && region1.major < region2.major && region1.minor < region2.minor) {
            return -1
        }

        return 1
    }

    oldRegions.sort(compare)
    newRegions.sort(compare)

    for (var i = 0; i < oldRegions.length; i++) {
        if (oldRegions[i].uuid != newRegions[i].uuid && oldRegions[i].major != newRegions[i].major && oldRegions[i].minor != newRegions.minor) {
            return true
        }
    }

    return false
}

function didDeviceUpdateGeofenceRegions(device, newDevice) {
    const oldRegions = device.geofence_monitoring_regions || []
    const newRegions = newDevice.geofence_monitoring_regions || []

    if (oldRegions.length !== newRegions.length) {
        return true
    }

    function compare(region1, region2) {
        if (region1.id < region2.id) {
            return -1
        }

        if (region1.id > region2.id) {
            return 1
        }

        return 0
    }

    oldRegions.sort(compare)
    newRegions.sort(compare)

    for (var i = 0; i < oldRegions.length; i++) {
        if (oldRegions[i].id !== newRegions[i].id) {
            return true
        }
    }

    return false
}

module.exports = function() {

    const handlers = {}

    handlers.create = function(request, reply) {

        function writeReplyError(status, body) {
            let response = JSON.stringify(body)
            reply.writeHead(status, {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(response, "utf-8")
            })
            reply.write(response)
            reply.end()
        }

        if (request.payload === null || request.payload === undefined || request.payload.data === null || request.payload.data === undefined) {
            return writeReplyError(400, { status: 400, error: "Expecting payload but got nothing" })
        }


        const currentScopes = request.auth.context.scopes

        if (!currentScopes.some(scope => AllowedScopes.includes(scope))) {
            return writeReplyError(403, { status: 403, error: "Insufficient permissions"})
        }

        const server = request.server
        const logger = server.plugins.logger.logger
        const methods = server.methods
        const deviceId = request.headers['x-rover-device-id'].toUpperCase()
        const accountId = request.auth.credentials.account.id
        const profilePayload = parseProfilePayload(request)
        const profilesNeedReindexing = []
        let deviceUpdated = false

        function reindexProfiles(profiles, callback) {
            profiles = lodash.uniqBy(profiles, 'id')
            
            let profileIds = profiles.map(p => p.id)
            logger.debug("Reindexing Profiles:", profileIds.join(', '))

            methods.device.findAllByProfileIds(accountId, profileIds, function(err, deviceIndex) {
                if (err) {
                    return callback(err)
                }

                profiles.forEach(function(profile) {
                    const devices = deviceIndex[profile.id] || []
                    methods.profile.index(profile, devices)
                })

                return callback()
            })
        }

        function createDeviceWithAnonymousProfile(accountId, deviceId, callback) {
            methods.profile.createAnonymousProfile(accountId, function(err, profile) {
                if (err) {
                    return callback()
                }


                methods.device.create(accountId, deviceId, profile.id, function(err, device) {
                    if (err) {
                        return callback(err)
                    }

                    return callback(null, device, profile)
                })
            })
        }

        function updateDeviceAndWriteResponse(profile, device, newDevice, response) {
            
            let tasks = []

            if (didDeviceUpdateLocation(device, newDevice)) {
                deviceUpdated = true
                logger.debug("Updating device's location: " + device.id)
                tasks.push(function(callback) {
                    methods.device.updateLocation(accountId, device.id, newDevice.location_accuracy, newDevice.location_latitude, newDevice.location_longitude, function(err) {
                        if (err) {
                            logger.debug("Unable to update device's location:", err)
                        }

                        return callback()
                    })
                })
            }

            if (didDeviceUpdateBeaconRegions(device, newDevice)) {
                deviceUpdated = true
                logger.debug("Updating device's beacon regions: " + device.id)
                tasks.push(function(callback) {
                    methods.device.updateIBeaconRegions(accountId, device.id, newDevice.ibeacon_monitoring_regions, function(err) {
                        if (err) {
                            logger.debug("Unable to update device's ibeacon regions:", err)
                        }

                        return callback()
                    })
                })
            }

            if (didDeviceUpdateGeofenceRegions(device, newDevice)) {
                deviceUpdated = true
                logger.debug("Updating device's geofence regions: " + device.id)
                tasks.push(function(callback) {
                    methods.device.updateGeofenceRegions(accountId, device.id, newDevice.geofence_monitoring_regions, function(err) {
                        if (err) {
                            logger.debug("Unable to update device's geofence regions:", err)
                        }

                        return callback()
                    })
                })
            }

            if (deviceUpdated === true) {
                profilesNeedReindexing.push(profile)
            }

            if (profilesNeedReindexing.length >= 1) {
                tasks.push(function(callback) {
                    reindexProfiles(profilesNeedReindexing, callback)
                })
            }
            
            async.parallel(tasks, function() {
                // if errors occur we can't do much we should just return
                let jsonResponse = JSON.stringify(response);
                reply.writeHead(200, {
                    'Content-Type': 'application/json',
                    'Connection': 'keep-alive',
                    'Content-Length': Buffer.byteLength(jsonResponse, "utf-8")
                });

                reply.write(jsonResponse)

                return reply.end()
            })
        }

        function updateProfileAndProcessEvent(device, profile) {
            if (device.is_test_device) {
                logger.debug("Device: " + device.id + " is a test device automatically indexing")
                // Always re-index devices and profiles that have a test device
                profilesNeedReindexing.push(profile)
            }

            // we need to check what has changed between the current profile and the profile payload
            logger.debug("Updating profile: " + profile.id)
            let attributeUpdates = profileDifferences(profile, profilePayload)

            methods.profile.updateAttributes(accountId, profile.id, attributeUpdates, function(err) {
                if (err) {
                    logger.error(err)
                    return writeReplyError(500, { status: 500, error: "Unable to update profile attributes" })
                }

                if (Object.keys(attributeUpdates).length !== 0) {
                    profilesNeedReindexing.push(profile)
                }
                // Server doesn't send us back what the new profile looks like?
                // We do an in memory update
                Object.assign(profile, attributeUpdates)
                profile.updated_at = new Date()

                let args = {
                    server: request.server,
                    customer: profile,
                    device: device,
                    account: request.auth.credentials.account,
                    event: parseEventPayload(request)
                }
                
                logger.debug("Processing Event", args.event)

                let event = Event.init(args);

                // newrelic.setTransactionName(event.getTransactionName());
                event.process(function(err, newDevice, eventResponse) {
                    if (err) {
                        logger.error("Event Processing Error:", err)
                        const status = err.status || 500
                        const message = status < 500 && err.message ? err.message : "unknown"
                        return writeReplyError(status, { status: status, error: message })
                    }

                    return updateDeviceAndWriteResponse(profile, device, newDevice, eventResponse)
                })
            })
        }

        function findOrCreateDeviceById(accountId, deviceId, callback) {
            methods.device.findById(accountId, deviceId, function(err, device) {
                if (err) {
                    return callback(err)
                }

                if (device !== null && device !== undefined) {
                    return callback(null, device)
                }

                logger.debug("Device: " + deviceId + " was not found creating one")
                // the device doesn't exist so we must create it
                createDeviceWithAnonymousProfile(accountId, deviceId, function(err, device, profile) {
                    if (err) {
                        return callback(err)
                    }
                    
                    return callback(null, device)
                })
            })
        }

        function updateDeviceWithContext(accountId, device, deviceContext, callback) {
            // if there is no differences in context then we don't need to update
            let needsUpdate = false
            let tasks = []

            if (deviceContext === null) {
                logger.debug("Device: " + device.id + " did not provide a context")
                return callback(null, device)
            }

            Object.keys(deviceContext).forEach(key => {
                if (deviceContext[key] !== undefined && !lodash.isEqual(deviceContext[key], device[key])) {
                    logger.debug("NO MATCH: " + key + " from: " + JSON.stringify(device[key]) + " to: " + JSON.stringify(deviceContext[key]))
                    needsUpdate = true
                }
            })

            if (!needsUpdate) {
                logger.debug("Device: " + device.id + " does not need updating")
                return callback(null, device)
            }

            if (device.push_token !== deviceContext.push_token && deviceContext.push_token !== "") {
                logger.debug("Device token has changed from: " + device.push_token + " to: " + deviceContext.push_token)
                tasks.push(function(done) {
                    // Since push tokens are unique we can't have a device with the same push token
                    methods.device.findByPushToken(accountId, deviceContext.push_token, function(err, oldDevice) {
                        if (err) {
                            return done(err)
                        }

                        if (oldDevice === null || oldDevice === undefined) {
                            logger.debug("Device with push token: " + deviceContext.push_token + " does not exist continuing")
                            // we are good just continue
                            return done()
                        }

                        logger.debug("Device with push token: " + deviceContext.push_token + " exists deleting device: " + oldDevice.id)
                        methods.device.delete(accountId, oldDevice.id, function(err) {
                            if (err) {
                                return done(err)
                            }

                            methods.profile.findById(accountId, oldDevice.profile_id, function(err, oldProfile) {
                                if (oldProfile.identifier === null) {
                                    methods.profile.delete(accountId, oldProfile.id, function(err) {
                                        if (err) {
                                            // For some reason we weren't able to delete the old profile
                                            // just reindex it with 0 devices
                                            profilesNeedReindexing.push(oldProfile)
                                        }
                                        return done(err)
                                    })
                                } else {
                                    // This was an identified profile we should just reindex the new state
                                    profilesNeedReindexing.push(oldProfile)
                                    return done()
                                }
                            })
                        })
                    })    
                })
               
            }

            tasks.push(function(done) {
                logger.debug("Updating device with context: " + device.id)

                methods.device.updateDeviceWithContext(accountId, device.id, deviceContext, function(err) {
                    if (err) {
                        return done(err)
                    }

                    Object.assign(device, deviceContext)
                    deviceUpdated = true

                    return done(null, device)
                })
            })

            async.series(tasks, function(err, results) {
                if (err) {
                    return callback(err)
                }

                // Select the last function output as results can either be of length of 1 or 2
                return callback(null, results[results.length - 1])
            })
        }

        /*
            Initial Starting Logic
         */
        if (deviceId === null || deviceId === undefined) {
            return writeReplyError(400, { status: 400, error: "Device ID is not defined"})
        }
        
        findOrCreateDeviceById(accountId, deviceId, function(err, device) {
            if (err) {
                logger.error(err)
                return writeReplyError(500, { status: 500, error: "Could not lookup current device"})
            }

            const deviceContext = parseDevicePayload(request)

            updateDeviceWithContext(accountId, device, deviceContext, function(err, device) {
                if (err) {
                    logger.error(err)
                    return writeReplyError(500, { status: 500, error: "Could not update device context" })
                }


                // Grab the devices profile
                logger.debug("Getting device's current profile: " + device.profile_id)
                methods.profile.findById(accountId, device.profile_id, function(err, currentProfile) {
                    if (err) {
                        logger.error(err)
                        return writeReplyError(500, { status: 500, error: "Could not grab device's current profile" })
                    }

                    if (currentProfile === null) {
                        logger.error("Device: " + device.id + " does not have a profile")
                        return writeReplyError(500, { status: 500, error: "Device does not have a profile"})
                    }

                    if ((currentProfile.identifier !== null && currentProfile.identifier !== undefined) && (profilePayload.identifier === null || profilePayload.identifier === undefined)) {
                        // The device is reporting it is no longer identifying
                        logger.debug("Device: " + device.id + " has gone from: " + currentProfile.identifier + " to anonymous")
                        methods.profile.createAnonymousProfile(accountId, function(err, profile) {
                            if (err) {
                                logger.error(err)
                                return writeReplyError(500, { status: 500, error: "Unable to create anonymous profile" })
                            }

                            logger.debug("Device transfered from: " + currentProfile.id + " to: " + profile.id)
                            // new anonymous profile exists lets transfer device
                            methods.device.moveToProfile(accountId, device.id, profile.id, function(err) {
                                if (err) {
                                    logger.error(err)
                                    return writeReplyError(500, { status: 500, error: "Unable to transfer device to new anonymous profile" })
                                }

                                profilesNeedReindexing.push(currentProfile)
                                profilesNeedReindexing.push(profile)

                                // move to final logic branch
                                return updateProfileAndProcessEvent(device, profile)
                            })
                        })
                    } else if(currentProfile.identifier !== profilePayload.identifier) {
                        logger.debug("Device: " + device.id + " has switched profiles from: " + currentProfile.identifier + " to: " + profilePayload.identifier)
                        // The device is reporting that they are identifying as someone else
                        methods.profile.findByIdentifier(accountId, profilePayload.identifier, function(err, existingProfile) {
                            if (err) {
                                logger.error(err)
                                return writeReplyError(500, { status: 500, error: "Unable to find existing profile" })
                            }

                            let profileSetupFunction = null

                            if (existingProfile === null || existingProfile === undefined) {
                                logger.debug("Existing profile: " + profilePayload.identifier + " does not exist creating!")
                                profileSetupFunction = function(callback) {
                                    // there is no profile we need to create one and then transfer
                                    methods.profile.createIdentifiedProfile(accountId, profilePayload.identifier, function(err, newProfile) {
                                        if (err) {
                                            return callback(err)
                                        }

                                        profilesNeedReindexing.push(newProfile)
                                        return callback(null, newProfile)
                                    })
                                }
                            } else {
                                logger.debug("Existing profile: " + profilePayload.identifier + " already exists")
                                profileSetupFunction = function(callback) {
                                    profilesNeedReindexing.push(existingProfile)
                                    return callback(null, existingProfile)
                                }
                            }

                            profileSetupFunction(function(err, profile) {
                                if (err) {
                                    logger.error(err)
                                    return writeReplyError(500, { status: 500, error: "Unable to execute profile setup function" })
                                }

                                methods.device.moveToProfile(accountId, device.id, profile.id, function(err) {
                                    if (err) {
                                        logger.error(err)
                                        return writeReplyError(500, { status: 500, error: "Unable to update device's profile" })
                                    }

                                    logger.debug("Device transfered from: " + currentProfile.id + " to: " + profile.id)

                                    if (currentProfile.identifier === null || currentProfile.identifier === undefined) {
                                        logger.debug("Deleting old anonymous profile: " + currentProfile.id)
                                        methods.profile.delete(accountId, currentProfile.id, function(err) {
                                            // if we didn't delete its not the end of the world
                                            if (err) {
                                                logger.error(err)
                                                profilesNeedReindexing.push(currentProfile)
                                            }

                                            // move to final logic branch
                                            return updateProfileAndProcessEvent(device, profile)
                                        })
                                    } else {
                                        // move to final logic branch
                                        return updateProfileAndProcessEvent(device, profile)
                                    }
                                })
                            })
                        })
                    } else {
                        return updateProfileAndProcessEvent(device, currentProfile)
                    }

                })
            })
        })
    }

    return handlers
}