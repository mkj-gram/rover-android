const expect = require('chai').expect

/**
 *  rover.protobuf.Struct Tests
 */
const Struct = require("../protobuf/struct_pb.js").Struct
require("../protobuf/struct_pb_ext.js")

describe('Struct', function() {
	it('preserves `null` values', function() {
		let t = { value: null }
		let res = Struct.fromJavaScript(t).toJavaScript()
		expect(res).to.deep.equal(t)
	});

	it('preserves `integer` values', function() {
		let t = { value: 173 }
		let res = Struct.fromJavaScript(t).toJavaScript()
		expect(res).to.deep.equal(t)
	});

	it('preserves `double` values', function() {
		let t = { value: 1.333 }
		let res = Struct.fromJavaScript(t).toJavaScript()
		expect(res).to.deep.equal(t)
	});

	it('preserves `string` values', function() {
		let t = { value: "test", value2: "" }
		let res = Struct.fromJavaScript(t).toJavaScript()
		expect(res).to.deep.equal(t)
	});

	it('preserves `boolean` values', function() {
		let t = { value: true, value2: false }
		let res = Struct.fromJavaScript(t).toJavaScript()
		expect(res).to.deep.equal(t)
	});

	it('preserves `list` values', function() {
		let t = { value: ["a", "b", "c"] }
		let res = Struct.fromJavaScript(t).toJavaScript()
		expect(res).to.deep.equal(t)
	});
})



/**
 *  rover.protobuf.Version Tests
 */
const Version = require("../protobuf/version_pb.js").Version
require("../protobuf/version_pb_ext.js")

describe('Version', function() {

	it('throws an error when input is not an object or a string', function() {
		expect(function() {
			Version.fromJavaScript(1)
		}).to.throw('unsupported value: 1')
	})

	it('throws an error when input is a string but does not match version regex', function() {
		expect(function() {
			Version.fromJavaScript("hello.hello")
		}).to.throw('unrecognized input, must be in the form of (^\d+\.\d+\.\d+$|^\d+\.\d+$) got: "hello.hello"')
	})

	it('parses string values', function() {
		const got = Version.fromJavaScript("1.3")
		expect(got.getMajor()).to.equal(1)
		expect(got.getMinor()).to.equal(3)

		const got2 = Version.fromJavaScript("3.4.2")
		expect(got2.getMajor()).to.equal(3)
		expect(got2.getMinor()).to.equal(4)
		expect(got2.getRevision()).to.equal(2)
	})

	it('parses version objects', function() {
		const got = Version.fromJavaScript({ major: 4, minor: 3 })
		expect(got.getMajor()).to.equal(4)
		expect(got.getMinor()).to.equal(3)

		const got2 = Version.fromJavaScript({ major: 3, minor: 10, revision: 6 })
		expect(got2.getMajor()).to.equal(3)
		expect(got2.getMinor()).to.equal(10)
		expect(got2.getRevision()).to.equal(6)
	})

	it('maps back to a version string', function() {
		const input	= "3.1.4"
		const exp	= "3.1.4"
		const got	= Version.fromJavaScript(input).toStringValue()

		expect(exp).to.equal(got)
	})

	it('maps back to a version object', function() {
		const input = {
			major: 3,
			minor: 1,
			revision: 4
		}

		const exp = {
			major: 3,
			minor: 1,
			revision: 4
		}

		const got = Version.fromJavaScript(input).toObjectValue()

		expect(exp).to.deep.equal(got)
	})
})


/**
 *  rover.protobuf.Wrappers Tests
 */
const Wrappers = require("../protobuf/wrappers_pb.js")
require("../protobuf/wrappers_pb_ext.js")

describe('Wrappers', function() {

	const typesDef = [
		{
			type: 'BoolValue',
			tests: [true, false]
		},
		{
			type: 'BytesValue',
			tests: []
		},
		{
			type: 'DoubleValue',
			tests: [1, 2.2, -33, 299999999999]
		},
		{
			type: 'FloatValue',
			tests: [-44.444444444, 32.1191919]
		},
		{
			type: 'Int32Value',
			tests: [-1, 1, 98]
		},
		{
			type: 'Int64Value',
			tests: [-33, 100, 33388888888]
		},
		{
			type: 'StringValue',
			tests: ["", "hello", "world with a few spaces"]
		},
		{
			type: 'UInt32Value',
			tests: [1,8]
		},
		{
			type: 'UInt64Value',
			tests: [3,44]
		}
	]

	typesDef.forEach(typeDef => {
		const base = Wrappers[typeDef.type]
		describe(typeDef.type, function() {
			it('returns `null` when input is null', function() {
				expect(base.fromJavaScript.call(base, null)).to.be.null
			})

			typeDef.tests.forEach(test => {
				it('preserves input `'+ JSON.stringify(test) +'`', function() {
					expect(base.toJavaScript.call(base,base.fromJavaScript.call(base, test))).to.equal(test)
				});
			})
		})
	})
})


/**
 *  rover.protobuf.Timestamp Tests
 */
const Timestamp = require("../protobuf/timestamp_pb.js").Timestamp
require("../protobuf/timestamp_pb_ext.js")

describe('Timestamp', function() {

	describe('fromISOString', function() {

		it('throws an error when value is not an ISO8601 string', function() {
			expect(function() {
				Timestamp.fromISOString("hi")
			}).to.throw('invalid timestamp value')
		})

		it('parses valid ISO8601 string', function(){

			const exp = {
				seconds: 1519401951,
				nanos: 110000000,
				offset: -18000,
			}

			const timestamp = Timestamp.fromISOString("2018-02-23T11:05:51.11-05:00")

			const got = {
				seconds: timestamp.getSeconds(),
				nanos: timestamp.getNanos(),
				offset: timestamp.getUtcOffset()
			}

			expect(got).to.deep.equal(exp)
		})
	})

	describe('toISOString', function() {
		it('correctly formats to ISO8601 string', function() {
			const timestamp = Timestamp.fromISOString("2018-02-23T11:05:51.11-05:00")
			// IS08601 in js is always represented in UTC time
			const exp = '2018-02-23T16:05:51.110Z'
			const got = timestamp.toISOString()

			expect(got).to.equal(exp)
		})
	})
})
