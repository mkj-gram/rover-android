const goog = require('google-protobuf');

function typeOf(value) {
	const type = goog.typeOf(value)
	if (type === 'number') {
		if (Number.isInteger(value)) {
			return 'number'
		} else {
			return 'float'
		}
	}

	return type
}

/**
 * Converts this Value object to a plain JavaScript value.
 * @return {?proto.rover.protobuf.JavaScriptValue} a plain JavaScript
 *     value representing this Struct.
 */
proto.rover.protobuf.Value.prototype.toJavaScript = function() {
  var kindCase = proto.rover.protobuf.Value.KindCase;
  switch (this.getKindCase()) {
    case kindCase.NULL_VALUE:
      return null;
    case kindCase.NUMBER_VALUE:
      return this.getNumberValue();
    case kindCase.DOUBLE_VALUE:
    	return this.getDoubleValue();
    case kindCase.STRING_VALUE:
      return this.getStringValue();
    case kindCase.BOOL_VALUE:
      return this.getBoolValue();
    case kindCase.STRUCT_VALUE:
      return this.getStructValue().toJavaScript();
    case kindCase.LIST_VALUE:
      return this.getListValue().toJavaScript();
    default:
      throw new Error('Unexpected struct type');
  }
};

/**
 * Converts this JavaScript value to a new Value proto.
 * @param {!proto.rover.protobuf.JavaScriptValue} value The value to
 *     convert.
 * @return {!proto.rover.protobuf.Value} The newly constructed value.
 */
proto.rover.protobuf.Value.fromJavaScript = function(value) {
  var ret = new proto.rover.protobuf.Value();
  switch (typeOf(value)) {
    case 'string':
      ret.setStringValue(/** @type {string} */ (value));
      break;
    case 'number':
      ret.setNumberValue(/** @type {number} */ (value));
      break;
    case 'float':
      ret.setDoubleValue(/** @type {double} */ (value));
      break;
    case 'boolean':
      ret.setBoolValue(/** @type {boolean} */ (value));
      break;
    case 'null':
      ret.setNullValue(proto.rover.protobuf.NullValue.NULL_VALUE);
      break;
    case 'array':
      ret.setListValue(proto.rover.protobuf.ListValue.fromJavaScript(
          /** @type{!Array} */ (value)));
      break;
    case 'object':
      ret.setStructValue(proto.rover.protobuf.Struct.fromJavaScript(
          /** @type{!Object} */ (value)));
      break;
    default:
      throw new Error('Unexpected struct type.');
  }

  return ret;
};


/**
 * Converts this ListValue object to a plain JavaScript array.
 * @return {!Array} a plain JavaScript array representing this List.
 */
proto.rover.protobuf.ListValue.prototype.toJavaScript = function() {
  var ret = [];
  var values = this.getValuesList();

  for (var i = 0; i < values.length; i++) {
    ret[i] = values[i].toJavaScript();
  }

  return ret;
};


/**
 * Constructs a ListValue protobuf from this plain JavaScript array.
 * @param {!Array} array a plain JavaScript array
 * @return {proto.rover.protobuf.ListValue} a new ListValue object
 */
proto.rover.protobuf.ListValue.fromJavaScript = function(array) {
  var ret = new proto.rover.protobuf.ListValue();

  for (var i = 0; i < array.length; i++) {
    ret.addValues(proto.rover.protobuf.Value.fromJavaScript(array[i]));
  }

  return ret;
};


/**
 * Converts this Struct object to a plain JavaScript object.
 * @return {!Object<string, !proto.rover.protobuf.JavaScriptValue>} a plain
 *     JavaScript object representing this Struct.
 */
proto.rover.protobuf.Struct.prototype.toJavaScript = function() {
  var ret = {};

  this.getFieldsMap().forEach(function(value, key) {
    ret[key] = value.toJavaScript();
  });

  return ret;
};


/**
 * Constructs a Struct protobuf from this plain JavaScript object.
 * @param {!Object} obj a plain JavaScript object
 * @return {proto.rover.protobuf.Struct} a new Struct object
 */
proto.rover.protobuf.Struct.fromJavaScript = function(obj) {
  var ret = new proto.rover.protobuf.Struct();
  var map = ret.getFieldsMap();

  for (var property in obj) {
    var val = obj[property];
    map.set(property, proto.rover.protobuf.Value.fromJavaScript(val));
  }

  return ret;
};