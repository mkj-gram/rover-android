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
			os_version: "1.3.1",
			os_name: "iOS",
			sdk_version: "1.7.11",
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

		let output = Device.deviceFromProto(Device.deviceToProto(input))

		expect(input).to.deep.equal(output)
	})

	it('builds device context request', function() {
		let ctx = {
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

		let proto = Device.deviceContextToProto(1, "ABC", ctx)

		expect(proto.getAuthContext()).to.not.be.undefined
		expect(proto.getAuthContext().getAccountId()).to.equal(1)
		expect(proto.getDeviceId()).to.equal("ABC")

		expect(proto.getPushEnvironment()).to.equal("production")
		expect(proto.getPushTokenKey()).to.equal("TOKENABC_123")
		expect(proto.getAppName()).to.equal("Rover Inbox")
		expect(proto.getAppVersion()).to.equal("1.4.1.beta")
		expect(proto.getAppBuild()).to.equal("Prod 52")
		expect(proto.getAppNamespace()).to.equal("io.rover.Rover")
		expect(proto.getDeviceManufacturer()).to.equal("Apple")
		expect(proto.getOsName()).to.equal("iOS")
		expect(proto.getOsVersion().toObject()).to.deep.equal({
			major: 1,
			minor: 2,
			revision: 3
		})
		expect(proto.getDeviceModel()).to.equal("iPhone 6s")
		expect(proto.getDeviceModelRaw()).to.equal("iPhone 8,1")

		let framworks = proto.getFrameworksMap()
		expect(framworks.get('io.rover.Rover')).to.not.be.undefined
		expect(framworks.get('io.rover.Rover').toObject()).to.deep.equal({
			major: 2,
			minor: 1,
			revision: 1
		})

		expect(proto.getLocaleLanguage()).to.equal("en")
		expect(proto.getLocaleRegion()).to.equal("ca")
		expect(proto.getLocaleScript()).to.equal("zz")
		expect(proto.getIsWifiEnabled()).to.equal(true)
		expect(proto.getIsCellularEnabled()).to.equal(true)
		expect(proto.getScreenWidth()).to.equal(480)
		expect(proto.getScreenHeight()).to.equal(720)
		expect(proto.getCarrierName()).to.equal("rogers")
		expect(proto.getRadio()).to.equal("LTE")
		expect(proto.getTimeZone()).to.equal("America/Toronto")
		expect(proto.getPlatform()).to.equal(AudienceProtobuf.Platform.MOBILE)
		expect(proto.getIsBackgroundEnabled()).to.equal(false)
		expect(proto.getIsLocationMonitoringEnabled()).to.equal(true)
		expect(proto.getIsBluetoothEnabled()).to.equal(true)
		expect(proto.getAdvertisingId()).to.equal("HJDIEJA-123BNAHA")
		expect(proto.getIp()).to.equal("127.0.0.1")
		expect(proto.getNotificationAuthorization()).to.equal(AudienceProtobuf.NotificationAuthorization.DENIED)
		
	})
})