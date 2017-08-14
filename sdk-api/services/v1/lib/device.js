const RoverApis = require('@rover/apis')
const grpc = require('grpc')
const async = require('async')

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
		const version = {}
		version.major = vp.getMajor()
		version.minor = vp.getMinor()
		version.revision = vp.getRevision()
		return version
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
			region.setMinor(region.minor)
		}

		return region
	}

	function deviceFromProto(dp) {
		let device = {}
		device.id = dp.getDeviceId()
		device.account_id = dp.getAccountId()
		device.profile_id = dp.getProfileId()
		device.updated_at = RoverApis.Helpers.timestampFromProto(dp.getUpdatedAt())
		device.created_at = RoverApis.Helpers.timestampFromProto(dp.getCreatedAt())

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
		device.location_accuracy = dp.getLocationAccuracy() === 0 ? null : dp.getLocationAccuracy()
		device.location_latitude = dp.getLocationLatitude() === 0 ? null : dp.getLocationLatitude()
		device.location_longitude = dp.getLocationLongitude() === 0 ? null : dp.getLocationLongitude()
		device.ibeacon_monitoring_regions_updated_at = RoverApis.Helpers.timestampFromProto(dp.getIbeaconMonitoringRegionsUpdatedAt())
		device.geofence_monitoring_regions_updated_at = RoverApis.Helpers.timestampFromProto(dp.getGeofenceMonitoringRegionsUpdatedAt())

		device.geofence_monitoring_regions = dp.getGeofenceMonitoringRegionsList().map(geofenceRegionFromProto)
		device.ibeacon_monitoring_regions = dp.getIbeaconMonitoringRegionsList().map(ibeaconRegionFromProto)

		device.is_test_device = dp.getIsTestDevice() || false

		return device
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

	methods.create = function(accountId, deviceId, profileId, callback) {
		let request = new RoverApis.audience.v1.Models.CreateDeviceRequest()
		request.setAuthContext(buildAuthContext(accountId))
		request.setDeviceId(deviceId)
		request.setProfileId(profileId)

		AudienceClient.createDevice(request, function(err, reply) {
			if (err) {
				return callback(err)
			}

			let device = {
				id: deviceId,
				account_id: accountId,
				profile_id: profileId
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

	methods.updateDeviceWithContext = function(accountId, deviceId, deviceContext, callback) {

  		let request = new RoverApis.audience.v1.Models.UpdateDeviceRequest()
  		request.setAuthContext(buildAuthContext(accountId))
  		request.setDeviceId(deviceId)

  		/*
  			Build Request
  		 */
  		request.setPushEnvironment(deviceContext.push_environment)
  		request.setPushTokenKey(deviceContext.push_token)
  		request.setAppName(deviceContext.app_name)
  		request.setAppVersion(deviceContext.app_version)
  		request.setAppBuild(deviceContext.app_build)
  		request.setAppNamespace(deviceContext.app_namespace)
  		request.setDeviceModel(deviceContext.device_model)
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

  		AudienceClient.updateDevice(request, function(err, reply) {
  			if (err) {
  				return callback(err)
  			}
  			
  			return callback()
  		})
	}

	methods.moveToProfile = function(accountId, deviceId, newProfileId, callback) {
		let request = new RoverApis.audience.v1.Models.SetDeviceProfileRequest()
		request.setAuthContext(buildAuthContext(accountId))
		request.setDeviceId(deviceId)
		request.setProfileId(newProfileId)

		AudienceClient.setDeviceProfile(request, function(err, reply) {
			if (err) {
				return callback(err)
			}

			return callback()
		})
	}

	methods.updateLocation = function(accountId, deviceId, accuracy, latitude, longitude, callback) {
		let request = new RoverApis.audience.v1.Models.UpdateDeviceLocationRequest()
		request.setAuthContext(buildAuthContext(accountId))
		request.setDeviceId(deviceId)
		request.setLocationAccuracy(accuracy)
		request.setLocationLatitude(latitude)
		request.setLocationLongitude(longitude)

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

	methods.findAllByProfileIds = function(accountId, profileIds, callback) {
		const authContext = buildAuthContext(accountId)

		let requests = profileIds.map(function(id) {
			return function(done) {
				let request = new RoverApis.audience.v1.Models.ListDevicesByProfileIdRequest()
				request.setAuthContext(authContext)
				request.setProfileId(id)

				AudienceClient.listDevicesByProfileId(request, function(err, reply) {
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

			let index = results.filter(result => result !== null).reduce(function(accumulator, result) {

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