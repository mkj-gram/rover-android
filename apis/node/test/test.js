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