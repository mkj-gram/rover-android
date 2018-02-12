proto.rover.protobuf.BoolValue.fromJavaScript = function(value) {
	if (value === null || value === undefined) {
		return null
	}

	const ret = new proto.rover.protobuf.BoolValue()
	ret.setValue(value)

	return ret
}

proto.rover.protobuf.BytesValue.fromJavaScript = function(value) {
	if (value === null || value === undefined) {
		return null
	}

	const ret = new proto.rover.protobuf.BytesValue()
	ret.setValue(value)

	return ret
}

proto.rover.protobuf.DoubleValue.fromJavaScript = function(value) {
	if (value === null || value === undefined) {
		return null
	}

	const ret = new proto.rover.protobuf.DoubleValue()
	ret.setValue(value)

	return ret
}

proto.rover.protobuf.FloatValue.fromJavaScript = function(value) {
	if (value === null || value === undefined) {
		return null
	}

	const ret = new proto.rover.protobuf.FloatValue()
	ret.setValue(value)

	return ret
}

proto.rover.protobuf.Int32Value.fromJavaScript = function(value) {
	if (value === null || value === undefined) {
		return null
	}

	const ret = new proto.rover.protobuf.Int32Value()
	ret.setValue(value)

	return ret
}

proto.rover.protobuf.Int64Value.fromJavaScript = function(value) {
	if (value === null || value === undefined) {
		return null
	}

	const ret = new proto.rover.protobuf.Int64Value()
	ret.setValue(value)

	return ret
}

proto.rover.protobuf.StringValue.fromJavaScript = function(value) {
	if (value === null || value === undefined) {
		return null
	}

	const ret = new proto.rover.protobuf.StringValue()
	ret.setValue(value)

	return ret
}

proto.rover.protobuf.UInt32Value.fromJavaScript = function(value) {
	if (value === null || value === undefined) {
		return null
	}

	const ret = new proto.rover.protobuf.UInt32Value()
	ret.setValue(value)

	return ret
}

proto.rover.protobuf.UInt64Value.fromJavaScript = function(value) {
	if (value === null || value === undefined) {
		return null
	}

	const ret = new proto.rover.protobuf.UInt64Value()
	ret.setValue(value)

	return ret
}

proto.rover.protobuf.BoolValue.toJavaScript = function(value) {
	if (value === null || value === undefined) {
		return null
	}

	return value.getValue()
}
proto.rover.protobuf.BytesValue.toJavaScript = function(value) {
	if (value === null || value === undefined) {
		return null
	}

	return value.getValue()
}

proto.rover.protobuf.DoubleValue.toJavaScript = function(value) {
	if (value === null || value === undefined) {
		return null
	}

	return value.getValue()
}

proto.rover.protobuf.FloatValue.toJavaScript = function(value) {
	if (value === null || value === undefined) {
		return null
	}

	return value.getValue()
}

proto.rover.protobuf.Int32Value.toJavaScript = function(value) {
	if (value === null || value === undefined) {
		return null
	}

	return value.getValue()
}

proto.rover.protobuf.Int64Value.toJavaScript = function(value) {
	if (value === null || value === undefined) {
		return null
	}

	return value.getValue()
}

proto.rover.protobuf.StringValue.toJavaScript = function(value) {
	if (value === null || value === undefined) {
		return null
	}

	return value.getValue()
}

proto.rover.protobuf.UInt32Value.toJavaScript = function(value) {
	if (value === null || value === undefined) {
		return null
	}

	return value.getValue()
}

proto.rover.protobuf.UInt64Value.toJavaScript = function(value) {
	if (value === null || value === undefined) {
		return null
	}

	return value.getValue()
}