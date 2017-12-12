const async = require('async')
const lodash = require('lodash')
const ISO3611 = require('../../lib/iso-3611')
const IpParse = require("@rover-common/ip-parse")
const AllowedScopes = ["sdk", "web", "server"]
const Event = require('../../lib/event')
const Config = require('../../config')
const DeviceModelMappings = Config.get('/mappings/device_model')
const DeviceContextSkipKeys = [
  'device_model_raw',
  'profile_identifier' // it's a special attribute that has its own RPC, it shoudn't trigger update, so do not treat it as rest of context attrs
]

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

function parseCustomPayload(request) {
    let payload = {}
    // Do we need to underscore?
    let customAttrs = request.payload.data.attributes.user || {} //underscore(request.payload.data.attributes.user)

    Object.keys(customAttrs).forEach(key => {
        // Flatten out traits
        if (key === 'traits') {
            Object.assign(payload, customAttrs['traits'])
        } else {
            payload[key] = customAttrs[key]
        }
    })

    if (payload["id"]) {
        delete payload["id"]
    }

    if (payload["account_id"]) {
        delete payload["account_id"]
    }

    if (payload["identifier"] === undefined || payload["identifier"] === "") {
        payload["identifier"] = null
    }

    if (payload['tags'] === null) {
        payload['tags'] = []
    }

    return payload
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

    const profile = request.payload.data.attributes.user || {}
    const profile_identifier = profile.identifier || request.headers['x-rover-customer-id']

    let context = {
        profile_identifier: String( profile_identifier || ""),

        push_environment: input.development === true ? "development" : "production",
        push_token: String(input.token || ""),
        app_namespace: String(input['app-identifier'] || ""),
        device_manufacturer: String(input.manufacturer || ""),
        os_name: String(input['os-name'] || ""),
        os_version: parseVersion(input['os-version']),
        device_model: String(DeviceModelMappings[input.model] || input.model || ""),
        device_model_raw: String(input.model || ""),
        sdk_version: parseVersion(input['sdk-version']),
        locale_language: String((input['locale-lang'] || "")).toLowerCase(),
        locale_script: String((input['locale-script'] || "")).toLowerCase(),
        carrier_name: String((input['carrier'] || "")).toLowerCase(),
        platform: String(input['platform'] || input['os-name']),
        time_zone: String(input['time-zone'] || ""),
        is_background_enabled: input['background-enabled'] === true ? true : false,
        is_location_monitoring_enabled: input['location-monitoring-enabled'] === true ? true : false,
        is_bluetooth_enabled: input['bluetooth-enabled'] === true ? true : false,
        advertising_id: String(input.aid || ""),
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

    if (context.platform === 'iOS' && context.os_name === 'iOS' && input['local-notifications-enabled'] !== undefined) {
        context.notification_authorization = input['local-notifications-enabled'] === true ? 'authorized' : 'denied'
    }

    if (context.platform === 'Android' && context.os_name === 'Android' && input['notifications-enabled'] !== undefined) {
        context.notification_authorization = input['notifications-enabled'] === true ? 'authorized' : 'denied'
    }

    if (request.headers['x-real-ip']) {
        context.ip = IpParse(request.headers['x-real-ip'])
    }

    return context
}

// If a server or client doesn't send in the entire profile this does not mean
// the missing attributes in the payload equal to deleting them. Can only be set to null
function diffAttributes(aAttrs, bAttrs) {
    let diffAttrs = {}

    // Compare all attributes except for id, identifier, account_id
    // go through aAttrs and find keys which values differ/absent in bAttrs
    Object.keys(aAttrs).forEach(key => {
        const value = aAttrs[key]
        if ((typeof value !== 'object' || value instanceof Array) && !lodash.isEqual(bAttrs[key], value) && bAttrs[key] !== undefined) {
            diffAttrs[key] = bAttrs[key]
        }
    })

    // also go through bAttrs and find keys which values differ/absent in aAttrs
    Object.keys(bAttrs).forEach(key => {
        const newValue = bAttrs[key]
        if (!lodash.isEqual(aAttrs[key], newValue) && !(aAttrs[key] === null && newValue === null || aAttrs[key] === undefined && newValue === null )) {
            diffAttrs[key] = newValue
        }
    })

    // skip id,account_id/identifier attrs
    if (diffAttrs["id"]) {
        delete diffAttrs["id"]
    }

    if (diffAttrs["account_id"]) {
        delete diffAttrs["account_id"]
    }

    if (diffAttrs["identifier"]) {
        delete diffAttrs["identifier"]
    }

    return diffAttrs
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
        const customPayload = parseCustomPayload(request)
        let deviceUpdated = false

        // updates Location, BeaconRegions, GeofenseRegion in parallel
        function updateDeviceAndWriteResponse(device, newDevice, response) {
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

        // updates custom profile attributes
        function updateDeviceAndProcessEvent(device) {
            // we need to check what has changed between the current profile and the profile payload
            logger.debug("updating device: " + device.id)

            if (!device.attributes) {
              device.attributes = {}
            }

            let attributeUpdates = diffAttributes(device.attributes, customPayload)
            let customerProfile = {account_id: accountId, identifier: device.profile_identifier}

            methods.profile.findByIdentifier(accountId, device.profile_identifier, function(err, profile) {
              if (err) {
                logger.error("profile.findByIdentifier:", err)
                return writeReplyError(500, { status: 500, error: "Unable to update device attributes" })
              }

              if (profile) {
                customerProfile = profile
              }

              methods.device.updateCustomAttributes(accountId, device.id, attributeUpdates, function(err) {
                  if (err) {
                      logger.error("updateCustomAttributes:", err)
                      return writeReplyError(500, { status: 500, error: "Unable to update device attributes" })
                  }

                  // construct resulting device with updates
                  Object.assign(device.attributes, attributeUpdates)
                  device.updated_at = new Date()

                  let args = {
                      server: request.server,
                      customer: customerProfile,
                      device: device,
                      account: request.auth.credentials.account,
                      event: parseEventPayload(request)
                  }

                  logger.debug("Processing Event", args.event)

                  let event = Event.init(args);

                  // newrelic.setTransactionName(event.getTransactionName());
                  event.process(function(err, newDevice, eventResponse) {
                      if (err) {
                          logger.error("event.process:", err)
                          const status = err.status || 500
                          const message = status < 500 && err.message ? err.message : "unknown"
                          return writeReplyError(status, { status: status, error: message })
                      }

                      return updateDeviceAndWriteResponse(device, newDevice, eventResponse)
                  })
              })
            })
        }

        function findOrCreateDeviceById(accountId, deviceId, profileIdentifier, callback) {
            methods.device.findById(accountId, deviceId, function(err, device) {
                if (err) {
                    return callback(err)
                }

                if (device !== null && device !== undefined) {
                    return callback(null, device)
                }

                logger.debug("Device: " + deviceId + " was not found, creating one")

                methods.device.create(accountId, deviceId, profileIdentifier, function(err, device) {
                    if (err) {
                        return callback(err)
                    }

                    return callback(null, device)
                })
            })
        }

      // update device record with context
        function updateDeviceWithContext(accountId, device, deviceContext, callback) {
            // if there is no differences in context then we don't need to update
            let needsUpdate = false
            let tasks = []

            if (deviceContext === null || deviceContext === undefined) {
                logger.debug("Device: " + device.id + " did not provide a context")
                return callback(null, device)
            }

            // compare device context with device model attributes
          // figure out if update is necessary
            Object.keys(deviceContext).forEach(key => {
                if (!DeviceContextSkipKeys.includes(key) && deviceContext[key] !== undefined && !lodash.isEqual(deviceContext[key], device[key])) {
                    logger.debug("NO MATCH: " + key + " from: " + JSON.stringify(device[key]) + " to: " + JSON.stringify(deviceContext[key]))
                    needsUpdate = true
                }
            })

            if (!needsUpdate) {
                logger.debug("Device: " + device.id + " does not need updating")
                return callback(null, device)
            }

            // device push_token differs from the context's push_token
            if (device.push_token !== deviceContext.push_token && deviceContext.push_token !== "") {
                logger.debug("Device token has changed from: " + device.push_token + " to: " + deviceContext.push_token)
                tasks.push(function(done) {
                    // Since push tokens are unique we can't have a device with the same push token
                    // find a device with the same push_token
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
                        // delete device with the same push_token
                        methods.device.delete(accountId, oldDevice.id, function(err) {
                            if (err) {
                                return done(err)
                            }

                            return done()
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

        const deviceContext = parseDevicePayload(request)

        // finds by deviceId or creates a device
        findOrCreateDeviceById(accountId, deviceId, deviceContext.profile_identifier, function(err, device) {
            if (err) {
                logger.error(err)
                return writeReplyError(500, { status: 500, error: "Could not lookup current device"})
            }

            const deviceProfileIdentifier = device.profile_identifier

            // update device context
            updateDeviceWithContext(accountId, device, deviceContext, function(err, device) {
                if (err) {
                    logger.error("updateDeviceWithContext:", err)
                    return writeReplyError(500, { status: 500, error: "Could not update device context" })
                }

                logger.debug("setDeviceProfile:", deviceProfileIdentifier, deviceContext.profile_identifier)
                if (deviceProfileIdentifier !== deviceContext.profile_identifier) {
                    methods.device.setDeviceProfile(accountId, deviceId, deviceContext.profile_identifier, function(err) {
                        if (err) {
                            logger.error("setDeviceProfile:", err)
                            return writeReplyError(500, { status: 500, error: "Could not grab device's current profile" })
                        }

                      return updateDeviceAndProcessEvent(device)
                    })
                } else {
                    return updateDeviceAndProcessEvent(device)
                }
            })
        })
    }

    return handlers
}
