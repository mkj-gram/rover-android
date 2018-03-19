var through2   = require('through2-concurrent')
var client     = require('@rover/audience-client').v1.Client()
var Apis       = require('@rover/apis')
var Generator  = require('./generator')
var Serializer = require('./serializer')
var promisify  = require('@rover-common/grpc-promisify')

promisify(client)

const argv = process.argv.slice(2)

argv.forEach(function(k, index) {
	if (k.startsWith('--')) {
		const env = k.substring(2).toUpperCase().replace(/-/, '_')
		const value = argv[index + 1]
		process.env[env] = value
	}
})

const numRecords = parseInt(process.env.NUM_RECORDS)
if (isNaN(numRecords)) {
	throw new TypeError("NUM_RECORDS must be set")
}

const account = parseInt(process.env.ACCOUNT_ID)
if (isNaN(account)) {
	throw new TypeError("ACCOUNT_ID must be set")
}

const context = new Apis.auth.v1.Models.AuthContext()
context.setAccountId(account)

var totalGenerated = 0
var generator = new Generator(numRecords, {})
generator.pipe(through2.obj(async function(obj, _, callback) {
	const { profile, device } = obj

	try {

		let req = new Apis.audience.v1.Models.CreateProfileRequest()
		req.setAuthContext(context)
		req.setIdentifier(profile.identifier)

		await client.createProfile(req)

		this.push(obj)
	} catch(err) {
		console.log(err)
		this.push(null)
	} finally {
		callback()
	}
})).pipe(through2.obj(async function(obj, _, callback) {
	// Update profile
	const { profile, device } = obj

	try {
		let req = new Apis.audience.v1.Models.UpdateProfileRequest()
		req.setIdentifier(profile.identifier)
		req.setAuthContext(context)

		Serializer.attributes(profile.attributes, req.getAttributesMap())

		await client.updateProfile(req)

		this.push(obj)
	} catch(err) {
		this.push(null)
		console.log(err)
	} finally {
		callback()
	}
})).pipe(through2.obj(async function(obj, _, callback) {
	// create device
	const { profile, device } = obj

	try {
		let req = new Apis.audience.v1.Models.CreateDeviceRequest()
		req.setAuthContext(context)
		req.setDeviceId(device.device_id)
		req.setProfileIdentifier(profile.identifier)
		
		await client.createDevice(req)

		this.push(obj)
	} catch(err) {
		console.log(err)
		this.push(null)
	} finally {
		callback()
	}

})).pipe(through2.obj(async function(obj, _, callback) {
	// update device
	const { profile, device } = obj

	try {
		let req = new Apis.audience.v1.Models.UpdateDeviceRequest()
		req.setAuthContext(context)
		req.setDeviceId(device.device_id)
		
		req.setPushTokenKey(device.push_token_key)
		req.setAppName(device.app_name)
		req.setAppVersion(device.app_version)
		req.setAppBuild(device.app_build)
		req.setAppNamespace(device.app_namespace)
		req.setDeviceManufacturer(device.device_manufacturer)
		req.setOsName(device.os_name)
		// os-version
		req.setDeviceModel(device.device_model)
		req.setDeviceModelRaw(device.device_model_raw)
		req.setLocaleLanguage(device.locale_language)
		req.setLocaleRegion(device.locale_region)
		req.setIsWifiEnabled(Serializer.boolean(device.is_wifi_enabled))
		req.setIsCellularEnabled(Serializer.boolean(device.is_cellular_enabled))
		req.setScreenWidth(device.screen_width)
		req.setScreenHeight(device.screen_height)
		req.setCarrierName(device.carrier_name)
		req.setRadio(device.radio)
		req.setPlatform(Serializer.platform("MOBILE"))
		req.setIsBackgroundEnabled(device.is_background_enabled)
		req.setIsLocationMonitoringEnabled(device.is_location_monitoring_enabled)
		req.setIsBluetoothEnabled(Serializer.boolean(device.is_bluetooth_enabled))
		req.setIp(device.ip)

		await client.updateDevice(req)

		this.push(obj)
	} catch(err) {
		console.log(err)
		this.push(null)
	} finally {
		callback()
	}
})).pipe(through2.obj(function(obj, _, callback) {
	if (obj !== null) {
		totalGenerated++
		const percentageDone = (totalGenerated/numRecords * 100).toFixed(2)
		process.stdout.clearLine();  // clear current text
		process.stdout.cursorTo(0);
		process.stdout.write(`${percentageDone}%`)

		if (totalGenerated == numRecords) {
			process.stdout.write("\n")
		}
	}
	callback()
})).on('end', function() {
	console.log("Finished")
}).resume()