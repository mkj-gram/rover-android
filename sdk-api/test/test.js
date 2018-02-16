const expect 	= require('chai').expect
const RoverApis = require('@rover/apis')

describe('Device', function() {
	const Device = require('../services/v1/lib/device')()
	const AudienceProtobuf = RoverApis.audience.v1.Models

	it('maps to proto and back to javascript preserving values', function() {
		const now = new Date()

		let input = {
			id: "0FD8E4F8-132E-11E8-B642-0ED5F89F718B",
			account_id: 1, 
			updated_at: now,
			created_at: now,
			profile_id: "",
			profile_identifier: "My Identifier",
			attributes: {
				bool: true,
				tags: ["A", "B", "C"],
				drank_at: now
			},
			push_environment: "production",
			push_token: "AAAAAA",
			push_token_is_active: true,
			push_token_created_at: now,
			push_token_updated_at: now,
			push_token_unregistered_at: undefined, 
			app_name: "My App",
			app_build: "1.0B",
			app_namespace: "io.rover.Rover",
			device_manufacturer: "Apple",
			device_model: "iPhone 6s",
			os_version: {
				major: 1,
				minor: 3,
				revision: 1
			},
			os_name: "iOS",
			sdk_version:{
				major: 1,
				minor: 7,
				revision: 11
			},
			locale_language: "en",
			locale_region: "ca",
			locale_script: "",
			is_wifi_enabled: true,
			is_cellular_enabled: true,
			screen_width: 120,
			screen_height: 40,
			carrier_name: "rogers",
			radio: "LTE",
			time_zone: "America/Toronto",
			platform: "iOS",
			is_background_enabled: true,
			is_location_monitoring_enabled: false,
			is_bluetooth_enabled: false,
			advertising_id: "FE653B90-132D-11E8-B642-0ED5F89F718B",
			ip: '192.168.1.1',
			notification_authorization: "denied",
			location_accuracy: 22,
			location_latitude: 43.11,
			location_longitude: -73.332,
			location_country: "Canada",
			location_state: "Ontario",
			location_city: "Toronto",
			ibeacon_monitoring_regions_updated_at: now,
			geofence_monitoring_regions_updated_at: now,
			geofence_monitoring_regions: [
				{
					id: "12:23:3",
					latitude: 12,
					longitude: 23,
					radius: 3
				}
			],
			ibeacon_monitoring_regions: [
				{
					uuid: "DA12AFF6-132E-11E8-B642-0ED5F89F718B",
					major: 2,
					minor: 331
				}
			],
			is_test_device: false,
			label: "Rover Test Device"
		}

		// Make sure we can serialize to binary and not throw any assertion errors
		const got = Device.deviceFromProto(AudienceProtobuf.Device.deserializeBinary(Device.deviceToProto(input).serializeBinary()))

		expect(input).to.deep.equal(got)
	})

	it('accepts strings as version numbers and returns parsed objects', function() {
	
		const input = {
			os_version: "1.3.4",
			sdk_version: "3.111.3"
		}

		const exp = {
			os_version: {
				major: 1,
				minor: 3,
				revision: 4
			},
			sdk_version: {
				major: 3,
				minor: 111,
				revision: 3
			}
		}

		// Make sure we can serialize to binary and not throw any assertion errors
		const got = Device.deviceFromProto(AudienceProtobuf.Device.deserializeBinary(Device.deviceToProto(input).serializeBinary()))

		expect(got).to.deep.include(exp)
	})

	it('builds device context request', function() {
		const input = {
			push_environment: "production",
			push_token: "TOKENABC_123",
			app_name: "Rover Inbox",
			app_version: "1.4.1.beta",
			app_build: "Prod 52",
			app_namespace: "io.rover.Rover",
			device_manufacturer: "Apple",
			os_name: "iOS",
			os_version: "1.2.3",
			device_model: "iPhone 6s",
			device_model_raw: "iPhone 8,1",
			sdk_version: "2.1.1",
			locale_language: "en",
			locale_region: "ca",
			locale_script: "zz",
			is_wifi_enabled: true,
			is_cellular_enabled: true,
			screen_width: 480,
			screen_height: 720,
			carrier_name: "rogers",
			radio: "LTE",
			time_zone: "America/Toronto",
			platform: "iOS",
			is_background_enabled: false,
			is_location_monitoring_enabled: true,
			is_bluetooth_enabled: true,
			advertising_id: "HJDIEJA-123BNAHA",
			ip: "127.0.0.1",
			notification_authorization: "denied"
		}

		

		const exp = {
			push_environment: AudienceProtobuf.PushEnvironment.Value.PRODUCTION,
			push_token: "TOKENABC_123",
			app_name: "Rover Inbox",
			app_version: "1.4.1.beta",
			app_build: "Prod 52",
			app_namespace: "io.rover.Rover",
			device_manufacturer: "Apple",
			os_name: "iOS",
			os_version: {
				major: 1,
				minor: 2,
				revision: 3
			},
			device_model: "iPhone 6s",
			device_model_raw: "iPhone 8,1",
			sdk_version: {
				major: 2,
				minor: 1,
				revision: 1
			},
			locale_language: "en",
			locale_region: "ca",
			locale_script: "zz",
			is_wifi_enabled: true,
			is_cellular_enabled: true,
			screen_width: 480,
			screen_height: 720,
			carrier_name: "rogers",
			radio: "LTE",
			time_zone: "America/Toronto",
			platform: AudienceProtobuf.Platform.Value.MOBILE,
			is_background_enabled: false,
			is_location_monitoring_enabled: true,
			is_bluetooth_enabled: true,
			advertising_id: "HJDIEJA-123BNAHA",
			ip: "127.0.0.1",
			notification_authorization: AudienceProtobuf.NotificationAuthorization.Value.DENIED
		}

		const proto = Device.deviceContextToProto(1, "ABC", input)

		expect(proto.getAuthContext()).to.not.be.undefined
		expect(proto.getAuthContext().getAccountId()).to.equal(1)
		expect(proto.getDeviceId()).to.equal("ABC")

		const framworks = proto.getFrameworksMap()
		expect(framworks.get('io.rover.Rover')).to.not.be.undefined


		const got = {
			push_environment: proto.getPushEnvironment(),
			push_token: proto.getPushTokenKey(),
			app_name: proto.getAppName(),
			app_version: proto.getAppVersion(),
			app_build: proto.getAppBuild(),
			app_namespace: proto.getAppNamespace(),
			device_manufacturer: proto.getDeviceManufacturer(),
			os_name: proto.getOsName(),
			os_version: proto.getOsVersion().toObject(),
			device_model: proto.getDeviceModel(),
			device_model_raw: proto.getDeviceModelRaw(),
			sdk_version: framworks.get('io.rover.Rover').toObject(),
			locale_language: proto.getLocaleLanguage(),
			locale_region: proto.getLocaleRegion(),
			locale_script: proto.getLocaleScript(),
			is_wifi_enabled: proto.getIsWifiEnabled(),
			is_cellular_enabled: proto.getIsCellularEnabled(),
			screen_width: proto.getScreenWidth(),
			screen_height: proto.getScreenHeight(),
			carrier_name: proto.getCarrierName(),
			radio: proto.getRadio(),
			time_zone: proto.getTimeZone(),
			platform: proto.getPlatform(),
			is_background_enabled: proto.getIsBackgroundEnabled(),
			is_location_monitoring_enabled: proto.getIsLocationMonitoringEnabled(),
			is_bluetooth_enabled: proto.getIsBluetoothEnabled(),
			advertising_id: proto.getAdvertisingId(),
			ip: proto.getIp(),
			notification_authorization: proto.getNotificationAuthorization()
		}

	
		expect(exp).to.deep.equal(got)
		
	})
})