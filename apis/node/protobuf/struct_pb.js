/**
 * @fileoverview
 * @enhanceable
 * @public
 */
// GENERATED CODE -- DO NOT EDIT!

var jspb = require('google-protobuf');
var goog = jspb;
var global = Function('return this')();

goog.exportSymbol('proto.rover.protobuf.ListValue', null, global);
goog.exportSymbol('proto.rover.protobuf.NullValue', null, global);
goog.exportSymbol('proto.rover.protobuf.Struct', null, global);
goog.exportSymbol('proto.rover.protobuf.Value', null, global);

/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.rover.protobuf.Struct = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.rover.protobuf.Struct, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.protobuf.Struct.displayName = 'proto.rover.protobuf.Struct';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.rover.protobuf.Struct.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.protobuf.Struct.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.protobuf.Struct} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.protobuf.Struct.toObject = function(includeInstance, msg) {
  var f, obj = {
    fieldsMap: (f = msg.getFieldsMap()) ? f.toObject(includeInstance, proto.rover.protobuf.Value.toObject) : []
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.rover.protobuf.Struct}
 */
proto.rover.protobuf.Struct.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.protobuf.Struct;
  return proto.rover.protobuf.Struct.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.protobuf.Struct} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.protobuf.Struct}
 */
proto.rover.protobuf.Struct.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = msg.getFieldsMap();
      reader.readMessage(value, function(message, reader) {
        jspb.Map.deserializeBinary(message, reader, jspb.BinaryReader.prototype.readString, jspb.BinaryReader.prototype.readMessage, proto.rover.protobuf.Value.deserializeBinaryFromReader);
         });
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.rover.protobuf.Struct.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.protobuf.Struct.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.protobuf.Struct} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.protobuf.Struct.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getFieldsMap(true);
  if (f && f.getLength() > 0) {
    f.serializeBinary(1, writer, jspb.BinaryWriter.prototype.writeString, jspb.BinaryWriter.prototype.writeMessage, proto.rover.protobuf.Value.serializeBinaryToWriter);
  }
};


/**
 * map<string, Value> fields = 1;
 * @param {boolean=} opt_noLazyCreate Do not create the map if
 * empty, instead returning `undefined`
 * @return {!jspb.Map<string,!proto.rover.protobuf.Value>}
 */
proto.rover.protobuf.Struct.prototype.getFieldsMap = function(opt_noLazyCreate) {
  return /** @type {!jspb.Map<string,!proto.rover.protobuf.Value>} */ (
      jspb.Message.getMapField(this, 1, opt_noLazyCreate,
      proto.rover.protobuf.Value));
};


proto.rover.protobuf.Struct.prototype.clearFieldsMap = function() {
  this.getFieldsMap().clear();
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.rover.protobuf.Value = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, proto.rover.protobuf.Value.oneofGroups_);
};
goog.inherits(proto.rover.protobuf.Value, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.protobuf.Value.displayName = 'proto.rover.protobuf.Value';
}
/**
 * Oneof group definitions for this message. Each group defines the field
 * numbers belonging to that group. When of these fields' value is set, all
 * other fields in the group are cleared. During deserialization, if multiple
 * fields are encountered for a group, only the last value seen will be kept.
 * @private {!Array<!Array<number>>}
 * @const
 */
proto.rover.protobuf.Value.oneofGroups_ = [[1,2,3,4,5,6,7]];

/**
 * @enum {number}
 */
proto.rover.protobuf.Value.KindCase = {
  KIND_NOT_SET: 0,
  NULL_VALUE: 1,
  NUMBER_VALUE: 2,
  DOUBLE_VALUE: 3,
  STRING_VALUE: 4,
  BOOL_VALUE: 5,
  STRUCT_VALUE: 6,
  LIST_VALUE: 7
};

/**
 * @return {proto.rover.protobuf.Value.KindCase}
 */
proto.rover.protobuf.Value.prototype.getKindCase = function() {
  return /** @type {proto.rover.protobuf.Value.KindCase} */(jspb.Message.computeOneofCase(this, proto.rover.protobuf.Value.oneofGroups_[0]));
};



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.rover.protobuf.Value.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.protobuf.Value.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.protobuf.Value} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.protobuf.Value.toObject = function(includeInstance, msg) {
  var f, obj = {
    nullValue: jspb.Message.getFieldWithDefault(msg, 1, 0),
    numberValue: jspb.Message.getFieldWithDefault(msg, 2, 0),
    doubleValue: +jspb.Message.getFieldWithDefault(msg, 3, 0.0),
    stringValue: jspb.Message.getFieldWithDefault(msg, 4, ""),
    boolValue: jspb.Message.getFieldWithDefault(msg, 5, false),
    structValue: (f = msg.getStructValue()) && proto.rover.protobuf.Struct.toObject(includeInstance, f),
    listValue: (f = msg.getListValue()) && proto.rover.protobuf.ListValue.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.rover.protobuf.Value}
 */
proto.rover.protobuf.Value.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.protobuf.Value;
  return proto.rover.protobuf.Value.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.protobuf.Value} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.protobuf.Value}
 */
proto.rover.protobuf.Value.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!proto.rover.protobuf.NullValue} */ (reader.readEnum());
      msg.setNullValue(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setNumberValue(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readDouble());
      msg.setDoubleValue(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setStringValue(value);
      break;
    case 5:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setBoolValue(value);
      break;
    case 6:
      var value = new proto.rover.protobuf.Struct;
      reader.readMessage(value,proto.rover.protobuf.Struct.deserializeBinaryFromReader);
      msg.setStructValue(value);
      break;
    case 7:
      var value = new proto.rover.protobuf.ListValue;
      reader.readMessage(value,proto.rover.protobuf.ListValue.deserializeBinaryFromReader);
      msg.setListValue(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.rover.protobuf.Value.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.protobuf.Value.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.protobuf.Value} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.protobuf.Value.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = /** @type {!proto.rover.protobuf.NullValue} */ (jspb.Message.getField(message, 1));
  if (f != null) {
    writer.writeEnum(
      1,
      f
    );
  }
  f = /** @type {number} */ (jspb.Message.getField(message, 2));
  if (f != null) {
    writer.writeInt64(
      2,
      f
    );
  }
  f = /** @type {number} */ (jspb.Message.getField(message, 3));
  if (f != null) {
    writer.writeDouble(
      3,
      f
    );
  }
  f = /** @type {string} */ (jspb.Message.getField(message, 4));
  if (f != null) {
    writer.writeString(
      4,
      f
    );
  }
  f = /** @type {boolean} */ (jspb.Message.getField(message, 5));
  if (f != null) {
    writer.writeBool(
      5,
      f
    );
  }
  f = message.getStructValue();
  if (f != null) {
    writer.writeMessage(
      6,
      f,
      proto.rover.protobuf.Struct.serializeBinaryToWriter
    );
  }
  f = message.getListValue();
  if (f != null) {
    writer.writeMessage(
      7,
      f,
      proto.rover.protobuf.ListValue.serializeBinaryToWriter
    );
  }
};


/**
 * optional NullValue null_value = 1;
 * @return {!proto.rover.protobuf.NullValue}
 */
proto.rover.protobuf.Value.prototype.getNullValue = function() {
  return /** @type {!proto.rover.protobuf.NullValue} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/** @param {!proto.rover.protobuf.NullValue} value */
proto.rover.protobuf.Value.prototype.setNullValue = function(value) {
  jspb.Message.setOneofField(this, 1, proto.rover.protobuf.Value.oneofGroups_[0], value);
};


proto.rover.protobuf.Value.prototype.clearNullValue = function() {
  jspb.Message.setOneofField(this, 1, proto.rover.protobuf.Value.oneofGroups_[0], undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.protobuf.Value.prototype.hasNullValue = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional int64 number_value = 2;
 * @return {number}
 */
proto.rover.protobuf.Value.prototype.getNumberValue = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/** @param {number} value */
proto.rover.protobuf.Value.prototype.setNumberValue = function(value) {
  jspb.Message.setOneofField(this, 2, proto.rover.protobuf.Value.oneofGroups_[0], value);
};


proto.rover.protobuf.Value.prototype.clearNumberValue = function() {
  jspb.Message.setOneofField(this, 2, proto.rover.protobuf.Value.oneofGroups_[0], undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.protobuf.Value.prototype.hasNumberValue = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional double double_value = 3;
 * @return {number}
 */
proto.rover.protobuf.Value.prototype.getDoubleValue = function() {
  return /** @type {number} */ (+jspb.Message.getFieldWithDefault(this, 3, 0.0));
};


/** @param {number} value */
proto.rover.protobuf.Value.prototype.setDoubleValue = function(value) {
  jspb.Message.setOneofField(this, 3, proto.rover.protobuf.Value.oneofGroups_[0], value);
};


proto.rover.protobuf.Value.prototype.clearDoubleValue = function() {
  jspb.Message.setOneofField(this, 3, proto.rover.protobuf.Value.oneofGroups_[0], undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.protobuf.Value.prototype.hasDoubleValue = function() {
  return jspb.Message.getField(this, 3) != null;
};


/**
 * optional string string_value = 4;
 * @return {string}
 */
proto.rover.protobuf.Value.prototype.getStringValue = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/** @param {string} value */
proto.rover.protobuf.Value.prototype.setStringValue = function(value) {
  jspb.Message.setOneofField(this, 4, proto.rover.protobuf.Value.oneofGroups_[0], value);
};


proto.rover.protobuf.Value.prototype.clearStringValue = function() {
  jspb.Message.setOneofField(this, 4, proto.rover.protobuf.Value.oneofGroups_[0], undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.protobuf.Value.prototype.hasStringValue = function() {
  return jspb.Message.getField(this, 4) != null;
};


/**
 * optional bool bool_value = 5;
 * Note that Boolean fields may be set to 0/1 when serialized from a Java server.
 * You should avoid comparisons like {@code val === true/false} in those cases.
 * @return {boolean}
 */
proto.rover.protobuf.Value.prototype.getBoolValue = function() {
  return /** @type {boolean} */ (jspb.Message.getFieldWithDefault(this, 5, false));
};


/** @param {boolean} value */
proto.rover.protobuf.Value.prototype.setBoolValue = function(value) {
  jspb.Message.setOneofField(this, 5, proto.rover.protobuf.Value.oneofGroups_[0], value);
};


proto.rover.protobuf.Value.prototype.clearBoolValue = function() {
  jspb.Message.setOneofField(this, 5, proto.rover.protobuf.Value.oneofGroups_[0], undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.protobuf.Value.prototype.hasBoolValue = function() {
  return jspb.Message.getField(this, 5) != null;
};


/**
 * optional Struct struct_value = 6;
 * @return {?proto.rover.protobuf.Struct}
 */
proto.rover.protobuf.Value.prototype.getStructValue = function() {
  return /** @type{?proto.rover.protobuf.Struct} */ (
    jspb.Message.getWrapperField(this, proto.rover.protobuf.Struct, 6));
};


/** @param {?proto.rover.protobuf.Struct|undefined} value */
proto.rover.protobuf.Value.prototype.setStructValue = function(value) {
  jspb.Message.setOneofWrapperField(this, 6, proto.rover.protobuf.Value.oneofGroups_[0], value);
};


proto.rover.protobuf.Value.prototype.clearStructValue = function() {
  this.setStructValue(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.protobuf.Value.prototype.hasStructValue = function() {
  return jspb.Message.getField(this, 6) != null;
};


/**
 * optional ListValue list_value = 7;
 * @return {?proto.rover.protobuf.ListValue}
 */
proto.rover.protobuf.Value.prototype.getListValue = function() {
  return /** @type{?proto.rover.protobuf.ListValue} */ (
    jspb.Message.getWrapperField(this, proto.rover.protobuf.ListValue, 7));
};


/** @param {?proto.rover.protobuf.ListValue|undefined} value */
proto.rover.protobuf.Value.prototype.setListValue = function(value) {
  jspb.Message.setOneofWrapperField(this, 7, proto.rover.protobuf.Value.oneofGroups_[0], value);
};


proto.rover.protobuf.Value.prototype.clearListValue = function() {
  this.setListValue(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.protobuf.Value.prototype.hasListValue = function() {
  return jspb.Message.getField(this, 7) != null;
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.rover.protobuf.ListValue = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.rover.protobuf.ListValue.repeatedFields_, null);
};
goog.inherits(proto.rover.protobuf.ListValue, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.protobuf.ListValue.displayName = 'proto.rover.protobuf.ListValue';
}
/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.rover.protobuf.ListValue.repeatedFields_ = [1];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.rover.protobuf.ListValue.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.protobuf.ListValue.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.protobuf.ListValue} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.protobuf.ListValue.toObject = function(includeInstance, msg) {
  var f, obj = {
    valuesList: jspb.Message.toObjectList(msg.getValuesList(),
    proto.rover.protobuf.Value.toObject, includeInstance)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.rover.protobuf.ListValue}
 */
proto.rover.protobuf.ListValue.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.protobuf.ListValue;
  return proto.rover.protobuf.ListValue.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.protobuf.ListValue} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.protobuf.ListValue}
 */
proto.rover.protobuf.ListValue.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.rover.protobuf.Value;
      reader.readMessage(value,proto.rover.protobuf.Value.deserializeBinaryFromReader);
      msg.addValues(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.rover.protobuf.ListValue.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.protobuf.ListValue.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.protobuf.ListValue} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.protobuf.ListValue.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getValuesList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      proto.rover.protobuf.Value.serializeBinaryToWriter
    );
  }
};


/**
 * repeated Value values = 1;
 * If you change this array by adding, removing or replacing elements, or if you
 * replace the array itself, then you must call the setter to update it.
 * @return {!Array.<!proto.rover.protobuf.Value>}
 */
proto.rover.protobuf.ListValue.prototype.getValuesList = function() {
  return /** @type{!Array.<!proto.rover.protobuf.Value>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.rover.protobuf.Value, 1));
};


/** @param {!Array.<!proto.rover.protobuf.Value>} value */
proto.rover.protobuf.ListValue.prototype.setValuesList = function(value) {
  jspb.Message.setRepeatedWrapperField(this, 1, value);
};


/**
 * @param {!proto.rover.protobuf.Value=} opt_value
 * @param {number=} opt_index
 * @return {!proto.rover.protobuf.Value}
 */
proto.rover.protobuf.ListValue.prototype.addValues = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.rover.protobuf.Value, opt_index);
};


proto.rover.protobuf.ListValue.prototype.clearValuesList = function() {
  this.setValuesList([]);
};


/**
 * @enum {number}
 */
proto.rover.protobuf.NullValue = {
  NULL_VALUE: 0
};

goog.object.extend(exports, proto.rover.protobuf);