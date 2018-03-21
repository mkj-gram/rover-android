const Helpers		= require('@rover/apis').Helpers
const Protobuf		= require('@rover/apis').protobuf.Models
const Audience 		= require('@rover/apis').audience.v1.Models

const { Struct, Version, Timestamp } = Protobuf
const { EventInput, DeviceEventInput, DeviceContext } = require('@rover/apis').event.v1.Models


function locationAuthorizationToProto(authorization) {
	switch (authorization) {
		case "not_determined", "notDetermined", "NOT_DETERMINED":
			return Audience.LocationAuthorization.Value.NOT_DETERMINED
		case "restricted", "RESTRICTED":
			return Audience.LocationAuthorization.Value.RESTRICTED
		case "denied", "DENIED":
			return Audience.LocationAuthorization.Value.DENIED
		case "authorized_when_in_use", "authorizedWhenInUse", "AUTHORIZED_WHEN_IN_USE":
			return Audience.LocationAuthorization.Value.AUTHORIZED_WHEN_IN_USE
		case "authorized_always", "authorizedAlways", "AUTHORIZED_ALWAYS":
			return Audience.LocationAuthorization.Value.AUTHORIZED_ALWAYS
		case "coarse", "COARSE":
			return Audience.LocationAuthorization.Value.COARSE
		case "fine", "FINE":
			return Audience.LocationAuthorization.Value.FINE
		default:
			return Audience.LocationAuthorization.Value.UNKNOWN
	}
}


function notificationAuthorizationToProto(authorization) {
	switch (authorization) {
		case "not_determined", "notDetermined", "NOT_DETERMINED":
			return Audience.NotificationAuthorization.Value.NOT_DETERMINED
		case "authorized", "AUTHORIZED":
			return Audience.NotificationAuthorization.Value.AUTHORIZED
		case "denied", "DENIED":
			return Audience.NotificationAuthorization.Value.DENIED
		default:
			return Audience.NotificationAuthorization.Value.UNKNOWN
	}
}

function pushEnvironmentToProto(environment) {
	switch (environment) {
		case "production":
			return Audience.PushEnvironment.Value.PRODUCTION
		case "development":
			return Audience.PushEnvironment.Value.DEVELOPMENT
		default:
			return Audience.PushEnvironment.Value.UNKNOWN
	}
}

function deviceContextToProto(context) {
	let dc = new DeviceContext()

	// dc.setDeviceId(context.id)
	dc.setProfileIdentifier(context.profileIdentifier)

	dc.setAttributes(Struct.fromJavaScript(context.attributes || {}))

	dc.setAppBuild(context.appBuild)
	dc.setAppName(context.appName)
	dc.setAppNamespace(context.appNamespace)
	dc.setAppVersion(context.appVersion)
	dc.setAppBadgeNumber(Protobuf.Int32Value.fromJavaScript(context.appBadgeNumber))

	dc.setDeviceManufacturer(context.deviceManufacturer)
	dc.setDeviceModel(context.deviceModel)
	dc.setDeviceName(context.deviceName)

	dc.setIsLocationServicesEnabled(Protobuf.BoolValue.fromJavaScript(context.isLocationServicesEnabled))
	dc.setLocationAuthorization(locationAuthorizationToProto(context.locationAuthorization))

	dc.setLocaleLanguage(context.localeLanguage)
	dc.setLocaleRegion(context.localeRegion)
	dc.setLocaleScript(context.localeScript)

	dc.setOperatingSystemName(context.operatingSystemName)
	dc.setOperatingSystemVersion(Version.fromJavaScript(context.operatingSystemVersion))

	dc.setNotificationAuthorization(notificationAuthorizationToProto(context.notificationAuthorization))

	dc.setPushEnvironment(pushEnvironmentToProto(context.pushEnvironment))
	dc.setPushToken(context.pushToken)

	dc.setRadio(context.radio)
	dc.setCarrierName(context.carrierName)
	dc.setTimeZone(context.timeZone)
	dc.setIp(context.ip)

	dc.setIsCellularEnabled(Protobuf.BoolValue.fromJavaScript(context.isCellularEnabled))
	dc.setIsWifiEnabled(Protobuf.BoolValue.fromJavaScript(context.isWifiEnabled))

	dc.setScreenWidth(context.screenWidth)
	dc.setScreenHeight(context.screenHeight)

	if (context.frameworks) {
		// map of string to version
		let frameworks = dc.getFrameworksMap()
		Object.keys(context.frameworks).forEach(function(key) {
			frameworks.set(key, Version.fromJavaScript(context.frameworks[key]))
		})
	}

	dc.setAdvertisingId(context.advertisingId)

	return dc
}

/**
 * Serializes a json representation of an event to the protobuf equivalent
 * @param  {Object} event
 * @return {Protobuf<event.Event>}
 */
function serializeEventInput(auth, event) {
	let e = new EventInput()

	e.setAuthContext(auth)

	e.setNamespace(event.namespace)
	e.setId(event.id)
	e.setName(event.name)

	// Timestamps
	e.setTimestamp(Timestamp.fromISOString(event.timestamp))
	e.setReceivedAt(Helpers.timestampToProto(event.receivedAt || new Date()))

	e.setAttributes(Struct.fromJavaScript(event.attributes || {}))

	return e
}

/**
 * Serializes a json representation of a device event to the protobuf equivalent
 * @param  {Object} event
 * @return {Protobuf<event.Event>}
 */
function serializeDeviceEvent(auth, event, deviceId, deviceContext) {
	const e = serializeEventInput(auth, event)

	const input = new DeviceEventInput()
	input.setDeviceId(deviceId)
	input.setContext(deviceContextToProto(deviceContext || {}))
	e.setDeviceEventInput(input)

	return e
}

module.exports = {
	serializeDeviceEvent: serializeDeviceEvent
}
