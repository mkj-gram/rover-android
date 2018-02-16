const RoverApis = require('@rover/apis')
const grpc = require('grpc')
const util = require('util')
const async = require('async')
const moment = require('moment')

module.exports = function(AudienceClient, logger) {
	let methods = {}

	function buildAuthContext(accountId) {
		const context = new RoverApis.auth.v1.Models.AuthContext()
		context.setAccountId(accountId)
		context.setPermissionScopesList(['internal', 'app:sdk-api'])
		return context
	}

	function versionFromProto(vp) {
		if (vp === null || vp === undefined) {
			return null
		}

		return {
			major: vp.getMajor(),
			minor: vp.getMinor(),
			revision: vp.getRevision()
		}
	}

	function versionToProto(v) {
		if (v === null || v === undefined) {
			return null
		}

		let version = new RoverApis.audience.v1.Models.Version()
		if (typeof v === 'string') {
			let parts = v.split('.')
			version.setMajor(parseInt(parts[0]) || 0)
			version.setMinor(parseInt(parts[1]) || 0)
			version.setRevision(parseInt(parts[2]) || 0)
			return version
		} else if(typeof v === 'object') {
			version.setMajor(v.major)
			version.setMinor(v.minor)
			version.setRevision(v.revision)
			return version
		} else {
			return null
		}

	}

	function notificationAuthorizationFromProto(n) {
		switch (n) {
			case RoverApis.audience.v1.Models.NotificationAuthorization.UNKNOWN:
				return "unknown"
			case RoverApis.audience.v1.Models.NotificationAuthorization.NOT_DETERMINED:
				return "not_determined"
			case RoverApis.audience.v1.Models.NotificationAuthorization.DENIED:
				return "denied"
			case RoverApis.audience.v1.Models.NotificationAuthorization.AUTHORIZED:
				return "authorized"
			default:
				return "unknown"
		}
	}

	function notificationAuthorizationToProto(n) {
		switch (n) {
			case "unknown":
				return RoverApis.audience.v1.Models.NotificationAuthorization.UNKNOWN
			case "not_determined":
				return RoverApis.audience.v1.Models.NotificationAuthorization.NOT_DETERMINED
			case "denied":
				return RoverApis.audience.v1.Models.NotificationAuthorization.DENIED
			case "authorized":
				return RoverApis.audience.v1.Models.NotificationAuthorization.AUTHORIZED
			default:
				return RoverApis.audience.v1.Models.NotificationAuthorization.UNKNOWN
		}
	}

	
	function geofenceRegionFromProto(gp) {
  		const region = {}
  		region.id = gp.getId()
  		region.latitude = gp.getLatitude()
  		region.longitude = gp.getLongitude()
  		region.radius = gp.getRadius()
  		return region
	}

	function geofenceRegionToProto(geofence) {
		const region  = new RoverApis.audience.v1.Models.GeofenceRegion()
		region.setId(geofence.id)
		region.setLatitude(geofence.latitude)
		region.setLongitude(geofence.longitude)
		region.setRadius(geofence.radius)
		return region
	}

	function ibeaconRegionFromProto(ibp) {
		const region = {}
		region.uuid = ibp.getUuid()
		region.major = ibp.getMajor() < 0 ? null : ibp.getMajor()
		region.minor = ibp.getMinor() < 0 ? null : ibp.getMinor()
		return region
	}

	function ibeaconRegionToProto(ibeacon) {
		const region = new RoverApis.audience.v1.Models.IBeaconRegion()
		region.setUuid(ibeacon.uuid)
		if (ibeacon.major === null) {
			region.setMajor(-1)
		} else {
			region.setMajor(ibeacon.major)
		}

		if (ibeacon.minor === null) {
			region.setMinor(-1)
		} else {
			region.setMinor(ibeacon.minor)
		}
		
		return region
	}


	function isInteger(n) {
		return Number(n) === n && n % 1 === 0
	}

	function isFloat(n) {
		return Number(n) === n && n % 1 !== 0
	}

	function valueFromProto(value) {
		if (!value.getValueTypeCase) {
			return undefined
		}

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
				protoValue.setTimestampValue(RoverApis.Helpers.timestampToProto(moment.parseZone(value).toDate()))
		} else if(util.isString(value)) {
				protoValue.setStringValue(value)
		} else if(value === null) {
				protoValue.setNullValue(RoverApis.audience.v1.Models.Null.NULL)
		} else if(util.isArray(value)) {
				const strings  = value.filter(v => { return util.isString(v) })
				const stringArray = new RoverApis.audience.v1.Models.Value.StringArray()
				stringArray.setValuesList(strings)
				protoValue.setStringArrayValue(stringArray)
		} else {
			return null
		}

		return protoValue
	}

	function attributesFromProto(attrMap) {
		let attrs = {};

		attrMap.keys().arr_.forEach(key => {
			attrs[key] = valueFromProto(attrMap.get(key))
		})

		return attrs
	}

	function attributesToProto(attrMap, attrs) {
		if (attrs === null || attrs === undefined) {
			return
		}
		
		Object.keys(attrs).forEach(key => {
			const value = valueToProto(attrs[key])
			if (value) {
				attrMap.set(key, value)
			}
		})
	}

	function deviceFromProto(dp) {
		let device = {}
		device.id = dp.getDeviceId()
		device.account_id = dp.getAccountId()
		device.updated_at = RoverApis.Helpers.timestampFromProto(dp.getUpdatedAt())
		device.created_at = RoverApis.Helpers.timestampFromProto(dp.getCreatedAt())

		// deprecated: use profile_identifier to reference profile
		device.profile_id = dp.getProfileId()
		device.profile_identifier = dp.getProfileIdentifier()
		device.attributes = attributesFromProto(dp.getAttributesMap())

		// Tokens
		device.push_environment = dp.getPushEnvironment()
		device.push_token = dp.getPushTokenKey()
		device.push_token_is_active = dp.getPushTokenIsActive()
		device.push_token_created_at = RoverApis.Helpers.timestampFromProto(dp.getPushTokenCreatedAt())
		device.push_token_updated_at = RoverApis.Helpers.timestampFromProto(dp.getPushTokenUpdatedAt())
		device.push_token_unregistered_at = RoverApis.Helpers.timestampFromProto(dp.getPushTokenUnregisteredAt())

		device.app_name = dp.getAppName()
		device.app_build = dp.getAppBuild(),
		device.app_namespace = dp.getAppNamespace()
		device.device_manufacturer = dp.getDeviceManufacturer()
		device.device_model = dp.getDeviceModel()
		device.os_version = versionFromProto(dp.getOsVersion())
		device.os_name = dp.getOsName()
		device.sdk_version = versionFromProto(dp.getFrameworksMap().get('io.rover.Rover'))
		device.locale_language = dp.getLocaleLanguage()
		device.locale_region = dp.getLocaleRegion()
		device.locale_script = dp.getLocaleScript()
		device.is_wifi_enabled = dp.getIsWifiEnabled()
		device.is_cellular_enabled = dp.getIsCellularEnabled()
		device.screen_width = dp.getScreenWidth()
		device.screen_height = dp.getScreenHeight()
		device.carrier_name = dp.getCarrierName()
		device.radio = dp.getRadio()
		device.time_zone = dp.getTimeZone()
		device.platform = dp.getPlatform() === 1 ? dp.getOsName() : "Web"
		device.is_background_enabled = dp.getIsBackgroundEnabled()
		device.is_location_monitoring_enabled = dp.getIsLocationMonitoringEnabled()
		device.is_bluetooth_enabled = dp.getIsBluetoothEnabled()
		device.advertising_id = dp.getAdvertisingId()
		device.ip = dp.getIp()
		device.notification_authorization = notificationAuthorizationFromProto(dp.getNotificationAuthorization())

		device.location_accuracy = dp.getLocationAccuracy() === 0 ? null : dp.getLocationAccuracy()
		device.location_latitude = dp.getLocationLatitude() === 0 ? null : dp.getLocationLatitude()
		device.location_longitude = dp.getLocationLongitude() === 0 ? null : dp.getLocationLongitude()
		device.location_country = dp.getLocationCountry()
		device.location_state 	= dp.getLocationState()
		device.location_city 	= dp.getLocationCity()

		device.ibeacon_monitoring_regions_updated_at = RoverApis.Helpers.timestampFromProto(dp.getIbeaconMonitoringRegionsUpdatedAt())
		device.geofence_monitoring_regions_updated_at = RoverApis.Helpers.timestampFromProto(dp.getGeofenceMonitoringRegionsUpdatedAt())

		device.geofence_monitoring_regions = dp.getGeofenceMonitoringRegionsList().map(geofenceRegionFromProto)
		device.ibeacon_monitoring_regions = dp.getIbeaconMonitoringRegionsList().map(ibeaconRegionFromProto)

		device.is_test_device = dp.getIsTestDevice() || false
		device.label = dp.getLabel()

		return device
	}

	// export private function
	methods.deviceFromProto = deviceFromProto
	
	methods.deviceToProto = function(device) {
		let dp = new RoverApis.audience.v1.Models.Device()

		dp.setDeviceId(device.id)
		dp.setAccountId(device.account_id)
		dp.setProfileId(device.profile_id)
		dp.setUpdatedAt(RoverApis.Helpers.timestampToProto(device.updated_at))
		dp.setCreatedAt(RoverApis.Helpers.timestampToProto(device.created_at))

		dp.setProfileIdentifier(device.profile_identifier)

		// custom attributes
		attributesToProto(dp.getAttributesMap(), device.attributes)

		// Tokens
		dp.setPushEnvironment(device.push_environment)
		dp.setPushTokenKey(device.push_token)
		dp.setPushTokenIsActive(device.push_token_is_active)
		dp.setPushTokenCreatedAt(RoverApis.Helpers.timestampToProto(device.push_token_created_at))
		dp.setPushTokenUpdatedAt(RoverApis.Helpers.timestampToProto(device.push_token_updated_at))
		dp.setPushTokenUnregisteredAt(RoverApis.Helpers.timestampToProto(device.push_token_unregistered_at))

		dp.setAppName(device.app_name)
		dp.setAppBuild(device.app_build),
		dp.setAppNamespace(device.app_namespace)
		dp.setDeviceManufacturer(device.device_manufacturer)
		dp.setDeviceModel(device.device_model)
		dp.setOsVersion(versionToProto(device.os_version))
		dp.setOsName(device.os_name)

		let frameworks = dp.getFrameworksMap()
		const v = versionToProto(device.sdk_version)
		if (v) {
			frameworks.set('io.rover.Rover', v)
		}
		
		dp.setLocaleLanguage(device.locale_language)
		dp.setLocaleRegion(device.locale_region)
		dp.setLocaleScript(device.locale_script)
		dp.setIsWifiEnabled(device.is_wifi_enabled)
		dp.setIsCellularEnabled(device.is_cellular_enabled)
		dp.setScreenWidth(device.screen_width)
		dp.setScreenHeight(device.screen_height)
		dp.setCarrierName(device.carrier_name)
		dp.setRadio(device.radio)
		dp.setTimeZone(device.time_zone)
		if (device.platform === "iOS" || device.platform === "Android") {
			dp.setPlatform(1)
		} else {
			dp.setPlatform(2)
		}
		
		
		dp.setIsBackgroundEnabled(device.is_background_enabled)
		dp.setIsLocationMonitoringEnabled(device.is_location_monitoring_enabled)
		dp.setIsBluetoothEnabled(device.is_bluetooth_enabled)
		dp.setAdvertisingId(device.advertising_id)
		dp.setIp(device.ip)
		dp.setNotificationAuthorization(notificationAuthorizationToProto(device.notification_authorization))

		dp.setLocationAccuracy(device.location_accuracy)
		dp.setLocationLatitude(device.location_latitude)
		dp.setLocationLongitude(device.location_longitude)
		dp.setLocationCountry(device.location_country)
		dp.setLocationState(device.location_state)
		dp.setLocationCity(device.location_city)

		dp.setIbeaconMonitoringRegionsUpdatedAt(RoverApis.Helpers.timestampToProto(device.ibeacon_monitoring_regions_updated_at))
		dp.setGeofenceMonitoringRegionsUpdatedAt(RoverApis.Helpers.timestampToProto(device.geofence_monitoring_regions_updated_at))

		dp.setGeofenceMonitoringRegionsList((device.geofence_monitoring_regions || []).map(geofenceRegionToProto))
		dp.setIbeaconMonitoringRegionsList((device.ibeacon_monitoring_regions || []).map(ibeaconRegionToProto))

		dp.setIsTestDevice(device.is_test_device)
		dp.setLabel(device.label)

		return dp
	}

	methods.findById = function(accountId, deviceId, callback) {
		let request = new RoverApis.audience.v1.Models.GetDeviceRequest()
		request.setAuthContext(buildAuthContext(accountId))
		request.setDeviceId(deviceId)

		AudienceClient.getDevice(request, function(err, reply) {
			if (err) {
				if (err.code === grpc.status.NOT_FOUND) {
					return callback(null, null)
				} else {
					return callback(err)
				}
			}

			if (reply.getDevice === null) {
				// Audience service is not responding correctly
				return callback(new Error("device.findById expecting device in response but got nothing"))
			}

			let device = deviceFromProto(reply.getDevice())

			return callback(null, device)

		})

	}


	methods.create = function(accountId, deviceId, profileIdentifier, callback) {
		let request = new RoverApis.audience.v1.Models.CreateDeviceRequest()
		request.setAuthContext(buildAuthContext(accountId))
		request.setMs12(true)
		request.setDeviceId(deviceId)
		request.setProfileIdentifier(profileIdentifier)

		AudienceClient.createDevice(request, function(err, reply) {
			if (err) {
				return callback(err)
			}

			let device = {
				id: deviceId,
				account_id: accountId,
				profile_identifier: profileIdentifier
			}

			return callback(null, device)
		})

	}

	methods.delete = function(accountId, deviceId, callback) {
		let request = new RoverApis.audience.v1.Models.DeleteDeviceRequest()
		request.setAuthContext(buildAuthContext(accountId))
		request.setDeviceId(deviceId)

		AudienceClient.deleteDevice(request, function(err, reply) {
			if (err) {
				return callback(err)
			}

			return callback()
		})
	}

	methods.deviceContextToProto = function(accountId, deviceId, deviceContext) {
		let request = new RoverApis.audience.v1.Models.UpdateDeviceRequest()
		/*
  			Build Request
  		 */
  		request.setAuthContext(buildAuthContext(accountId))
  		request.setDeviceId(deviceId)
  		request.setPushEnvironment(deviceContext.push_environment)
  		request.setPushTokenKey(deviceContext.push_token)
  		request.setAppName(deviceContext.app_name)
  		request.setAppVersion(deviceContext.app_version)
  		request.setAppBuild(deviceContext.app_build)
  		request.setAppNamespace(deviceContext.app_namespace)
  		request.setDeviceModel(deviceContext.device_model)
  		request.setDeviceModelRaw(deviceContext.device_model_raw)
  		request.setDeviceManufacturer(deviceContext.device_manufacturer)
  		request.setOsName(deviceContext.os_name)
  		request.setOsVersion(versionToProto(deviceContext.os_version))

  		let frameworks = request.getFrameworksMap()
  		let sdkVersion = versionToProto(deviceContext.sdk_version)
  		if (sdkVersion) {
  			frameworks.set('io.rover.Rover', versionToProto(deviceContext.sdk_version))
  		}

  		request.setLocaleLanguage(deviceContext.locale_language)
  		request.setLocaleRegion(deviceContext.locale_region)
  		request.setLocaleScript(deviceContext.locale_script)
  		request.setIsWifiEnabled(deviceContext.is_wifi_enabled)
  		request.setIsCellularEnabled(deviceContext.is_cellular_enabled)
  		request.setScreenWidth(deviceContext.screen_width)
  		request.setScreenHeight(deviceContext.screen_height)
  		request.setCarrierName(deviceContext.carrier_name)
  		request.setRadio(deviceContext.radio)
  		request.setTimeZone(deviceContext.time_zone)
  		if (deviceContext.platform === "iOS" || deviceContext.platform === "Android") {
  			request.setPlatform(1)
  		} else {
  			request.setPlatform(2)
  		}
  		request.setIsBackgroundEnabled(deviceContext.is_background_enabled)
  		request.setIsLocationMonitoringEnabled(deviceContext.is_location_monitoring_enabled)
  		request.setIsBluetoothEnabled(deviceContext.is_bluetooth_enabled)
  		request.setAdvertisingId(deviceContext.advertising_id)
  		request.setIp(deviceContext.ip)
  		request.setNotificationAuthorization(notificationAuthorizationToProto(deviceContext.notification_authorization))

  		return request
	}

	methods.updateDeviceWithContext = function(accountId, deviceId, deviceContext, callback) {
		let request = methods.deviceContextToProto(accountId, deviceId, deviceContext)

  		AudienceClient.updateDevice(request, function(err, reply) {
  			if (err) {
  				return callback(err)
  			}

  			return callback()
  		})
	}


	methods.updateCustomAttributes = function(accountId, deviceId, attributeUpdates, callback) {
		if (Object.keys(attributeUpdates).length === 0) {
			return callback()
		}

		let request = new RoverApis.audience.v1.Models.UpdateDeviceCustomAttributesRequest()
		request.setAuthContext(buildAuthContext(accountId))
		request.setDeviceId(deviceId)

		let attributes = request.getAttributesMap()

		Object.keys(attributeUpdates).forEach(key => {
			const value = valueToProto(attributeUpdates[key])
			if (value) {
				attributes.set(key, value)
			}
		})

		logger.debug("UpdateCustomAttributes:", JSON.stringify(request.toObject()))
		AudienceClient.updateDeviceCustomAttributes(request, function(err, reply) {
			if (err) {
				return callback(err)
			}

			return callback()
		})
	}

	methods.setDeviceProfileIdentifier = function(accountId, deviceId, profileIdentifier, callback) {
		let request = new RoverApis.audience.v1.Models.SetDeviceProfileIdentifierRequest()
  
		request.setAuthContext(buildAuthContext(accountId))
		request.setDeviceId(deviceId)
		request.setProfileIdentifier(profileIdentifier || "")

		logger.debug("setDeviceProfile:", JSON.stringify(request.toObject()))
		AudienceClient.setDeviceProfileIdentifier(request, function(err, reply) {
			if (err) {
				return callback(err)
			}

			return callback()
		})
	}

	/**
	 * Update the devices location
	 * @param  {Integer}   accountId
	 * @param  {String}   deviceId  
	 * @param  {Object}   location
	 * @param  {Function} callback
	 *
	 * `location` object has the following properties
	 * @param  {Integer}	accuracy
	 * @param  {Float}   	longitude
	 * @param  {Float}   	latitude
	 * @param  {String}   	country
	 * @param  {String}   	state
	 * @param  {String}   	city
	 */
	methods.updateLocation = function(accountId, deviceId, location, callback) {
		if (!location) {
			return callback()
		}

		let {
			accuracy,
			longitude,
			latitude,
			country,
			state,
			city
		} = location

		let request = new RoverApis.audience.v1.Models.UpdateDeviceLocationRequest()
		request.setAuthContext(buildAuthContext(accountId))
		request.setDeviceId(deviceId)
		request.setLocationAccuracy(accuracy)
		request.setLocationLatitude(latitude)
		request.setLocationLongitude(longitude)
		request.setLocationCountry(country)
		request.setLocationState(state)
		request.setLocationCity(city)

		AudienceClient.updateDeviceLocation(request, function(err, reply) {
			if (err) {
				return callback(err)
			}

			return callback()
		})
	}

	methods.updateIBeaconRegions = function(accountId, deviceId, ibeaconRegions, callback) {
		let request = new RoverApis.audience.v1.Models.UpdateDeviceIBeaconMonitoringRequest()
		request.setAuthContext(buildAuthContext(accountId))
		request.setDeviceId(deviceId)
 		request.setRegionsList(ibeaconRegions.map(ibeaconRegionToProto))

 		AudienceClient.updateDeviceIBeaconMonitoring(request, function(err, reply) {
 			if (err) {
 				return callback(err)
 			}

 			return callback()
 		})
	}

	methods.updateGeofenceRegions = function(accountId, deviceId, geofenceRegions, callback) {
		let request = new RoverApis.audience.v1.Models.UpdateDeviceGeofenceMonitoringRequest()
		request.setAuthContext(buildAuthContext(accountId))
		request.setDeviceId(deviceId)
 		request.setRegionsList(geofenceRegions.map(geofenceRegionToProto))

 		AudienceClient.updateDeviceGeofenceMonitoring(request, function(err, reply) {
 			if (err) {
 				return callback(err)
 			}

 			return callback()
 		})
	}

	methods.findByPushToken = function(accountId, pushToken, callback) {
		let request = new RoverApis.audience.v1.Models.GetDeviceByPushTokenRequest()
		request.setAuthContext(buildAuthContext(accountId))
		request.setPushTokenKey(pushToken)

		AudienceClient.getDeviceByPushToken(request, function(err, reply) {
			if (err) {
				if (err.code === grpc.status.NOT_FOUND) {
					return callback(null, null)
				}

				return callback(err)
			}

			let deviceProto = reply.getDevice()

			if (deviceProto === null || deviceProto === undefined) {
				return callback(new Error("device.findByPushToken expecting device in response but got nothing"))
			}

			let device = deviceFromProto(deviceProto)

			return callback(null, device)
		})
	}

	methods.findAllByProfileIdentifiers = function(accountId, profileIdentifiers, callback) {
		const authContext = buildAuthContext(accountId)

		let requests = profileIdentifiers.map(function(profileIdentifier) {
			return function(done) {
				let request = new RoverApis.audience.v1.Models.ListDevicesByProfileIdentifierRequest()
				request.setAuthContext(authContext)
        request.setMs12(true)
				request.setProfileIdentifier(profileIdentifier)

				AudienceClient.listDevicesByProfileIdentifier(request, function(err, reply) {
					if (err) {
						logger.error(err)
						// Don't error out just continue
						return done()
					}

					let devices = reply.getDevicesList().map(d => deviceFromProto(d))

					return done(null, devices)
				})
			}
		})

		async.parallel(requests, function(err, results) {
			if (err) {
				logger.error(err)
				return callback(err)
			}

			let index = results.filter(result => result !== undefined).reduce(function(accumulator, result) {

				result.forEach(function(result) {
					if (accumulator[result.profile_id] === undefined) {
						accumulator[result.profile_id] = []	
					}
					accumulator[result.profile_id].push(result)
				})

				return accumulator
			}, {})
			
			return callback(null, index)
		})
		
	}

	return methods
}
