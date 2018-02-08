const assert = require('chai').assert

/**
 *  rover.protobuf.Struct Tests
 */
const Struct = require("../protobuf/struct_pb.js").Struct
require("../protobuf/struct_pb_ext.js")

describe('Struct', function() {
	it('preserves `null` values', function() {
		let t = { value: null }
		let res = Struct.fromJavaScript({ value: null }).toJavaScript()
		assert(res, t)
	});

	it('preserves `integer` values', function() {
		let t = { value: 173 }
		let res = Struct.fromJavaScript({ value: null }).toJavaScript()
		assert(res, t)
	});

	it('preserves `double` values', function() {
		let t = { value: 1.333 }
		let res = Struct.fromJavaScript({ value: null }).toJavaScript()
		assert(res, t)
	});

	it('preserves `string` values', function() {
		let t = { value: "test", value2: "" }
		let res = Struct.fromJavaScript({ value: null }).toJavaScript()
		assert(res, t)
	});

	it('preserves `boolean` values', function() {
		let t = { value: true, value2: false }
		let res = Struct.fromJavaScript({ value: null }).toJavaScript()
		assert(res, t)
	});

	it('preserves `list` values', function() {
		let t = { value: ["a", "b", "c"] }
		let res = Struct.fromJavaScript({ value: null }).toJavaScript()
		assert(res, t)
	});
})