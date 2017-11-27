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

	methods.fromProto = function(dp) {
		let device = {}
		device.id = dp.getDeviceId()
		device.account_id = dp.getAccountId()
		device.profile_id = dp.getProfileId()
		device.updated_at = RoverApis.Helpers.timestampFromProto(dp.getUpdatedAt())
		device.created_at = RoverApis.Helpers.timestampFromProto(dp.getCreatedAt())

		device.profile_identifier = dp.getProfileIdentifier()

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
		device.notification_authorization = notificationAuthorizationFromProto(dp.getNotificationAuthorization())
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

					let devices = reply.getDevicesList().map(d => methods.fromProto(d))

					return done(null, devices)
				})
			}
		})

		async.parallel(requests, function(err, results) {
			if (err) {
				logger.error(err)
				return callback(err)
			}

			let devices = results.
				filter(result => result !== undefined).
				reduce((acc, devices) => acc.concat(devices), [])

			return callback(null, devices)
		})
		
	}
	
	return methods
}
