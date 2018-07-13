const Client        = require('../lib/client')
const Serializer    = require('../lib/serializer')
const RoverApis     = require('@rover/apis')
const chai          = require('chai')
const Crypto        = require('crypto')
const expect        = chai.expect
const Consumer      = require('./consumer')

// Add promise assertion helpers
chai.use(require('chai-as-promised'))

describe('Client', function() {

	describe("connect", function() {

		it('calls callback upon success', function(done) {
			let client = new Client({ kafka: { 'metadata.broker.list': 'kafka:9092' }})
			client.connect()
				.then(_ => done())
				.catch(err => done(err))
				.then(_ => client.disconnect())
		})

	})

	describe('submit', function() {
		it('is rejected when connect() was not called before', function() {
			const client = new Client()
			return expect(client.submit()).to.be.rejectedWith('client is not connected: please call connect() before calling submit()')
		})

		it('is rejected when auth context is not defined', function(done) {
			const client = new Client()
			client.connect()
				.then(_ => {
					return expect(client.submit()).to.be.rejectedWith("auth is not defined or of type AuthContext").notify(done)
				})
				.catch(err => done(err))
				.then(_ => {
					client.disconnect()
				})
		})

		it('is rejected a partition key is empty', function(done) {
			const client = new Client()
			const context = new RoverApis.auth.v1.Models.AuthContext()

			client.connect()
				.then(_ => {
					return expect(client.submit(context)).to.be.rejectedWith("partition key cannot be empty").notify(done)
				})
				.catch(err => done(err))
				.then(_ => {
					client.disconnect()
				})
		})

		it('rejected when device is set but device identifier is empty', function(done) {
			const client = new Client()
			const context = new RoverApis.auth.v1.Models.AuthContext()

			client.connect()
				.then(_ => {
					return expect(client.submit(context, "1", {device: { deviceIdentifier: "" }})).to.be.rejectedWith("device.deviceIdentifier cannot be empty").notify(done)
				})
				.catch(err => done(err))
				.then(_ => {
					client.disconnect()
				})
		})


		// TODO
		// Need to make sure before this test runs the topic "test" exists within kafka
		
		it('submits a device event to kafka', function(done) {
			this.timeout(20000)

			const topic 	= "test"
			const client 	= new Client({ topic: topic })
			const consumer 	= new Consumer()

			// Use random ids to ensure we are always comparing the latest message in a kafka topic
			const eventId			= Crypto.randomBytes(16).toString("hex")
			const context 			= new RoverApis.auth.v1.Models.AuthContext()
			const deviceIdentifier 	= Crypto.randomBytes(16).toString("hex").toUpperCase()

			const input = {
				id: eventId,
				namespace: "rover",
				name: "location update",
				timestamp: "2018-02-19T16:00:59Z",
				attributes: {
					latitude: 43.111,
					longitude: -71.3621,
					accuracy: 200
				},
				device: {
					deviceIdentifier: deviceIdentifier,
					appBadgeNumber: 2,
					appBuild: "Prod 3.1 - OSX 13",
					appName: "AwesomeDoughnuts",
					appNamespace: "io.doughnut.App",
					appVersion: "3.1",
					attributes: {
						stringval: "hello",
						boolval: true
					},
					carrierName: "rogers",
					deviceManufacturer: "Apple",
					deviceModel: "iPhone 7,1",
					isCellularEnabled: true,
					isLocationServicesEnabled: true,
					isWifiEnabled: true,
					locationAuthorization: "UNKNOWN",
					localeLanguage: "en",
					localeRegion: "ca",
					localeScript: "zn",
					notificationAuthorization: "UNKNOWN",
					operatingSystemName: "iOS",
					operatingSystemVersion: "11.1.2",
					profileIdentifier: "hello@doughnuts.io",
					pushEnvironment: "production",
					pushToken: "84A24C504C965AD095F5BFD7FB2F4CA9AE017BBC270BCCD31E1D5B0BC94EAADC",
					radio: "LTE",
					screenWidth: 480,
					screenHeight: 720,
					sdkVersion: "2.0.0",
					timeZone: "America/Toronto",
					isTestDevice: true,
				}
			}

			consumer.connect()
				.then(_ => {
					consumer.subscribe(topic)
					return Promise.resolve()
				})
				.then(_ => consumer.seekLast(0))
				.then(_ => client.connect())
				.then(_ => client.submit(context, deviceIdentifier, input))
				.then(_ => consumer.next())
				.then(msg => {
					
					expect(msg).to.not.be.undefined
					expect(msg.length).to.equal(1)
					expect(msg[0].key.toString()).to.equal(deviceIdentifier)
					// Deserialize the kafka message back to protobuf
					const event = RoverApis.event.v1.Models.Event.deserializeBinary(msg[0].value)
					const dctx = event.getDevice()
					
					expect(dctx.getDeviceIdentifier()).to.equal(deviceIdentifier)

					const exp = {
						id: eventId,
						namespace: "rover",
						name: 'location update',
						attributes: { accuracy: 200, latitude: 43.111, longitude: -71.3621 },
						timestamp: new Date("2018-02-19T16:00:59.000Z"),
						device: {
							profileIdentifier: 'hello@doughnuts.io',
							appBadgeNumber: 2,
							appBuild: 'Prod 3.1 - OSX 13',
							appName: 'AwesomeDoughnuts',
							appNamespace: 'io.doughnut.App',
							appVersion: '3.1',
							attributes: { 
								boolval: true, 
								stringval: 'hello' 
							},
							carrierName: 'rogers',
							deviceManufacturer: 'Apple',
							deviceModel: 'iPhone 7,1',
							isCellularEnabled: true,
							isLocationServicesEnabled: true,
							isWifiEnabled: true,
							localeLanguage: 'en',
							localeRegion: 'ca',
							localeScript: 'zn',
							operatingSystemName: 'iOS',
							operatingSystemVersion: '11.1.2',
							pushToken: '84A24C504C965AD095F5BFD7FB2F4CA9AE017BBC270BCCD31E1D5B0BC94EAADC',
							radio: 'LTE',
							screenWidth: 480,
							screenHeight: 720,
							sdkVersion: "2.0.0",
							timeZone: 'America/Toronto',
							isTestDevice: true 
						} 
					}

					const got = {
						id: event.getId(),
						namespace: event.getNamespace(),
						name: event.getName(),
						attributes: event.getAttributes().toJavaScript(),
						timestamp: event.getTimestamp().toDate(),
						device: {
							profileIdentifier: dctx.getProfileIdentifier(),
							appBadgeNumber: dctx.getAppBadgeNumber().getValue(),
							appBuild: dctx.getAppBuild(),
							appName: dctx.getAppName(),
							appNamespace: dctx.getAppNamespace(),
							appVersion: dctx.getAppVersion(),
							attributes: dctx.getAttributes().toJavaScript(),
							carrierName: dctx.getCarrierName(),
							deviceManufacturer: dctx.getDeviceManufacturer(),
							deviceModel: dctx.getDeviceModel(),
							isCellularEnabled: dctx.getIsCellularEnabled().getValue(),
							isLocationServicesEnabled: dctx.getIsLocationServicesEnabled().getValue(),
							isWifiEnabled: dctx.getIsWifiEnabled().getValue(),
							localeLanguage: dctx.getLocaleLanguage(),
							localeRegion: dctx.getLocaleRegion(),
							localeScript: dctx.getLocaleScript(),
							operatingSystemName: dctx.getOperatingSystemName(),
							operatingSystemVersion: dctx.getOperatingSystemVersion().toStringValue(),
							pushToken: dctx.getPushToken(),
							radio: dctx.getRadio(),
							carrierName: dctx.getCarrierName(),
							screenWidth: dctx.getScreenWidth(),
							screenHeight: dctx.getScreenHeight(),
							sdkVersion: dctx.getSdkVersion().toStringValue(),
							timeZone: dctx.getTimeZone(),
							isTestDevice: dctx.getIsTestDevice().getValue()
						}
					}

					expect(exp).to.deep.equal(got)

					done()
					return Promise.resolve()
				})
				.catch(err => {
					done(err)
				})
				.then(_ => {
					consumer.disconnect()
					client.disconnect()
				})

		})
	})
	
})