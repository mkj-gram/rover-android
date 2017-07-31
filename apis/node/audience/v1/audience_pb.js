/**
 * @fileoverview
 * @enhanceable
 * @public
 */
// GENERATED CODE -- DO NOT EDIT!

var jspb = require('google-protobuf');
var goog = jspb;
var global = Function('return this')();

var google_protobuf_timestamp_pb = require('google-protobuf/google/protobuf/timestamp_pb.js');
var auth_v1_auth_pb = require('../../auth/v1/auth_pb.js');
goog.exportSymbol('proto.rover.audience.v1.BoolPredicate', null, global);
goog.exportSymbol('proto.rover.audience.v1.BoolPredicate.Op', null, global);
goog.exportSymbol('proto.rover.audience.v1.CreateDeviceRequest', null, global);
goog.exportSymbol('proto.rover.audience.v1.CreateDeviceResponse', null, global);
goog.exportSymbol('proto.rover.audience.v1.CreateProfileRequest', null, global);
goog.exportSymbol('proto.rover.audience.v1.CreateProfileResponse', null, global);
goog.exportSymbol('proto.rover.audience.v1.CreateSegmentRequest', null, global);
goog.exportSymbol('proto.rover.audience.v1.CreateSegmentResponse', null, global);
goog.exportSymbol('proto.rover.audience.v1.DatePredicate', null, global);
goog.exportSymbol('proto.rover.audience.v1.DatePredicate.Op', null, global);
goog.exportSymbol('proto.rover.audience.v1.DeleteDeviceRequest', null, global);
goog.exportSymbol('proto.rover.audience.v1.DeleteDeviceResponse', null, global);
goog.exportSymbol('proto.rover.audience.v1.DeleteProfileRequest', null, global);
goog.exportSymbol('proto.rover.audience.v1.DeleteProfileResponse', null, global);
goog.exportSymbol('proto.rover.audience.v1.DeleteSegmentByIdRequest', null, global);
goog.exportSymbol('proto.rover.audience.v1.DeleteSegmentByIdResponse', null, global);
goog.exportSymbol('proto.rover.audience.v1.Device', null, global);
goog.exportSymbol('proto.rover.audience.v1.Device.RegionMonitoringMode', null, global);
goog.exportSymbol('proto.rover.audience.v1.GeofencePredicate', null, global);
goog.exportSymbol('proto.rover.audience.v1.GeofencePredicate.Op', null, global);
goog.exportSymbol('proto.rover.audience.v1.GeofenceRegion', null, global);
goog.exportSymbol('proto.rover.audience.v1.GetDeviceByPushTokenRequest', null, global);
goog.exportSymbol('proto.rover.audience.v1.GetDeviceByPushTokenResponse', null, global);
goog.exportSymbol('proto.rover.audience.v1.GetDeviceRequest', null, global);
goog.exportSymbol('proto.rover.audience.v1.GetDeviceResponse', null, global);
goog.exportSymbol('proto.rover.audience.v1.GetProfileByDeviceIdRequest', null, global);
goog.exportSymbol('proto.rover.audience.v1.GetProfileByDeviceIdResponse', null, global);
goog.exportSymbol('proto.rover.audience.v1.GetProfileByIdentifierRequest', null, global);
goog.exportSymbol('proto.rover.audience.v1.GetProfileByIdentifierResponse', null, global);
goog.exportSymbol('proto.rover.audience.v1.GetProfileRequest', null, global);
goog.exportSymbol('proto.rover.audience.v1.GetProfileResponse', null, global);
goog.exportSymbol('proto.rover.audience.v1.GetProfileSchemaRequest', null, global);
goog.exportSymbol('proto.rover.audience.v1.GetProfileSchemaResponse', null, global);
goog.exportSymbol('proto.rover.audience.v1.GetSegmentByIdRequest', null, global);
goog.exportSymbol('proto.rover.audience.v1.GetSegmentByIdResponse', null, global);
goog.exportSymbol('proto.rover.audience.v1.IBeaconRegion', null, global);
goog.exportSymbol('proto.rover.audience.v1.ListDevicesByProfileIdRequest', null, global);
goog.exportSymbol('proto.rover.audience.v1.ListDevicesByProfileIdResponse', null, global);
goog.exportSymbol('proto.rover.audience.v1.ListDevicesByProfileIdentifierRequest', null, global);
goog.exportSymbol('proto.rover.audience.v1.ListDevicesByProfileIdentifierResponse', null, global);
goog.exportSymbol('proto.rover.audience.v1.ListProfilesByIdsRequest', null, global);
goog.exportSymbol('proto.rover.audience.v1.ListProfilesByIdsResponse', null, global);
goog.exportSymbol('proto.rover.audience.v1.ListSegmentsRequest', null, global);
goog.exportSymbol('proto.rover.audience.v1.ListSegmentsResponse', null, global);
goog.exportSymbol('proto.rover.audience.v1.Location', null, global);
goog.exportSymbol('proto.rover.audience.v1.Null', null, global);
goog.exportSymbol('proto.rover.audience.v1.NumberPredicate', null, global);
goog.exportSymbol('proto.rover.audience.v1.NumberPredicate.Op', null, global);
goog.exportSymbol('proto.rover.audience.v1.Platform', null, global);
goog.exportSymbol('proto.rover.audience.v1.Predicate', null, global);
goog.exportSymbol('proto.rover.audience.v1.PredicateAggregate', null, global);
goog.exportSymbol('proto.rover.audience.v1.PredicateAggregate.Condition', null, global);
goog.exportSymbol('proto.rover.audience.v1.Profile', null, global);
goog.exportSymbol('proto.rover.audience.v1.ProfileSchema', null, global);
goog.exportSymbol('proto.rover.audience.v1.SchemaAttribute', null, global);
goog.exportSymbol('proto.rover.audience.v1.Segment', null, global);
goog.exportSymbol('proto.rover.audience.v1.SetDeviceProfileRequest', null, global);
goog.exportSymbol('proto.rover.audience.v1.SetDeviceProfileResponse', null, global);
goog.exportSymbol('proto.rover.audience.v1.StringPredicate', null, global);
goog.exportSymbol('proto.rover.audience.v1.StringPredicate.Op', null, global);
goog.exportSymbol('proto.rover.audience.v1.UpdateDeviceGeofenceMonitoringRequest', null, global);
goog.exportSymbol('proto.rover.audience.v1.UpdateDeviceGeofenceMonitoringResponse', null, global);
goog.exportSymbol('proto.rover.audience.v1.UpdateDeviceIBeaconMonitoringRequest', null, global);
goog.exportSymbol('proto.rover.audience.v1.UpdateDeviceIBeaconMonitoringResponse', null, global);
goog.exportSymbol('proto.rover.audience.v1.UpdateDeviceLocationRequest', null, global);
goog.exportSymbol('proto.rover.audience.v1.UpdateDeviceLocationResponse', null, global);
goog.exportSymbol('proto.rover.audience.v1.UpdateDevicePushTokenRequest', null, global);
goog.exportSymbol('proto.rover.audience.v1.UpdateDevicePushTokenResponse', null, global);
goog.exportSymbol('proto.rover.audience.v1.UpdateDeviceRequest', null, global);
goog.exportSymbol('proto.rover.audience.v1.UpdateDeviceResponse', null, global);
goog.exportSymbol('proto.rover.audience.v1.UpdateDeviceUnregisterPushTokenRequest', null, global);
goog.exportSymbol('proto.rover.audience.v1.UpdateDeviceUnregisterPushTokenResponse', null, global);
goog.exportSymbol('proto.rover.audience.v1.UpdateProfileIdentifierRequest', null, global);
goog.exportSymbol('proto.rover.audience.v1.UpdateProfileIdentifierResponse', null, global);
goog.exportSymbol('proto.rover.audience.v1.UpdateProfileRequest', null, global);
goog.exportSymbol('proto.rover.audience.v1.UpdateProfileResponse', null, global);
goog.exportSymbol('proto.rover.audience.v1.UpdateSegmentPredicatesRequest', null, global);
goog.exportSymbol('proto.rover.audience.v1.UpdateSegmentPredicatesResponse', null, global);
goog.exportSymbol('proto.rover.audience.v1.UpdateSegmentTitleRequest', null, global);
goog.exportSymbol('proto.rover.audience.v1.UpdateSegmentTitleResponse', null, global);
goog.exportSymbol('proto.rover.audience.v1.Value', null, global);
goog.exportSymbol('proto.rover.audience.v1.Value.StringArray', null, global);
goog.exportSymbol('proto.rover.audience.v1.ValueUpdate', null, global);
goog.exportSymbol('proto.rover.audience.v1.ValueUpdate.UpdateType', null, global);
goog.exportSymbol('proto.rover.audience.v1.ValueUpdates', null, global);
goog.exportSymbol('proto.rover.audience.v1.Version', null, global);
goog.exportSymbol('proto.rover.audience.v1.VersionPredicate', null, global);
goog.exportSymbol('proto.rover.audience.v1.VersionPredicate.Op', null, global);

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
proto.rover.audience.v1.GetProfileRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.rover.audience.v1.GetProfileRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.GetProfileRequest.displayName = 'proto.rover.audience.v1.GetProfileRequest';
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
proto.rover.audience.v1.GetProfileRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.GetProfileRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.GetProfileRequest} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.GetProfileRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    authContext: (f = msg.getAuthContext()) && auth_v1_auth_pb.AuthContext.toObject(includeInstance, f),
    profileId: jspb.Message.getFieldWithDefault(msg, 2, "")
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
 * @return {!proto.rover.audience.v1.GetProfileRequest}
 */
proto.rover.audience.v1.GetProfileRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.GetProfileRequest;
  return proto.rover.audience.v1.GetProfileRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.GetProfileRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.GetProfileRequest}
 */
proto.rover.audience.v1.GetProfileRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new auth_v1_auth_pb.AuthContext;
      reader.readMessage(value,auth_v1_auth_pb.AuthContext.deserializeBinaryFromReader);
      msg.setAuthContext(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setProfileId(value);
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
proto.rover.audience.v1.GetProfileRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.GetProfileRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.GetProfileRequest} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.GetProfileRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getAuthContext();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      auth_v1_auth_pb.AuthContext.serializeBinaryToWriter
    );
  }
  f = message.getProfileId();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * optional rover.auth.v1.AuthContext auth_context = 1;
 * @return {?proto.rover.auth.v1.AuthContext}
 */
proto.rover.audience.v1.GetProfileRequest.prototype.getAuthContext = function() {
  return /** @type{?proto.rover.auth.v1.AuthContext} */ (
    jspb.Message.getWrapperField(this, auth_v1_auth_pb.AuthContext, 1));
};


/** @param {?proto.rover.auth.v1.AuthContext|undefined} value */
proto.rover.audience.v1.GetProfileRequest.prototype.setAuthContext = function(value) {
  jspb.Message.setWrapperField(this, 1, value);
};


proto.rover.audience.v1.GetProfileRequest.prototype.clearAuthContext = function() {
  this.setAuthContext(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.GetProfileRequest.prototype.hasAuthContext = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional string profile_id = 2;
 * @return {string}
 */
proto.rover.audience.v1.GetProfileRequest.prototype.getProfileId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/** @param {string} value */
proto.rover.audience.v1.GetProfileRequest.prototype.setProfileId = function(value) {
  jspb.Message.setField(this, 2, value);
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
proto.rover.audience.v1.GetProfileResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.rover.audience.v1.GetProfileResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.GetProfileResponse.displayName = 'proto.rover.audience.v1.GetProfileResponse';
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
proto.rover.audience.v1.GetProfileResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.GetProfileResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.GetProfileResponse} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.GetProfileResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    profile: (f = msg.getProfile()) && proto.rover.audience.v1.Profile.toObject(includeInstance, f)
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
 * @return {!proto.rover.audience.v1.GetProfileResponse}
 */
proto.rover.audience.v1.GetProfileResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.GetProfileResponse;
  return proto.rover.audience.v1.GetProfileResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.GetProfileResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.GetProfileResponse}
 */
proto.rover.audience.v1.GetProfileResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.rover.audience.v1.Profile;
      reader.readMessage(value,proto.rover.audience.v1.Profile.deserializeBinaryFromReader);
      msg.setProfile(value);
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
proto.rover.audience.v1.GetProfileResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.GetProfileResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.GetProfileResponse} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.GetProfileResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getProfile();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.rover.audience.v1.Profile.serializeBinaryToWriter
    );
  }
};


/**
 * optional Profile profile = 1;
 * @return {?proto.rover.audience.v1.Profile}
 */
proto.rover.audience.v1.GetProfileResponse.prototype.getProfile = function() {
  return /** @type{?proto.rover.audience.v1.Profile} */ (
    jspb.Message.getWrapperField(this, proto.rover.audience.v1.Profile, 1));
};


/** @param {?proto.rover.audience.v1.Profile|undefined} value */
proto.rover.audience.v1.GetProfileResponse.prototype.setProfile = function(value) {
  jspb.Message.setWrapperField(this, 1, value);
};


proto.rover.audience.v1.GetProfileResponse.prototype.clearProfile = function() {
  this.setProfile(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.GetProfileResponse.prototype.hasProfile = function() {
  return jspb.Message.getField(this, 1) != null;
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
proto.rover.audience.v1.CreateProfileRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.rover.audience.v1.CreateProfileRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.CreateProfileRequest.displayName = 'proto.rover.audience.v1.CreateProfileRequest';
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
proto.rover.audience.v1.CreateProfileRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.CreateProfileRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.CreateProfileRequest} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.CreateProfileRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    authContext: (f = msg.getAuthContext()) && auth_v1_auth_pb.AuthContext.toObject(includeInstance, f)
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
 * @return {!proto.rover.audience.v1.CreateProfileRequest}
 */
proto.rover.audience.v1.CreateProfileRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.CreateProfileRequest;
  return proto.rover.audience.v1.CreateProfileRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.CreateProfileRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.CreateProfileRequest}
 */
proto.rover.audience.v1.CreateProfileRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new auth_v1_auth_pb.AuthContext;
      reader.readMessage(value,auth_v1_auth_pb.AuthContext.deserializeBinaryFromReader);
      msg.setAuthContext(value);
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
proto.rover.audience.v1.CreateProfileRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.CreateProfileRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.CreateProfileRequest} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.CreateProfileRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getAuthContext();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      auth_v1_auth_pb.AuthContext.serializeBinaryToWriter
    );
  }
};


/**
 * optional rover.auth.v1.AuthContext auth_context = 1;
 * @return {?proto.rover.auth.v1.AuthContext}
 */
proto.rover.audience.v1.CreateProfileRequest.prototype.getAuthContext = function() {
  return /** @type{?proto.rover.auth.v1.AuthContext} */ (
    jspb.Message.getWrapperField(this, auth_v1_auth_pb.AuthContext, 1));
};


/** @param {?proto.rover.auth.v1.AuthContext|undefined} value */
proto.rover.audience.v1.CreateProfileRequest.prototype.setAuthContext = function(value) {
  jspb.Message.setWrapperField(this, 1, value);
};


proto.rover.audience.v1.CreateProfileRequest.prototype.clearAuthContext = function() {
  this.setAuthContext(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.CreateProfileRequest.prototype.hasAuthContext = function() {
  return jspb.Message.getField(this, 1) != null;
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
proto.rover.audience.v1.CreateProfileResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.rover.audience.v1.CreateProfileResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.CreateProfileResponse.displayName = 'proto.rover.audience.v1.CreateProfileResponse';
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
proto.rover.audience.v1.CreateProfileResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.CreateProfileResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.CreateProfileResponse} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.CreateProfileResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    profile: (f = msg.getProfile()) && proto.rover.audience.v1.Profile.toObject(includeInstance, f)
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
 * @return {!proto.rover.audience.v1.CreateProfileResponse}
 */
proto.rover.audience.v1.CreateProfileResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.CreateProfileResponse;
  return proto.rover.audience.v1.CreateProfileResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.CreateProfileResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.CreateProfileResponse}
 */
proto.rover.audience.v1.CreateProfileResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.rover.audience.v1.Profile;
      reader.readMessage(value,proto.rover.audience.v1.Profile.deserializeBinaryFromReader);
      msg.setProfile(value);
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
proto.rover.audience.v1.CreateProfileResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.CreateProfileResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.CreateProfileResponse} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.CreateProfileResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getProfile();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.rover.audience.v1.Profile.serializeBinaryToWriter
    );
  }
};


/**
 * optional Profile profile = 1;
 * @return {?proto.rover.audience.v1.Profile}
 */
proto.rover.audience.v1.CreateProfileResponse.prototype.getProfile = function() {
  return /** @type{?proto.rover.audience.v1.Profile} */ (
    jspb.Message.getWrapperField(this, proto.rover.audience.v1.Profile, 1));
};


/** @param {?proto.rover.audience.v1.Profile|undefined} value */
proto.rover.audience.v1.CreateProfileResponse.prototype.setProfile = function(value) {
  jspb.Message.setWrapperField(this, 1, value);
};


proto.rover.audience.v1.CreateProfileResponse.prototype.clearProfile = function() {
  this.setProfile(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.CreateProfileResponse.prototype.hasProfile = function() {
  return jspb.Message.getField(this, 1) != null;
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
proto.rover.audience.v1.DeleteProfileRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.rover.audience.v1.DeleteProfileRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.DeleteProfileRequest.displayName = 'proto.rover.audience.v1.DeleteProfileRequest';
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
proto.rover.audience.v1.DeleteProfileRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.DeleteProfileRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.DeleteProfileRequest} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.DeleteProfileRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    authContext: (f = msg.getAuthContext()) && auth_v1_auth_pb.AuthContext.toObject(includeInstance, f),
    profileId: jspb.Message.getFieldWithDefault(msg, 2, "")
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
 * @return {!proto.rover.audience.v1.DeleteProfileRequest}
 */
proto.rover.audience.v1.DeleteProfileRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.DeleteProfileRequest;
  return proto.rover.audience.v1.DeleteProfileRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.DeleteProfileRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.DeleteProfileRequest}
 */
proto.rover.audience.v1.DeleteProfileRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new auth_v1_auth_pb.AuthContext;
      reader.readMessage(value,auth_v1_auth_pb.AuthContext.deserializeBinaryFromReader);
      msg.setAuthContext(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setProfileId(value);
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
proto.rover.audience.v1.DeleteProfileRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.DeleteProfileRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.DeleteProfileRequest} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.DeleteProfileRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getAuthContext();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      auth_v1_auth_pb.AuthContext.serializeBinaryToWriter
    );
  }
  f = message.getProfileId();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * optional rover.auth.v1.AuthContext auth_context = 1;
 * @return {?proto.rover.auth.v1.AuthContext}
 */
proto.rover.audience.v1.DeleteProfileRequest.prototype.getAuthContext = function() {
  return /** @type{?proto.rover.auth.v1.AuthContext} */ (
    jspb.Message.getWrapperField(this, auth_v1_auth_pb.AuthContext, 1));
};


/** @param {?proto.rover.auth.v1.AuthContext|undefined} value */
proto.rover.audience.v1.DeleteProfileRequest.prototype.setAuthContext = function(value) {
  jspb.Message.setWrapperField(this, 1, value);
};


proto.rover.audience.v1.DeleteProfileRequest.prototype.clearAuthContext = function() {
  this.setAuthContext(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.DeleteProfileRequest.prototype.hasAuthContext = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional string profile_id = 2;
 * @return {string}
 */
proto.rover.audience.v1.DeleteProfileRequest.prototype.getProfileId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/** @param {string} value */
proto.rover.audience.v1.DeleteProfileRequest.prototype.setProfileId = function(value) {
  jspb.Message.setField(this, 2, value);
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
proto.rover.audience.v1.DeleteProfileResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.rover.audience.v1.DeleteProfileResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.DeleteProfileResponse.displayName = 'proto.rover.audience.v1.DeleteProfileResponse';
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
proto.rover.audience.v1.DeleteProfileResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.DeleteProfileResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.DeleteProfileResponse} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.DeleteProfileResponse.toObject = function(includeInstance, msg) {
  var f, obj = {

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
 * @return {!proto.rover.audience.v1.DeleteProfileResponse}
 */
proto.rover.audience.v1.DeleteProfileResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.DeleteProfileResponse;
  return proto.rover.audience.v1.DeleteProfileResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.DeleteProfileResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.DeleteProfileResponse}
 */
proto.rover.audience.v1.DeleteProfileResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
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
proto.rover.audience.v1.DeleteProfileResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.DeleteProfileResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.DeleteProfileResponse} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.DeleteProfileResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
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
proto.rover.audience.v1.UpdateProfileRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.rover.audience.v1.UpdateProfileRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.UpdateProfileRequest.displayName = 'proto.rover.audience.v1.UpdateProfileRequest';
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
proto.rover.audience.v1.UpdateProfileRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.UpdateProfileRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.UpdateProfileRequest} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.UpdateProfileRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    authContext: (f = msg.getAuthContext()) && auth_v1_auth_pb.AuthContext.toObject(includeInstance, f),
    profileId: jspb.Message.getFieldWithDefault(msg, 2, ""),
    attributesMap: (f = msg.getAttributesMap()) ? f.toObject(includeInstance, proto.rover.audience.v1.ValueUpdates.toObject) : []
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
 * @return {!proto.rover.audience.v1.UpdateProfileRequest}
 */
proto.rover.audience.v1.UpdateProfileRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.UpdateProfileRequest;
  return proto.rover.audience.v1.UpdateProfileRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.UpdateProfileRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.UpdateProfileRequest}
 */
proto.rover.audience.v1.UpdateProfileRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new auth_v1_auth_pb.AuthContext;
      reader.readMessage(value,auth_v1_auth_pb.AuthContext.deserializeBinaryFromReader);
      msg.setAuthContext(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setProfileId(value);
      break;
    case 5:
      var value = msg.getAttributesMap();
      reader.readMessage(value, function(message, reader) {
        jspb.Map.deserializeBinary(message, reader, jspb.BinaryReader.prototype.readString, jspb.BinaryReader.prototype.readMessage, proto.rover.audience.v1.ValueUpdates.deserializeBinaryFromReader);
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
proto.rover.audience.v1.UpdateProfileRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.UpdateProfileRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.UpdateProfileRequest} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.UpdateProfileRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getAuthContext();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      auth_v1_auth_pb.AuthContext.serializeBinaryToWriter
    );
  }
  f = message.getProfileId();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getAttributesMap(true);
  if (f && f.getLength() > 0) {
    f.serializeBinary(5, writer, jspb.BinaryWriter.prototype.writeString, jspb.BinaryWriter.prototype.writeMessage, proto.rover.audience.v1.ValueUpdates.serializeBinaryToWriter);
  }
};


/**
 * optional rover.auth.v1.AuthContext auth_context = 1;
 * @return {?proto.rover.auth.v1.AuthContext}
 */
proto.rover.audience.v1.UpdateProfileRequest.prototype.getAuthContext = function() {
  return /** @type{?proto.rover.auth.v1.AuthContext} */ (
    jspb.Message.getWrapperField(this, auth_v1_auth_pb.AuthContext, 1));
};


/** @param {?proto.rover.auth.v1.AuthContext|undefined} value */
proto.rover.audience.v1.UpdateProfileRequest.prototype.setAuthContext = function(value) {
  jspb.Message.setWrapperField(this, 1, value);
};


proto.rover.audience.v1.UpdateProfileRequest.prototype.clearAuthContext = function() {
  this.setAuthContext(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.UpdateProfileRequest.prototype.hasAuthContext = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional string profile_id = 2;
 * @return {string}
 */
proto.rover.audience.v1.UpdateProfileRequest.prototype.getProfileId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/** @param {string} value */
proto.rover.audience.v1.UpdateProfileRequest.prototype.setProfileId = function(value) {
  jspb.Message.setField(this, 2, value);
};


/**
 * map<string, ValueUpdates> attributes = 5;
 * @param {boolean=} opt_noLazyCreate Do not create the map if
 * empty, instead returning `undefined`
 * @return {!jspb.Map<string,!proto.rover.audience.v1.ValueUpdates>}
 */
proto.rover.audience.v1.UpdateProfileRequest.prototype.getAttributesMap = function(opt_noLazyCreate) {
  return /** @type {!jspb.Map<string,!proto.rover.audience.v1.ValueUpdates>} */ (
      jspb.Message.getMapField(this, 5, opt_noLazyCreate,
      proto.rover.audience.v1.ValueUpdates));
};


proto.rover.audience.v1.UpdateProfileRequest.prototype.clearAttributesMap = function() {
  this.getAttributesMap().clear();
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
proto.rover.audience.v1.UpdateProfileResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.rover.audience.v1.UpdateProfileResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.UpdateProfileResponse.displayName = 'proto.rover.audience.v1.UpdateProfileResponse';
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
proto.rover.audience.v1.UpdateProfileResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.UpdateProfileResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.UpdateProfileResponse} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.UpdateProfileResponse.toObject = function(includeInstance, msg) {
  var f, obj = {

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
 * @return {!proto.rover.audience.v1.UpdateProfileResponse}
 */
proto.rover.audience.v1.UpdateProfileResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.UpdateProfileResponse;
  return proto.rover.audience.v1.UpdateProfileResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.UpdateProfileResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.UpdateProfileResponse}
 */
proto.rover.audience.v1.UpdateProfileResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
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
proto.rover.audience.v1.UpdateProfileResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.UpdateProfileResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.UpdateProfileResponse} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.UpdateProfileResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
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
proto.rover.audience.v1.UpdateProfileIdentifierRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.rover.audience.v1.UpdateProfileIdentifierRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.UpdateProfileIdentifierRequest.displayName = 'proto.rover.audience.v1.UpdateProfileIdentifierRequest';
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
proto.rover.audience.v1.UpdateProfileIdentifierRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.UpdateProfileIdentifierRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.UpdateProfileIdentifierRequest} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.UpdateProfileIdentifierRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    authContext: (f = msg.getAuthContext()) && auth_v1_auth_pb.AuthContext.toObject(includeInstance, f),
    profileId: jspb.Message.getFieldWithDefault(msg, 2, ""),
    identifier: jspb.Message.getFieldWithDefault(msg, 3, "")
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
 * @return {!proto.rover.audience.v1.UpdateProfileIdentifierRequest}
 */
proto.rover.audience.v1.UpdateProfileIdentifierRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.UpdateProfileIdentifierRequest;
  return proto.rover.audience.v1.UpdateProfileIdentifierRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.UpdateProfileIdentifierRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.UpdateProfileIdentifierRequest}
 */
proto.rover.audience.v1.UpdateProfileIdentifierRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new auth_v1_auth_pb.AuthContext;
      reader.readMessage(value,auth_v1_auth_pb.AuthContext.deserializeBinaryFromReader);
      msg.setAuthContext(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setProfileId(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setIdentifier(value);
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
proto.rover.audience.v1.UpdateProfileIdentifierRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.UpdateProfileIdentifierRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.UpdateProfileIdentifierRequest} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.UpdateProfileIdentifierRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getAuthContext();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      auth_v1_auth_pb.AuthContext.serializeBinaryToWriter
    );
  }
  f = message.getProfileId();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getIdentifier();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
};


/**
 * optional rover.auth.v1.AuthContext auth_context = 1;
 * @return {?proto.rover.auth.v1.AuthContext}
 */
proto.rover.audience.v1.UpdateProfileIdentifierRequest.prototype.getAuthContext = function() {
  return /** @type{?proto.rover.auth.v1.AuthContext} */ (
    jspb.Message.getWrapperField(this, auth_v1_auth_pb.AuthContext, 1));
};


/** @param {?proto.rover.auth.v1.AuthContext|undefined} value */
proto.rover.audience.v1.UpdateProfileIdentifierRequest.prototype.setAuthContext = function(value) {
  jspb.Message.setWrapperField(this, 1, value);
};


proto.rover.audience.v1.UpdateProfileIdentifierRequest.prototype.clearAuthContext = function() {
  this.setAuthContext(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.UpdateProfileIdentifierRequest.prototype.hasAuthContext = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional string profile_id = 2;
 * @return {string}
 */
proto.rover.audience.v1.UpdateProfileIdentifierRequest.prototype.getProfileId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/** @param {string} value */
proto.rover.audience.v1.UpdateProfileIdentifierRequest.prototype.setProfileId = function(value) {
  jspb.Message.setField(this, 2, value);
};


/**
 * optional string identifier = 3;
 * @return {string}
 */
proto.rover.audience.v1.UpdateProfileIdentifierRequest.prototype.getIdentifier = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/** @param {string} value */
proto.rover.audience.v1.UpdateProfileIdentifierRequest.prototype.setIdentifier = function(value) {
  jspb.Message.setField(this, 3, value);
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
proto.rover.audience.v1.UpdateProfileIdentifierResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.rover.audience.v1.UpdateProfileIdentifierResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.UpdateProfileIdentifierResponse.displayName = 'proto.rover.audience.v1.UpdateProfileIdentifierResponse';
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
proto.rover.audience.v1.UpdateProfileIdentifierResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.UpdateProfileIdentifierResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.UpdateProfileIdentifierResponse} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.UpdateProfileIdentifierResponse.toObject = function(includeInstance, msg) {
  var f, obj = {

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
 * @return {!proto.rover.audience.v1.UpdateProfileIdentifierResponse}
 */
proto.rover.audience.v1.UpdateProfileIdentifierResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.UpdateProfileIdentifierResponse;
  return proto.rover.audience.v1.UpdateProfileIdentifierResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.UpdateProfileIdentifierResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.UpdateProfileIdentifierResponse}
 */
proto.rover.audience.v1.UpdateProfileIdentifierResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
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
proto.rover.audience.v1.UpdateProfileIdentifierResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.UpdateProfileIdentifierResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.UpdateProfileIdentifierResponse} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.UpdateProfileIdentifierResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
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
proto.rover.audience.v1.GetProfileByDeviceIdRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.rover.audience.v1.GetProfileByDeviceIdRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.GetProfileByDeviceIdRequest.displayName = 'proto.rover.audience.v1.GetProfileByDeviceIdRequest';
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
proto.rover.audience.v1.GetProfileByDeviceIdRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.GetProfileByDeviceIdRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.GetProfileByDeviceIdRequest} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.GetProfileByDeviceIdRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    authContext: (f = msg.getAuthContext()) && auth_v1_auth_pb.AuthContext.toObject(includeInstance, f),
    deviceId: jspb.Message.getFieldWithDefault(msg, 2, "")
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
 * @return {!proto.rover.audience.v1.GetProfileByDeviceIdRequest}
 */
proto.rover.audience.v1.GetProfileByDeviceIdRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.GetProfileByDeviceIdRequest;
  return proto.rover.audience.v1.GetProfileByDeviceIdRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.GetProfileByDeviceIdRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.GetProfileByDeviceIdRequest}
 */
proto.rover.audience.v1.GetProfileByDeviceIdRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new auth_v1_auth_pb.AuthContext;
      reader.readMessage(value,auth_v1_auth_pb.AuthContext.deserializeBinaryFromReader);
      msg.setAuthContext(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setDeviceId(value);
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
proto.rover.audience.v1.GetProfileByDeviceIdRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.GetProfileByDeviceIdRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.GetProfileByDeviceIdRequest} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.GetProfileByDeviceIdRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getAuthContext();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      auth_v1_auth_pb.AuthContext.serializeBinaryToWriter
    );
  }
  f = message.getDeviceId();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * optional rover.auth.v1.AuthContext auth_context = 1;
 * @return {?proto.rover.auth.v1.AuthContext}
 */
proto.rover.audience.v1.GetProfileByDeviceIdRequest.prototype.getAuthContext = function() {
  return /** @type{?proto.rover.auth.v1.AuthContext} */ (
    jspb.Message.getWrapperField(this, auth_v1_auth_pb.AuthContext, 1));
};


/** @param {?proto.rover.auth.v1.AuthContext|undefined} value */
proto.rover.audience.v1.GetProfileByDeviceIdRequest.prototype.setAuthContext = function(value) {
  jspb.Message.setWrapperField(this, 1, value);
};


proto.rover.audience.v1.GetProfileByDeviceIdRequest.prototype.clearAuthContext = function() {
  this.setAuthContext(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.GetProfileByDeviceIdRequest.prototype.hasAuthContext = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional string device_id = 2;
 * @return {string}
 */
proto.rover.audience.v1.GetProfileByDeviceIdRequest.prototype.getDeviceId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/** @param {string} value */
proto.rover.audience.v1.GetProfileByDeviceIdRequest.prototype.setDeviceId = function(value) {
  jspb.Message.setField(this, 2, value);
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
proto.rover.audience.v1.GetProfileByDeviceIdResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.rover.audience.v1.GetProfileByDeviceIdResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.GetProfileByDeviceIdResponse.displayName = 'proto.rover.audience.v1.GetProfileByDeviceIdResponse';
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
proto.rover.audience.v1.GetProfileByDeviceIdResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.GetProfileByDeviceIdResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.GetProfileByDeviceIdResponse} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.GetProfileByDeviceIdResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    profile: (f = msg.getProfile()) && proto.rover.audience.v1.Profile.toObject(includeInstance, f)
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
 * @return {!proto.rover.audience.v1.GetProfileByDeviceIdResponse}
 */
proto.rover.audience.v1.GetProfileByDeviceIdResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.GetProfileByDeviceIdResponse;
  return proto.rover.audience.v1.GetProfileByDeviceIdResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.GetProfileByDeviceIdResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.GetProfileByDeviceIdResponse}
 */
proto.rover.audience.v1.GetProfileByDeviceIdResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.rover.audience.v1.Profile;
      reader.readMessage(value,proto.rover.audience.v1.Profile.deserializeBinaryFromReader);
      msg.setProfile(value);
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
proto.rover.audience.v1.GetProfileByDeviceIdResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.GetProfileByDeviceIdResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.GetProfileByDeviceIdResponse} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.GetProfileByDeviceIdResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getProfile();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.rover.audience.v1.Profile.serializeBinaryToWriter
    );
  }
};


/**
 * optional Profile profile = 1;
 * @return {?proto.rover.audience.v1.Profile}
 */
proto.rover.audience.v1.GetProfileByDeviceIdResponse.prototype.getProfile = function() {
  return /** @type{?proto.rover.audience.v1.Profile} */ (
    jspb.Message.getWrapperField(this, proto.rover.audience.v1.Profile, 1));
};


/** @param {?proto.rover.audience.v1.Profile|undefined} value */
proto.rover.audience.v1.GetProfileByDeviceIdResponse.prototype.setProfile = function(value) {
  jspb.Message.setWrapperField(this, 1, value);
};


proto.rover.audience.v1.GetProfileByDeviceIdResponse.prototype.clearProfile = function() {
  this.setProfile(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.GetProfileByDeviceIdResponse.prototype.hasProfile = function() {
  return jspb.Message.getField(this, 1) != null;
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
proto.rover.audience.v1.GetProfileByIdentifierRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.rover.audience.v1.GetProfileByIdentifierRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.GetProfileByIdentifierRequest.displayName = 'proto.rover.audience.v1.GetProfileByIdentifierRequest';
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
proto.rover.audience.v1.GetProfileByIdentifierRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.GetProfileByIdentifierRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.GetProfileByIdentifierRequest} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.GetProfileByIdentifierRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    authContext: (f = msg.getAuthContext()) && auth_v1_auth_pb.AuthContext.toObject(includeInstance, f),
    identifier: jspb.Message.getFieldWithDefault(msg, 2, "")
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
 * @return {!proto.rover.audience.v1.GetProfileByIdentifierRequest}
 */
proto.rover.audience.v1.GetProfileByIdentifierRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.GetProfileByIdentifierRequest;
  return proto.rover.audience.v1.GetProfileByIdentifierRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.GetProfileByIdentifierRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.GetProfileByIdentifierRequest}
 */
proto.rover.audience.v1.GetProfileByIdentifierRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new auth_v1_auth_pb.AuthContext;
      reader.readMessage(value,auth_v1_auth_pb.AuthContext.deserializeBinaryFromReader);
      msg.setAuthContext(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setIdentifier(value);
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
proto.rover.audience.v1.GetProfileByIdentifierRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.GetProfileByIdentifierRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.GetProfileByIdentifierRequest} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.GetProfileByIdentifierRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getAuthContext();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      auth_v1_auth_pb.AuthContext.serializeBinaryToWriter
    );
  }
  f = message.getIdentifier();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * optional rover.auth.v1.AuthContext auth_context = 1;
 * @return {?proto.rover.auth.v1.AuthContext}
 */
proto.rover.audience.v1.GetProfileByIdentifierRequest.prototype.getAuthContext = function() {
  return /** @type{?proto.rover.auth.v1.AuthContext} */ (
    jspb.Message.getWrapperField(this, auth_v1_auth_pb.AuthContext, 1));
};


/** @param {?proto.rover.auth.v1.AuthContext|undefined} value */
proto.rover.audience.v1.GetProfileByIdentifierRequest.prototype.setAuthContext = function(value) {
  jspb.Message.setWrapperField(this, 1, value);
};


proto.rover.audience.v1.GetProfileByIdentifierRequest.prototype.clearAuthContext = function() {
  this.setAuthContext(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.GetProfileByIdentifierRequest.prototype.hasAuthContext = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional string identifier = 2;
 * @return {string}
 */
proto.rover.audience.v1.GetProfileByIdentifierRequest.prototype.getIdentifier = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/** @param {string} value */
proto.rover.audience.v1.GetProfileByIdentifierRequest.prototype.setIdentifier = function(value) {
  jspb.Message.setField(this, 2, value);
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
proto.rover.audience.v1.GetProfileByIdentifierResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.rover.audience.v1.GetProfileByIdentifierResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.GetProfileByIdentifierResponse.displayName = 'proto.rover.audience.v1.GetProfileByIdentifierResponse';
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
proto.rover.audience.v1.GetProfileByIdentifierResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.GetProfileByIdentifierResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.GetProfileByIdentifierResponse} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.GetProfileByIdentifierResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    profile: (f = msg.getProfile()) && proto.rover.audience.v1.Profile.toObject(includeInstance, f)
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
 * @return {!proto.rover.audience.v1.GetProfileByIdentifierResponse}
 */
proto.rover.audience.v1.GetProfileByIdentifierResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.GetProfileByIdentifierResponse;
  return proto.rover.audience.v1.GetProfileByIdentifierResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.GetProfileByIdentifierResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.GetProfileByIdentifierResponse}
 */
proto.rover.audience.v1.GetProfileByIdentifierResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.rover.audience.v1.Profile;
      reader.readMessage(value,proto.rover.audience.v1.Profile.deserializeBinaryFromReader);
      msg.setProfile(value);
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
proto.rover.audience.v1.GetProfileByIdentifierResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.GetProfileByIdentifierResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.GetProfileByIdentifierResponse} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.GetProfileByIdentifierResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getProfile();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.rover.audience.v1.Profile.serializeBinaryToWriter
    );
  }
};


/**
 * optional Profile profile = 1;
 * @return {?proto.rover.audience.v1.Profile}
 */
proto.rover.audience.v1.GetProfileByIdentifierResponse.prototype.getProfile = function() {
  return /** @type{?proto.rover.audience.v1.Profile} */ (
    jspb.Message.getWrapperField(this, proto.rover.audience.v1.Profile, 1));
};


/** @param {?proto.rover.audience.v1.Profile|undefined} value */
proto.rover.audience.v1.GetProfileByIdentifierResponse.prototype.setProfile = function(value) {
  jspb.Message.setWrapperField(this, 1, value);
};


proto.rover.audience.v1.GetProfileByIdentifierResponse.prototype.clearProfile = function() {
  this.setProfile(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.GetProfileByIdentifierResponse.prototype.hasProfile = function() {
  return jspb.Message.getField(this, 1) != null;
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
proto.rover.audience.v1.ListProfilesByIdsRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.rover.audience.v1.ListProfilesByIdsRequest.repeatedFields_, null);
};
goog.inherits(proto.rover.audience.v1.ListProfilesByIdsRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.ListProfilesByIdsRequest.displayName = 'proto.rover.audience.v1.ListProfilesByIdsRequest';
}
/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.rover.audience.v1.ListProfilesByIdsRequest.repeatedFields_ = [2];



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
proto.rover.audience.v1.ListProfilesByIdsRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.ListProfilesByIdsRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.ListProfilesByIdsRequest} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.ListProfilesByIdsRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    authContext: (f = msg.getAuthContext()) && auth_v1_auth_pb.AuthContext.toObject(includeInstance, f),
    profileIdsList: jspb.Message.getField(msg, 2)
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
 * @return {!proto.rover.audience.v1.ListProfilesByIdsRequest}
 */
proto.rover.audience.v1.ListProfilesByIdsRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.ListProfilesByIdsRequest;
  return proto.rover.audience.v1.ListProfilesByIdsRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.ListProfilesByIdsRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.ListProfilesByIdsRequest}
 */
proto.rover.audience.v1.ListProfilesByIdsRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new auth_v1_auth_pb.AuthContext;
      reader.readMessage(value,auth_v1_auth_pb.AuthContext.deserializeBinaryFromReader);
      msg.setAuthContext(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.addProfileIds(value);
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
proto.rover.audience.v1.ListProfilesByIdsRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.ListProfilesByIdsRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.ListProfilesByIdsRequest} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.ListProfilesByIdsRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getAuthContext();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      auth_v1_auth_pb.AuthContext.serializeBinaryToWriter
    );
  }
  f = message.getProfileIdsList();
  if (f.length > 0) {
    writer.writeRepeatedString(
      2,
      f
    );
  }
};


/**
 * optional rover.auth.v1.AuthContext auth_context = 1;
 * @return {?proto.rover.auth.v1.AuthContext}
 */
proto.rover.audience.v1.ListProfilesByIdsRequest.prototype.getAuthContext = function() {
  return /** @type{?proto.rover.auth.v1.AuthContext} */ (
    jspb.Message.getWrapperField(this, auth_v1_auth_pb.AuthContext, 1));
};


/** @param {?proto.rover.auth.v1.AuthContext|undefined} value */
proto.rover.audience.v1.ListProfilesByIdsRequest.prototype.setAuthContext = function(value) {
  jspb.Message.setWrapperField(this, 1, value);
};


proto.rover.audience.v1.ListProfilesByIdsRequest.prototype.clearAuthContext = function() {
  this.setAuthContext(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.ListProfilesByIdsRequest.prototype.hasAuthContext = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * repeated string profile_ids = 2;
 * If you change this array by adding, removing or replacing elements, or if you
 * replace the array itself, then you must call the setter to update it.
 * @return {!Array.<string>}
 */
proto.rover.audience.v1.ListProfilesByIdsRequest.prototype.getProfileIdsList = function() {
  return /** @type {!Array.<string>} */ (jspb.Message.getField(this, 2));
};


/** @param {!Array.<string>} value */
proto.rover.audience.v1.ListProfilesByIdsRequest.prototype.setProfileIdsList = function(value) {
  jspb.Message.setField(this, 2, value || []);
};


/**
 * @param {!string} value
 * @param {number=} opt_index
 */
proto.rover.audience.v1.ListProfilesByIdsRequest.prototype.addProfileIds = function(value, opt_index) {
  jspb.Message.addToRepeatedField(this, 2, value, opt_index);
};


proto.rover.audience.v1.ListProfilesByIdsRequest.prototype.clearProfileIdsList = function() {
  this.setProfileIdsList([]);
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
proto.rover.audience.v1.ListProfilesByIdsResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.rover.audience.v1.ListProfilesByIdsResponse.repeatedFields_, null);
};
goog.inherits(proto.rover.audience.v1.ListProfilesByIdsResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.ListProfilesByIdsResponse.displayName = 'proto.rover.audience.v1.ListProfilesByIdsResponse';
}
/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.rover.audience.v1.ListProfilesByIdsResponse.repeatedFields_ = [2];



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
proto.rover.audience.v1.ListProfilesByIdsResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.ListProfilesByIdsResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.ListProfilesByIdsResponse} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.ListProfilesByIdsResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    profilesList: jspb.Message.toObjectList(msg.getProfilesList(),
    proto.rover.audience.v1.Profile.toObject, includeInstance)
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
 * @return {!proto.rover.audience.v1.ListProfilesByIdsResponse}
 */
proto.rover.audience.v1.ListProfilesByIdsResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.ListProfilesByIdsResponse;
  return proto.rover.audience.v1.ListProfilesByIdsResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.ListProfilesByIdsResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.ListProfilesByIdsResponse}
 */
proto.rover.audience.v1.ListProfilesByIdsResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 2:
      var value = new proto.rover.audience.v1.Profile;
      reader.readMessage(value,proto.rover.audience.v1.Profile.deserializeBinaryFromReader);
      msg.addProfiles(value);
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
proto.rover.audience.v1.ListProfilesByIdsResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.ListProfilesByIdsResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.ListProfilesByIdsResponse} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.ListProfilesByIdsResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getProfilesList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      2,
      f,
      proto.rover.audience.v1.Profile.serializeBinaryToWriter
    );
  }
};


/**
 * repeated Profile profiles = 2;
 * If you change this array by adding, removing or replacing elements, or if you
 * replace the array itself, then you must call the setter to update it.
 * @return {!Array.<!proto.rover.audience.v1.Profile>}
 */
proto.rover.audience.v1.ListProfilesByIdsResponse.prototype.getProfilesList = function() {
  return /** @type{!Array.<!proto.rover.audience.v1.Profile>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.rover.audience.v1.Profile, 2));
};


/** @param {!Array.<!proto.rover.audience.v1.Profile>} value */
proto.rover.audience.v1.ListProfilesByIdsResponse.prototype.setProfilesList = function(value) {
  jspb.Message.setRepeatedWrapperField(this, 2, value);
};


/**
 * @param {!proto.rover.audience.v1.Profile=} opt_value
 * @param {number=} opt_index
 * @return {!proto.rover.audience.v1.Profile}
 */
proto.rover.audience.v1.ListProfilesByIdsResponse.prototype.addProfiles = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 2, opt_value, proto.rover.audience.v1.Profile, opt_index);
};


proto.rover.audience.v1.ListProfilesByIdsResponse.prototype.clearProfilesList = function() {
  this.setProfilesList([]);
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
proto.rover.audience.v1.GetProfileSchemaRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.rover.audience.v1.GetProfileSchemaRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.GetProfileSchemaRequest.displayName = 'proto.rover.audience.v1.GetProfileSchemaRequest';
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
proto.rover.audience.v1.GetProfileSchemaRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.GetProfileSchemaRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.GetProfileSchemaRequest} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.GetProfileSchemaRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    authContext: (f = msg.getAuthContext()) && auth_v1_auth_pb.AuthContext.toObject(includeInstance, f)
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
 * @return {!proto.rover.audience.v1.GetProfileSchemaRequest}
 */
proto.rover.audience.v1.GetProfileSchemaRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.GetProfileSchemaRequest;
  return proto.rover.audience.v1.GetProfileSchemaRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.GetProfileSchemaRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.GetProfileSchemaRequest}
 */
proto.rover.audience.v1.GetProfileSchemaRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new auth_v1_auth_pb.AuthContext;
      reader.readMessage(value,auth_v1_auth_pb.AuthContext.deserializeBinaryFromReader);
      msg.setAuthContext(value);
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
proto.rover.audience.v1.GetProfileSchemaRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.GetProfileSchemaRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.GetProfileSchemaRequest} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.GetProfileSchemaRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getAuthContext();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      auth_v1_auth_pb.AuthContext.serializeBinaryToWriter
    );
  }
};


/**
 * optional rover.auth.v1.AuthContext auth_context = 1;
 * @return {?proto.rover.auth.v1.AuthContext}
 */
proto.rover.audience.v1.GetProfileSchemaRequest.prototype.getAuthContext = function() {
  return /** @type{?proto.rover.auth.v1.AuthContext} */ (
    jspb.Message.getWrapperField(this, auth_v1_auth_pb.AuthContext, 1));
};


/** @param {?proto.rover.auth.v1.AuthContext|undefined} value */
proto.rover.audience.v1.GetProfileSchemaRequest.prototype.setAuthContext = function(value) {
  jspb.Message.setWrapperField(this, 1, value);
};


proto.rover.audience.v1.GetProfileSchemaRequest.prototype.clearAuthContext = function() {
  this.setAuthContext(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.GetProfileSchemaRequest.prototype.hasAuthContext = function() {
  return jspb.Message.getField(this, 1) != null;
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
proto.rover.audience.v1.GetProfileSchemaResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.rover.audience.v1.GetProfileSchemaResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.GetProfileSchemaResponse.displayName = 'proto.rover.audience.v1.GetProfileSchemaResponse';
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
proto.rover.audience.v1.GetProfileSchemaResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.GetProfileSchemaResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.GetProfileSchemaResponse} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.GetProfileSchemaResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    schema: (f = msg.getSchema()) && proto.rover.audience.v1.ProfileSchema.toObject(includeInstance, f)
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
 * @return {!proto.rover.audience.v1.GetProfileSchemaResponse}
 */
proto.rover.audience.v1.GetProfileSchemaResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.GetProfileSchemaResponse;
  return proto.rover.audience.v1.GetProfileSchemaResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.GetProfileSchemaResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.GetProfileSchemaResponse}
 */
proto.rover.audience.v1.GetProfileSchemaResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.rover.audience.v1.ProfileSchema;
      reader.readMessage(value,proto.rover.audience.v1.ProfileSchema.deserializeBinaryFromReader);
      msg.setSchema(value);
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
proto.rover.audience.v1.GetProfileSchemaResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.GetProfileSchemaResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.GetProfileSchemaResponse} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.GetProfileSchemaResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSchema();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.rover.audience.v1.ProfileSchema.serializeBinaryToWriter
    );
  }
};


/**
 * optional ProfileSchema schema = 1;
 * @return {?proto.rover.audience.v1.ProfileSchema}
 */
proto.rover.audience.v1.GetProfileSchemaResponse.prototype.getSchema = function() {
  return /** @type{?proto.rover.audience.v1.ProfileSchema} */ (
    jspb.Message.getWrapperField(this, proto.rover.audience.v1.ProfileSchema, 1));
};


/** @param {?proto.rover.audience.v1.ProfileSchema|undefined} value */
proto.rover.audience.v1.GetProfileSchemaResponse.prototype.setSchema = function(value) {
  jspb.Message.setWrapperField(this, 1, value);
};


proto.rover.audience.v1.GetProfileSchemaResponse.prototype.clearSchema = function() {
  this.setSchema(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.GetProfileSchemaResponse.prototype.hasSchema = function() {
  return jspb.Message.getField(this, 1) != null;
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
proto.rover.audience.v1.Profile = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.rover.audience.v1.Profile, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.Profile.displayName = 'proto.rover.audience.v1.Profile';
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
proto.rover.audience.v1.Profile.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.Profile.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.Profile} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.Profile.toObject = function(includeInstance, msg) {
  var f, obj = {
    id: jspb.Message.getFieldWithDefault(msg, 1, ""),
    accountId: jspb.Message.getFieldWithDefault(msg, 2, 0),
    identifier: jspb.Message.getFieldWithDefault(msg, 3, ""),
    attributesMap: (f = msg.getAttributesMap()) ? f.toObject(includeInstance, proto.rover.audience.v1.Value.toObject) : [],
    createdAt: (f = msg.getCreatedAt()) && google_protobuf_timestamp_pb.Timestamp.toObject(includeInstance, f),
    updatedAt: (f = msg.getUpdatedAt()) && google_protobuf_timestamp_pb.Timestamp.toObject(includeInstance, f)
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
 * @return {!proto.rover.audience.v1.Profile}
 */
proto.rover.audience.v1.Profile.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.Profile;
  return proto.rover.audience.v1.Profile.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.Profile} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.Profile}
 */
proto.rover.audience.v1.Profile.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setId(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setAccountId(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setIdentifier(value);
      break;
    case 4:
      var value = msg.getAttributesMap();
      reader.readMessage(value, function(message, reader) {
        jspb.Map.deserializeBinary(message, reader, jspb.BinaryReader.prototype.readString, jspb.BinaryReader.prototype.readMessage, proto.rover.audience.v1.Value.deserializeBinaryFromReader);
         });
      break;
    case 5:
      var value = new google_protobuf_timestamp_pb.Timestamp;
      reader.readMessage(value,google_protobuf_timestamp_pb.Timestamp.deserializeBinaryFromReader);
      msg.setCreatedAt(value);
      break;
    case 6:
      var value = new google_protobuf_timestamp_pb.Timestamp;
      reader.readMessage(value,google_protobuf_timestamp_pb.Timestamp.deserializeBinaryFromReader);
      msg.setUpdatedAt(value);
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
proto.rover.audience.v1.Profile.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.Profile.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.Profile} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.Profile.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getId();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getAccountId();
  if (f !== 0) {
    writer.writeInt32(
      2,
      f
    );
  }
  f = message.getIdentifier();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getAttributesMap(true);
  if (f && f.getLength() > 0) {
    f.serializeBinary(4, writer, jspb.BinaryWriter.prototype.writeString, jspb.BinaryWriter.prototype.writeMessage, proto.rover.audience.v1.Value.serializeBinaryToWriter);
  }
  f = message.getCreatedAt();
  if (f != null) {
    writer.writeMessage(
      5,
      f,
      google_protobuf_timestamp_pb.Timestamp.serializeBinaryToWriter
    );
  }
  f = message.getUpdatedAt();
  if (f != null) {
    writer.writeMessage(
      6,
      f,
      google_protobuf_timestamp_pb.Timestamp.serializeBinaryToWriter
    );
  }
};


/**
 * optional string id = 1;
 * @return {string}
 */
proto.rover.audience.v1.Profile.prototype.getId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/** @param {string} value */
proto.rover.audience.v1.Profile.prototype.setId = function(value) {
  jspb.Message.setField(this, 1, value);
};


/**
 * optional int32 account_id = 2;
 * @return {number}
 */
proto.rover.audience.v1.Profile.prototype.getAccountId = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/** @param {number} value */
proto.rover.audience.v1.Profile.prototype.setAccountId = function(value) {
  jspb.Message.setField(this, 2, value);
};


/**
 * optional string identifier = 3;
 * @return {string}
 */
proto.rover.audience.v1.Profile.prototype.getIdentifier = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/** @param {string} value */
proto.rover.audience.v1.Profile.prototype.setIdentifier = function(value) {
  jspb.Message.setField(this, 3, value);
};


/**
 * map<string, Value> attributes = 4;
 * @param {boolean=} opt_noLazyCreate Do not create the map if
 * empty, instead returning `undefined`
 * @return {!jspb.Map<string,!proto.rover.audience.v1.Value>}
 */
proto.rover.audience.v1.Profile.prototype.getAttributesMap = function(opt_noLazyCreate) {
  return /** @type {!jspb.Map<string,!proto.rover.audience.v1.Value>} */ (
      jspb.Message.getMapField(this, 4, opt_noLazyCreate,
      proto.rover.audience.v1.Value));
};


proto.rover.audience.v1.Profile.prototype.clearAttributesMap = function() {
  this.getAttributesMap().clear();
};


/**
 * optional google.protobuf.Timestamp created_at = 5;
 * @return {?proto.google.protobuf.Timestamp}
 */
proto.rover.audience.v1.Profile.prototype.getCreatedAt = function() {
  return /** @type{?proto.google.protobuf.Timestamp} */ (
    jspb.Message.getWrapperField(this, google_protobuf_timestamp_pb.Timestamp, 5));
};


/** @param {?proto.google.protobuf.Timestamp|undefined} value */
proto.rover.audience.v1.Profile.prototype.setCreatedAt = function(value) {
  jspb.Message.setWrapperField(this, 5, value);
};


proto.rover.audience.v1.Profile.prototype.clearCreatedAt = function() {
  this.setCreatedAt(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.Profile.prototype.hasCreatedAt = function() {
  return jspb.Message.getField(this, 5) != null;
};


/**
 * optional google.protobuf.Timestamp updated_at = 6;
 * @return {?proto.google.protobuf.Timestamp}
 */
proto.rover.audience.v1.Profile.prototype.getUpdatedAt = function() {
  return /** @type{?proto.google.protobuf.Timestamp} */ (
    jspb.Message.getWrapperField(this, google_protobuf_timestamp_pb.Timestamp, 6));
};


/** @param {?proto.google.protobuf.Timestamp|undefined} value */
proto.rover.audience.v1.Profile.prototype.setUpdatedAt = function(value) {
  jspb.Message.setWrapperField(this, 6, value);
};


proto.rover.audience.v1.Profile.prototype.clearUpdatedAt = function() {
  this.setUpdatedAt(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.Profile.prototype.hasUpdatedAt = function() {
  return jspb.Message.getField(this, 6) != null;
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
proto.rover.audience.v1.ProfileSchema = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.rover.audience.v1.ProfileSchema.repeatedFields_, null);
};
goog.inherits(proto.rover.audience.v1.ProfileSchema, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.ProfileSchema.displayName = 'proto.rover.audience.v1.ProfileSchema';
}
/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.rover.audience.v1.ProfileSchema.repeatedFields_ = [10];



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
proto.rover.audience.v1.ProfileSchema.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.ProfileSchema.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.ProfileSchema} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.ProfileSchema.toObject = function(includeInstance, msg) {
  var f, obj = {
    attributesList: jspb.Message.toObjectList(msg.getAttributesList(),
    proto.rover.audience.v1.SchemaAttribute.toObject, includeInstance)
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
 * @return {!proto.rover.audience.v1.ProfileSchema}
 */
proto.rover.audience.v1.ProfileSchema.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.ProfileSchema;
  return proto.rover.audience.v1.ProfileSchema.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.ProfileSchema} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.ProfileSchema}
 */
proto.rover.audience.v1.ProfileSchema.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 10:
      var value = new proto.rover.audience.v1.SchemaAttribute;
      reader.readMessage(value,proto.rover.audience.v1.SchemaAttribute.deserializeBinaryFromReader);
      msg.addAttributes(value);
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
proto.rover.audience.v1.ProfileSchema.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.ProfileSchema.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.ProfileSchema} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.ProfileSchema.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getAttributesList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      10,
      f,
      proto.rover.audience.v1.SchemaAttribute.serializeBinaryToWriter
    );
  }
};


/**
 * repeated SchemaAttribute attributes = 10;
 * If you change this array by adding, removing or replacing elements, or if you
 * replace the array itself, then you must call the setter to update it.
 * @return {!Array.<!proto.rover.audience.v1.SchemaAttribute>}
 */
proto.rover.audience.v1.ProfileSchema.prototype.getAttributesList = function() {
  return /** @type{!Array.<!proto.rover.audience.v1.SchemaAttribute>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.rover.audience.v1.SchemaAttribute, 10));
};


/** @param {!Array.<!proto.rover.audience.v1.SchemaAttribute>} value */
proto.rover.audience.v1.ProfileSchema.prototype.setAttributesList = function(value) {
  jspb.Message.setRepeatedWrapperField(this, 10, value);
};


/**
 * @param {!proto.rover.audience.v1.SchemaAttribute=} opt_value
 * @param {number=} opt_index
 * @return {!proto.rover.audience.v1.SchemaAttribute}
 */
proto.rover.audience.v1.ProfileSchema.prototype.addAttributes = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 10, opt_value, proto.rover.audience.v1.SchemaAttribute, opt_index);
};


proto.rover.audience.v1.ProfileSchema.prototype.clearAttributesList = function() {
  this.setAttributesList([]);
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
proto.rover.audience.v1.GetDeviceRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.rover.audience.v1.GetDeviceRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.GetDeviceRequest.displayName = 'proto.rover.audience.v1.GetDeviceRequest';
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
proto.rover.audience.v1.GetDeviceRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.GetDeviceRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.GetDeviceRequest} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.GetDeviceRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    authContext: (f = msg.getAuthContext()) && auth_v1_auth_pb.AuthContext.toObject(includeInstance, f),
    deviceId: jspb.Message.getFieldWithDefault(msg, 2, "")
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
 * @return {!proto.rover.audience.v1.GetDeviceRequest}
 */
proto.rover.audience.v1.GetDeviceRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.GetDeviceRequest;
  return proto.rover.audience.v1.GetDeviceRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.GetDeviceRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.GetDeviceRequest}
 */
proto.rover.audience.v1.GetDeviceRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new auth_v1_auth_pb.AuthContext;
      reader.readMessage(value,auth_v1_auth_pb.AuthContext.deserializeBinaryFromReader);
      msg.setAuthContext(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setDeviceId(value);
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
proto.rover.audience.v1.GetDeviceRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.GetDeviceRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.GetDeviceRequest} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.GetDeviceRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getAuthContext();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      auth_v1_auth_pb.AuthContext.serializeBinaryToWriter
    );
  }
  f = message.getDeviceId();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * optional rover.auth.v1.AuthContext auth_context = 1;
 * @return {?proto.rover.auth.v1.AuthContext}
 */
proto.rover.audience.v1.GetDeviceRequest.prototype.getAuthContext = function() {
  return /** @type{?proto.rover.auth.v1.AuthContext} */ (
    jspb.Message.getWrapperField(this, auth_v1_auth_pb.AuthContext, 1));
};


/** @param {?proto.rover.auth.v1.AuthContext|undefined} value */
proto.rover.audience.v1.GetDeviceRequest.prototype.setAuthContext = function(value) {
  jspb.Message.setWrapperField(this, 1, value);
};


proto.rover.audience.v1.GetDeviceRequest.prototype.clearAuthContext = function() {
  this.setAuthContext(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.GetDeviceRequest.prototype.hasAuthContext = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional string device_id = 2;
 * @return {string}
 */
proto.rover.audience.v1.GetDeviceRequest.prototype.getDeviceId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/** @param {string} value */
proto.rover.audience.v1.GetDeviceRequest.prototype.setDeviceId = function(value) {
  jspb.Message.setField(this, 2, value);
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
proto.rover.audience.v1.GetDeviceResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.rover.audience.v1.GetDeviceResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.GetDeviceResponse.displayName = 'proto.rover.audience.v1.GetDeviceResponse';
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
proto.rover.audience.v1.GetDeviceResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.GetDeviceResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.GetDeviceResponse} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.GetDeviceResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    device: (f = msg.getDevice()) && proto.rover.audience.v1.Device.toObject(includeInstance, f)
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
 * @return {!proto.rover.audience.v1.GetDeviceResponse}
 */
proto.rover.audience.v1.GetDeviceResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.GetDeviceResponse;
  return proto.rover.audience.v1.GetDeviceResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.GetDeviceResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.GetDeviceResponse}
 */
proto.rover.audience.v1.GetDeviceResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.rover.audience.v1.Device;
      reader.readMessage(value,proto.rover.audience.v1.Device.deserializeBinaryFromReader);
      msg.setDevice(value);
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
proto.rover.audience.v1.GetDeviceResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.GetDeviceResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.GetDeviceResponse} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.GetDeviceResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getDevice();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.rover.audience.v1.Device.serializeBinaryToWriter
    );
  }
};


/**
 * optional Device device = 1;
 * @return {?proto.rover.audience.v1.Device}
 */
proto.rover.audience.v1.GetDeviceResponse.prototype.getDevice = function() {
  return /** @type{?proto.rover.audience.v1.Device} */ (
    jspb.Message.getWrapperField(this, proto.rover.audience.v1.Device, 1));
};


/** @param {?proto.rover.audience.v1.Device|undefined} value */
proto.rover.audience.v1.GetDeviceResponse.prototype.setDevice = function(value) {
  jspb.Message.setWrapperField(this, 1, value);
};


proto.rover.audience.v1.GetDeviceResponse.prototype.clearDevice = function() {
  this.setDevice(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.GetDeviceResponse.prototype.hasDevice = function() {
  return jspb.Message.getField(this, 1) != null;
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
proto.rover.audience.v1.GetDeviceByPushTokenRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.rover.audience.v1.GetDeviceByPushTokenRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.GetDeviceByPushTokenRequest.displayName = 'proto.rover.audience.v1.GetDeviceByPushTokenRequest';
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
proto.rover.audience.v1.GetDeviceByPushTokenRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.GetDeviceByPushTokenRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.GetDeviceByPushTokenRequest} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.GetDeviceByPushTokenRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    authContext: (f = msg.getAuthContext()) && auth_v1_auth_pb.AuthContext.toObject(includeInstance, f),
    deviceTokenKey: jspb.Message.getFieldWithDefault(msg, 2, "")
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
 * @return {!proto.rover.audience.v1.GetDeviceByPushTokenRequest}
 */
proto.rover.audience.v1.GetDeviceByPushTokenRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.GetDeviceByPushTokenRequest;
  return proto.rover.audience.v1.GetDeviceByPushTokenRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.GetDeviceByPushTokenRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.GetDeviceByPushTokenRequest}
 */
proto.rover.audience.v1.GetDeviceByPushTokenRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new auth_v1_auth_pb.AuthContext;
      reader.readMessage(value,auth_v1_auth_pb.AuthContext.deserializeBinaryFromReader);
      msg.setAuthContext(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setDeviceTokenKey(value);
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
proto.rover.audience.v1.GetDeviceByPushTokenRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.GetDeviceByPushTokenRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.GetDeviceByPushTokenRequest} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.GetDeviceByPushTokenRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getAuthContext();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      auth_v1_auth_pb.AuthContext.serializeBinaryToWriter
    );
  }
  f = message.getDeviceTokenKey();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * optional rover.auth.v1.AuthContext auth_context = 1;
 * @return {?proto.rover.auth.v1.AuthContext}
 */
proto.rover.audience.v1.GetDeviceByPushTokenRequest.prototype.getAuthContext = function() {
  return /** @type{?proto.rover.auth.v1.AuthContext} */ (
    jspb.Message.getWrapperField(this, auth_v1_auth_pb.AuthContext, 1));
};


/** @param {?proto.rover.auth.v1.AuthContext|undefined} value */
proto.rover.audience.v1.GetDeviceByPushTokenRequest.prototype.setAuthContext = function(value) {
  jspb.Message.setWrapperField(this, 1, value);
};


proto.rover.audience.v1.GetDeviceByPushTokenRequest.prototype.clearAuthContext = function() {
  this.setAuthContext(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.GetDeviceByPushTokenRequest.prototype.hasAuthContext = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional string device_token_key = 2;
 * @return {string}
 */
proto.rover.audience.v1.GetDeviceByPushTokenRequest.prototype.getDeviceTokenKey = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/** @param {string} value */
proto.rover.audience.v1.GetDeviceByPushTokenRequest.prototype.setDeviceTokenKey = function(value) {
  jspb.Message.setField(this, 2, value);
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
proto.rover.audience.v1.GetDeviceByPushTokenResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.rover.audience.v1.GetDeviceByPushTokenResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.GetDeviceByPushTokenResponse.displayName = 'proto.rover.audience.v1.GetDeviceByPushTokenResponse';
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
proto.rover.audience.v1.GetDeviceByPushTokenResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.GetDeviceByPushTokenResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.GetDeviceByPushTokenResponse} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.GetDeviceByPushTokenResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    device: (f = msg.getDevice()) && proto.rover.audience.v1.Device.toObject(includeInstance, f)
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
 * @return {!proto.rover.audience.v1.GetDeviceByPushTokenResponse}
 */
proto.rover.audience.v1.GetDeviceByPushTokenResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.GetDeviceByPushTokenResponse;
  return proto.rover.audience.v1.GetDeviceByPushTokenResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.GetDeviceByPushTokenResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.GetDeviceByPushTokenResponse}
 */
proto.rover.audience.v1.GetDeviceByPushTokenResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.rover.audience.v1.Device;
      reader.readMessage(value,proto.rover.audience.v1.Device.deserializeBinaryFromReader);
      msg.setDevice(value);
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
proto.rover.audience.v1.GetDeviceByPushTokenResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.GetDeviceByPushTokenResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.GetDeviceByPushTokenResponse} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.GetDeviceByPushTokenResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getDevice();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.rover.audience.v1.Device.serializeBinaryToWriter
    );
  }
};


/**
 * optional Device device = 1;
 * @return {?proto.rover.audience.v1.Device}
 */
proto.rover.audience.v1.GetDeviceByPushTokenResponse.prototype.getDevice = function() {
  return /** @type{?proto.rover.audience.v1.Device} */ (
    jspb.Message.getWrapperField(this, proto.rover.audience.v1.Device, 1));
};


/** @param {?proto.rover.audience.v1.Device|undefined} value */
proto.rover.audience.v1.GetDeviceByPushTokenResponse.prototype.setDevice = function(value) {
  jspb.Message.setWrapperField(this, 1, value);
};


proto.rover.audience.v1.GetDeviceByPushTokenResponse.prototype.clearDevice = function() {
  this.setDevice(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.GetDeviceByPushTokenResponse.prototype.hasDevice = function() {
  return jspb.Message.getField(this, 1) != null;
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
proto.rover.audience.v1.CreateDeviceRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.rover.audience.v1.CreateDeviceRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.CreateDeviceRequest.displayName = 'proto.rover.audience.v1.CreateDeviceRequest';
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
proto.rover.audience.v1.CreateDeviceRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.CreateDeviceRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.CreateDeviceRequest} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.CreateDeviceRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    authContext: (f = msg.getAuthContext()) && auth_v1_auth_pb.AuthContext.toObject(includeInstance, f),
    profileId: jspb.Message.getFieldWithDefault(msg, 2, ""),
    deviceId: jspb.Message.getFieldWithDefault(msg, 3, "")
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
 * @return {!proto.rover.audience.v1.CreateDeviceRequest}
 */
proto.rover.audience.v1.CreateDeviceRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.CreateDeviceRequest;
  return proto.rover.audience.v1.CreateDeviceRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.CreateDeviceRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.CreateDeviceRequest}
 */
proto.rover.audience.v1.CreateDeviceRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new auth_v1_auth_pb.AuthContext;
      reader.readMessage(value,auth_v1_auth_pb.AuthContext.deserializeBinaryFromReader);
      msg.setAuthContext(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setProfileId(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setDeviceId(value);
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
proto.rover.audience.v1.CreateDeviceRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.CreateDeviceRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.CreateDeviceRequest} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.CreateDeviceRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getAuthContext();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      auth_v1_auth_pb.AuthContext.serializeBinaryToWriter
    );
  }
  f = message.getProfileId();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getDeviceId();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
};


/**
 * optional rover.auth.v1.AuthContext auth_context = 1;
 * @return {?proto.rover.auth.v1.AuthContext}
 */
proto.rover.audience.v1.CreateDeviceRequest.prototype.getAuthContext = function() {
  return /** @type{?proto.rover.auth.v1.AuthContext} */ (
    jspb.Message.getWrapperField(this, auth_v1_auth_pb.AuthContext, 1));
};


/** @param {?proto.rover.auth.v1.AuthContext|undefined} value */
proto.rover.audience.v1.CreateDeviceRequest.prototype.setAuthContext = function(value) {
  jspb.Message.setWrapperField(this, 1, value);
};


proto.rover.audience.v1.CreateDeviceRequest.prototype.clearAuthContext = function() {
  this.setAuthContext(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.CreateDeviceRequest.prototype.hasAuthContext = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional string profile_id = 2;
 * @return {string}
 */
proto.rover.audience.v1.CreateDeviceRequest.prototype.getProfileId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/** @param {string} value */
proto.rover.audience.v1.CreateDeviceRequest.prototype.setProfileId = function(value) {
  jspb.Message.setField(this, 2, value);
};


/**
 * optional string device_id = 3;
 * @return {string}
 */
proto.rover.audience.v1.CreateDeviceRequest.prototype.getDeviceId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/** @param {string} value */
proto.rover.audience.v1.CreateDeviceRequest.prototype.setDeviceId = function(value) {
  jspb.Message.setField(this, 3, value);
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
proto.rover.audience.v1.CreateDeviceResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.rover.audience.v1.CreateDeviceResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.CreateDeviceResponse.displayName = 'proto.rover.audience.v1.CreateDeviceResponse';
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
proto.rover.audience.v1.CreateDeviceResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.CreateDeviceResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.CreateDeviceResponse} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.CreateDeviceResponse.toObject = function(includeInstance, msg) {
  var f, obj = {

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
 * @return {!proto.rover.audience.v1.CreateDeviceResponse}
 */
proto.rover.audience.v1.CreateDeviceResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.CreateDeviceResponse;
  return proto.rover.audience.v1.CreateDeviceResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.CreateDeviceResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.CreateDeviceResponse}
 */
proto.rover.audience.v1.CreateDeviceResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
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
proto.rover.audience.v1.CreateDeviceResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.CreateDeviceResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.CreateDeviceResponse} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.CreateDeviceResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
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
proto.rover.audience.v1.UpdateDevicePushTokenRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.rover.audience.v1.UpdateDevicePushTokenRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.UpdateDevicePushTokenRequest.displayName = 'proto.rover.audience.v1.UpdateDevicePushTokenRequest';
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
proto.rover.audience.v1.UpdateDevicePushTokenRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.UpdateDevicePushTokenRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.UpdateDevicePushTokenRequest} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.UpdateDevicePushTokenRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    authContext: (f = msg.getAuthContext()) && auth_v1_auth_pb.AuthContext.toObject(includeInstance, f),
    deviceId: jspb.Message.getFieldWithDefault(msg, 2, ""),
    deviceTokenKey: jspb.Message.getFieldWithDefault(msg, 3, ""),
    apsEnvironment: jspb.Message.getFieldWithDefault(msg, 4, "")
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
 * @return {!proto.rover.audience.v1.UpdateDevicePushTokenRequest}
 */
proto.rover.audience.v1.UpdateDevicePushTokenRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.UpdateDevicePushTokenRequest;
  return proto.rover.audience.v1.UpdateDevicePushTokenRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.UpdateDevicePushTokenRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.UpdateDevicePushTokenRequest}
 */
proto.rover.audience.v1.UpdateDevicePushTokenRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new auth_v1_auth_pb.AuthContext;
      reader.readMessage(value,auth_v1_auth_pb.AuthContext.deserializeBinaryFromReader);
      msg.setAuthContext(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setDeviceId(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setDeviceTokenKey(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setApsEnvironment(value);
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
proto.rover.audience.v1.UpdateDevicePushTokenRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.UpdateDevicePushTokenRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.UpdateDevicePushTokenRequest} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.UpdateDevicePushTokenRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getAuthContext();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      auth_v1_auth_pb.AuthContext.serializeBinaryToWriter
    );
  }
  f = message.getDeviceId();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getDeviceTokenKey();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getApsEnvironment();
  if (f.length > 0) {
    writer.writeString(
      4,
      f
    );
  }
};


/**
 * optional rover.auth.v1.AuthContext auth_context = 1;
 * @return {?proto.rover.auth.v1.AuthContext}
 */
proto.rover.audience.v1.UpdateDevicePushTokenRequest.prototype.getAuthContext = function() {
  return /** @type{?proto.rover.auth.v1.AuthContext} */ (
    jspb.Message.getWrapperField(this, auth_v1_auth_pb.AuthContext, 1));
};


/** @param {?proto.rover.auth.v1.AuthContext|undefined} value */
proto.rover.audience.v1.UpdateDevicePushTokenRequest.prototype.setAuthContext = function(value) {
  jspb.Message.setWrapperField(this, 1, value);
};


proto.rover.audience.v1.UpdateDevicePushTokenRequest.prototype.clearAuthContext = function() {
  this.setAuthContext(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.UpdateDevicePushTokenRequest.prototype.hasAuthContext = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional string device_id = 2;
 * @return {string}
 */
proto.rover.audience.v1.UpdateDevicePushTokenRequest.prototype.getDeviceId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/** @param {string} value */
proto.rover.audience.v1.UpdateDevicePushTokenRequest.prototype.setDeviceId = function(value) {
  jspb.Message.setField(this, 2, value);
};


/**
 * optional string device_token_key = 3;
 * @return {string}
 */
proto.rover.audience.v1.UpdateDevicePushTokenRequest.prototype.getDeviceTokenKey = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/** @param {string} value */
proto.rover.audience.v1.UpdateDevicePushTokenRequest.prototype.setDeviceTokenKey = function(value) {
  jspb.Message.setField(this, 3, value);
};


/**
 * optional string aps_environment = 4;
 * @return {string}
 */
proto.rover.audience.v1.UpdateDevicePushTokenRequest.prototype.getApsEnvironment = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/** @param {string} value */
proto.rover.audience.v1.UpdateDevicePushTokenRequest.prototype.setApsEnvironment = function(value) {
  jspb.Message.setField(this, 4, value);
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
proto.rover.audience.v1.UpdateDevicePushTokenResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.rover.audience.v1.UpdateDevicePushTokenResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.UpdateDevicePushTokenResponse.displayName = 'proto.rover.audience.v1.UpdateDevicePushTokenResponse';
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
proto.rover.audience.v1.UpdateDevicePushTokenResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.UpdateDevicePushTokenResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.UpdateDevicePushTokenResponse} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.UpdateDevicePushTokenResponse.toObject = function(includeInstance, msg) {
  var f, obj = {

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
 * @return {!proto.rover.audience.v1.UpdateDevicePushTokenResponse}
 */
proto.rover.audience.v1.UpdateDevicePushTokenResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.UpdateDevicePushTokenResponse;
  return proto.rover.audience.v1.UpdateDevicePushTokenResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.UpdateDevicePushTokenResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.UpdateDevicePushTokenResponse}
 */
proto.rover.audience.v1.UpdateDevicePushTokenResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
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
proto.rover.audience.v1.UpdateDevicePushTokenResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.UpdateDevicePushTokenResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.UpdateDevicePushTokenResponse} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.UpdateDevicePushTokenResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
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
proto.rover.audience.v1.UpdateDeviceUnregisterPushTokenRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.rover.audience.v1.UpdateDeviceUnregisterPushTokenRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.UpdateDeviceUnregisterPushTokenRequest.displayName = 'proto.rover.audience.v1.UpdateDeviceUnregisterPushTokenRequest';
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
proto.rover.audience.v1.UpdateDeviceUnregisterPushTokenRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.UpdateDeviceUnregisterPushTokenRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.UpdateDeviceUnregisterPushTokenRequest} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.UpdateDeviceUnregisterPushTokenRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    authContext: (f = msg.getAuthContext()) && auth_v1_auth_pb.AuthContext.toObject(includeInstance, f),
    deviceId: jspb.Message.getFieldWithDefault(msg, 2, "")
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
 * @return {!proto.rover.audience.v1.UpdateDeviceUnregisterPushTokenRequest}
 */
proto.rover.audience.v1.UpdateDeviceUnregisterPushTokenRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.UpdateDeviceUnregisterPushTokenRequest;
  return proto.rover.audience.v1.UpdateDeviceUnregisterPushTokenRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.UpdateDeviceUnregisterPushTokenRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.UpdateDeviceUnregisterPushTokenRequest}
 */
proto.rover.audience.v1.UpdateDeviceUnregisterPushTokenRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new auth_v1_auth_pb.AuthContext;
      reader.readMessage(value,auth_v1_auth_pb.AuthContext.deserializeBinaryFromReader);
      msg.setAuthContext(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setDeviceId(value);
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
proto.rover.audience.v1.UpdateDeviceUnregisterPushTokenRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.UpdateDeviceUnregisterPushTokenRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.UpdateDeviceUnregisterPushTokenRequest} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.UpdateDeviceUnregisterPushTokenRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getAuthContext();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      auth_v1_auth_pb.AuthContext.serializeBinaryToWriter
    );
  }
  f = message.getDeviceId();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * optional rover.auth.v1.AuthContext auth_context = 1;
 * @return {?proto.rover.auth.v1.AuthContext}
 */
proto.rover.audience.v1.UpdateDeviceUnregisterPushTokenRequest.prototype.getAuthContext = function() {
  return /** @type{?proto.rover.auth.v1.AuthContext} */ (
    jspb.Message.getWrapperField(this, auth_v1_auth_pb.AuthContext, 1));
};


/** @param {?proto.rover.auth.v1.AuthContext|undefined} value */
proto.rover.audience.v1.UpdateDeviceUnregisterPushTokenRequest.prototype.setAuthContext = function(value) {
  jspb.Message.setWrapperField(this, 1, value);
};


proto.rover.audience.v1.UpdateDeviceUnregisterPushTokenRequest.prototype.clearAuthContext = function() {
  this.setAuthContext(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.UpdateDeviceUnregisterPushTokenRequest.prototype.hasAuthContext = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional string device_id = 2;
 * @return {string}
 */
proto.rover.audience.v1.UpdateDeviceUnregisterPushTokenRequest.prototype.getDeviceId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/** @param {string} value */
proto.rover.audience.v1.UpdateDeviceUnregisterPushTokenRequest.prototype.setDeviceId = function(value) {
  jspb.Message.setField(this, 2, value);
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
proto.rover.audience.v1.UpdateDeviceUnregisterPushTokenResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.rover.audience.v1.UpdateDeviceUnregisterPushTokenResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.UpdateDeviceUnregisterPushTokenResponse.displayName = 'proto.rover.audience.v1.UpdateDeviceUnregisterPushTokenResponse';
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
proto.rover.audience.v1.UpdateDeviceUnregisterPushTokenResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.UpdateDeviceUnregisterPushTokenResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.UpdateDeviceUnregisterPushTokenResponse} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.UpdateDeviceUnregisterPushTokenResponse.toObject = function(includeInstance, msg) {
  var f, obj = {

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
 * @return {!proto.rover.audience.v1.UpdateDeviceUnregisterPushTokenResponse}
 */
proto.rover.audience.v1.UpdateDeviceUnregisterPushTokenResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.UpdateDeviceUnregisterPushTokenResponse;
  return proto.rover.audience.v1.UpdateDeviceUnregisterPushTokenResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.UpdateDeviceUnregisterPushTokenResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.UpdateDeviceUnregisterPushTokenResponse}
 */
proto.rover.audience.v1.UpdateDeviceUnregisterPushTokenResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
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
proto.rover.audience.v1.UpdateDeviceUnregisterPushTokenResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.UpdateDeviceUnregisterPushTokenResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.UpdateDeviceUnregisterPushTokenResponse} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.UpdateDeviceUnregisterPushTokenResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
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
proto.rover.audience.v1.UpdateDeviceLocationRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.rover.audience.v1.UpdateDeviceLocationRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.UpdateDeviceLocationRequest.displayName = 'proto.rover.audience.v1.UpdateDeviceLocationRequest';
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
proto.rover.audience.v1.UpdateDeviceLocationRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.UpdateDeviceLocationRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.UpdateDeviceLocationRequest} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.UpdateDeviceLocationRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    authContext: (f = msg.getAuthContext()) && auth_v1_auth_pb.AuthContext.toObject(includeInstance, f),
    deviceId: jspb.Message.getFieldWithDefault(msg, 2, ""),
    locationAccuracy: jspb.Message.getFieldWithDefault(msg, 3, 0),
    locationLatitude: +jspb.Message.getFieldWithDefault(msg, 4, 0.0),
    locationLongitude: +jspb.Message.getFieldWithDefault(msg, 5, 0.0)
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
 * @return {!proto.rover.audience.v1.UpdateDeviceLocationRequest}
 */
proto.rover.audience.v1.UpdateDeviceLocationRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.UpdateDeviceLocationRequest;
  return proto.rover.audience.v1.UpdateDeviceLocationRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.UpdateDeviceLocationRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.UpdateDeviceLocationRequest}
 */
proto.rover.audience.v1.UpdateDeviceLocationRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new auth_v1_auth_pb.AuthContext;
      reader.readMessage(value,auth_v1_auth_pb.AuthContext.deserializeBinaryFromReader);
      msg.setAuthContext(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setDeviceId(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setLocationAccuracy(value);
      break;
    case 4:
      var value = /** @type {number} */ (reader.readDouble());
      msg.setLocationLatitude(value);
      break;
    case 5:
      var value = /** @type {number} */ (reader.readDouble());
      msg.setLocationLongitude(value);
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
proto.rover.audience.v1.UpdateDeviceLocationRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.UpdateDeviceLocationRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.UpdateDeviceLocationRequest} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.UpdateDeviceLocationRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getAuthContext();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      auth_v1_auth_pb.AuthContext.serializeBinaryToWriter
    );
  }
  f = message.getDeviceId();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getLocationAccuracy();
  if (f !== 0) {
    writer.writeInt32(
      3,
      f
    );
  }
  f = message.getLocationLatitude();
  if (f !== 0.0) {
    writer.writeDouble(
      4,
      f
    );
  }
  f = message.getLocationLongitude();
  if (f !== 0.0) {
    writer.writeDouble(
      5,
      f
    );
  }
};


/**
 * optional rover.auth.v1.AuthContext auth_context = 1;
 * @return {?proto.rover.auth.v1.AuthContext}
 */
proto.rover.audience.v1.UpdateDeviceLocationRequest.prototype.getAuthContext = function() {
  return /** @type{?proto.rover.auth.v1.AuthContext} */ (
    jspb.Message.getWrapperField(this, auth_v1_auth_pb.AuthContext, 1));
};


/** @param {?proto.rover.auth.v1.AuthContext|undefined} value */
proto.rover.audience.v1.UpdateDeviceLocationRequest.prototype.setAuthContext = function(value) {
  jspb.Message.setWrapperField(this, 1, value);
};


proto.rover.audience.v1.UpdateDeviceLocationRequest.prototype.clearAuthContext = function() {
  this.setAuthContext(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.UpdateDeviceLocationRequest.prototype.hasAuthContext = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional string device_id = 2;
 * @return {string}
 */
proto.rover.audience.v1.UpdateDeviceLocationRequest.prototype.getDeviceId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/** @param {string} value */
proto.rover.audience.v1.UpdateDeviceLocationRequest.prototype.setDeviceId = function(value) {
  jspb.Message.setField(this, 2, value);
};


/**
 * optional int32 location_accuracy = 3;
 * @return {number}
 */
proto.rover.audience.v1.UpdateDeviceLocationRequest.prototype.getLocationAccuracy = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/** @param {number} value */
proto.rover.audience.v1.UpdateDeviceLocationRequest.prototype.setLocationAccuracy = function(value) {
  jspb.Message.setField(this, 3, value);
};


/**
 * optional double location_latitude = 4;
 * @return {number}
 */
proto.rover.audience.v1.UpdateDeviceLocationRequest.prototype.getLocationLatitude = function() {
  return /** @type {number} */ (+jspb.Message.getFieldWithDefault(this, 4, 0.0));
};


/** @param {number} value */
proto.rover.audience.v1.UpdateDeviceLocationRequest.prototype.setLocationLatitude = function(value) {
  jspb.Message.setField(this, 4, value);
};


/**
 * optional double location_longitude = 5;
 * @return {number}
 */
proto.rover.audience.v1.UpdateDeviceLocationRequest.prototype.getLocationLongitude = function() {
  return /** @type {number} */ (+jspb.Message.getFieldWithDefault(this, 5, 0.0));
};


/** @param {number} value */
proto.rover.audience.v1.UpdateDeviceLocationRequest.prototype.setLocationLongitude = function(value) {
  jspb.Message.setField(this, 5, value);
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
proto.rover.audience.v1.UpdateDeviceLocationResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.rover.audience.v1.UpdateDeviceLocationResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.UpdateDeviceLocationResponse.displayName = 'proto.rover.audience.v1.UpdateDeviceLocationResponse';
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
proto.rover.audience.v1.UpdateDeviceLocationResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.UpdateDeviceLocationResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.UpdateDeviceLocationResponse} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.UpdateDeviceLocationResponse.toObject = function(includeInstance, msg) {
  var f, obj = {

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
 * @return {!proto.rover.audience.v1.UpdateDeviceLocationResponse}
 */
proto.rover.audience.v1.UpdateDeviceLocationResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.UpdateDeviceLocationResponse;
  return proto.rover.audience.v1.UpdateDeviceLocationResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.UpdateDeviceLocationResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.UpdateDeviceLocationResponse}
 */
proto.rover.audience.v1.UpdateDeviceLocationResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
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
proto.rover.audience.v1.UpdateDeviceLocationResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.UpdateDeviceLocationResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.UpdateDeviceLocationResponse} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.UpdateDeviceLocationResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
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
proto.rover.audience.v1.UpdateDeviceGeofenceMonitoringRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.rover.audience.v1.UpdateDeviceGeofenceMonitoringRequest.repeatedFields_, null);
};
goog.inherits(proto.rover.audience.v1.UpdateDeviceGeofenceMonitoringRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.UpdateDeviceGeofenceMonitoringRequest.displayName = 'proto.rover.audience.v1.UpdateDeviceGeofenceMonitoringRequest';
}
/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.rover.audience.v1.UpdateDeviceGeofenceMonitoringRequest.repeatedFields_ = [3];



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
proto.rover.audience.v1.UpdateDeviceGeofenceMonitoringRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.UpdateDeviceGeofenceMonitoringRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.UpdateDeviceGeofenceMonitoringRequest} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.UpdateDeviceGeofenceMonitoringRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    authContext: (f = msg.getAuthContext()) && auth_v1_auth_pb.AuthContext.toObject(includeInstance, f),
    deviceId: jspb.Message.getFieldWithDefault(msg, 2, ""),
    regionsList: jspb.Message.toObjectList(msg.getRegionsList(),
    proto.rover.audience.v1.GeofenceRegion.toObject, includeInstance)
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
 * @return {!proto.rover.audience.v1.UpdateDeviceGeofenceMonitoringRequest}
 */
proto.rover.audience.v1.UpdateDeviceGeofenceMonitoringRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.UpdateDeviceGeofenceMonitoringRequest;
  return proto.rover.audience.v1.UpdateDeviceGeofenceMonitoringRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.UpdateDeviceGeofenceMonitoringRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.UpdateDeviceGeofenceMonitoringRequest}
 */
proto.rover.audience.v1.UpdateDeviceGeofenceMonitoringRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new auth_v1_auth_pb.AuthContext;
      reader.readMessage(value,auth_v1_auth_pb.AuthContext.deserializeBinaryFromReader);
      msg.setAuthContext(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setDeviceId(value);
      break;
    case 3:
      var value = new proto.rover.audience.v1.GeofenceRegion;
      reader.readMessage(value,proto.rover.audience.v1.GeofenceRegion.deserializeBinaryFromReader);
      msg.addRegions(value);
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
proto.rover.audience.v1.UpdateDeviceGeofenceMonitoringRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.UpdateDeviceGeofenceMonitoringRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.UpdateDeviceGeofenceMonitoringRequest} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.UpdateDeviceGeofenceMonitoringRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getAuthContext();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      auth_v1_auth_pb.AuthContext.serializeBinaryToWriter
    );
  }
  f = message.getDeviceId();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getRegionsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      3,
      f,
      proto.rover.audience.v1.GeofenceRegion.serializeBinaryToWriter
    );
  }
};


/**
 * optional rover.auth.v1.AuthContext auth_context = 1;
 * @return {?proto.rover.auth.v1.AuthContext}
 */
proto.rover.audience.v1.UpdateDeviceGeofenceMonitoringRequest.prototype.getAuthContext = function() {
  return /** @type{?proto.rover.auth.v1.AuthContext} */ (
    jspb.Message.getWrapperField(this, auth_v1_auth_pb.AuthContext, 1));
};


/** @param {?proto.rover.auth.v1.AuthContext|undefined} value */
proto.rover.audience.v1.UpdateDeviceGeofenceMonitoringRequest.prototype.setAuthContext = function(value) {
  jspb.Message.setWrapperField(this, 1, value);
};


proto.rover.audience.v1.UpdateDeviceGeofenceMonitoringRequest.prototype.clearAuthContext = function() {
  this.setAuthContext(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.UpdateDeviceGeofenceMonitoringRequest.prototype.hasAuthContext = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional string device_id = 2;
 * @return {string}
 */
proto.rover.audience.v1.UpdateDeviceGeofenceMonitoringRequest.prototype.getDeviceId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/** @param {string} value */
proto.rover.audience.v1.UpdateDeviceGeofenceMonitoringRequest.prototype.setDeviceId = function(value) {
  jspb.Message.setField(this, 2, value);
};


/**
 * repeated GeofenceRegion regions = 3;
 * If you change this array by adding, removing or replacing elements, or if you
 * replace the array itself, then you must call the setter to update it.
 * @return {!Array.<!proto.rover.audience.v1.GeofenceRegion>}
 */
proto.rover.audience.v1.UpdateDeviceGeofenceMonitoringRequest.prototype.getRegionsList = function() {
  return /** @type{!Array.<!proto.rover.audience.v1.GeofenceRegion>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.rover.audience.v1.GeofenceRegion, 3));
};


/** @param {!Array.<!proto.rover.audience.v1.GeofenceRegion>} value */
proto.rover.audience.v1.UpdateDeviceGeofenceMonitoringRequest.prototype.setRegionsList = function(value) {
  jspb.Message.setRepeatedWrapperField(this, 3, value);
};


/**
 * @param {!proto.rover.audience.v1.GeofenceRegion=} opt_value
 * @param {number=} opt_index
 * @return {!proto.rover.audience.v1.GeofenceRegion}
 */
proto.rover.audience.v1.UpdateDeviceGeofenceMonitoringRequest.prototype.addRegions = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 3, opt_value, proto.rover.audience.v1.GeofenceRegion, opt_index);
};


proto.rover.audience.v1.UpdateDeviceGeofenceMonitoringRequest.prototype.clearRegionsList = function() {
  this.setRegionsList([]);
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
proto.rover.audience.v1.UpdateDeviceGeofenceMonitoringResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.rover.audience.v1.UpdateDeviceGeofenceMonitoringResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.UpdateDeviceGeofenceMonitoringResponse.displayName = 'proto.rover.audience.v1.UpdateDeviceGeofenceMonitoringResponse';
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
proto.rover.audience.v1.UpdateDeviceGeofenceMonitoringResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.UpdateDeviceGeofenceMonitoringResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.UpdateDeviceGeofenceMonitoringResponse} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.UpdateDeviceGeofenceMonitoringResponse.toObject = function(includeInstance, msg) {
  var f, obj = {

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
 * @return {!proto.rover.audience.v1.UpdateDeviceGeofenceMonitoringResponse}
 */
proto.rover.audience.v1.UpdateDeviceGeofenceMonitoringResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.UpdateDeviceGeofenceMonitoringResponse;
  return proto.rover.audience.v1.UpdateDeviceGeofenceMonitoringResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.UpdateDeviceGeofenceMonitoringResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.UpdateDeviceGeofenceMonitoringResponse}
 */
proto.rover.audience.v1.UpdateDeviceGeofenceMonitoringResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
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
proto.rover.audience.v1.UpdateDeviceGeofenceMonitoringResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.UpdateDeviceGeofenceMonitoringResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.UpdateDeviceGeofenceMonitoringResponse} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.UpdateDeviceGeofenceMonitoringResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
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
proto.rover.audience.v1.UpdateDeviceIBeaconMonitoringRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.rover.audience.v1.UpdateDeviceIBeaconMonitoringRequest.repeatedFields_, null);
};
goog.inherits(proto.rover.audience.v1.UpdateDeviceIBeaconMonitoringRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.UpdateDeviceIBeaconMonitoringRequest.displayName = 'proto.rover.audience.v1.UpdateDeviceIBeaconMonitoringRequest';
}
/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.rover.audience.v1.UpdateDeviceIBeaconMonitoringRequest.repeatedFields_ = [3];



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
proto.rover.audience.v1.UpdateDeviceIBeaconMonitoringRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.UpdateDeviceIBeaconMonitoringRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.UpdateDeviceIBeaconMonitoringRequest} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.UpdateDeviceIBeaconMonitoringRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    authContext: (f = msg.getAuthContext()) && auth_v1_auth_pb.AuthContext.toObject(includeInstance, f),
    deviceId: jspb.Message.getFieldWithDefault(msg, 2, ""),
    regionsList: jspb.Message.toObjectList(msg.getRegionsList(),
    proto.rover.audience.v1.IBeaconRegion.toObject, includeInstance)
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
 * @return {!proto.rover.audience.v1.UpdateDeviceIBeaconMonitoringRequest}
 */
proto.rover.audience.v1.UpdateDeviceIBeaconMonitoringRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.UpdateDeviceIBeaconMonitoringRequest;
  return proto.rover.audience.v1.UpdateDeviceIBeaconMonitoringRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.UpdateDeviceIBeaconMonitoringRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.UpdateDeviceIBeaconMonitoringRequest}
 */
proto.rover.audience.v1.UpdateDeviceIBeaconMonitoringRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new auth_v1_auth_pb.AuthContext;
      reader.readMessage(value,auth_v1_auth_pb.AuthContext.deserializeBinaryFromReader);
      msg.setAuthContext(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setDeviceId(value);
      break;
    case 3:
      var value = new proto.rover.audience.v1.IBeaconRegion;
      reader.readMessage(value,proto.rover.audience.v1.IBeaconRegion.deserializeBinaryFromReader);
      msg.addRegions(value);
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
proto.rover.audience.v1.UpdateDeviceIBeaconMonitoringRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.UpdateDeviceIBeaconMonitoringRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.UpdateDeviceIBeaconMonitoringRequest} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.UpdateDeviceIBeaconMonitoringRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getAuthContext();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      auth_v1_auth_pb.AuthContext.serializeBinaryToWriter
    );
  }
  f = message.getDeviceId();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getRegionsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      3,
      f,
      proto.rover.audience.v1.IBeaconRegion.serializeBinaryToWriter
    );
  }
};


/**
 * optional rover.auth.v1.AuthContext auth_context = 1;
 * @return {?proto.rover.auth.v1.AuthContext}
 */
proto.rover.audience.v1.UpdateDeviceIBeaconMonitoringRequest.prototype.getAuthContext = function() {
  return /** @type{?proto.rover.auth.v1.AuthContext} */ (
    jspb.Message.getWrapperField(this, auth_v1_auth_pb.AuthContext, 1));
};


/** @param {?proto.rover.auth.v1.AuthContext|undefined} value */
proto.rover.audience.v1.UpdateDeviceIBeaconMonitoringRequest.prototype.setAuthContext = function(value) {
  jspb.Message.setWrapperField(this, 1, value);
};


proto.rover.audience.v1.UpdateDeviceIBeaconMonitoringRequest.prototype.clearAuthContext = function() {
  this.setAuthContext(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.UpdateDeviceIBeaconMonitoringRequest.prototype.hasAuthContext = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional string device_id = 2;
 * @return {string}
 */
proto.rover.audience.v1.UpdateDeviceIBeaconMonitoringRequest.prototype.getDeviceId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/** @param {string} value */
proto.rover.audience.v1.UpdateDeviceIBeaconMonitoringRequest.prototype.setDeviceId = function(value) {
  jspb.Message.setField(this, 2, value);
};


/**
 * repeated IBeaconRegion regions = 3;
 * If you change this array by adding, removing or replacing elements, or if you
 * replace the array itself, then you must call the setter to update it.
 * @return {!Array.<!proto.rover.audience.v1.IBeaconRegion>}
 */
proto.rover.audience.v1.UpdateDeviceIBeaconMonitoringRequest.prototype.getRegionsList = function() {
  return /** @type{!Array.<!proto.rover.audience.v1.IBeaconRegion>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.rover.audience.v1.IBeaconRegion, 3));
};


/** @param {!Array.<!proto.rover.audience.v1.IBeaconRegion>} value */
proto.rover.audience.v1.UpdateDeviceIBeaconMonitoringRequest.prototype.setRegionsList = function(value) {
  jspb.Message.setRepeatedWrapperField(this, 3, value);
};


/**
 * @param {!proto.rover.audience.v1.IBeaconRegion=} opt_value
 * @param {number=} opt_index
 * @return {!proto.rover.audience.v1.IBeaconRegion}
 */
proto.rover.audience.v1.UpdateDeviceIBeaconMonitoringRequest.prototype.addRegions = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 3, opt_value, proto.rover.audience.v1.IBeaconRegion, opt_index);
};


proto.rover.audience.v1.UpdateDeviceIBeaconMonitoringRequest.prototype.clearRegionsList = function() {
  this.setRegionsList([]);
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
proto.rover.audience.v1.UpdateDeviceIBeaconMonitoringResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.rover.audience.v1.UpdateDeviceIBeaconMonitoringResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.UpdateDeviceIBeaconMonitoringResponse.displayName = 'proto.rover.audience.v1.UpdateDeviceIBeaconMonitoringResponse';
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
proto.rover.audience.v1.UpdateDeviceIBeaconMonitoringResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.UpdateDeviceIBeaconMonitoringResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.UpdateDeviceIBeaconMonitoringResponse} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.UpdateDeviceIBeaconMonitoringResponse.toObject = function(includeInstance, msg) {
  var f, obj = {

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
 * @return {!proto.rover.audience.v1.UpdateDeviceIBeaconMonitoringResponse}
 */
proto.rover.audience.v1.UpdateDeviceIBeaconMonitoringResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.UpdateDeviceIBeaconMonitoringResponse;
  return proto.rover.audience.v1.UpdateDeviceIBeaconMonitoringResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.UpdateDeviceIBeaconMonitoringResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.UpdateDeviceIBeaconMonitoringResponse}
 */
proto.rover.audience.v1.UpdateDeviceIBeaconMonitoringResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
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
proto.rover.audience.v1.UpdateDeviceIBeaconMonitoringResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.UpdateDeviceIBeaconMonitoringResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.UpdateDeviceIBeaconMonitoringResponse} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.UpdateDeviceIBeaconMonitoringResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
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
proto.rover.audience.v1.DeleteDeviceRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.rover.audience.v1.DeleteDeviceRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.DeleteDeviceRequest.displayName = 'proto.rover.audience.v1.DeleteDeviceRequest';
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
proto.rover.audience.v1.DeleteDeviceRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.DeleteDeviceRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.DeleteDeviceRequest} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.DeleteDeviceRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    authContext: (f = msg.getAuthContext()) && auth_v1_auth_pb.AuthContext.toObject(includeInstance, f),
    deviceId: jspb.Message.getFieldWithDefault(msg, 2, "")
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
 * @return {!proto.rover.audience.v1.DeleteDeviceRequest}
 */
proto.rover.audience.v1.DeleteDeviceRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.DeleteDeviceRequest;
  return proto.rover.audience.v1.DeleteDeviceRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.DeleteDeviceRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.DeleteDeviceRequest}
 */
proto.rover.audience.v1.DeleteDeviceRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new auth_v1_auth_pb.AuthContext;
      reader.readMessage(value,auth_v1_auth_pb.AuthContext.deserializeBinaryFromReader);
      msg.setAuthContext(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setDeviceId(value);
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
proto.rover.audience.v1.DeleteDeviceRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.DeleteDeviceRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.DeleteDeviceRequest} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.DeleteDeviceRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getAuthContext();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      auth_v1_auth_pb.AuthContext.serializeBinaryToWriter
    );
  }
  f = message.getDeviceId();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * optional rover.auth.v1.AuthContext auth_context = 1;
 * @return {?proto.rover.auth.v1.AuthContext}
 */
proto.rover.audience.v1.DeleteDeviceRequest.prototype.getAuthContext = function() {
  return /** @type{?proto.rover.auth.v1.AuthContext} */ (
    jspb.Message.getWrapperField(this, auth_v1_auth_pb.AuthContext, 1));
};


/** @param {?proto.rover.auth.v1.AuthContext|undefined} value */
proto.rover.audience.v1.DeleteDeviceRequest.prototype.setAuthContext = function(value) {
  jspb.Message.setWrapperField(this, 1, value);
};


proto.rover.audience.v1.DeleteDeviceRequest.prototype.clearAuthContext = function() {
  this.setAuthContext(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.DeleteDeviceRequest.prototype.hasAuthContext = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional string device_id = 2;
 * @return {string}
 */
proto.rover.audience.v1.DeleteDeviceRequest.prototype.getDeviceId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/** @param {string} value */
proto.rover.audience.v1.DeleteDeviceRequest.prototype.setDeviceId = function(value) {
  jspb.Message.setField(this, 2, value);
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
proto.rover.audience.v1.DeleteDeviceResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.rover.audience.v1.DeleteDeviceResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.DeleteDeviceResponse.displayName = 'proto.rover.audience.v1.DeleteDeviceResponse';
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
proto.rover.audience.v1.DeleteDeviceResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.DeleteDeviceResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.DeleteDeviceResponse} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.DeleteDeviceResponse.toObject = function(includeInstance, msg) {
  var f, obj = {

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
 * @return {!proto.rover.audience.v1.DeleteDeviceResponse}
 */
proto.rover.audience.v1.DeleteDeviceResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.DeleteDeviceResponse;
  return proto.rover.audience.v1.DeleteDeviceResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.DeleteDeviceResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.DeleteDeviceResponse}
 */
proto.rover.audience.v1.DeleteDeviceResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
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
proto.rover.audience.v1.DeleteDeviceResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.DeleteDeviceResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.DeleteDeviceResponse} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.DeleteDeviceResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
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
proto.rover.audience.v1.SetDeviceProfileRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.rover.audience.v1.SetDeviceProfileRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.SetDeviceProfileRequest.displayName = 'proto.rover.audience.v1.SetDeviceProfileRequest';
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
proto.rover.audience.v1.SetDeviceProfileRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.SetDeviceProfileRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.SetDeviceProfileRequest} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.SetDeviceProfileRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    authContext: (f = msg.getAuthContext()) && auth_v1_auth_pb.AuthContext.toObject(includeInstance, f),
    deviceId: jspb.Message.getFieldWithDefault(msg, 2, ""),
    profileId: jspb.Message.getFieldWithDefault(msg, 3, "")
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
 * @return {!proto.rover.audience.v1.SetDeviceProfileRequest}
 */
proto.rover.audience.v1.SetDeviceProfileRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.SetDeviceProfileRequest;
  return proto.rover.audience.v1.SetDeviceProfileRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.SetDeviceProfileRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.SetDeviceProfileRequest}
 */
proto.rover.audience.v1.SetDeviceProfileRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new auth_v1_auth_pb.AuthContext;
      reader.readMessage(value,auth_v1_auth_pb.AuthContext.deserializeBinaryFromReader);
      msg.setAuthContext(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setDeviceId(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setProfileId(value);
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
proto.rover.audience.v1.SetDeviceProfileRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.SetDeviceProfileRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.SetDeviceProfileRequest} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.SetDeviceProfileRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getAuthContext();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      auth_v1_auth_pb.AuthContext.serializeBinaryToWriter
    );
  }
  f = message.getDeviceId();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getProfileId();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
};


/**
 * optional rover.auth.v1.AuthContext auth_context = 1;
 * @return {?proto.rover.auth.v1.AuthContext}
 */
proto.rover.audience.v1.SetDeviceProfileRequest.prototype.getAuthContext = function() {
  return /** @type{?proto.rover.auth.v1.AuthContext} */ (
    jspb.Message.getWrapperField(this, auth_v1_auth_pb.AuthContext, 1));
};


/** @param {?proto.rover.auth.v1.AuthContext|undefined} value */
proto.rover.audience.v1.SetDeviceProfileRequest.prototype.setAuthContext = function(value) {
  jspb.Message.setWrapperField(this, 1, value);
};


proto.rover.audience.v1.SetDeviceProfileRequest.prototype.clearAuthContext = function() {
  this.setAuthContext(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.SetDeviceProfileRequest.prototype.hasAuthContext = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional string device_id = 2;
 * @return {string}
 */
proto.rover.audience.v1.SetDeviceProfileRequest.prototype.getDeviceId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/** @param {string} value */
proto.rover.audience.v1.SetDeviceProfileRequest.prototype.setDeviceId = function(value) {
  jspb.Message.setField(this, 2, value);
};


/**
 * optional string profile_id = 3;
 * @return {string}
 */
proto.rover.audience.v1.SetDeviceProfileRequest.prototype.getProfileId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/** @param {string} value */
proto.rover.audience.v1.SetDeviceProfileRequest.prototype.setProfileId = function(value) {
  jspb.Message.setField(this, 3, value);
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
proto.rover.audience.v1.SetDeviceProfileResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.rover.audience.v1.SetDeviceProfileResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.SetDeviceProfileResponse.displayName = 'proto.rover.audience.v1.SetDeviceProfileResponse';
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
proto.rover.audience.v1.SetDeviceProfileResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.SetDeviceProfileResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.SetDeviceProfileResponse} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.SetDeviceProfileResponse.toObject = function(includeInstance, msg) {
  var f, obj = {

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
 * @return {!proto.rover.audience.v1.SetDeviceProfileResponse}
 */
proto.rover.audience.v1.SetDeviceProfileResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.SetDeviceProfileResponse;
  return proto.rover.audience.v1.SetDeviceProfileResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.SetDeviceProfileResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.SetDeviceProfileResponse}
 */
proto.rover.audience.v1.SetDeviceProfileResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
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
proto.rover.audience.v1.SetDeviceProfileResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.SetDeviceProfileResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.SetDeviceProfileResponse} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.SetDeviceProfileResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
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
proto.rover.audience.v1.ListDevicesByProfileIdRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.rover.audience.v1.ListDevicesByProfileIdRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.ListDevicesByProfileIdRequest.displayName = 'proto.rover.audience.v1.ListDevicesByProfileIdRequest';
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
proto.rover.audience.v1.ListDevicesByProfileIdRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.ListDevicesByProfileIdRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.ListDevicesByProfileIdRequest} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.ListDevicesByProfileIdRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    authContext: (f = msg.getAuthContext()) && auth_v1_auth_pb.AuthContext.toObject(includeInstance, f),
    profileId: jspb.Message.getFieldWithDefault(msg, 2, "")
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
 * @return {!proto.rover.audience.v1.ListDevicesByProfileIdRequest}
 */
proto.rover.audience.v1.ListDevicesByProfileIdRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.ListDevicesByProfileIdRequest;
  return proto.rover.audience.v1.ListDevicesByProfileIdRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.ListDevicesByProfileIdRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.ListDevicesByProfileIdRequest}
 */
proto.rover.audience.v1.ListDevicesByProfileIdRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new auth_v1_auth_pb.AuthContext;
      reader.readMessage(value,auth_v1_auth_pb.AuthContext.deserializeBinaryFromReader);
      msg.setAuthContext(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setProfileId(value);
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
proto.rover.audience.v1.ListDevicesByProfileIdRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.ListDevicesByProfileIdRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.ListDevicesByProfileIdRequest} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.ListDevicesByProfileIdRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getAuthContext();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      auth_v1_auth_pb.AuthContext.serializeBinaryToWriter
    );
  }
  f = message.getProfileId();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * optional rover.auth.v1.AuthContext auth_context = 1;
 * @return {?proto.rover.auth.v1.AuthContext}
 */
proto.rover.audience.v1.ListDevicesByProfileIdRequest.prototype.getAuthContext = function() {
  return /** @type{?proto.rover.auth.v1.AuthContext} */ (
    jspb.Message.getWrapperField(this, auth_v1_auth_pb.AuthContext, 1));
};


/** @param {?proto.rover.auth.v1.AuthContext|undefined} value */
proto.rover.audience.v1.ListDevicesByProfileIdRequest.prototype.setAuthContext = function(value) {
  jspb.Message.setWrapperField(this, 1, value);
};


proto.rover.audience.v1.ListDevicesByProfileIdRequest.prototype.clearAuthContext = function() {
  this.setAuthContext(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.ListDevicesByProfileIdRequest.prototype.hasAuthContext = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional string profile_id = 2;
 * @return {string}
 */
proto.rover.audience.v1.ListDevicesByProfileIdRequest.prototype.getProfileId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/** @param {string} value */
proto.rover.audience.v1.ListDevicesByProfileIdRequest.prototype.setProfileId = function(value) {
  jspb.Message.setField(this, 2, value);
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
proto.rover.audience.v1.ListDevicesByProfileIdResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.rover.audience.v1.ListDevicesByProfileIdResponse.repeatedFields_, null);
};
goog.inherits(proto.rover.audience.v1.ListDevicesByProfileIdResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.ListDevicesByProfileIdResponse.displayName = 'proto.rover.audience.v1.ListDevicesByProfileIdResponse';
}
/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.rover.audience.v1.ListDevicesByProfileIdResponse.repeatedFields_ = [1];



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
proto.rover.audience.v1.ListDevicesByProfileIdResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.ListDevicesByProfileIdResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.ListDevicesByProfileIdResponse} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.ListDevicesByProfileIdResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    devicesList: jspb.Message.toObjectList(msg.getDevicesList(),
    proto.rover.audience.v1.Device.toObject, includeInstance)
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
 * @return {!proto.rover.audience.v1.ListDevicesByProfileIdResponse}
 */
proto.rover.audience.v1.ListDevicesByProfileIdResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.ListDevicesByProfileIdResponse;
  return proto.rover.audience.v1.ListDevicesByProfileIdResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.ListDevicesByProfileIdResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.ListDevicesByProfileIdResponse}
 */
proto.rover.audience.v1.ListDevicesByProfileIdResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.rover.audience.v1.Device;
      reader.readMessage(value,proto.rover.audience.v1.Device.deserializeBinaryFromReader);
      msg.addDevices(value);
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
proto.rover.audience.v1.ListDevicesByProfileIdResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.ListDevicesByProfileIdResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.ListDevicesByProfileIdResponse} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.ListDevicesByProfileIdResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getDevicesList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      proto.rover.audience.v1.Device.serializeBinaryToWriter
    );
  }
};


/**
 * repeated Device devices = 1;
 * If you change this array by adding, removing or replacing elements, or if you
 * replace the array itself, then you must call the setter to update it.
 * @return {!Array.<!proto.rover.audience.v1.Device>}
 */
proto.rover.audience.v1.ListDevicesByProfileIdResponse.prototype.getDevicesList = function() {
  return /** @type{!Array.<!proto.rover.audience.v1.Device>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.rover.audience.v1.Device, 1));
};


/** @param {!Array.<!proto.rover.audience.v1.Device>} value */
proto.rover.audience.v1.ListDevicesByProfileIdResponse.prototype.setDevicesList = function(value) {
  jspb.Message.setRepeatedWrapperField(this, 1, value);
};


/**
 * @param {!proto.rover.audience.v1.Device=} opt_value
 * @param {number=} opt_index
 * @return {!proto.rover.audience.v1.Device}
 */
proto.rover.audience.v1.ListDevicesByProfileIdResponse.prototype.addDevices = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.rover.audience.v1.Device, opt_index);
};


proto.rover.audience.v1.ListDevicesByProfileIdResponse.prototype.clearDevicesList = function() {
  this.setDevicesList([]);
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
proto.rover.audience.v1.ListDevicesByProfileIdentifierRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.rover.audience.v1.ListDevicesByProfileIdentifierRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.ListDevicesByProfileIdentifierRequest.displayName = 'proto.rover.audience.v1.ListDevicesByProfileIdentifierRequest';
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
proto.rover.audience.v1.ListDevicesByProfileIdentifierRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.ListDevicesByProfileIdentifierRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.ListDevicesByProfileIdentifierRequest} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.ListDevicesByProfileIdentifierRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    authContext: (f = msg.getAuthContext()) && auth_v1_auth_pb.AuthContext.toObject(includeInstance, f),
    identifier: jspb.Message.getFieldWithDefault(msg, 2, "")
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
 * @return {!proto.rover.audience.v1.ListDevicesByProfileIdentifierRequest}
 */
proto.rover.audience.v1.ListDevicesByProfileIdentifierRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.ListDevicesByProfileIdentifierRequest;
  return proto.rover.audience.v1.ListDevicesByProfileIdentifierRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.ListDevicesByProfileIdentifierRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.ListDevicesByProfileIdentifierRequest}
 */
proto.rover.audience.v1.ListDevicesByProfileIdentifierRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new auth_v1_auth_pb.AuthContext;
      reader.readMessage(value,auth_v1_auth_pb.AuthContext.deserializeBinaryFromReader);
      msg.setAuthContext(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setIdentifier(value);
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
proto.rover.audience.v1.ListDevicesByProfileIdentifierRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.ListDevicesByProfileIdentifierRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.ListDevicesByProfileIdentifierRequest} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.ListDevicesByProfileIdentifierRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getAuthContext();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      auth_v1_auth_pb.AuthContext.serializeBinaryToWriter
    );
  }
  f = message.getIdentifier();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * optional rover.auth.v1.AuthContext auth_context = 1;
 * @return {?proto.rover.auth.v1.AuthContext}
 */
proto.rover.audience.v1.ListDevicesByProfileIdentifierRequest.prototype.getAuthContext = function() {
  return /** @type{?proto.rover.auth.v1.AuthContext} */ (
    jspb.Message.getWrapperField(this, auth_v1_auth_pb.AuthContext, 1));
};


/** @param {?proto.rover.auth.v1.AuthContext|undefined} value */
proto.rover.audience.v1.ListDevicesByProfileIdentifierRequest.prototype.setAuthContext = function(value) {
  jspb.Message.setWrapperField(this, 1, value);
};


proto.rover.audience.v1.ListDevicesByProfileIdentifierRequest.prototype.clearAuthContext = function() {
  this.setAuthContext(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.ListDevicesByProfileIdentifierRequest.prototype.hasAuthContext = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional string identifier = 2;
 * @return {string}
 */
proto.rover.audience.v1.ListDevicesByProfileIdentifierRequest.prototype.getIdentifier = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/** @param {string} value */
proto.rover.audience.v1.ListDevicesByProfileIdentifierRequest.prototype.setIdentifier = function(value) {
  jspb.Message.setField(this, 2, value);
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
proto.rover.audience.v1.ListDevicesByProfileIdentifierResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.rover.audience.v1.ListDevicesByProfileIdentifierResponse.repeatedFields_, null);
};
goog.inherits(proto.rover.audience.v1.ListDevicesByProfileIdentifierResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.ListDevicesByProfileIdentifierResponse.displayName = 'proto.rover.audience.v1.ListDevicesByProfileIdentifierResponse';
}
/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.rover.audience.v1.ListDevicesByProfileIdentifierResponse.repeatedFields_ = [1];



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
proto.rover.audience.v1.ListDevicesByProfileIdentifierResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.ListDevicesByProfileIdentifierResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.ListDevicesByProfileIdentifierResponse} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.ListDevicesByProfileIdentifierResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    devicesList: jspb.Message.toObjectList(msg.getDevicesList(),
    proto.rover.audience.v1.Device.toObject, includeInstance)
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
 * @return {!proto.rover.audience.v1.ListDevicesByProfileIdentifierResponse}
 */
proto.rover.audience.v1.ListDevicesByProfileIdentifierResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.ListDevicesByProfileIdentifierResponse;
  return proto.rover.audience.v1.ListDevicesByProfileIdentifierResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.ListDevicesByProfileIdentifierResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.ListDevicesByProfileIdentifierResponse}
 */
proto.rover.audience.v1.ListDevicesByProfileIdentifierResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.rover.audience.v1.Device;
      reader.readMessage(value,proto.rover.audience.v1.Device.deserializeBinaryFromReader);
      msg.addDevices(value);
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
proto.rover.audience.v1.ListDevicesByProfileIdentifierResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.ListDevicesByProfileIdentifierResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.ListDevicesByProfileIdentifierResponse} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.ListDevicesByProfileIdentifierResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getDevicesList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      proto.rover.audience.v1.Device.serializeBinaryToWriter
    );
  }
};


/**
 * repeated Device devices = 1;
 * If you change this array by adding, removing or replacing elements, or if you
 * replace the array itself, then you must call the setter to update it.
 * @return {!Array.<!proto.rover.audience.v1.Device>}
 */
proto.rover.audience.v1.ListDevicesByProfileIdentifierResponse.prototype.getDevicesList = function() {
  return /** @type{!Array.<!proto.rover.audience.v1.Device>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.rover.audience.v1.Device, 1));
};


/** @param {!Array.<!proto.rover.audience.v1.Device>} value */
proto.rover.audience.v1.ListDevicesByProfileIdentifierResponse.prototype.setDevicesList = function(value) {
  jspb.Message.setRepeatedWrapperField(this, 1, value);
};


/**
 * @param {!proto.rover.audience.v1.Device=} opt_value
 * @param {number=} opt_index
 * @return {!proto.rover.audience.v1.Device}
 */
proto.rover.audience.v1.ListDevicesByProfileIdentifierResponse.prototype.addDevices = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.rover.audience.v1.Device, opt_index);
};


proto.rover.audience.v1.ListDevicesByProfileIdentifierResponse.prototype.clearDevicesList = function() {
  this.setDevicesList([]);
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
proto.rover.audience.v1.UpdateDeviceRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.rover.audience.v1.UpdateDeviceRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.UpdateDeviceRequest.displayName = 'proto.rover.audience.v1.UpdateDeviceRequest';
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
proto.rover.audience.v1.UpdateDeviceRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.UpdateDeviceRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.UpdateDeviceRequest} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.UpdateDeviceRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    authContext: (f = msg.getAuthContext()) && auth_v1_auth_pb.AuthContext.toObject(includeInstance, f),
    deviceId: jspb.Message.getFieldWithDefault(msg, 2, ""),
    apsEnvironment: jspb.Message.getFieldWithDefault(msg, 10, ""),
    deviceTokenKey: jspb.Message.getFieldWithDefault(msg, 11, ""),
    appName: jspb.Message.getFieldWithDefault(msg, 12, ""),
    appVersion: jspb.Message.getFieldWithDefault(msg, 13, ""),
    appBuild: jspb.Message.getFieldWithDefault(msg, 14, ""),
    appNamespace: jspb.Message.getFieldWithDefault(msg, 15, ""),
    deviceManufacturer: jspb.Message.getFieldWithDefault(msg, 16, ""),
    osName: jspb.Message.getFieldWithDefault(msg, 17, ""),
    osVersion: (f = msg.getOsVersion()) && proto.rover.audience.v1.Version.toObject(includeInstance, f),
    deviceModel: jspb.Message.getFieldWithDefault(msg, 19, ""),
    frameworksMap: (f = msg.getFrameworksMap()) ? f.toObject(includeInstance, proto.rover.audience.v1.Version.toObject) : [],
    localeLanguage: jspb.Message.getFieldWithDefault(msg, 21, ""),
    localeRegion: jspb.Message.getFieldWithDefault(msg, 22, ""),
    localeScript: jspb.Message.getFieldWithDefault(msg, 23, ""),
    isWifiEnabled: jspb.Message.getFieldWithDefault(msg, 24, false),
    isCellularEnabled: jspb.Message.getFieldWithDefault(msg, 25, false),
    screenWidth: jspb.Message.getFieldWithDefault(msg, 26, 0),
    screenHeight: jspb.Message.getFieldWithDefault(msg, 27, 0),
    carrierName: jspb.Message.getFieldWithDefault(msg, 28, ""),
    radio: jspb.Message.getFieldWithDefault(msg, 29, ""),
    timeZone: jspb.Message.getFieldWithDefault(msg, 30, ""),
    platform: jspb.Message.getFieldWithDefault(msg, 31, 0),
    isBackgroundEnabled: jspb.Message.getFieldWithDefault(msg, 32, false),
    isLocationMonitoringEnabled: jspb.Message.getFieldWithDefault(msg, 33, false),
    isBluetoothEnabled: jspb.Message.getFieldWithDefault(msg, 34, false),
    advertisingId: jspb.Message.getFieldWithDefault(msg, 35, ""),
    ip: jspb.Message.getFieldWithDefault(msg, 36, ""),
    regionMonitoringMode: jspb.Message.getFieldWithDefault(msg, 37, 0)
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
 * @return {!proto.rover.audience.v1.UpdateDeviceRequest}
 */
proto.rover.audience.v1.UpdateDeviceRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.UpdateDeviceRequest;
  return proto.rover.audience.v1.UpdateDeviceRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.UpdateDeviceRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.UpdateDeviceRequest}
 */
proto.rover.audience.v1.UpdateDeviceRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new auth_v1_auth_pb.AuthContext;
      reader.readMessage(value,auth_v1_auth_pb.AuthContext.deserializeBinaryFromReader);
      msg.setAuthContext(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setDeviceId(value);
      break;
    case 10:
      var value = /** @type {string} */ (reader.readString());
      msg.setApsEnvironment(value);
      break;
    case 11:
      var value = /** @type {string} */ (reader.readString());
      msg.setDeviceTokenKey(value);
      break;
    case 12:
      var value = /** @type {string} */ (reader.readString());
      msg.setAppName(value);
      break;
    case 13:
      var value = /** @type {string} */ (reader.readString());
      msg.setAppVersion(value);
      break;
    case 14:
      var value = /** @type {string} */ (reader.readString());
      msg.setAppBuild(value);
      break;
    case 15:
      var value = /** @type {string} */ (reader.readString());
      msg.setAppNamespace(value);
      break;
    case 16:
      var value = /** @type {string} */ (reader.readString());
      msg.setDeviceManufacturer(value);
      break;
    case 17:
      var value = /** @type {string} */ (reader.readString());
      msg.setOsName(value);
      break;
    case 18:
      var value = new proto.rover.audience.v1.Version;
      reader.readMessage(value,proto.rover.audience.v1.Version.deserializeBinaryFromReader);
      msg.setOsVersion(value);
      break;
    case 19:
      var value = /** @type {string} */ (reader.readString());
      msg.setDeviceModel(value);
      break;
    case 20:
      var value = msg.getFrameworksMap();
      reader.readMessage(value, function(message, reader) {
        jspb.Map.deserializeBinary(message, reader, jspb.BinaryReader.prototype.readString, jspb.BinaryReader.prototype.readMessage, proto.rover.audience.v1.Version.deserializeBinaryFromReader);
         });
      break;
    case 21:
      var value = /** @type {string} */ (reader.readString());
      msg.setLocaleLanguage(value);
      break;
    case 22:
      var value = /** @type {string} */ (reader.readString());
      msg.setLocaleRegion(value);
      break;
    case 23:
      var value = /** @type {string} */ (reader.readString());
      msg.setLocaleScript(value);
      break;
    case 24:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setIsWifiEnabled(value);
      break;
    case 25:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setIsCellularEnabled(value);
      break;
    case 26:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setScreenWidth(value);
      break;
    case 27:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setScreenHeight(value);
      break;
    case 28:
      var value = /** @type {string} */ (reader.readString());
      msg.setCarrierName(value);
      break;
    case 29:
      var value = /** @type {string} */ (reader.readString());
      msg.setRadio(value);
      break;
    case 30:
      var value = /** @type {string} */ (reader.readString());
      msg.setTimeZone(value);
      break;
    case 31:
      var value = /** @type {!proto.rover.audience.v1.Platform} */ (reader.readEnum());
      msg.setPlatform(value);
      break;
    case 32:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setIsBackgroundEnabled(value);
      break;
    case 33:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setIsLocationMonitoringEnabled(value);
      break;
    case 34:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setIsBluetoothEnabled(value);
      break;
    case 35:
      var value = /** @type {string} */ (reader.readString());
      msg.setAdvertisingId(value);
      break;
    case 36:
      var value = /** @type {string} */ (reader.readString());
      msg.setIp(value);
      break;
    case 37:
      var value = /** @type {!proto.rover.audience.v1.Device.RegionMonitoringMode} */ (reader.readEnum());
      msg.setRegionMonitoringMode(value);
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
proto.rover.audience.v1.UpdateDeviceRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.UpdateDeviceRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.UpdateDeviceRequest} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.UpdateDeviceRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getAuthContext();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      auth_v1_auth_pb.AuthContext.serializeBinaryToWriter
    );
  }
  f = message.getDeviceId();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getApsEnvironment();
  if (f.length > 0) {
    writer.writeString(
      10,
      f
    );
  }
  f = message.getDeviceTokenKey();
  if (f.length > 0) {
    writer.writeString(
      11,
      f
    );
  }
  f = message.getAppName();
  if (f.length > 0) {
    writer.writeString(
      12,
      f
    );
  }
  f = message.getAppVersion();
  if (f.length > 0) {
    writer.writeString(
      13,
      f
    );
  }
  f = message.getAppBuild();
  if (f.length > 0) {
    writer.writeString(
      14,
      f
    );
  }
  f = message.getAppNamespace();
  if (f.length > 0) {
    writer.writeString(
      15,
      f
    );
  }
  f = message.getDeviceManufacturer();
  if (f.length > 0) {
    writer.writeString(
      16,
      f
    );
  }
  f = message.getOsName();
  if (f.length > 0) {
    writer.writeString(
      17,
      f
    );
  }
  f = message.getOsVersion();
  if (f != null) {
    writer.writeMessage(
      18,
      f,
      proto.rover.audience.v1.Version.serializeBinaryToWriter
    );
  }
  f = message.getDeviceModel();
  if (f.length > 0) {
    writer.writeString(
      19,
      f
    );
  }
  f = message.getFrameworksMap(true);
  if (f && f.getLength() > 0) {
    f.serializeBinary(20, writer, jspb.BinaryWriter.prototype.writeString, jspb.BinaryWriter.prototype.writeMessage, proto.rover.audience.v1.Version.serializeBinaryToWriter);
  }
  f = message.getLocaleLanguage();
  if (f.length > 0) {
    writer.writeString(
      21,
      f
    );
  }
  f = message.getLocaleRegion();
  if (f.length > 0) {
    writer.writeString(
      22,
      f
    );
  }
  f = message.getLocaleScript();
  if (f.length > 0) {
    writer.writeString(
      23,
      f
    );
  }
  f = message.getIsWifiEnabled();
  if (f) {
    writer.writeBool(
      24,
      f
    );
  }
  f = message.getIsCellularEnabled();
  if (f) {
    writer.writeBool(
      25,
      f
    );
  }
  f = message.getScreenWidth();
  if (f !== 0) {
    writer.writeInt32(
      26,
      f
    );
  }
  f = message.getScreenHeight();
  if (f !== 0) {
    writer.writeInt32(
      27,
      f
    );
  }
  f = message.getCarrierName();
  if (f.length > 0) {
    writer.writeString(
      28,
      f
    );
  }
  f = message.getRadio();
  if (f.length > 0) {
    writer.writeString(
      29,
      f
    );
  }
  f = message.getTimeZone();
  if (f.length > 0) {
    writer.writeString(
      30,
      f
    );
  }
  f = message.getPlatform();
  if (f !== 0.0) {
    writer.writeEnum(
      31,
      f
    );
  }
  f = message.getIsBackgroundEnabled();
  if (f) {
    writer.writeBool(
      32,
      f
    );
  }
  f = message.getIsLocationMonitoringEnabled();
  if (f) {
    writer.writeBool(
      33,
      f
    );
  }
  f = message.getIsBluetoothEnabled();
  if (f) {
    writer.writeBool(
      34,
      f
    );
  }
  f = message.getAdvertisingId();
  if (f.length > 0) {
    writer.writeString(
      35,
      f
    );
  }
  f = message.getIp();
  if (f.length > 0) {
    writer.writeString(
      36,
      f
    );
  }
  f = message.getRegionMonitoringMode();
  if (f !== 0.0) {
    writer.writeEnum(
      37,
      f
    );
  }
};


/**
 * optional rover.auth.v1.AuthContext auth_context = 1;
 * @return {?proto.rover.auth.v1.AuthContext}
 */
proto.rover.audience.v1.UpdateDeviceRequest.prototype.getAuthContext = function() {
  return /** @type{?proto.rover.auth.v1.AuthContext} */ (
    jspb.Message.getWrapperField(this, auth_v1_auth_pb.AuthContext, 1));
};


/** @param {?proto.rover.auth.v1.AuthContext|undefined} value */
proto.rover.audience.v1.UpdateDeviceRequest.prototype.setAuthContext = function(value) {
  jspb.Message.setWrapperField(this, 1, value);
};


proto.rover.audience.v1.UpdateDeviceRequest.prototype.clearAuthContext = function() {
  this.setAuthContext(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.UpdateDeviceRequest.prototype.hasAuthContext = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional string device_id = 2;
 * @return {string}
 */
proto.rover.audience.v1.UpdateDeviceRequest.prototype.getDeviceId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/** @param {string} value */
proto.rover.audience.v1.UpdateDeviceRequest.prototype.setDeviceId = function(value) {
  jspb.Message.setField(this, 2, value);
};


/**
 * optional string aps_environment = 10;
 * @return {string}
 */
proto.rover.audience.v1.UpdateDeviceRequest.prototype.getApsEnvironment = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 10, ""));
};


/** @param {string} value */
proto.rover.audience.v1.UpdateDeviceRequest.prototype.setApsEnvironment = function(value) {
  jspb.Message.setField(this, 10, value);
};


/**
 * optional string device_token_key = 11;
 * @return {string}
 */
proto.rover.audience.v1.UpdateDeviceRequest.prototype.getDeviceTokenKey = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 11, ""));
};


/** @param {string} value */
proto.rover.audience.v1.UpdateDeviceRequest.prototype.setDeviceTokenKey = function(value) {
  jspb.Message.setField(this, 11, value);
};


/**
 * optional string app_name = 12;
 * @return {string}
 */
proto.rover.audience.v1.UpdateDeviceRequest.prototype.getAppName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 12, ""));
};


/** @param {string} value */
proto.rover.audience.v1.UpdateDeviceRequest.prototype.setAppName = function(value) {
  jspb.Message.setField(this, 12, value);
};


/**
 * optional string app_version = 13;
 * @return {string}
 */
proto.rover.audience.v1.UpdateDeviceRequest.prototype.getAppVersion = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 13, ""));
};


/** @param {string} value */
proto.rover.audience.v1.UpdateDeviceRequest.prototype.setAppVersion = function(value) {
  jspb.Message.setField(this, 13, value);
};


/**
 * optional string app_build = 14;
 * @return {string}
 */
proto.rover.audience.v1.UpdateDeviceRequest.prototype.getAppBuild = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 14, ""));
};


/** @param {string} value */
proto.rover.audience.v1.UpdateDeviceRequest.prototype.setAppBuild = function(value) {
  jspb.Message.setField(this, 14, value);
};


/**
 * optional string app_namespace = 15;
 * @return {string}
 */
proto.rover.audience.v1.UpdateDeviceRequest.prototype.getAppNamespace = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 15, ""));
};


/** @param {string} value */
proto.rover.audience.v1.UpdateDeviceRequest.prototype.setAppNamespace = function(value) {
  jspb.Message.setField(this, 15, value);
};


/**
 * optional string device_manufacturer = 16;
 * @return {string}
 */
proto.rover.audience.v1.UpdateDeviceRequest.prototype.getDeviceManufacturer = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 16, ""));
};


/** @param {string} value */
proto.rover.audience.v1.UpdateDeviceRequest.prototype.setDeviceManufacturer = function(value) {
  jspb.Message.setField(this, 16, value);
};


/**
 * optional string os_name = 17;
 * @return {string}
 */
proto.rover.audience.v1.UpdateDeviceRequest.prototype.getOsName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 17, ""));
};


/** @param {string} value */
proto.rover.audience.v1.UpdateDeviceRequest.prototype.setOsName = function(value) {
  jspb.Message.setField(this, 17, value);
};


/**
 * optional Version os_version = 18;
 * @return {?proto.rover.audience.v1.Version}
 */
proto.rover.audience.v1.UpdateDeviceRequest.prototype.getOsVersion = function() {
  return /** @type{?proto.rover.audience.v1.Version} */ (
    jspb.Message.getWrapperField(this, proto.rover.audience.v1.Version, 18));
};


/** @param {?proto.rover.audience.v1.Version|undefined} value */
proto.rover.audience.v1.UpdateDeviceRequest.prototype.setOsVersion = function(value) {
  jspb.Message.setWrapperField(this, 18, value);
};


proto.rover.audience.v1.UpdateDeviceRequest.prototype.clearOsVersion = function() {
  this.setOsVersion(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.UpdateDeviceRequest.prototype.hasOsVersion = function() {
  return jspb.Message.getField(this, 18) != null;
};


/**
 * optional string device_model = 19;
 * @return {string}
 */
proto.rover.audience.v1.UpdateDeviceRequest.prototype.getDeviceModel = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 19, ""));
};


/** @param {string} value */
proto.rover.audience.v1.UpdateDeviceRequest.prototype.setDeviceModel = function(value) {
  jspb.Message.setField(this, 19, value);
};


/**
 * map<string, Version> frameworks = 20;
 * @param {boolean=} opt_noLazyCreate Do not create the map if
 * empty, instead returning `undefined`
 * @return {!jspb.Map<string,!proto.rover.audience.v1.Version>}
 */
proto.rover.audience.v1.UpdateDeviceRequest.prototype.getFrameworksMap = function(opt_noLazyCreate) {
  return /** @type {!jspb.Map<string,!proto.rover.audience.v1.Version>} */ (
      jspb.Message.getMapField(this, 20, opt_noLazyCreate,
      proto.rover.audience.v1.Version));
};


proto.rover.audience.v1.UpdateDeviceRequest.prototype.clearFrameworksMap = function() {
  this.getFrameworksMap().clear();
};


/**
 * optional string locale_language = 21;
 * @return {string}
 */
proto.rover.audience.v1.UpdateDeviceRequest.prototype.getLocaleLanguage = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 21, ""));
};


/** @param {string} value */
proto.rover.audience.v1.UpdateDeviceRequest.prototype.setLocaleLanguage = function(value) {
  jspb.Message.setField(this, 21, value);
};


/**
 * optional string locale_region = 22;
 * @return {string}
 */
proto.rover.audience.v1.UpdateDeviceRequest.prototype.getLocaleRegion = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 22, ""));
};


/** @param {string} value */
proto.rover.audience.v1.UpdateDeviceRequest.prototype.setLocaleRegion = function(value) {
  jspb.Message.setField(this, 22, value);
};


/**
 * optional string locale_script = 23;
 * @return {string}
 */
proto.rover.audience.v1.UpdateDeviceRequest.prototype.getLocaleScript = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 23, ""));
};


/** @param {string} value */
proto.rover.audience.v1.UpdateDeviceRequest.prototype.setLocaleScript = function(value) {
  jspb.Message.setField(this, 23, value);
};


/**
 * optional bool is_wifi_enabled = 24;
 * Note that Boolean fields may be set to 0/1 when serialized from a Java server.
 * You should avoid comparisons like {@code val === true/false} in those cases.
 * @return {boolean}
 */
proto.rover.audience.v1.UpdateDeviceRequest.prototype.getIsWifiEnabled = function() {
  return /** @type {boolean} */ (jspb.Message.getFieldWithDefault(this, 24, false));
};


/** @param {boolean} value */
proto.rover.audience.v1.UpdateDeviceRequest.prototype.setIsWifiEnabled = function(value) {
  jspb.Message.setField(this, 24, value);
};


/**
 * optional bool is_cellular_enabled = 25;
 * Note that Boolean fields may be set to 0/1 when serialized from a Java server.
 * You should avoid comparisons like {@code val === true/false} in those cases.
 * @return {boolean}
 */
proto.rover.audience.v1.UpdateDeviceRequest.prototype.getIsCellularEnabled = function() {
  return /** @type {boolean} */ (jspb.Message.getFieldWithDefault(this, 25, false));
};


/** @param {boolean} value */
proto.rover.audience.v1.UpdateDeviceRequest.prototype.setIsCellularEnabled = function(value) {
  jspb.Message.setField(this, 25, value);
};


/**
 * optional int32 screen_width = 26;
 * @return {number}
 */
proto.rover.audience.v1.UpdateDeviceRequest.prototype.getScreenWidth = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 26, 0));
};


/** @param {number} value */
proto.rover.audience.v1.UpdateDeviceRequest.prototype.setScreenWidth = function(value) {
  jspb.Message.setField(this, 26, value);
};


/**
 * optional int32 screen_height = 27;
 * @return {number}
 */
proto.rover.audience.v1.UpdateDeviceRequest.prototype.getScreenHeight = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 27, 0));
};


/** @param {number} value */
proto.rover.audience.v1.UpdateDeviceRequest.prototype.setScreenHeight = function(value) {
  jspb.Message.setField(this, 27, value);
};


/**
 * optional string carrier_name = 28;
 * @return {string}
 */
proto.rover.audience.v1.UpdateDeviceRequest.prototype.getCarrierName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 28, ""));
};


/** @param {string} value */
proto.rover.audience.v1.UpdateDeviceRequest.prototype.setCarrierName = function(value) {
  jspb.Message.setField(this, 28, value);
};


/**
 * optional string radio = 29;
 * @return {string}
 */
proto.rover.audience.v1.UpdateDeviceRequest.prototype.getRadio = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 29, ""));
};


/** @param {string} value */
proto.rover.audience.v1.UpdateDeviceRequest.prototype.setRadio = function(value) {
  jspb.Message.setField(this, 29, value);
};


/**
 * optional string time_zone = 30;
 * @return {string}
 */
proto.rover.audience.v1.UpdateDeviceRequest.prototype.getTimeZone = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 30, ""));
};


/** @param {string} value */
proto.rover.audience.v1.UpdateDeviceRequest.prototype.setTimeZone = function(value) {
  jspb.Message.setField(this, 30, value);
};


/**
 * optional Platform platform = 31;
 * @return {!proto.rover.audience.v1.Platform}
 */
proto.rover.audience.v1.UpdateDeviceRequest.prototype.getPlatform = function() {
  return /** @type {!proto.rover.audience.v1.Platform} */ (jspb.Message.getFieldWithDefault(this, 31, 0));
};


/** @param {!proto.rover.audience.v1.Platform} value */
proto.rover.audience.v1.UpdateDeviceRequest.prototype.setPlatform = function(value) {
  jspb.Message.setField(this, 31, value);
};


/**
 * optional bool is_background_enabled = 32;
 * Note that Boolean fields may be set to 0/1 when serialized from a Java server.
 * You should avoid comparisons like {@code val === true/false} in those cases.
 * @return {boolean}
 */
proto.rover.audience.v1.UpdateDeviceRequest.prototype.getIsBackgroundEnabled = function() {
  return /** @type {boolean} */ (jspb.Message.getFieldWithDefault(this, 32, false));
};


/** @param {boolean} value */
proto.rover.audience.v1.UpdateDeviceRequest.prototype.setIsBackgroundEnabled = function(value) {
  jspb.Message.setField(this, 32, value);
};


/**
 * optional bool is_location_monitoring_enabled = 33;
 * Note that Boolean fields may be set to 0/1 when serialized from a Java server.
 * You should avoid comparisons like {@code val === true/false} in those cases.
 * @return {boolean}
 */
proto.rover.audience.v1.UpdateDeviceRequest.prototype.getIsLocationMonitoringEnabled = function() {
  return /** @type {boolean} */ (jspb.Message.getFieldWithDefault(this, 33, false));
};


/** @param {boolean} value */
proto.rover.audience.v1.UpdateDeviceRequest.prototype.setIsLocationMonitoringEnabled = function(value) {
  jspb.Message.setField(this, 33, value);
};


/**
 * optional bool is_bluetooth_enabled = 34;
 * Note that Boolean fields may be set to 0/1 when serialized from a Java server.
 * You should avoid comparisons like {@code val === true/false} in those cases.
 * @return {boolean}
 */
proto.rover.audience.v1.UpdateDeviceRequest.prototype.getIsBluetoothEnabled = function() {
  return /** @type {boolean} */ (jspb.Message.getFieldWithDefault(this, 34, false));
};


/** @param {boolean} value */
proto.rover.audience.v1.UpdateDeviceRequest.prototype.setIsBluetoothEnabled = function(value) {
  jspb.Message.setField(this, 34, value);
};


/**
 * optional string advertising_id = 35;
 * @return {string}
 */
proto.rover.audience.v1.UpdateDeviceRequest.prototype.getAdvertisingId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 35, ""));
};


/** @param {string} value */
proto.rover.audience.v1.UpdateDeviceRequest.prototype.setAdvertisingId = function(value) {
  jspb.Message.setField(this, 35, value);
};


/**
 * optional string ip = 36;
 * @return {string}
 */
proto.rover.audience.v1.UpdateDeviceRequest.prototype.getIp = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 36, ""));
};


/** @param {string} value */
proto.rover.audience.v1.UpdateDeviceRequest.prototype.setIp = function(value) {
  jspb.Message.setField(this, 36, value);
};


/**
 * optional Device.RegionMonitoringMode region_monitoring_mode = 37;
 * @return {!proto.rover.audience.v1.Device.RegionMonitoringMode}
 */
proto.rover.audience.v1.UpdateDeviceRequest.prototype.getRegionMonitoringMode = function() {
  return /** @type {!proto.rover.audience.v1.Device.RegionMonitoringMode} */ (jspb.Message.getFieldWithDefault(this, 37, 0));
};


/** @param {!proto.rover.audience.v1.Device.RegionMonitoringMode} value */
proto.rover.audience.v1.UpdateDeviceRequest.prototype.setRegionMonitoringMode = function(value) {
  jspb.Message.setField(this, 37, value);
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
proto.rover.audience.v1.UpdateDeviceResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.rover.audience.v1.UpdateDeviceResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.UpdateDeviceResponse.displayName = 'proto.rover.audience.v1.UpdateDeviceResponse';
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
proto.rover.audience.v1.UpdateDeviceResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.UpdateDeviceResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.UpdateDeviceResponse} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.UpdateDeviceResponse.toObject = function(includeInstance, msg) {
  var f, obj = {

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
 * @return {!proto.rover.audience.v1.UpdateDeviceResponse}
 */
proto.rover.audience.v1.UpdateDeviceResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.UpdateDeviceResponse;
  return proto.rover.audience.v1.UpdateDeviceResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.UpdateDeviceResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.UpdateDeviceResponse}
 */
proto.rover.audience.v1.UpdateDeviceResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
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
proto.rover.audience.v1.UpdateDeviceResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.UpdateDeviceResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.UpdateDeviceResponse} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.UpdateDeviceResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
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
proto.rover.audience.v1.Device = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.rover.audience.v1.Device.repeatedFields_, null);
};
goog.inherits(proto.rover.audience.v1.Device, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.Device.displayName = 'proto.rover.audience.v1.Device';
}
/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.rover.audience.v1.Device.repeatedFields_ = [49,51];



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
proto.rover.audience.v1.Device.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.Device.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.Device} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.Device.toObject = function(includeInstance, msg) {
  var f, obj = {
    id: jspb.Message.getFieldWithDefault(msg, 1, ""),
    deviceId: jspb.Message.getFieldWithDefault(msg, 2, ""),
    accountId: jspb.Message.getFieldWithDefault(msg, 3, 0),
    profileId: jspb.Message.getFieldWithDefault(msg, 4, ""),
    createdAt: (f = msg.getCreatedAt()) && google_protobuf_timestamp_pb.Timestamp.toObject(includeInstance, f),
    updatedAt: (f = msg.getUpdatedAt()) && google_protobuf_timestamp_pb.Timestamp.toObject(includeInstance, f),
    apsEnvironment: jspb.Message.getFieldWithDefault(msg, 10, ""),
    deviceTokenKey: jspb.Message.getFieldWithDefault(msg, 11, ""),
    deviceTokenIsActive: jspb.Message.getFieldWithDefault(msg, 12, false),
    deviceTokenCreatedAt: (f = msg.getDeviceTokenCreatedAt()) && google_protobuf_timestamp_pb.Timestamp.toObject(includeInstance, f),
    deviceTokenUpdatedAt: (f = msg.getDeviceTokenUpdatedAt()) && google_protobuf_timestamp_pb.Timestamp.toObject(includeInstance, f),
    deviceTokenUnregisteredAt: (f = msg.getDeviceTokenUnregisteredAt()) && google_protobuf_timestamp_pb.Timestamp.toObject(includeInstance, f),
    appName: jspb.Message.getFieldWithDefault(msg, 16, ""),
    appVersion: jspb.Message.getFieldWithDefault(msg, 17, ""),
    appBuild: jspb.Message.getFieldWithDefault(msg, 18, ""),
    appNamespace: jspb.Message.getFieldWithDefault(msg, 19, ""),
    deviceManufacturer: jspb.Message.getFieldWithDefault(msg, 20, ""),
    deviceModel: jspb.Message.getFieldWithDefault(msg, 23, ""),
    osName: jspb.Message.getFieldWithDefault(msg, 21, ""),
    osVersion: (f = msg.getOsVersion()) && proto.rover.audience.v1.Version.toObject(includeInstance, f),
    frameworksMap: (f = msg.getFrameworksMap()) ? f.toObject(includeInstance, proto.rover.audience.v1.Version.toObject) : [],
    localeLanguage: jspb.Message.getFieldWithDefault(msg, 25, ""),
    localeRegion: jspb.Message.getFieldWithDefault(msg, 26, ""),
    localeScript: jspb.Message.getFieldWithDefault(msg, 27, ""),
    isWifiEnabled: jspb.Message.getFieldWithDefault(msg, 28, false),
    isCellularEnabled: jspb.Message.getFieldWithDefault(msg, 29, false),
    screenWidth: jspb.Message.getFieldWithDefault(msg, 30, 0),
    screenHeight: jspb.Message.getFieldWithDefault(msg, 31, 0),
    carrierName: jspb.Message.getFieldWithDefault(msg, 32, ""),
    radio: jspb.Message.getFieldWithDefault(msg, 33, ""),
    timeZone: jspb.Message.getFieldWithDefault(msg, 34, ""),
    platform: jspb.Message.getFieldWithDefault(msg, 35, 0),
    isBackgroundEnabled: jspb.Message.getFieldWithDefault(msg, 36, false),
    isLocationMonitoringEnabled: jspb.Message.getFieldWithDefault(msg, 37, false),
    isBluetoothEnabled: jspb.Message.getFieldWithDefault(msg, 38, false),
    advertisingId: jspb.Message.getFieldWithDefault(msg, 39, ""),
    ip: jspb.Message.getFieldWithDefault(msg, 40, ""),
    locationAccuracy: jspb.Message.getFieldWithDefault(msg, 41, 0),
    locationLatitude: +jspb.Message.getFieldWithDefault(msg, 42, 0.0),
    locationLongitude: +jspb.Message.getFieldWithDefault(msg, 43, 0.0),
    locationRegion: jspb.Message.getFieldWithDefault(msg, 44, ""),
    locationCity: jspb.Message.getFieldWithDefault(msg, 45, ""),
    locationStreet: jspb.Message.getFieldWithDefault(msg, 46, ""),
    regionMonitoringMode: jspb.Message.getFieldWithDefault(msg, 47, 0),
    ibeaconMonitoringRegionsUpdatedAt: (f = msg.getIbeaconMonitoringRegionsUpdatedAt()) && google_protobuf_timestamp_pb.Timestamp.toObject(includeInstance, f),
    ibeaconMonitoringRegionsList: jspb.Message.toObjectList(msg.getIbeaconMonitoringRegionsList(),
    proto.rover.audience.v1.IBeaconRegion.toObject, includeInstance),
    geofenceMonitoringRegionsUpdatedAt: (f = msg.getGeofenceMonitoringRegionsUpdatedAt()) && google_protobuf_timestamp_pb.Timestamp.toObject(includeInstance, f),
    geofenceMonitoringRegionsList: jspb.Message.toObjectList(msg.getGeofenceMonitoringRegionsList(),
    proto.rover.audience.v1.GeofenceRegion.toObject, includeInstance)
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
 * @return {!proto.rover.audience.v1.Device}
 */
proto.rover.audience.v1.Device.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.Device;
  return proto.rover.audience.v1.Device.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.Device} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.Device}
 */
proto.rover.audience.v1.Device.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setId(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setDeviceId(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setAccountId(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setProfileId(value);
      break;
    case 5:
      var value = new google_protobuf_timestamp_pb.Timestamp;
      reader.readMessage(value,google_protobuf_timestamp_pb.Timestamp.deserializeBinaryFromReader);
      msg.setCreatedAt(value);
      break;
    case 6:
      var value = new google_protobuf_timestamp_pb.Timestamp;
      reader.readMessage(value,google_protobuf_timestamp_pb.Timestamp.deserializeBinaryFromReader);
      msg.setUpdatedAt(value);
      break;
    case 10:
      var value = /** @type {string} */ (reader.readString());
      msg.setApsEnvironment(value);
      break;
    case 11:
      var value = /** @type {string} */ (reader.readString());
      msg.setDeviceTokenKey(value);
      break;
    case 12:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setDeviceTokenIsActive(value);
      break;
    case 13:
      var value = new google_protobuf_timestamp_pb.Timestamp;
      reader.readMessage(value,google_protobuf_timestamp_pb.Timestamp.deserializeBinaryFromReader);
      msg.setDeviceTokenCreatedAt(value);
      break;
    case 14:
      var value = new google_protobuf_timestamp_pb.Timestamp;
      reader.readMessage(value,google_protobuf_timestamp_pb.Timestamp.deserializeBinaryFromReader);
      msg.setDeviceTokenUpdatedAt(value);
      break;
    case 15:
      var value = new google_protobuf_timestamp_pb.Timestamp;
      reader.readMessage(value,google_protobuf_timestamp_pb.Timestamp.deserializeBinaryFromReader);
      msg.setDeviceTokenUnregisteredAt(value);
      break;
    case 16:
      var value = /** @type {string} */ (reader.readString());
      msg.setAppName(value);
      break;
    case 17:
      var value = /** @type {string} */ (reader.readString());
      msg.setAppVersion(value);
      break;
    case 18:
      var value = /** @type {string} */ (reader.readString());
      msg.setAppBuild(value);
      break;
    case 19:
      var value = /** @type {string} */ (reader.readString());
      msg.setAppNamespace(value);
      break;
    case 20:
      var value = /** @type {string} */ (reader.readString());
      msg.setDeviceManufacturer(value);
      break;
    case 23:
      var value = /** @type {string} */ (reader.readString());
      msg.setDeviceModel(value);
      break;
    case 21:
      var value = /** @type {string} */ (reader.readString());
      msg.setOsName(value);
      break;
    case 22:
      var value = new proto.rover.audience.v1.Version;
      reader.readMessage(value,proto.rover.audience.v1.Version.deserializeBinaryFromReader);
      msg.setOsVersion(value);
      break;
    case 24:
      var value = msg.getFrameworksMap();
      reader.readMessage(value, function(message, reader) {
        jspb.Map.deserializeBinary(message, reader, jspb.BinaryReader.prototype.readString, jspb.BinaryReader.prototype.readMessage, proto.rover.audience.v1.Version.deserializeBinaryFromReader);
         });
      break;
    case 25:
      var value = /** @type {string} */ (reader.readString());
      msg.setLocaleLanguage(value);
      break;
    case 26:
      var value = /** @type {string} */ (reader.readString());
      msg.setLocaleRegion(value);
      break;
    case 27:
      var value = /** @type {string} */ (reader.readString());
      msg.setLocaleScript(value);
      break;
    case 28:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setIsWifiEnabled(value);
      break;
    case 29:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setIsCellularEnabled(value);
      break;
    case 30:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setScreenWidth(value);
      break;
    case 31:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setScreenHeight(value);
      break;
    case 32:
      var value = /** @type {string} */ (reader.readString());
      msg.setCarrierName(value);
      break;
    case 33:
      var value = /** @type {string} */ (reader.readString());
      msg.setRadio(value);
      break;
    case 34:
      var value = /** @type {string} */ (reader.readString());
      msg.setTimeZone(value);
      break;
    case 35:
      var value = /** @type {!proto.rover.audience.v1.Platform} */ (reader.readEnum());
      msg.setPlatform(value);
      break;
    case 36:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setIsBackgroundEnabled(value);
      break;
    case 37:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setIsLocationMonitoringEnabled(value);
      break;
    case 38:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setIsBluetoothEnabled(value);
      break;
    case 39:
      var value = /** @type {string} */ (reader.readString());
      msg.setAdvertisingId(value);
      break;
    case 40:
      var value = /** @type {string} */ (reader.readString());
      msg.setIp(value);
      break;
    case 41:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setLocationAccuracy(value);
      break;
    case 42:
      var value = /** @type {number} */ (reader.readDouble());
      msg.setLocationLatitude(value);
      break;
    case 43:
      var value = /** @type {number} */ (reader.readDouble());
      msg.setLocationLongitude(value);
      break;
    case 44:
      var value = /** @type {string} */ (reader.readString());
      msg.setLocationRegion(value);
      break;
    case 45:
      var value = /** @type {string} */ (reader.readString());
      msg.setLocationCity(value);
      break;
    case 46:
      var value = /** @type {string} */ (reader.readString());
      msg.setLocationStreet(value);
      break;
    case 47:
      var value = /** @type {!proto.rover.audience.v1.Device.RegionMonitoringMode} */ (reader.readEnum());
      msg.setRegionMonitoringMode(value);
      break;
    case 48:
      var value = new google_protobuf_timestamp_pb.Timestamp;
      reader.readMessage(value,google_protobuf_timestamp_pb.Timestamp.deserializeBinaryFromReader);
      msg.setIbeaconMonitoringRegionsUpdatedAt(value);
      break;
    case 49:
      var value = new proto.rover.audience.v1.IBeaconRegion;
      reader.readMessage(value,proto.rover.audience.v1.IBeaconRegion.deserializeBinaryFromReader);
      msg.addIbeaconMonitoringRegions(value);
      break;
    case 50:
      var value = new google_protobuf_timestamp_pb.Timestamp;
      reader.readMessage(value,google_protobuf_timestamp_pb.Timestamp.deserializeBinaryFromReader);
      msg.setGeofenceMonitoringRegionsUpdatedAt(value);
      break;
    case 51:
      var value = new proto.rover.audience.v1.GeofenceRegion;
      reader.readMessage(value,proto.rover.audience.v1.GeofenceRegion.deserializeBinaryFromReader);
      msg.addGeofenceMonitoringRegions(value);
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
proto.rover.audience.v1.Device.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.Device.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.Device} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.Device.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getId();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getDeviceId();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getAccountId();
  if (f !== 0) {
    writer.writeInt32(
      3,
      f
    );
  }
  f = message.getProfileId();
  if (f.length > 0) {
    writer.writeString(
      4,
      f
    );
  }
  f = message.getCreatedAt();
  if (f != null) {
    writer.writeMessage(
      5,
      f,
      google_protobuf_timestamp_pb.Timestamp.serializeBinaryToWriter
    );
  }
  f = message.getUpdatedAt();
  if (f != null) {
    writer.writeMessage(
      6,
      f,
      google_protobuf_timestamp_pb.Timestamp.serializeBinaryToWriter
    );
  }
  f = message.getApsEnvironment();
  if (f.length > 0) {
    writer.writeString(
      10,
      f
    );
  }
  f = message.getDeviceTokenKey();
  if (f.length > 0) {
    writer.writeString(
      11,
      f
    );
  }
  f = message.getDeviceTokenIsActive();
  if (f) {
    writer.writeBool(
      12,
      f
    );
  }
  f = message.getDeviceTokenCreatedAt();
  if (f != null) {
    writer.writeMessage(
      13,
      f,
      google_protobuf_timestamp_pb.Timestamp.serializeBinaryToWriter
    );
  }
  f = message.getDeviceTokenUpdatedAt();
  if (f != null) {
    writer.writeMessage(
      14,
      f,
      google_protobuf_timestamp_pb.Timestamp.serializeBinaryToWriter
    );
  }
  f = message.getDeviceTokenUnregisteredAt();
  if (f != null) {
    writer.writeMessage(
      15,
      f,
      google_protobuf_timestamp_pb.Timestamp.serializeBinaryToWriter
    );
  }
  f = message.getAppName();
  if (f.length > 0) {
    writer.writeString(
      16,
      f
    );
  }
  f = message.getAppVersion();
  if (f.length > 0) {
    writer.writeString(
      17,
      f
    );
  }
  f = message.getAppBuild();
  if (f.length > 0) {
    writer.writeString(
      18,
      f
    );
  }
  f = message.getAppNamespace();
  if (f.length > 0) {
    writer.writeString(
      19,
      f
    );
  }
  f = message.getDeviceManufacturer();
  if (f.length > 0) {
    writer.writeString(
      20,
      f
    );
  }
  f = message.getDeviceModel();
  if (f.length > 0) {
    writer.writeString(
      23,
      f
    );
  }
  f = message.getOsName();
  if (f.length > 0) {
    writer.writeString(
      21,
      f
    );
  }
  f = message.getOsVersion();
  if (f != null) {
    writer.writeMessage(
      22,
      f,
      proto.rover.audience.v1.Version.serializeBinaryToWriter
    );
  }
  f = message.getFrameworksMap(true);
  if (f && f.getLength() > 0) {
    f.serializeBinary(24, writer, jspb.BinaryWriter.prototype.writeString, jspb.BinaryWriter.prototype.writeMessage, proto.rover.audience.v1.Version.serializeBinaryToWriter);
  }
  f = message.getLocaleLanguage();
  if (f.length > 0) {
    writer.writeString(
      25,
      f
    );
  }
  f = message.getLocaleRegion();
  if (f.length > 0) {
    writer.writeString(
      26,
      f
    );
  }
  f = message.getLocaleScript();
  if (f.length > 0) {
    writer.writeString(
      27,
      f
    );
  }
  f = message.getIsWifiEnabled();
  if (f) {
    writer.writeBool(
      28,
      f
    );
  }
  f = message.getIsCellularEnabled();
  if (f) {
    writer.writeBool(
      29,
      f
    );
  }
  f = message.getScreenWidth();
  if (f !== 0) {
    writer.writeInt32(
      30,
      f
    );
  }
  f = message.getScreenHeight();
  if (f !== 0) {
    writer.writeInt32(
      31,
      f
    );
  }
  f = message.getCarrierName();
  if (f.length > 0) {
    writer.writeString(
      32,
      f
    );
  }
  f = message.getRadio();
  if (f.length > 0) {
    writer.writeString(
      33,
      f
    );
  }
  f = message.getTimeZone();
  if (f.length > 0) {
    writer.writeString(
      34,
      f
    );
  }
  f = message.getPlatform();
  if (f !== 0.0) {
    writer.writeEnum(
      35,
      f
    );
  }
  f = message.getIsBackgroundEnabled();
  if (f) {
    writer.writeBool(
      36,
      f
    );
  }
  f = message.getIsLocationMonitoringEnabled();
  if (f) {
    writer.writeBool(
      37,
      f
    );
  }
  f = message.getIsBluetoothEnabled();
  if (f) {
    writer.writeBool(
      38,
      f
    );
  }
  f = message.getAdvertisingId();
  if (f.length > 0) {
    writer.writeString(
      39,
      f
    );
  }
  f = message.getIp();
  if (f.length > 0) {
    writer.writeString(
      40,
      f
    );
  }
  f = message.getLocationAccuracy();
  if (f !== 0) {
    writer.writeInt32(
      41,
      f
    );
  }
  f = message.getLocationLatitude();
  if (f !== 0.0) {
    writer.writeDouble(
      42,
      f
    );
  }
  f = message.getLocationLongitude();
  if (f !== 0.0) {
    writer.writeDouble(
      43,
      f
    );
  }
  f = message.getLocationRegion();
  if (f.length > 0) {
    writer.writeString(
      44,
      f
    );
  }
  f = message.getLocationCity();
  if (f.length > 0) {
    writer.writeString(
      45,
      f
    );
  }
  f = message.getLocationStreet();
  if (f.length > 0) {
    writer.writeString(
      46,
      f
    );
  }
  f = message.getRegionMonitoringMode();
  if (f !== 0.0) {
    writer.writeEnum(
      47,
      f
    );
  }
  f = message.getIbeaconMonitoringRegionsUpdatedAt();
  if (f != null) {
    writer.writeMessage(
      48,
      f,
      google_protobuf_timestamp_pb.Timestamp.serializeBinaryToWriter
    );
  }
  f = message.getIbeaconMonitoringRegionsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      49,
      f,
      proto.rover.audience.v1.IBeaconRegion.serializeBinaryToWriter
    );
  }
  f = message.getGeofenceMonitoringRegionsUpdatedAt();
  if (f != null) {
    writer.writeMessage(
      50,
      f,
      google_protobuf_timestamp_pb.Timestamp.serializeBinaryToWriter
    );
  }
  f = message.getGeofenceMonitoringRegionsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      51,
      f,
      proto.rover.audience.v1.GeofenceRegion.serializeBinaryToWriter
    );
  }
};


/**
 * @enum {number}
 */
proto.rover.audience.v1.Device.RegionMonitoringMode = {
  UNDEFINED: 0,
  ROVER: 1,
  GIMBAL: 2
};

/**
 * optional string id = 1;
 * @return {string}
 */
proto.rover.audience.v1.Device.prototype.getId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/** @param {string} value */
proto.rover.audience.v1.Device.prototype.setId = function(value) {
  jspb.Message.setField(this, 1, value);
};


/**
 * optional string device_id = 2;
 * @return {string}
 */
proto.rover.audience.v1.Device.prototype.getDeviceId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/** @param {string} value */
proto.rover.audience.v1.Device.prototype.setDeviceId = function(value) {
  jspb.Message.setField(this, 2, value);
};


/**
 * optional int32 account_id = 3;
 * @return {number}
 */
proto.rover.audience.v1.Device.prototype.getAccountId = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/** @param {number} value */
proto.rover.audience.v1.Device.prototype.setAccountId = function(value) {
  jspb.Message.setField(this, 3, value);
};


/**
 * optional string profile_id = 4;
 * @return {string}
 */
proto.rover.audience.v1.Device.prototype.getProfileId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/** @param {string} value */
proto.rover.audience.v1.Device.prototype.setProfileId = function(value) {
  jspb.Message.setField(this, 4, value);
};


/**
 * optional google.protobuf.Timestamp created_at = 5;
 * @return {?proto.google.protobuf.Timestamp}
 */
proto.rover.audience.v1.Device.prototype.getCreatedAt = function() {
  return /** @type{?proto.google.protobuf.Timestamp} */ (
    jspb.Message.getWrapperField(this, google_protobuf_timestamp_pb.Timestamp, 5));
};


/** @param {?proto.google.protobuf.Timestamp|undefined} value */
proto.rover.audience.v1.Device.prototype.setCreatedAt = function(value) {
  jspb.Message.setWrapperField(this, 5, value);
};


proto.rover.audience.v1.Device.prototype.clearCreatedAt = function() {
  this.setCreatedAt(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.Device.prototype.hasCreatedAt = function() {
  return jspb.Message.getField(this, 5) != null;
};


/**
 * optional google.protobuf.Timestamp updated_at = 6;
 * @return {?proto.google.protobuf.Timestamp}
 */
proto.rover.audience.v1.Device.prototype.getUpdatedAt = function() {
  return /** @type{?proto.google.protobuf.Timestamp} */ (
    jspb.Message.getWrapperField(this, google_protobuf_timestamp_pb.Timestamp, 6));
};


/** @param {?proto.google.protobuf.Timestamp|undefined} value */
proto.rover.audience.v1.Device.prototype.setUpdatedAt = function(value) {
  jspb.Message.setWrapperField(this, 6, value);
};


proto.rover.audience.v1.Device.prototype.clearUpdatedAt = function() {
  this.setUpdatedAt(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.Device.prototype.hasUpdatedAt = function() {
  return jspb.Message.getField(this, 6) != null;
};


/**
 * optional string aps_environment = 10;
 * @return {string}
 */
proto.rover.audience.v1.Device.prototype.getApsEnvironment = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 10, ""));
};


/** @param {string} value */
proto.rover.audience.v1.Device.prototype.setApsEnvironment = function(value) {
  jspb.Message.setField(this, 10, value);
};


/**
 * optional string device_token_key = 11;
 * @return {string}
 */
proto.rover.audience.v1.Device.prototype.getDeviceTokenKey = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 11, ""));
};


/** @param {string} value */
proto.rover.audience.v1.Device.prototype.setDeviceTokenKey = function(value) {
  jspb.Message.setField(this, 11, value);
};


/**
 * optional bool device_token_is_active = 12;
 * Note that Boolean fields may be set to 0/1 when serialized from a Java server.
 * You should avoid comparisons like {@code val === true/false} in those cases.
 * @return {boolean}
 */
proto.rover.audience.v1.Device.prototype.getDeviceTokenIsActive = function() {
  return /** @type {boolean} */ (jspb.Message.getFieldWithDefault(this, 12, false));
};


/** @param {boolean} value */
proto.rover.audience.v1.Device.prototype.setDeviceTokenIsActive = function(value) {
  jspb.Message.setField(this, 12, value);
};


/**
 * optional google.protobuf.Timestamp device_token_created_at = 13;
 * @return {?proto.google.protobuf.Timestamp}
 */
proto.rover.audience.v1.Device.prototype.getDeviceTokenCreatedAt = function() {
  return /** @type{?proto.google.protobuf.Timestamp} */ (
    jspb.Message.getWrapperField(this, google_protobuf_timestamp_pb.Timestamp, 13));
};


/** @param {?proto.google.protobuf.Timestamp|undefined} value */
proto.rover.audience.v1.Device.prototype.setDeviceTokenCreatedAt = function(value) {
  jspb.Message.setWrapperField(this, 13, value);
};


proto.rover.audience.v1.Device.prototype.clearDeviceTokenCreatedAt = function() {
  this.setDeviceTokenCreatedAt(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.Device.prototype.hasDeviceTokenCreatedAt = function() {
  return jspb.Message.getField(this, 13) != null;
};


/**
 * optional google.protobuf.Timestamp device_token_updated_at = 14;
 * @return {?proto.google.protobuf.Timestamp}
 */
proto.rover.audience.v1.Device.prototype.getDeviceTokenUpdatedAt = function() {
  return /** @type{?proto.google.protobuf.Timestamp} */ (
    jspb.Message.getWrapperField(this, google_protobuf_timestamp_pb.Timestamp, 14));
};


/** @param {?proto.google.protobuf.Timestamp|undefined} value */
proto.rover.audience.v1.Device.prototype.setDeviceTokenUpdatedAt = function(value) {
  jspb.Message.setWrapperField(this, 14, value);
};


proto.rover.audience.v1.Device.prototype.clearDeviceTokenUpdatedAt = function() {
  this.setDeviceTokenUpdatedAt(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.Device.prototype.hasDeviceTokenUpdatedAt = function() {
  return jspb.Message.getField(this, 14) != null;
};


/**
 * optional google.protobuf.Timestamp device_token_unregistered_at = 15;
 * @return {?proto.google.protobuf.Timestamp}
 */
proto.rover.audience.v1.Device.prototype.getDeviceTokenUnregisteredAt = function() {
  return /** @type{?proto.google.protobuf.Timestamp} */ (
    jspb.Message.getWrapperField(this, google_protobuf_timestamp_pb.Timestamp, 15));
};


/** @param {?proto.google.protobuf.Timestamp|undefined} value */
proto.rover.audience.v1.Device.prototype.setDeviceTokenUnregisteredAt = function(value) {
  jspb.Message.setWrapperField(this, 15, value);
};


proto.rover.audience.v1.Device.prototype.clearDeviceTokenUnregisteredAt = function() {
  this.setDeviceTokenUnregisteredAt(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.Device.prototype.hasDeviceTokenUnregisteredAt = function() {
  return jspb.Message.getField(this, 15) != null;
};


/**
 * optional string app_name = 16;
 * @return {string}
 */
proto.rover.audience.v1.Device.prototype.getAppName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 16, ""));
};


/** @param {string} value */
proto.rover.audience.v1.Device.prototype.setAppName = function(value) {
  jspb.Message.setField(this, 16, value);
};


/**
 * optional string app_version = 17;
 * @return {string}
 */
proto.rover.audience.v1.Device.prototype.getAppVersion = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 17, ""));
};


/** @param {string} value */
proto.rover.audience.v1.Device.prototype.setAppVersion = function(value) {
  jspb.Message.setField(this, 17, value);
};


/**
 * optional string app_build = 18;
 * @return {string}
 */
proto.rover.audience.v1.Device.prototype.getAppBuild = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 18, ""));
};


/** @param {string} value */
proto.rover.audience.v1.Device.prototype.setAppBuild = function(value) {
  jspb.Message.setField(this, 18, value);
};


/**
 * optional string app_namespace = 19;
 * @return {string}
 */
proto.rover.audience.v1.Device.prototype.getAppNamespace = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 19, ""));
};


/** @param {string} value */
proto.rover.audience.v1.Device.prototype.setAppNamespace = function(value) {
  jspb.Message.setField(this, 19, value);
};


/**
 * optional string device_manufacturer = 20;
 * @return {string}
 */
proto.rover.audience.v1.Device.prototype.getDeviceManufacturer = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 20, ""));
};


/** @param {string} value */
proto.rover.audience.v1.Device.prototype.setDeviceManufacturer = function(value) {
  jspb.Message.setField(this, 20, value);
};


/**
 * optional string device_model = 23;
 * @return {string}
 */
proto.rover.audience.v1.Device.prototype.getDeviceModel = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 23, ""));
};


/** @param {string} value */
proto.rover.audience.v1.Device.prototype.setDeviceModel = function(value) {
  jspb.Message.setField(this, 23, value);
};


/**
 * optional string os_name = 21;
 * @return {string}
 */
proto.rover.audience.v1.Device.prototype.getOsName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 21, ""));
};


/** @param {string} value */
proto.rover.audience.v1.Device.prototype.setOsName = function(value) {
  jspb.Message.setField(this, 21, value);
};


/**
 * optional Version os_version = 22;
 * @return {?proto.rover.audience.v1.Version}
 */
proto.rover.audience.v1.Device.prototype.getOsVersion = function() {
  return /** @type{?proto.rover.audience.v1.Version} */ (
    jspb.Message.getWrapperField(this, proto.rover.audience.v1.Version, 22));
};


/** @param {?proto.rover.audience.v1.Version|undefined} value */
proto.rover.audience.v1.Device.prototype.setOsVersion = function(value) {
  jspb.Message.setWrapperField(this, 22, value);
};


proto.rover.audience.v1.Device.prototype.clearOsVersion = function() {
  this.setOsVersion(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.Device.prototype.hasOsVersion = function() {
  return jspb.Message.getField(this, 22) != null;
};


/**
 * map<string, Version> frameworks = 24;
 * @param {boolean=} opt_noLazyCreate Do not create the map if
 * empty, instead returning `undefined`
 * @return {!jspb.Map<string,!proto.rover.audience.v1.Version>}
 */
proto.rover.audience.v1.Device.prototype.getFrameworksMap = function(opt_noLazyCreate) {
  return /** @type {!jspb.Map<string,!proto.rover.audience.v1.Version>} */ (
      jspb.Message.getMapField(this, 24, opt_noLazyCreate,
      proto.rover.audience.v1.Version));
};


proto.rover.audience.v1.Device.prototype.clearFrameworksMap = function() {
  this.getFrameworksMap().clear();
};


/**
 * optional string locale_language = 25;
 * @return {string}
 */
proto.rover.audience.v1.Device.prototype.getLocaleLanguage = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 25, ""));
};


/** @param {string} value */
proto.rover.audience.v1.Device.prototype.setLocaleLanguage = function(value) {
  jspb.Message.setField(this, 25, value);
};


/**
 * optional string locale_region = 26;
 * @return {string}
 */
proto.rover.audience.v1.Device.prototype.getLocaleRegion = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 26, ""));
};


/** @param {string} value */
proto.rover.audience.v1.Device.prototype.setLocaleRegion = function(value) {
  jspb.Message.setField(this, 26, value);
};


/**
 * optional string locale_script = 27;
 * @return {string}
 */
proto.rover.audience.v1.Device.prototype.getLocaleScript = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 27, ""));
};


/** @param {string} value */
proto.rover.audience.v1.Device.prototype.setLocaleScript = function(value) {
  jspb.Message.setField(this, 27, value);
};


/**
 * optional bool is_wifi_enabled = 28;
 * Note that Boolean fields may be set to 0/1 when serialized from a Java server.
 * You should avoid comparisons like {@code val === true/false} in those cases.
 * @return {boolean}
 */
proto.rover.audience.v1.Device.prototype.getIsWifiEnabled = function() {
  return /** @type {boolean} */ (jspb.Message.getFieldWithDefault(this, 28, false));
};


/** @param {boolean} value */
proto.rover.audience.v1.Device.prototype.setIsWifiEnabled = function(value) {
  jspb.Message.setField(this, 28, value);
};


/**
 * optional bool is_cellular_enabled = 29;
 * Note that Boolean fields may be set to 0/1 when serialized from a Java server.
 * You should avoid comparisons like {@code val === true/false} in those cases.
 * @return {boolean}
 */
proto.rover.audience.v1.Device.prototype.getIsCellularEnabled = function() {
  return /** @type {boolean} */ (jspb.Message.getFieldWithDefault(this, 29, false));
};


/** @param {boolean} value */
proto.rover.audience.v1.Device.prototype.setIsCellularEnabled = function(value) {
  jspb.Message.setField(this, 29, value);
};


/**
 * optional int32 screen_width = 30;
 * @return {number}
 */
proto.rover.audience.v1.Device.prototype.getScreenWidth = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 30, 0));
};


/** @param {number} value */
proto.rover.audience.v1.Device.prototype.setScreenWidth = function(value) {
  jspb.Message.setField(this, 30, value);
};


/**
 * optional int32 screen_height = 31;
 * @return {number}
 */
proto.rover.audience.v1.Device.prototype.getScreenHeight = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 31, 0));
};


/** @param {number} value */
proto.rover.audience.v1.Device.prototype.setScreenHeight = function(value) {
  jspb.Message.setField(this, 31, value);
};


/**
 * optional string carrier_name = 32;
 * @return {string}
 */
proto.rover.audience.v1.Device.prototype.getCarrierName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 32, ""));
};


/** @param {string} value */
proto.rover.audience.v1.Device.prototype.setCarrierName = function(value) {
  jspb.Message.setField(this, 32, value);
};


/**
 * optional string radio = 33;
 * @return {string}
 */
proto.rover.audience.v1.Device.prototype.getRadio = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 33, ""));
};


/** @param {string} value */
proto.rover.audience.v1.Device.prototype.setRadio = function(value) {
  jspb.Message.setField(this, 33, value);
};


/**
 * optional string time_zone = 34;
 * @return {string}
 */
proto.rover.audience.v1.Device.prototype.getTimeZone = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 34, ""));
};


/** @param {string} value */
proto.rover.audience.v1.Device.prototype.setTimeZone = function(value) {
  jspb.Message.setField(this, 34, value);
};


/**
 * optional Platform platform = 35;
 * @return {!proto.rover.audience.v1.Platform}
 */
proto.rover.audience.v1.Device.prototype.getPlatform = function() {
  return /** @type {!proto.rover.audience.v1.Platform} */ (jspb.Message.getFieldWithDefault(this, 35, 0));
};


/** @param {!proto.rover.audience.v1.Platform} value */
proto.rover.audience.v1.Device.prototype.setPlatform = function(value) {
  jspb.Message.setField(this, 35, value);
};


/**
 * optional bool is_background_enabled = 36;
 * Note that Boolean fields may be set to 0/1 when serialized from a Java server.
 * You should avoid comparisons like {@code val === true/false} in those cases.
 * @return {boolean}
 */
proto.rover.audience.v1.Device.prototype.getIsBackgroundEnabled = function() {
  return /** @type {boolean} */ (jspb.Message.getFieldWithDefault(this, 36, false));
};


/** @param {boolean} value */
proto.rover.audience.v1.Device.prototype.setIsBackgroundEnabled = function(value) {
  jspb.Message.setField(this, 36, value);
};


/**
 * optional bool is_location_monitoring_enabled = 37;
 * Note that Boolean fields may be set to 0/1 when serialized from a Java server.
 * You should avoid comparisons like {@code val === true/false} in those cases.
 * @return {boolean}
 */
proto.rover.audience.v1.Device.prototype.getIsLocationMonitoringEnabled = function() {
  return /** @type {boolean} */ (jspb.Message.getFieldWithDefault(this, 37, false));
};


/** @param {boolean} value */
proto.rover.audience.v1.Device.prototype.setIsLocationMonitoringEnabled = function(value) {
  jspb.Message.setField(this, 37, value);
};


/**
 * optional bool is_bluetooth_enabled = 38;
 * Note that Boolean fields may be set to 0/1 when serialized from a Java server.
 * You should avoid comparisons like {@code val === true/false} in those cases.
 * @return {boolean}
 */
proto.rover.audience.v1.Device.prototype.getIsBluetoothEnabled = function() {
  return /** @type {boolean} */ (jspb.Message.getFieldWithDefault(this, 38, false));
};


/** @param {boolean} value */
proto.rover.audience.v1.Device.prototype.setIsBluetoothEnabled = function(value) {
  jspb.Message.setField(this, 38, value);
};


/**
 * optional string advertising_id = 39;
 * @return {string}
 */
proto.rover.audience.v1.Device.prototype.getAdvertisingId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 39, ""));
};


/** @param {string} value */
proto.rover.audience.v1.Device.prototype.setAdvertisingId = function(value) {
  jspb.Message.setField(this, 39, value);
};


/**
 * optional string ip = 40;
 * @return {string}
 */
proto.rover.audience.v1.Device.prototype.getIp = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 40, ""));
};


/** @param {string} value */
proto.rover.audience.v1.Device.prototype.setIp = function(value) {
  jspb.Message.setField(this, 40, value);
};


/**
 * optional int32 location_accuracy = 41;
 * @return {number}
 */
proto.rover.audience.v1.Device.prototype.getLocationAccuracy = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 41, 0));
};


/** @param {number} value */
proto.rover.audience.v1.Device.prototype.setLocationAccuracy = function(value) {
  jspb.Message.setField(this, 41, value);
};


/**
 * optional double location_latitude = 42;
 * @return {number}
 */
proto.rover.audience.v1.Device.prototype.getLocationLatitude = function() {
  return /** @type {number} */ (+jspb.Message.getFieldWithDefault(this, 42, 0.0));
};


/** @param {number} value */
proto.rover.audience.v1.Device.prototype.setLocationLatitude = function(value) {
  jspb.Message.setField(this, 42, value);
};


/**
 * optional double location_longitude = 43;
 * @return {number}
 */
proto.rover.audience.v1.Device.prototype.getLocationLongitude = function() {
  return /** @type {number} */ (+jspb.Message.getFieldWithDefault(this, 43, 0.0));
};


/** @param {number} value */
proto.rover.audience.v1.Device.prototype.setLocationLongitude = function(value) {
  jspb.Message.setField(this, 43, value);
};


/**
 * optional string location_region = 44;
 * @return {string}
 */
proto.rover.audience.v1.Device.prototype.getLocationRegion = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 44, ""));
};


/** @param {string} value */
proto.rover.audience.v1.Device.prototype.setLocationRegion = function(value) {
  jspb.Message.setField(this, 44, value);
};


/**
 * optional string location_city = 45;
 * @return {string}
 */
proto.rover.audience.v1.Device.prototype.getLocationCity = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 45, ""));
};


/** @param {string} value */
proto.rover.audience.v1.Device.prototype.setLocationCity = function(value) {
  jspb.Message.setField(this, 45, value);
};


/**
 * optional string location_street = 46;
 * @return {string}
 */
proto.rover.audience.v1.Device.prototype.getLocationStreet = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 46, ""));
};


/** @param {string} value */
proto.rover.audience.v1.Device.prototype.setLocationStreet = function(value) {
  jspb.Message.setField(this, 46, value);
};


/**
 * optional RegionMonitoringMode region_monitoring_mode = 47;
 * @return {!proto.rover.audience.v1.Device.RegionMonitoringMode}
 */
proto.rover.audience.v1.Device.prototype.getRegionMonitoringMode = function() {
  return /** @type {!proto.rover.audience.v1.Device.RegionMonitoringMode} */ (jspb.Message.getFieldWithDefault(this, 47, 0));
};


/** @param {!proto.rover.audience.v1.Device.RegionMonitoringMode} value */
proto.rover.audience.v1.Device.prototype.setRegionMonitoringMode = function(value) {
  jspb.Message.setField(this, 47, value);
};


/**
 * optional google.protobuf.Timestamp ibeacon_monitoring_regions_updated_at = 48;
 * @return {?proto.google.protobuf.Timestamp}
 */
proto.rover.audience.v1.Device.prototype.getIbeaconMonitoringRegionsUpdatedAt = function() {
  return /** @type{?proto.google.protobuf.Timestamp} */ (
    jspb.Message.getWrapperField(this, google_protobuf_timestamp_pb.Timestamp, 48));
};


/** @param {?proto.google.protobuf.Timestamp|undefined} value */
proto.rover.audience.v1.Device.prototype.setIbeaconMonitoringRegionsUpdatedAt = function(value) {
  jspb.Message.setWrapperField(this, 48, value);
};


proto.rover.audience.v1.Device.prototype.clearIbeaconMonitoringRegionsUpdatedAt = function() {
  this.setIbeaconMonitoringRegionsUpdatedAt(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.Device.prototype.hasIbeaconMonitoringRegionsUpdatedAt = function() {
  return jspb.Message.getField(this, 48) != null;
};


/**
 * repeated IBeaconRegion ibeacon_monitoring_regions = 49;
 * If you change this array by adding, removing or replacing elements, or if you
 * replace the array itself, then you must call the setter to update it.
 * @return {!Array.<!proto.rover.audience.v1.IBeaconRegion>}
 */
proto.rover.audience.v1.Device.prototype.getIbeaconMonitoringRegionsList = function() {
  return /** @type{!Array.<!proto.rover.audience.v1.IBeaconRegion>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.rover.audience.v1.IBeaconRegion, 49));
};


/** @param {!Array.<!proto.rover.audience.v1.IBeaconRegion>} value */
proto.rover.audience.v1.Device.prototype.setIbeaconMonitoringRegionsList = function(value) {
  jspb.Message.setRepeatedWrapperField(this, 49, value);
};


/**
 * @param {!proto.rover.audience.v1.IBeaconRegion=} opt_value
 * @param {number=} opt_index
 * @return {!proto.rover.audience.v1.IBeaconRegion}
 */
proto.rover.audience.v1.Device.prototype.addIbeaconMonitoringRegions = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 49, opt_value, proto.rover.audience.v1.IBeaconRegion, opt_index);
};


proto.rover.audience.v1.Device.prototype.clearIbeaconMonitoringRegionsList = function() {
  this.setIbeaconMonitoringRegionsList([]);
};


/**
 * optional google.protobuf.Timestamp geofence_monitoring_regions_updated_at = 50;
 * @return {?proto.google.protobuf.Timestamp}
 */
proto.rover.audience.v1.Device.prototype.getGeofenceMonitoringRegionsUpdatedAt = function() {
  return /** @type{?proto.google.protobuf.Timestamp} */ (
    jspb.Message.getWrapperField(this, google_protobuf_timestamp_pb.Timestamp, 50));
};


/** @param {?proto.google.protobuf.Timestamp|undefined} value */
proto.rover.audience.v1.Device.prototype.setGeofenceMonitoringRegionsUpdatedAt = function(value) {
  jspb.Message.setWrapperField(this, 50, value);
};


proto.rover.audience.v1.Device.prototype.clearGeofenceMonitoringRegionsUpdatedAt = function() {
  this.setGeofenceMonitoringRegionsUpdatedAt(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.Device.prototype.hasGeofenceMonitoringRegionsUpdatedAt = function() {
  return jspb.Message.getField(this, 50) != null;
};


/**
 * repeated GeofenceRegion geofence_monitoring_regions = 51;
 * If you change this array by adding, removing or replacing elements, or if you
 * replace the array itself, then you must call the setter to update it.
 * @return {!Array.<!proto.rover.audience.v1.GeofenceRegion>}
 */
proto.rover.audience.v1.Device.prototype.getGeofenceMonitoringRegionsList = function() {
  return /** @type{!Array.<!proto.rover.audience.v1.GeofenceRegion>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.rover.audience.v1.GeofenceRegion, 51));
};


/** @param {!Array.<!proto.rover.audience.v1.GeofenceRegion>} value */
proto.rover.audience.v1.Device.prototype.setGeofenceMonitoringRegionsList = function(value) {
  jspb.Message.setRepeatedWrapperField(this, 51, value);
};


/**
 * @param {!proto.rover.audience.v1.GeofenceRegion=} opt_value
 * @param {number=} opt_index
 * @return {!proto.rover.audience.v1.GeofenceRegion}
 */
proto.rover.audience.v1.Device.prototype.addGeofenceMonitoringRegions = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 51, opt_value, proto.rover.audience.v1.GeofenceRegion, opt_index);
};


proto.rover.audience.v1.Device.prototype.clearGeofenceMonitoringRegionsList = function() {
  this.setGeofenceMonitoringRegionsList([]);
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
proto.rover.audience.v1.IBeaconRegion = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.rover.audience.v1.IBeaconRegion, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.IBeaconRegion.displayName = 'proto.rover.audience.v1.IBeaconRegion';
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
proto.rover.audience.v1.IBeaconRegion.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.IBeaconRegion.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.IBeaconRegion} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.IBeaconRegion.toObject = function(includeInstance, msg) {
  var f, obj = {
    uuid: jspb.Message.getFieldWithDefault(msg, 1, ""),
    major: jspb.Message.getFieldWithDefault(msg, 2, 0),
    minor: jspb.Message.getFieldWithDefault(msg, 3, 0)
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
 * @return {!proto.rover.audience.v1.IBeaconRegion}
 */
proto.rover.audience.v1.IBeaconRegion.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.IBeaconRegion;
  return proto.rover.audience.v1.IBeaconRegion.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.IBeaconRegion} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.IBeaconRegion}
 */
proto.rover.audience.v1.IBeaconRegion.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setUuid(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setMajor(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setMinor(value);
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
proto.rover.audience.v1.IBeaconRegion.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.IBeaconRegion.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.IBeaconRegion} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.IBeaconRegion.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getUuid();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getMajor();
  if (f !== 0) {
    writer.writeInt32(
      2,
      f
    );
  }
  f = message.getMinor();
  if (f !== 0) {
    writer.writeInt32(
      3,
      f
    );
  }
};


/**
 * optional string uuid = 1;
 * @return {string}
 */
proto.rover.audience.v1.IBeaconRegion.prototype.getUuid = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/** @param {string} value */
proto.rover.audience.v1.IBeaconRegion.prototype.setUuid = function(value) {
  jspb.Message.setField(this, 1, value);
};


/**
 * optional int32 major = 2;
 * @return {number}
 */
proto.rover.audience.v1.IBeaconRegion.prototype.getMajor = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/** @param {number} value */
proto.rover.audience.v1.IBeaconRegion.prototype.setMajor = function(value) {
  jspb.Message.setField(this, 2, value);
};


/**
 * optional int32 minor = 3;
 * @return {number}
 */
proto.rover.audience.v1.IBeaconRegion.prototype.getMinor = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/** @param {number} value */
proto.rover.audience.v1.IBeaconRegion.prototype.setMinor = function(value) {
  jspb.Message.setField(this, 3, value);
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
proto.rover.audience.v1.GeofenceRegion = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.rover.audience.v1.GeofenceRegion, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.GeofenceRegion.displayName = 'proto.rover.audience.v1.GeofenceRegion';
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
proto.rover.audience.v1.GeofenceRegion.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.GeofenceRegion.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.GeofenceRegion} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.GeofenceRegion.toObject = function(includeInstance, msg) {
  var f, obj = {
    id: jspb.Message.getFieldWithDefault(msg, 1, ""),
    latitude: +jspb.Message.getFieldWithDefault(msg, 2, 0.0),
    longitude: +jspb.Message.getFieldWithDefault(msg, 3, 0.0),
    radius: jspb.Message.getFieldWithDefault(msg, 4, 0)
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
 * @return {!proto.rover.audience.v1.GeofenceRegion}
 */
proto.rover.audience.v1.GeofenceRegion.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.GeofenceRegion;
  return proto.rover.audience.v1.GeofenceRegion.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.GeofenceRegion} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.GeofenceRegion}
 */
proto.rover.audience.v1.GeofenceRegion.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setId(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readDouble());
      msg.setLatitude(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readDouble());
      msg.setLongitude(value);
      break;
    case 4:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setRadius(value);
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
proto.rover.audience.v1.GeofenceRegion.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.GeofenceRegion.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.GeofenceRegion} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.GeofenceRegion.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getId();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getLatitude();
  if (f !== 0.0) {
    writer.writeDouble(
      2,
      f
    );
  }
  f = message.getLongitude();
  if (f !== 0.0) {
    writer.writeDouble(
      3,
      f
    );
  }
  f = message.getRadius();
  if (f !== 0) {
    writer.writeInt32(
      4,
      f
    );
  }
};


/**
 * optional string id = 1;
 * @return {string}
 */
proto.rover.audience.v1.GeofenceRegion.prototype.getId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/** @param {string} value */
proto.rover.audience.v1.GeofenceRegion.prototype.setId = function(value) {
  jspb.Message.setField(this, 1, value);
};


/**
 * optional double latitude = 2;
 * @return {number}
 */
proto.rover.audience.v1.GeofenceRegion.prototype.getLatitude = function() {
  return /** @type {number} */ (+jspb.Message.getFieldWithDefault(this, 2, 0.0));
};


/** @param {number} value */
proto.rover.audience.v1.GeofenceRegion.prototype.setLatitude = function(value) {
  jspb.Message.setField(this, 2, value);
};


/**
 * optional double longitude = 3;
 * @return {number}
 */
proto.rover.audience.v1.GeofenceRegion.prototype.getLongitude = function() {
  return /** @type {number} */ (+jspb.Message.getFieldWithDefault(this, 3, 0.0));
};


/** @param {number} value */
proto.rover.audience.v1.GeofenceRegion.prototype.setLongitude = function(value) {
  jspb.Message.setField(this, 3, value);
};


/**
 * optional int32 radius = 4;
 * @return {number}
 */
proto.rover.audience.v1.GeofenceRegion.prototype.getRadius = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 4, 0));
};


/** @param {number} value */
proto.rover.audience.v1.GeofenceRegion.prototype.setRadius = function(value) {
  jspb.Message.setField(this, 4, value);
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
proto.rover.audience.v1.ValueUpdates = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.rover.audience.v1.ValueUpdates.repeatedFields_, null);
};
goog.inherits(proto.rover.audience.v1.ValueUpdates, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.ValueUpdates.displayName = 'proto.rover.audience.v1.ValueUpdates';
}
/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.rover.audience.v1.ValueUpdates.repeatedFields_ = [1];



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
proto.rover.audience.v1.ValueUpdates.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.ValueUpdates.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.ValueUpdates} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.ValueUpdates.toObject = function(includeInstance, msg) {
  var f, obj = {
    valuesList: jspb.Message.toObjectList(msg.getValuesList(),
    proto.rover.audience.v1.ValueUpdate.toObject, includeInstance)
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
 * @return {!proto.rover.audience.v1.ValueUpdates}
 */
proto.rover.audience.v1.ValueUpdates.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.ValueUpdates;
  return proto.rover.audience.v1.ValueUpdates.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.ValueUpdates} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.ValueUpdates}
 */
proto.rover.audience.v1.ValueUpdates.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.rover.audience.v1.ValueUpdate;
      reader.readMessage(value,proto.rover.audience.v1.ValueUpdate.deserializeBinaryFromReader);
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
proto.rover.audience.v1.ValueUpdates.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.ValueUpdates.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.ValueUpdates} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.ValueUpdates.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getValuesList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      proto.rover.audience.v1.ValueUpdate.serializeBinaryToWriter
    );
  }
};


/**
 * repeated ValueUpdate values = 1;
 * If you change this array by adding, removing or replacing elements, or if you
 * replace the array itself, then you must call the setter to update it.
 * @return {!Array.<!proto.rover.audience.v1.ValueUpdate>}
 */
proto.rover.audience.v1.ValueUpdates.prototype.getValuesList = function() {
  return /** @type{!Array.<!proto.rover.audience.v1.ValueUpdate>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.rover.audience.v1.ValueUpdate, 1));
};


/** @param {!Array.<!proto.rover.audience.v1.ValueUpdate>} value */
proto.rover.audience.v1.ValueUpdates.prototype.setValuesList = function(value) {
  jspb.Message.setRepeatedWrapperField(this, 1, value);
};


/**
 * @param {!proto.rover.audience.v1.ValueUpdate=} opt_value
 * @param {number=} opt_index
 * @return {!proto.rover.audience.v1.ValueUpdate}
 */
proto.rover.audience.v1.ValueUpdates.prototype.addValues = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.rover.audience.v1.ValueUpdate, opt_index);
};


proto.rover.audience.v1.ValueUpdates.prototype.clearValuesList = function() {
  this.setValuesList([]);
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
proto.rover.audience.v1.ValueUpdate = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.rover.audience.v1.ValueUpdate, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.ValueUpdate.displayName = 'proto.rover.audience.v1.ValueUpdate';
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
proto.rover.audience.v1.ValueUpdate.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.ValueUpdate.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.ValueUpdate} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.ValueUpdate.toObject = function(includeInstance, msg) {
  var f, obj = {
    updateType: jspb.Message.getFieldWithDefault(msg, 1, 0),
    value: (f = msg.getValue()) && proto.rover.audience.v1.Value.toObject(includeInstance, f)
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
 * @return {!proto.rover.audience.v1.ValueUpdate}
 */
proto.rover.audience.v1.ValueUpdate.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.ValueUpdate;
  return proto.rover.audience.v1.ValueUpdate.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.ValueUpdate} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.ValueUpdate}
 */
proto.rover.audience.v1.ValueUpdate.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!proto.rover.audience.v1.ValueUpdate.UpdateType} */ (reader.readEnum());
      msg.setUpdateType(value);
      break;
    case 2:
      var value = new proto.rover.audience.v1.Value;
      reader.readMessage(value,proto.rover.audience.v1.Value.deserializeBinaryFromReader);
      msg.setValue(value);
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
proto.rover.audience.v1.ValueUpdate.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.ValueUpdate.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.ValueUpdate} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.ValueUpdate.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getUpdateType();
  if (f !== 0.0) {
    writer.writeEnum(
      1,
      f
    );
  }
  f = message.getValue();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      proto.rover.audience.v1.Value.serializeBinaryToWriter
    );
  }
};


/**
 * @enum {number}
 */
proto.rover.audience.v1.ValueUpdate.UpdateType = {
  SET: 0,
  ADD: 3,
  REMOVE: 4
};

/**
 * optional UpdateType update_type = 1;
 * @return {!proto.rover.audience.v1.ValueUpdate.UpdateType}
 */
proto.rover.audience.v1.ValueUpdate.prototype.getUpdateType = function() {
  return /** @type {!proto.rover.audience.v1.ValueUpdate.UpdateType} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/** @param {!proto.rover.audience.v1.ValueUpdate.UpdateType} value */
proto.rover.audience.v1.ValueUpdate.prototype.setUpdateType = function(value) {
  jspb.Message.setField(this, 1, value);
};


/**
 * optional Value value = 2;
 * @return {?proto.rover.audience.v1.Value}
 */
proto.rover.audience.v1.ValueUpdate.prototype.getValue = function() {
  return /** @type{?proto.rover.audience.v1.Value} */ (
    jspb.Message.getWrapperField(this, proto.rover.audience.v1.Value, 2));
};


/** @param {?proto.rover.audience.v1.Value|undefined} value */
proto.rover.audience.v1.ValueUpdate.prototype.setValue = function(value) {
  jspb.Message.setWrapperField(this, 2, value);
};


proto.rover.audience.v1.ValueUpdate.prototype.clearValue = function() {
  this.setValue(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.ValueUpdate.prototype.hasValue = function() {
  return jspb.Message.getField(this, 2) != null;
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
proto.rover.audience.v1.Value = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, proto.rover.audience.v1.Value.oneofGroups_);
};
goog.inherits(proto.rover.audience.v1.Value, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.Value.displayName = 'proto.rover.audience.v1.Value';
}
/**
 * Oneof group definitions for this message. Each group defines the field
 * numbers belonging to that group. When of these fields' value is set, all
 * other fields in the group are cleared. During deserialization, if multiple
 * fields are encountered for a group, only the last value seen will be kept.
 * @private {!Array<!Array<number>>}
 * @const
 */
proto.rover.audience.v1.Value.oneofGroups_ = [[1,2,3,4,5,7,8]];

/**
 * @enum {number}
 */
proto.rover.audience.v1.Value.ValueTypeCase = {
  VALUE_TYPE_NOT_SET: 0,
  BOOLEAN_VALUE: 1,
  INTEGER_VALUE: 2,
  DOUBLE_VALUE: 3,
  STRING_VALUE: 4,
  STRING_ARRAY_VALUE: 5,
  NULL_VALUE: 7,
  TIMESTAMP_VALUE: 8
};

/**
 * @return {proto.rover.audience.v1.Value.ValueTypeCase}
 */
proto.rover.audience.v1.Value.prototype.getValueTypeCase = function() {
  return /** @type {proto.rover.audience.v1.Value.ValueTypeCase} */(jspb.Message.computeOneofCase(this, proto.rover.audience.v1.Value.oneofGroups_[0]));
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
proto.rover.audience.v1.Value.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.Value.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.Value} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.Value.toObject = function(includeInstance, msg) {
  var f, obj = {
    booleanValue: jspb.Message.getFieldWithDefault(msg, 1, false),
    integerValue: jspb.Message.getFieldWithDefault(msg, 2, 0),
    doubleValue: +jspb.Message.getFieldWithDefault(msg, 3, 0.0),
    stringValue: jspb.Message.getFieldWithDefault(msg, 4, ""),
    stringArrayValue: (f = msg.getStringArrayValue()) && proto.rover.audience.v1.Value.StringArray.toObject(includeInstance, f),
    nullValue: jspb.Message.getFieldWithDefault(msg, 7, 0),
    timestampValue: (f = msg.getTimestampValue()) && google_protobuf_timestamp_pb.Timestamp.toObject(includeInstance, f)
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
 * @return {!proto.rover.audience.v1.Value}
 */
proto.rover.audience.v1.Value.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.Value;
  return proto.rover.audience.v1.Value.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.Value} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.Value}
 */
proto.rover.audience.v1.Value.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setBooleanValue(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setIntegerValue(value);
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
      var value = new proto.rover.audience.v1.Value.StringArray;
      reader.readMessage(value,proto.rover.audience.v1.Value.StringArray.deserializeBinaryFromReader);
      msg.setStringArrayValue(value);
      break;
    case 7:
      var value = /** @type {!proto.rover.audience.v1.Null} */ (reader.readEnum());
      msg.setNullValue(value);
      break;
    case 8:
      var value = new google_protobuf_timestamp_pb.Timestamp;
      reader.readMessage(value,google_protobuf_timestamp_pb.Timestamp.deserializeBinaryFromReader);
      msg.setTimestampValue(value);
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
proto.rover.audience.v1.Value.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.Value.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.Value} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.Value.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = /** @type {boolean} */ (jspb.Message.getField(message, 1));
  if (f != null) {
    writer.writeBool(
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
  f = message.getStringArrayValue();
  if (f != null) {
    writer.writeMessage(
      5,
      f,
      proto.rover.audience.v1.Value.StringArray.serializeBinaryToWriter
    );
  }
  f = /** @type {!proto.rover.audience.v1.Null} */ (jspb.Message.getField(message, 7));
  if (f != null) {
    writer.writeEnum(
      7,
      f
    );
  }
  f = message.getTimestampValue();
  if (f != null) {
    writer.writeMessage(
      8,
      f,
      google_protobuf_timestamp_pb.Timestamp.serializeBinaryToWriter
    );
  }
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
proto.rover.audience.v1.Value.StringArray = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.rover.audience.v1.Value.StringArray.repeatedFields_, null);
};
goog.inherits(proto.rover.audience.v1.Value.StringArray, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.Value.StringArray.displayName = 'proto.rover.audience.v1.Value.StringArray';
}
/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.rover.audience.v1.Value.StringArray.repeatedFields_ = [1];



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
proto.rover.audience.v1.Value.StringArray.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.Value.StringArray.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.Value.StringArray} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.Value.StringArray.toObject = function(includeInstance, msg) {
  var f, obj = {
    valuesList: jspb.Message.getField(msg, 1)
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
 * @return {!proto.rover.audience.v1.Value.StringArray}
 */
proto.rover.audience.v1.Value.StringArray.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.Value.StringArray;
  return proto.rover.audience.v1.Value.StringArray.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.Value.StringArray} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.Value.StringArray}
 */
proto.rover.audience.v1.Value.StringArray.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
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
proto.rover.audience.v1.Value.StringArray.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.Value.StringArray.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.Value.StringArray} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.Value.StringArray.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getValuesList();
  if (f.length > 0) {
    writer.writeRepeatedString(
      1,
      f
    );
  }
};


/**
 * repeated string values = 1;
 * If you change this array by adding, removing or replacing elements, or if you
 * replace the array itself, then you must call the setter to update it.
 * @return {!Array.<string>}
 */
proto.rover.audience.v1.Value.StringArray.prototype.getValuesList = function() {
  return /** @type {!Array.<string>} */ (jspb.Message.getField(this, 1));
};


/** @param {!Array.<string>} value */
proto.rover.audience.v1.Value.StringArray.prototype.setValuesList = function(value) {
  jspb.Message.setField(this, 1, value || []);
};


/**
 * @param {!string} value
 * @param {number=} opt_index
 */
proto.rover.audience.v1.Value.StringArray.prototype.addValues = function(value, opt_index) {
  jspb.Message.addToRepeatedField(this, 1, value, opt_index);
};


proto.rover.audience.v1.Value.StringArray.prototype.clearValuesList = function() {
  this.setValuesList([]);
};


/**
 * optional bool boolean_value = 1;
 * Note that Boolean fields may be set to 0/1 when serialized from a Java server.
 * You should avoid comparisons like {@code val === true/false} in those cases.
 * @return {boolean}
 */
proto.rover.audience.v1.Value.prototype.getBooleanValue = function() {
  return /** @type {boolean} */ (jspb.Message.getFieldWithDefault(this, 1, false));
};


/** @param {boolean} value */
proto.rover.audience.v1.Value.prototype.setBooleanValue = function(value) {
  jspb.Message.setOneofField(this, 1, proto.rover.audience.v1.Value.oneofGroups_[0], value);
};


proto.rover.audience.v1.Value.prototype.clearBooleanValue = function() {
  jspb.Message.setOneofField(this, 1, proto.rover.audience.v1.Value.oneofGroups_[0], undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.Value.prototype.hasBooleanValue = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional int64 integer_value = 2;
 * @return {number}
 */
proto.rover.audience.v1.Value.prototype.getIntegerValue = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/** @param {number} value */
proto.rover.audience.v1.Value.prototype.setIntegerValue = function(value) {
  jspb.Message.setOneofField(this, 2, proto.rover.audience.v1.Value.oneofGroups_[0], value);
};


proto.rover.audience.v1.Value.prototype.clearIntegerValue = function() {
  jspb.Message.setOneofField(this, 2, proto.rover.audience.v1.Value.oneofGroups_[0], undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.Value.prototype.hasIntegerValue = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional double double_value = 3;
 * @return {number}
 */
proto.rover.audience.v1.Value.prototype.getDoubleValue = function() {
  return /** @type {number} */ (+jspb.Message.getFieldWithDefault(this, 3, 0.0));
};


/** @param {number} value */
proto.rover.audience.v1.Value.prototype.setDoubleValue = function(value) {
  jspb.Message.setOneofField(this, 3, proto.rover.audience.v1.Value.oneofGroups_[0], value);
};


proto.rover.audience.v1.Value.prototype.clearDoubleValue = function() {
  jspb.Message.setOneofField(this, 3, proto.rover.audience.v1.Value.oneofGroups_[0], undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.Value.prototype.hasDoubleValue = function() {
  return jspb.Message.getField(this, 3) != null;
};


/**
 * optional string string_value = 4;
 * @return {string}
 */
proto.rover.audience.v1.Value.prototype.getStringValue = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/** @param {string} value */
proto.rover.audience.v1.Value.prototype.setStringValue = function(value) {
  jspb.Message.setOneofField(this, 4, proto.rover.audience.v1.Value.oneofGroups_[0], value);
};


proto.rover.audience.v1.Value.prototype.clearStringValue = function() {
  jspb.Message.setOneofField(this, 4, proto.rover.audience.v1.Value.oneofGroups_[0], undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.Value.prototype.hasStringValue = function() {
  return jspb.Message.getField(this, 4) != null;
};


/**
 * optional StringArray string_array_value = 5;
 * @return {?proto.rover.audience.v1.Value.StringArray}
 */
proto.rover.audience.v1.Value.prototype.getStringArrayValue = function() {
  return /** @type{?proto.rover.audience.v1.Value.StringArray} */ (
    jspb.Message.getWrapperField(this, proto.rover.audience.v1.Value.StringArray, 5));
};


/** @param {?proto.rover.audience.v1.Value.StringArray|undefined} value */
proto.rover.audience.v1.Value.prototype.setStringArrayValue = function(value) {
  jspb.Message.setOneofWrapperField(this, 5, proto.rover.audience.v1.Value.oneofGroups_[0], value);
};


proto.rover.audience.v1.Value.prototype.clearStringArrayValue = function() {
  this.setStringArrayValue(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.Value.prototype.hasStringArrayValue = function() {
  return jspb.Message.getField(this, 5) != null;
};


/**
 * optional Null null_value = 7;
 * @return {!proto.rover.audience.v1.Null}
 */
proto.rover.audience.v1.Value.prototype.getNullValue = function() {
  return /** @type {!proto.rover.audience.v1.Null} */ (jspb.Message.getFieldWithDefault(this, 7, 0));
};


/** @param {!proto.rover.audience.v1.Null} value */
proto.rover.audience.v1.Value.prototype.setNullValue = function(value) {
  jspb.Message.setOneofField(this, 7, proto.rover.audience.v1.Value.oneofGroups_[0], value);
};


proto.rover.audience.v1.Value.prototype.clearNullValue = function() {
  jspb.Message.setOneofField(this, 7, proto.rover.audience.v1.Value.oneofGroups_[0], undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.Value.prototype.hasNullValue = function() {
  return jspb.Message.getField(this, 7) != null;
};


/**
 * optional google.protobuf.Timestamp timestamp_value = 8;
 * @return {?proto.google.protobuf.Timestamp}
 */
proto.rover.audience.v1.Value.prototype.getTimestampValue = function() {
  return /** @type{?proto.google.protobuf.Timestamp} */ (
    jspb.Message.getWrapperField(this, google_protobuf_timestamp_pb.Timestamp, 8));
};


/** @param {?proto.google.protobuf.Timestamp|undefined} value */
proto.rover.audience.v1.Value.prototype.setTimestampValue = function(value) {
  jspb.Message.setOneofWrapperField(this, 8, proto.rover.audience.v1.Value.oneofGroups_[0], value);
};


proto.rover.audience.v1.Value.prototype.clearTimestampValue = function() {
  this.setTimestampValue(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.Value.prototype.hasTimestampValue = function() {
  return jspb.Message.getField(this, 8) != null;
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
proto.rover.audience.v1.SchemaAttribute = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.rover.audience.v1.SchemaAttribute, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.SchemaAttribute.displayName = 'proto.rover.audience.v1.SchemaAttribute';
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
proto.rover.audience.v1.SchemaAttribute.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.SchemaAttribute.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.SchemaAttribute} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.SchemaAttribute.toObject = function(includeInstance, msg) {
  var f, obj = {
    accountId: jspb.Message.getFieldWithDefault(msg, 1, 0),
    id: jspb.Message.getFieldWithDefault(msg, 2, ""),
    attribute: jspb.Message.getFieldWithDefault(msg, 3, ""),
    attributeType: jspb.Message.getFieldWithDefault(msg, 4, ""),
    path: jspb.Message.getFieldWithDefault(msg, 5, ""),
    createdAt: (f = msg.getCreatedAt()) && google_protobuf_timestamp_pb.Timestamp.toObject(includeInstance, f)
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
 * @return {!proto.rover.audience.v1.SchemaAttribute}
 */
proto.rover.audience.v1.SchemaAttribute.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.SchemaAttribute;
  return proto.rover.audience.v1.SchemaAttribute.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.SchemaAttribute} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.SchemaAttribute}
 */
proto.rover.audience.v1.SchemaAttribute.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setAccountId(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setId(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setAttribute(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setAttributeType(value);
      break;
    case 5:
      var value = /** @type {string} */ (reader.readString());
      msg.setPath(value);
      break;
    case 10:
      var value = new google_protobuf_timestamp_pb.Timestamp;
      reader.readMessage(value,google_protobuf_timestamp_pb.Timestamp.deserializeBinaryFromReader);
      msg.setCreatedAt(value);
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
proto.rover.audience.v1.SchemaAttribute.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.SchemaAttribute.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.SchemaAttribute} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.SchemaAttribute.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getAccountId();
  if (f !== 0) {
    writer.writeInt32(
      1,
      f
    );
  }
  f = message.getId();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getAttribute();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getAttributeType();
  if (f.length > 0) {
    writer.writeString(
      4,
      f
    );
  }
  f = message.getPath();
  if (f.length > 0) {
    writer.writeString(
      5,
      f
    );
  }
  f = message.getCreatedAt();
  if (f != null) {
    writer.writeMessage(
      10,
      f,
      google_protobuf_timestamp_pb.Timestamp.serializeBinaryToWriter
    );
  }
};


/**
 * optional int32 account_id = 1;
 * @return {number}
 */
proto.rover.audience.v1.SchemaAttribute.prototype.getAccountId = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/** @param {number} value */
proto.rover.audience.v1.SchemaAttribute.prototype.setAccountId = function(value) {
  jspb.Message.setField(this, 1, value);
};


/**
 * optional string id = 2;
 * @return {string}
 */
proto.rover.audience.v1.SchemaAttribute.prototype.getId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/** @param {string} value */
proto.rover.audience.v1.SchemaAttribute.prototype.setId = function(value) {
  jspb.Message.setField(this, 2, value);
};


/**
 * optional string attribute = 3;
 * @return {string}
 */
proto.rover.audience.v1.SchemaAttribute.prototype.getAttribute = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/** @param {string} value */
proto.rover.audience.v1.SchemaAttribute.prototype.setAttribute = function(value) {
  jspb.Message.setField(this, 3, value);
};


/**
 * optional string attribute_type = 4;
 * @return {string}
 */
proto.rover.audience.v1.SchemaAttribute.prototype.getAttributeType = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/** @param {string} value */
proto.rover.audience.v1.SchemaAttribute.prototype.setAttributeType = function(value) {
  jspb.Message.setField(this, 4, value);
};


/**
 * optional string path = 5;
 * @return {string}
 */
proto.rover.audience.v1.SchemaAttribute.prototype.getPath = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 5, ""));
};


/** @param {string} value */
proto.rover.audience.v1.SchemaAttribute.prototype.setPath = function(value) {
  jspb.Message.setField(this, 5, value);
};


/**
 * optional google.protobuf.Timestamp created_at = 10;
 * @return {?proto.google.protobuf.Timestamp}
 */
proto.rover.audience.v1.SchemaAttribute.prototype.getCreatedAt = function() {
  return /** @type{?proto.google.protobuf.Timestamp} */ (
    jspb.Message.getWrapperField(this, google_protobuf_timestamp_pb.Timestamp, 10));
};


/** @param {?proto.google.protobuf.Timestamp|undefined} value */
proto.rover.audience.v1.SchemaAttribute.prototype.setCreatedAt = function(value) {
  jspb.Message.setWrapperField(this, 10, value);
};


proto.rover.audience.v1.SchemaAttribute.prototype.clearCreatedAt = function() {
  this.setCreatedAt(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.SchemaAttribute.prototype.hasCreatedAt = function() {
  return jspb.Message.getField(this, 10) != null;
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
proto.rover.audience.v1.Version = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.rover.audience.v1.Version, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.Version.displayName = 'proto.rover.audience.v1.Version';
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
proto.rover.audience.v1.Version.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.Version.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.Version} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.Version.toObject = function(includeInstance, msg) {
  var f, obj = {
    major: jspb.Message.getFieldWithDefault(msg, 1, 0),
    minor: jspb.Message.getFieldWithDefault(msg, 2, 0),
    revision: jspb.Message.getFieldWithDefault(msg, 3, 0)
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
 * @return {!proto.rover.audience.v1.Version}
 */
proto.rover.audience.v1.Version.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.Version;
  return proto.rover.audience.v1.Version.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.Version} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.Version}
 */
proto.rover.audience.v1.Version.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setMajor(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setMinor(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setRevision(value);
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
proto.rover.audience.v1.Version.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.Version.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.Version} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.Version.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getMajor();
  if (f !== 0) {
    writer.writeInt32(
      1,
      f
    );
  }
  f = message.getMinor();
  if (f !== 0) {
    writer.writeInt32(
      2,
      f
    );
  }
  f = message.getRevision();
  if (f !== 0) {
    writer.writeInt32(
      3,
      f
    );
  }
};


/**
 * optional int32 major = 1;
 * @return {number}
 */
proto.rover.audience.v1.Version.prototype.getMajor = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/** @param {number} value */
proto.rover.audience.v1.Version.prototype.setMajor = function(value) {
  jspb.Message.setField(this, 1, value);
};


/**
 * optional int32 minor = 2;
 * @return {number}
 */
proto.rover.audience.v1.Version.prototype.getMinor = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/** @param {number} value */
proto.rover.audience.v1.Version.prototype.setMinor = function(value) {
  jspb.Message.setField(this, 2, value);
};


/**
 * optional int32 revision = 3;
 * @return {number}
 */
proto.rover.audience.v1.Version.prototype.getRevision = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/** @param {number} value */
proto.rover.audience.v1.Version.prototype.setRevision = function(value) {
  jspb.Message.setField(this, 3, value);
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
proto.rover.audience.v1.CreateSegmentRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.rover.audience.v1.CreateSegmentRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.CreateSegmentRequest.displayName = 'proto.rover.audience.v1.CreateSegmentRequest';
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
proto.rover.audience.v1.CreateSegmentRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.CreateSegmentRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.CreateSegmentRequest} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.CreateSegmentRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    authContext: (f = msg.getAuthContext()) && auth_v1_auth_pb.AuthContext.toObject(includeInstance, f),
    title: jspb.Message.getFieldWithDefault(msg, 2, "")
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
 * @return {!proto.rover.audience.v1.CreateSegmentRequest}
 */
proto.rover.audience.v1.CreateSegmentRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.CreateSegmentRequest;
  return proto.rover.audience.v1.CreateSegmentRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.CreateSegmentRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.CreateSegmentRequest}
 */
proto.rover.audience.v1.CreateSegmentRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new auth_v1_auth_pb.AuthContext;
      reader.readMessage(value,auth_v1_auth_pb.AuthContext.deserializeBinaryFromReader);
      msg.setAuthContext(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setTitle(value);
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
proto.rover.audience.v1.CreateSegmentRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.CreateSegmentRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.CreateSegmentRequest} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.CreateSegmentRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getAuthContext();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      auth_v1_auth_pb.AuthContext.serializeBinaryToWriter
    );
  }
  f = message.getTitle();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * optional rover.auth.v1.AuthContext auth_context = 1;
 * @return {?proto.rover.auth.v1.AuthContext}
 */
proto.rover.audience.v1.CreateSegmentRequest.prototype.getAuthContext = function() {
  return /** @type{?proto.rover.auth.v1.AuthContext} */ (
    jspb.Message.getWrapperField(this, auth_v1_auth_pb.AuthContext, 1));
};


/** @param {?proto.rover.auth.v1.AuthContext|undefined} value */
proto.rover.audience.v1.CreateSegmentRequest.prototype.setAuthContext = function(value) {
  jspb.Message.setWrapperField(this, 1, value);
};


proto.rover.audience.v1.CreateSegmentRequest.prototype.clearAuthContext = function() {
  this.setAuthContext(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.CreateSegmentRequest.prototype.hasAuthContext = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional string title = 2;
 * @return {string}
 */
proto.rover.audience.v1.CreateSegmentRequest.prototype.getTitle = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/** @param {string} value */
proto.rover.audience.v1.CreateSegmentRequest.prototype.setTitle = function(value) {
  jspb.Message.setField(this, 2, value);
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
proto.rover.audience.v1.CreateSegmentResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.rover.audience.v1.CreateSegmentResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.CreateSegmentResponse.displayName = 'proto.rover.audience.v1.CreateSegmentResponse';
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
proto.rover.audience.v1.CreateSegmentResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.CreateSegmentResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.CreateSegmentResponse} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.CreateSegmentResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    segment: (f = msg.getSegment()) && proto.rover.audience.v1.Segment.toObject(includeInstance, f)
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
 * @return {!proto.rover.audience.v1.CreateSegmentResponse}
 */
proto.rover.audience.v1.CreateSegmentResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.CreateSegmentResponse;
  return proto.rover.audience.v1.CreateSegmentResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.CreateSegmentResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.CreateSegmentResponse}
 */
proto.rover.audience.v1.CreateSegmentResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.rover.audience.v1.Segment;
      reader.readMessage(value,proto.rover.audience.v1.Segment.deserializeBinaryFromReader);
      msg.setSegment(value);
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
proto.rover.audience.v1.CreateSegmentResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.CreateSegmentResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.CreateSegmentResponse} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.CreateSegmentResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSegment();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.rover.audience.v1.Segment.serializeBinaryToWriter
    );
  }
};


/**
 * optional Segment segment = 1;
 * @return {?proto.rover.audience.v1.Segment}
 */
proto.rover.audience.v1.CreateSegmentResponse.prototype.getSegment = function() {
  return /** @type{?proto.rover.audience.v1.Segment} */ (
    jspb.Message.getWrapperField(this, proto.rover.audience.v1.Segment, 1));
};


/** @param {?proto.rover.audience.v1.Segment|undefined} value */
proto.rover.audience.v1.CreateSegmentResponse.prototype.setSegment = function(value) {
  jspb.Message.setWrapperField(this, 1, value);
};


proto.rover.audience.v1.CreateSegmentResponse.prototype.clearSegment = function() {
  this.setSegment(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.CreateSegmentResponse.prototype.hasSegment = function() {
  return jspb.Message.getField(this, 1) != null;
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
proto.rover.audience.v1.GetSegmentByIdRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.rover.audience.v1.GetSegmentByIdRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.GetSegmentByIdRequest.displayName = 'proto.rover.audience.v1.GetSegmentByIdRequest';
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
proto.rover.audience.v1.GetSegmentByIdRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.GetSegmentByIdRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.GetSegmentByIdRequest} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.GetSegmentByIdRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    authContext: (f = msg.getAuthContext()) && auth_v1_auth_pb.AuthContext.toObject(includeInstance, f),
    segmentId: jspb.Message.getFieldWithDefault(msg, 2, "")
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
 * @return {!proto.rover.audience.v1.GetSegmentByIdRequest}
 */
proto.rover.audience.v1.GetSegmentByIdRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.GetSegmentByIdRequest;
  return proto.rover.audience.v1.GetSegmentByIdRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.GetSegmentByIdRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.GetSegmentByIdRequest}
 */
proto.rover.audience.v1.GetSegmentByIdRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new auth_v1_auth_pb.AuthContext;
      reader.readMessage(value,auth_v1_auth_pb.AuthContext.deserializeBinaryFromReader);
      msg.setAuthContext(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setSegmentId(value);
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
proto.rover.audience.v1.GetSegmentByIdRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.GetSegmentByIdRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.GetSegmentByIdRequest} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.GetSegmentByIdRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getAuthContext();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      auth_v1_auth_pb.AuthContext.serializeBinaryToWriter
    );
  }
  f = message.getSegmentId();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * optional rover.auth.v1.AuthContext auth_context = 1;
 * @return {?proto.rover.auth.v1.AuthContext}
 */
proto.rover.audience.v1.GetSegmentByIdRequest.prototype.getAuthContext = function() {
  return /** @type{?proto.rover.auth.v1.AuthContext} */ (
    jspb.Message.getWrapperField(this, auth_v1_auth_pb.AuthContext, 1));
};


/** @param {?proto.rover.auth.v1.AuthContext|undefined} value */
proto.rover.audience.v1.GetSegmentByIdRequest.prototype.setAuthContext = function(value) {
  jspb.Message.setWrapperField(this, 1, value);
};


proto.rover.audience.v1.GetSegmentByIdRequest.prototype.clearAuthContext = function() {
  this.setAuthContext(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.GetSegmentByIdRequest.prototype.hasAuthContext = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional string segment_id = 2;
 * @return {string}
 */
proto.rover.audience.v1.GetSegmentByIdRequest.prototype.getSegmentId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/** @param {string} value */
proto.rover.audience.v1.GetSegmentByIdRequest.prototype.setSegmentId = function(value) {
  jspb.Message.setField(this, 2, value);
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
proto.rover.audience.v1.GetSegmentByIdResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.rover.audience.v1.GetSegmentByIdResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.GetSegmentByIdResponse.displayName = 'proto.rover.audience.v1.GetSegmentByIdResponse';
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
proto.rover.audience.v1.GetSegmentByIdResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.GetSegmentByIdResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.GetSegmentByIdResponse} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.GetSegmentByIdResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    segment: (f = msg.getSegment()) && proto.rover.audience.v1.Segment.toObject(includeInstance, f)
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
 * @return {!proto.rover.audience.v1.GetSegmentByIdResponse}
 */
proto.rover.audience.v1.GetSegmentByIdResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.GetSegmentByIdResponse;
  return proto.rover.audience.v1.GetSegmentByIdResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.GetSegmentByIdResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.GetSegmentByIdResponse}
 */
proto.rover.audience.v1.GetSegmentByIdResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.rover.audience.v1.Segment;
      reader.readMessage(value,proto.rover.audience.v1.Segment.deserializeBinaryFromReader);
      msg.setSegment(value);
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
proto.rover.audience.v1.GetSegmentByIdResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.GetSegmentByIdResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.GetSegmentByIdResponse} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.GetSegmentByIdResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSegment();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.rover.audience.v1.Segment.serializeBinaryToWriter
    );
  }
};


/**
 * optional Segment segment = 1;
 * @return {?proto.rover.audience.v1.Segment}
 */
proto.rover.audience.v1.GetSegmentByIdResponse.prototype.getSegment = function() {
  return /** @type{?proto.rover.audience.v1.Segment} */ (
    jspb.Message.getWrapperField(this, proto.rover.audience.v1.Segment, 1));
};


/** @param {?proto.rover.audience.v1.Segment|undefined} value */
proto.rover.audience.v1.GetSegmentByIdResponse.prototype.setSegment = function(value) {
  jspb.Message.setWrapperField(this, 1, value);
};


proto.rover.audience.v1.GetSegmentByIdResponse.prototype.clearSegment = function() {
  this.setSegment(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.GetSegmentByIdResponse.prototype.hasSegment = function() {
  return jspb.Message.getField(this, 1) != null;
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
proto.rover.audience.v1.UpdateSegmentTitleRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.rover.audience.v1.UpdateSegmentTitleRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.UpdateSegmentTitleRequest.displayName = 'proto.rover.audience.v1.UpdateSegmentTitleRequest';
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
proto.rover.audience.v1.UpdateSegmentTitleRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.UpdateSegmentTitleRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.UpdateSegmentTitleRequest} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.UpdateSegmentTitleRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    authContext: (f = msg.getAuthContext()) && auth_v1_auth_pb.AuthContext.toObject(includeInstance, f),
    segmentId: jspb.Message.getFieldWithDefault(msg, 2, ""),
    title: jspb.Message.getFieldWithDefault(msg, 3, "")
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
 * @return {!proto.rover.audience.v1.UpdateSegmentTitleRequest}
 */
proto.rover.audience.v1.UpdateSegmentTitleRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.UpdateSegmentTitleRequest;
  return proto.rover.audience.v1.UpdateSegmentTitleRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.UpdateSegmentTitleRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.UpdateSegmentTitleRequest}
 */
proto.rover.audience.v1.UpdateSegmentTitleRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new auth_v1_auth_pb.AuthContext;
      reader.readMessage(value,auth_v1_auth_pb.AuthContext.deserializeBinaryFromReader);
      msg.setAuthContext(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setSegmentId(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setTitle(value);
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
proto.rover.audience.v1.UpdateSegmentTitleRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.UpdateSegmentTitleRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.UpdateSegmentTitleRequest} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.UpdateSegmentTitleRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getAuthContext();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      auth_v1_auth_pb.AuthContext.serializeBinaryToWriter
    );
  }
  f = message.getSegmentId();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getTitle();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
};


/**
 * optional rover.auth.v1.AuthContext auth_context = 1;
 * @return {?proto.rover.auth.v1.AuthContext}
 */
proto.rover.audience.v1.UpdateSegmentTitleRequest.prototype.getAuthContext = function() {
  return /** @type{?proto.rover.auth.v1.AuthContext} */ (
    jspb.Message.getWrapperField(this, auth_v1_auth_pb.AuthContext, 1));
};


/** @param {?proto.rover.auth.v1.AuthContext|undefined} value */
proto.rover.audience.v1.UpdateSegmentTitleRequest.prototype.setAuthContext = function(value) {
  jspb.Message.setWrapperField(this, 1, value);
};


proto.rover.audience.v1.UpdateSegmentTitleRequest.prototype.clearAuthContext = function() {
  this.setAuthContext(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.UpdateSegmentTitleRequest.prototype.hasAuthContext = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional string segment_id = 2;
 * @return {string}
 */
proto.rover.audience.v1.UpdateSegmentTitleRequest.prototype.getSegmentId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/** @param {string} value */
proto.rover.audience.v1.UpdateSegmentTitleRequest.prototype.setSegmentId = function(value) {
  jspb.Message.setField(this, 2, value);
};


/**
 * optional string title = 3;
 * @return {string}
 */
proto.rover.audience.v1.UpdateSegmentTitleRequest.prototype.getTitle = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/** @param {string} value */
proto.rover.audience.v1.UpdateSegmentTitleRequest.prototype.setTitle = function(value) {
  jspb.Message.setField(this, 3, value);
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
proto.rover.audience.v1.UpdateSegmentTitleResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.rover.audience.v1.UpdateSegmentTitleResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.UpdateSegmentTitleResponse.displayName = 'proto.rover.audience.v1.UpdateSegmentTitleResponse';
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
proto.rover.audience.v1.UpdateSegmentTitleResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.UpdateSegmentTitleResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.UpdateSegmentTitleResponse} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.UpdateSegmentTitleResponse.toObject = function(includeInstance, msg) {
  var f, obj = {

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
 * @return {!proto.rover.audience.v1.UpdateSegmentTitleResponse}
 */
proto.rover.audience.v1.UpdateSegmentTitleResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.UpdateSegmentTitleResponse;
  return proto.rover.audience.v1.UpdateSegmentTitleResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.UpdateSegmentTitleResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.UpdateSegmentTitleResponse}
 */
proto.rover.audience.v1.UpdateSegmentTitleResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
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
proto.rover.audience.v1.UpdateSegmentTitleResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.UpdateSegmentTitleResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.UpdateSegmentTitleResponse} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.UpdateSegmentTitleResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
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
proto.rover.audience.v1.UpdateSegmentPredicatesRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.rover.audience.v1.UpdateSegmentPredicatesRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.UpdateSegmentPredicatesRequest.displayName = 'proto.rover.audience.v1.UpdateSegmentPredicatesRequest';
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
proto.rover.audience.v1.UpdateSegmentPredicatesRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.UpdateSegmentPredicatesRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.UpdateSegmentPredicatesRequest} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.UpdateSegmentPredicatesRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    authContext: (f = msg.getAuthContext()) && auth_v1_auth_pb.AuthContext.toObject(includeInstance, f),
    segmentId: jspb.Message.getFieldWithDefault(msg, 2, ""),
    predicates: (f = msg.getPredicates()) && proto.rover.audience.v1.PredicateAggregate.toObject(includeInstance, f)
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
 * @return {!proto.rover.audience.v1.UpdateSegmentPredicatesRequest}
 */
proto.rover.audience.v1.UpdateSegmentPredicatesRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.UpdateSegmentPredicatesRequest;
  return proto.rover.audience.v1.UpdateSegmentPredicatesRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.UpdateSegmentPredicatesRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.UpdateSegmentPredicatesRequest}
 */
proto.rover.audience.v1.UpdateSegmentPredicatesRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new auth_v1_auth_pb.AuthContext;
      reader.readMessage(value,auth_v1_auth_pb.AuthContext.deserializeBinaryFromReader);
      msg.setAuthContext(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setSegmentId(value);
      break;
    case 3:
      var value = new proto.rover.audience.v1.PredicateAggregate;
      reader.readMessage(value,proto.rover.audience.v1.PredicateAggregate.deserializeBinaryFromReader);
      msg.setPredicates(value);
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
proto.rover.audience.v1.UpdateSegmentPredicatesRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.UpdateSegmentPredicatesRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.UpdateSegmentPredicatesRequest} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.UpdateSegmentPredicatesRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getAuthContext();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      auth_v1_auth_pb.AuthContext.serializeBinaryToWriter
    );
  }
  f = message.getSegmentId();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getPredicates();
  if (f != null) {
    writer.writeMessage(
      3,
      f,
      proto.rover.audience.v1.PredicateAggregate.serializeBinaryToWriter
    );
  }
};


/**
 * optional rover.auth.v1.AuthContext auth_context = 1;
 * @return {?proto.rover.auth.v1.AuthContext}
 */
proto.rover.audience.v1.UpdateSegmentPredicatesRequest.prototype.getAuthContext = function() {
  return /** @type{?proto.rover.auth.v1.AuthContext} */ (
    jspb.Message.getWrapperField(this, auth_v1_auth_pb.AuthContext, 1));
};


/** @param {?proto.rover.auth.v1.AuthContext|undefined} value */
proto.rover.audience.v1.UpdateSegmentPredicatesRequest.prototype.setAuthContext = function(value) {
  jspb.Message.setWrapperField(this, 1, value);
};


proto.rover.audience.v1.UpdateSegmentPredicatesRequest.prototype.clearAuthContext = function() {
  this.setAuthContext(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.UpdateSegmentPredicatesRequest.prototype.hasAuthContext = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional string segment_id = 2;
 * @return {string}
 */
proto.rover.audience.v1.UpdateSegmentPredicatesRequest.prototype.getSegmentId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/** @param {string} value */
proto.rover.audience.v1.UpdateSegmentPredicatesRequest.prototype.setSegmentId = function(value) {
  jspb.Message.setField(this, 2, value);
};


/**
 * optional PredicateAggregate predicates = 3;
 * @return {?proto.rover.audience.v1.PredicateAggregate}
 */
proto.rover.audience.v1.UpdateSegmentPredicatesRequest.prototype.getPredicates = function() {
  return /** @type{?proto.rover.audience.v1.PredicateAggregate} */ (
    jspb.Message.getWrapperField(this, proto.rover.audience.v1.PredicateAggregate, 3));
};


/** @param {?proto.rover.audience.v1.PredicateAggregate|undefined} value */
proto.rover.audience.v1.UpdateSegmentPredicatesRequest.prototype.setPredicates = function(value) {
  jspb.Message.setWrapperField(this, 3, value);
};


proto.rover.audience.v1.UpdateSegmentPredicatesRequest.prototype.clearPredicates = function() {
  this.setPredicates(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.UpdateSegmentPredicatesRequest.prototype.hasPredicates = function() {
  return jspb.Message.getField(this, 3) != null;
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
proto.rover.audience.v1.UpdateSegmentPredicatesResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.rover.audience.v1.UpdateSegmentPredicatesResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.UpdateSegmentPredicatesResponse.displayName = 'proto.rover.audience.v1.UpdateSegmentPredicatesResponse';
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
proto.rover.audience.v1.UpdateSegmentPredicatesResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.UpdateSegmentPredicatesResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.UpdateSegmentPredicatesResponse} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.UpdateSegmentPredicatesResponse.toObject = function(includeInstance, msg) {
  var f, obj = {

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
 * @return {!proto.rover.audience.v1.UpdateSegmentPredicatesResponse}
 */
proto.rover.audience.v1.UpdateSegmentPredicatesResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.UpdateSegmentPredicatesResponse;
  return proto.rover.audience.v1.UpdateSegmentPredicatesResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.UpdateSegmentPredicatesResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.UpdateSegmentPredicatesResponse}
 */
proto.rover.audience.v1.UpdateSegmentPredicatesResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
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
proto.rover.audience.v1.UpdateSegmentPredicatesResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.UpdateSegmentPredicatesResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.UpdateSegmentPredicatesResponse} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.UpdateSegmentPredicatesResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
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
proto.rover.audience.v1.DeleteSegmentByIdRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.rover.audience.v1.DeleteSegmentByIdRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.DeleteSegmentByIdRequest.displayName = 'proto.rover.audience.v1.DeleteSegmentByIdRequest';
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
proto.rover.audience.v1.DeleteSegmentByIdRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.DeleteSegmentByIdRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.DeleteSegmentByIdRequest} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.DeleteSegmentByIdRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    authContext: (f = msg.getAuthContext()) && auth_v1_auth_pb.AuthContext.toObject(includeInstance, f),
    segmentId: jspb.Message.getFieldWithDefault(msg, 2, "")
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
 * @return {!proto.rover.audience.v1.DeleteSegmentByIdRequest}
 */
proto.rover.audience.v1.DeleteSegmentByIdRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.DeleteSegmentByIdRequest;
  return proto.rover.audience.v1.DeleteSegmentByIdRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.DeleteSegmentByIdRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.DeleteSegmentByIdRequest}
 */
proto.rover.audience.v1.DeleteSegmentByIdRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new auth_v1_auth_pb.AuthContext;
      reader.readMessage(value,auth_v1_auth_pb.AuthContext.deserializeBinaryFromReader);
      msg.setAuthContext(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setSegmentId(value);
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
proto.rover.audience.v1.DeleteSegmentByIdRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.DeleteSegmentByIdRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.DeleteSegmentByIdRequest} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.DeleteSegmentByIdRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getAuthContext();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      auth_v1_auth_pb.AuthContext.serializeBinaryToWriter
    );
  }
  f = message.getSegmentId();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * optional rover.auth.v1.AuthContext auth_context = 1;
 * @return {?proto.rover.auth.v1.AuthContext}
 */
proto.rover.audience.v1.DeleteSegmentByIdRequest.prototype.getAuthContext = function() {
  return /** @type{?proto.rover.auth.v1.AuthContext} */ (
    jspb.Message.getWrapperField(this, auth_v1_auth_pb.AuthContext, 1));
};


/** @param {?proto.rover.auth.v1.AuthContext|undefined} value */
proto.rover.audience.v1.DeleteSegmentByIdRequest.prototype.setAuthContext = function(value) {
  jspb.Message.setWrapperField(this, 1, value);
};


proto.rover.audience.v1.DeleteSegmentByIdRequest.prototype.clearAuthContext = function() {
  this.setAuthContext(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.DeleteSegmentByIdRequest.prototype.hasAuthContext = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional string segment_id = 2;
 * @return {string}
 */
proto.rover.audience.v1.DeleteSegmentByIdRequest.prototype.getSegmentId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/** @param {string} value */
proto.rover.audience.v1.DeleteSegmentByIdRequest.prototype.setSegmentId = function(value) {
  jspb.Message.setField(this, 2, value);
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
proto.rover.audience.v1.DeleteSegmentByIdResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.rover.audience.v1.DeleteSegmentByIdResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.DeleteSegmentByIdResponse.displayName = 'proto.rover.audience.v1.DeleteSegmentByIdResponse';
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
proto.rover.audience.v1.DeleteSegmentByIdResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.DeleteSegmentByIdResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.DeleteSegmentByIdResponse} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.DeleteSegmentByIdResponse.toObject = function(includeInstance, msg) {
  var f, obj = {

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
 * @return {!proto.rover.audience.v1.DeleteSegmentByIdResponse}
 */
proto.rover.audience.v1.DeleteSegmentByIdResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.DeleteSegmentByIdResponse;
  return proto.rover.audience.v1.DeleteSegmentByIdResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.DeleteSegmentByIdResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.DeleteSegmentByIdResponse}
 */
proto.rover.audience.v1.DeleteSegmentByIdResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
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
proto.rover.audience.v1.DeleteSegmentByIdResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.DeleteSegmentByIdResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.DeleteSegmentByIdResponse} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.DeleteSegmentByIdResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
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
proto.rover.audience.v1.ListSegmentsRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.rover.audience.v1.ListSegmentsRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.ListSegmentsRequest.displayName = 'proto.rover.audience.v1.ListSegmentsRequest';
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
proto.rover.audience.v1.ListSegmentsRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.ListSegmentsRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.ListSegmentsRequest} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.ListSegmentsRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    authContext: (f = msg.getAuthContext()) && auth_v1_auth_pb.AuthContext.toObject(includeInstance, f)
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
 * @return {!proto.rover.audience.v1.ListSegmentsRequest}
 */
proto.rover.audience.v1.ListSegmentsRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.ListSegmentsRequest;
  return proto.rover.audience.v1.ListSegmentsRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.ListSegmentsRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.ListSegmentsRequest}
 */
proto.rover.audience.v1.ListSegmentsRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new auth_v1_auth_pb.AuthContext;
      reader.readMessage(value,auth_v1_auth_pb.AuthContext.deserializeBinaryFromReader);
      msg.setAuthContext(value);
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
proto.rover.audience.v1.ListSegmentsRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.ListSegmentsRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.ListSegmentsRequest} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.ListSegmentsRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getAuthContext();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      auth_v1_auth_pb.AuthContext.serializeBinaryToWriter
    );
  }
};


/**
 * optional rover.auth.v1.AuthContext auth_context = 1;
 * @return {?proto.rover.auth.v1.AuthContext}
 */
proto.rover.audience.v1.ListSegmentsRequest.prototype.getAuthContext = function() {
  return /** @type{?proto.rover.auth.v1.AuthContext} */ (
    jspb.Message.getWrapperField(this, auth_v1_auth_pb.AuthContext, 1));
};


/** @param {?proto.rover.auth.v1.AuthContext|undefined} value */
proto.rover.audience.v1.ListSegmentsRequest.prototype.setAuthContext = function(value) {
  jspb.Message.setWrapperField(this, 1, value);
};


proto.rover.audience.v1.ListSegmentsRequest.prototype.clearAuthContext = function() {
  this.setAuthContext(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.ListSegmentsRequest.prototype.hasAuthContext = function() {
  return jspb.Message.getField(this, 1) != null;
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
proto.rover.audience.v1.ListSegmentsResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.rover.audience.v1.ListSegmentsResponse.repeatedFields_, null);
};
goog.inherits(proto.rover.audience.v1.ListSegmentsResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.ListSegmentsResponse.displayName = 'proto.rover.audience.v1.ListSegmentsResponse';
}
/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.rover.audience.v1.ListSegmentsResponse.repeatedFields_ = [1];



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
proto.rover.audience.v1.ListSegmentsResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.ListSegmentsResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.ListSegmentsResponse} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.ListSegmentsResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    segmentsList: jspb.Message.toObjectList(msg.getSegmentsList(),
    proto.rover.audience.v1.Segment.toObject, includeInstance)
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
 * @return {!proto.rover.audience.v1.ListSegmentsResponse}
 */
proto.rover.audience.v1.ListSegmentsResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.ListSegmentsResponse;
  return proto.rover.audience.v1.ListSegmentsResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.ListSegmentsResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.ListSegmentsResponse}
 */
proto.rover.audience.v1.ListSegmentsResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.rover.audience.v1.Segment;
      reader.readMessage(value,proto.rover.audience.v1.Segment.deserializeBinaryFromReader);
      msg.addSegments(value);
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
proto.rover.audience.v1.ListSegmentsResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.ListSegmentsResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.ListSegmentsResponse} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.ListSegmentsResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSegmentsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      proto.rover.audience.v1.Segment.serializeBinaryToWriter
    );
  }
};


/**
 * repeated Segment segments = 1;
 * If you change this array by adding, removing or replacing elements, or if you
 * replace the array itself, then you must call the setter to update it.
 * @return {!Array.<!proto.rover.audience.v1.Segment>}
 */
proto.rover.audience.v1.ListSegmentsResponse.prototype.getSegmentsList = function() {
  return /** @type{!Array.<!proto.rover.audience.v1.Segment>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.rover.audience.v1.Segment, 1));
};


/** @param {!Array.<!proto.rover.audience.v1.Segment>} value */
proto.rover.audience.v1.ListSegmentsResponse.prototype.setSegmentsList = function(value) {
  jspb.Message.setRepeatedWrapperField(this, 1, value);
};


/**
 * @param {!proto.rover.audience.v1.Segment=} opt_value
 * @param {number=} opt_index
 * @return {!proto.rover.audience.v1.Segment}
 */
proto.rover.audience.v1.ListSegmentsResponse.prototype.addSegments = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.rover.audience.v1.Segment, opt_index);
};


proto.rover.audience.v1.ListSegmentsResponse.prototype.clearSegmentsList = function() {
  this.setSegmentsList([]);
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
proto.rover.audience.v1.Segment = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.rover.audience.v1.Segment, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.Segment.displayName = 'proto.rover.audience.v1.Segment';
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
proto.rover.audience.v1.Segment.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.Segment.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.Segment} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.Segment.toObject = function(includeInstance, msg) {
  var f, obj = {
    id: jspb.Message.getFieldWithDefault(msg, 1, ""),
    accountId: jspb.Message.getFieldWithDefault(msg, 2, 0),
    createdAt: (f = msg.getCreatedAt()) && google_protobuf_timestamp_pb.Timestamp.toObject(includeInstance, f),
    updatedAt: (f = msg.getUpdatedAt()) && google_protobuf_timestamp_pb.Timestamp.toObject(includeInstance, f),
    title: jspb.Message.getFieldWithDefault(msg, 5, ""),
    segmentSize: jspb.Message.getFieldWithDefault(msg, 6, 0),
    predicates: (f = msg.getPredicates()) && proto.rover.audience.v1.PredicateAggregate.toObject(includeInstance, f)
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
 * @return {!proto.rover.audience.v1.Segment}
 */
proto.rover.audience.v1.Segment.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.Segment;
  return proto.rover.audience.v1.Segment.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.Segment} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.Segment}
 */
proto.rover.audience.v1.Segment.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setId(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setAccountId(value);
      break;
    case 3:
      var value = new google_protobuf_timestamp_pb.Timestamp;
      reader.readMessage(value,google_protobuf_timestamp_pb.Timestamp.deserializeBinaryFromReader);
      msg.setCreatedAt(value);
      break;
    case 4:
      var value = new google_protobuf_timestamp_pb.Timestamp;
      reader.readMessage(value,google_protobuf_timestamp_pb.Timestamp.deserializeBinaryFromReader);
      msg.setUpdatedAt(value);
      break;
    case 5:
      var value = /** @type {string} */ (reader.readString());
      msg.setTitle(value);
      break;
    case 6:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setSegmentSize(value);
      break;
    case 7:
      var value = new proto.rover.audience.v1.PredicateAggregate;
      reader.readMessage(value,proto.rover.audience.v1.PredicateAggregate.deserializeBinaryFromReader);
      msg.setPredicates(value);
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
proto.rover.audience.v1.Segment.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.Segment.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.Segment} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.Segment.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getId();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getAccountId();
  if (f !== 0) {
    writer.writeInt32(
      2,
      f
    );
  }
  f = message.getCreatedAt();
  if (f != null) {
    writer.writeMessage(
      3,
      f,
      google_protobuf_timestamp_pb.Timestamp.serializeBinaryToWriter
    );
  }
  f = message.getUpdatedAt();
  if (f != null) {
    writer.writeMessage(
      4,
      f,
      google_protobuf_timestamp_pb.Timestamp.serializeBinaryToWriter
    );
  }
  f = message.getTitle();
  if (f.length > 0) {
    writer.writeString(
      5,
      f
    );
  }
  f = message.getSegmentSize();
  if (f !== 0) {
    writer.writeInt64(
      6,
      f
    );
  }
  f = message.getPredicates();
  if (f != null) {
    writer.writeMessage(
      7,
      f,
      proto.rover.audience.v1.PredicateAggregate.serializeBinaryToWriter
    );
  }
};


/**
 * optional string id = 1;
 * @return {string}
 */
proto.rover.audience.v1.Segment.prototype.getId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/** @param {string} value */
proto.rover.audience.v1.Segment.prototype.setId = function(value) {
  jspb.Message.setField(this, 1, value);
};


/**
 * optional int32 account_id = 2;
 * @return {number}
 */
proto.rover.audience.v1.Segment.prototype.getAccountId = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/** @param {number} value */
proto.rover.audience.v1.Segment.prototype.setAccountId = function(value) {
  jspb.Message.setField(this, 2, value);
};


/**
 * optional google.protobuf.Timestamp created_at = 3;
 * @return {?proto.google.protobuf.Timestamp}
 */
proto.rover.audience.v1.Segment.prototype.getCreatedAt = function() {
  return /** @type{?proto.google.protobuf.Timestamp} */ (
    jspb.Message.getWrapperField(this, google_protobuf_timestamp_pb.Timestamp, 3));
};


/** @param {?proto.google.protobuf.Timestamp|undefined} value */
proto.rover.audience.v1.Segment.prototype.setCreatedAt = function(value) {
  jspb.Message.setWrapperField(this, 3, value);
};


proto.rover.audience.v1.Segment.prototype.clearCreatedAt = function() {
  this.setCreatedAt(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.Segment.prototype.hasCreatedAt = function() {
  return jspb.Message.getField(this, 3) != null;
};


/**
 * optional google.protobuf.Timestamp updated_at = 4;
 * @return {?proto.google.protobuf.Timestamp}
 */
proto.rover.audience.v1.Segment.prototype.getUpdatedAt = function() {
  return /** @type{?proto.google.protobuf.Timestamp} */ (
    jspb.Message.getWrapperField(this, google_protobuf_timestamp_pb.Timestamp, 4));
};


/** @param {?proto.google.protobuf.Timestamp|undefined} value */
proto.rover.audience.v1.Segment.prototype.setUpdatedAt = function(value) {
  jspb.Message.setWrapperField(this, 4, value);
};


proto.rover.audience.v1.Segment.prototype.clearUpdatedAt = function() {
  this.setUpdatedAt(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.Segment.prototype.hasUpdatedAt = function() {
  return jspb.Message.getField(this, 4) != null;
};


/**
 * optional string title = 5;
 * @return {string}
 */
proto.rover.audience.v1.Segment.prototype.getTitle = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 5, ""));
};


/** @param {string} value */
proto.rover.audience.v1.Segment.prototype.setTitle = function(value) {
  jspb.Message.setField(this, 5, value);
};


/**
 * optional int64 segment_size = 6;
 * @return {number}
 */
proto.rover.audience.v1.Segment.prototype.getSegmentSize = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 6, 0));
};


/** @param {number} value */
proto.rover.audience.v1.Segment.prototype.setSegmentSize = function(value) {
  jspb.Message.setField(this, 6, value);
};


/**
 * optional PredicateAggregate predicates = 7;
 * @return {?proto.rover.audience.v1.PredicateAggregate}
 */
proto.rover.audience.v1.Segment.prototype.getPredicates = function() {
  return /** @type{?proto.rover.audience.v1.PredicateAggregate} */ (
    jspb.Message.getWrapperField(this, proto.rover.audience.v1.PredicateAggregate, 7));
};


/** @param {?proto.rover.audience.v1.PredicateAggregate|undefined} value */
proto.rover.audience.v1.Segment.prototype.setPredicates = function(value) {
  jspb.Message.setWrapperField(this, 7, value);
};


proto.rover.audience.v1.Segment.prototype.clearPredicates = function() {
  this.setPredicates(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.Segment.prototype.hasPredicates = function() {
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
proto.rover.audience.v1.StringPredicate = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.rover.audience.v1.StringPredicate, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.StringPredicate.displayName = 'proto.rover.audience.v1.StringPredicate';
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
proto.rover.audience.v1.StringPredicate.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.StringPredicate.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.StringPredicate} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.StringPredicate.toObject = function(includeInstance, msg) {
  var f, obj = {
    op: jspb.Message.getFieldWithDefault(msg, 1, 0),
    value: jspb.Message.getFieldWithDefault(msg, 2, "")
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
 * @return {!proto.rover.audience.v1.StringPredicate}
 */
proto.rover.audience.v1.StringPredicate.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.StringPredicate;
  return proto.rover.audience.v1.StringPredicate.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.StringPredicate} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.StringPredicate}
 */
proto.rover.audience.v1.StringPredicate.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!proto.rover.audience.v1.StringPredicate.Op} */ (reader.readEnum());
      msg.setOp(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setValue(value);
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
proto.rover.audience.v1.StringPredicate.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.StringPredicate.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.StringPredicate} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.StringPredicate.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getOp();
  if (f !== 0.0) {
    writer.writeEnum(
      1,
      f
    );
  }
  f = message.getValue();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * @enum {number}
 */
proto.rover.audience.v1.StringPredicate.Op = {
  UNSET: 0,
  SET: 1,
  EQUAL: 2,
  NOT_EQUAL: 3,
  STARTS_WITH: 4,
  ENDS_WITH: 5,
  CONTAINS: 6,
  NOT_CONTAINS: 7
};

/**
 * optional Op op = 1;
 * @return {!proto.rover.audience.v1.StringPredicate.Op}
 */
proto.rover.audience.v1.StringPredicate.prototype.getOp = function() {
  return /** @type {!proto.rover.audience.v1.StringPredicate.Op} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/** @param {!proto.rover.audience.v1.StringPredicate.Op} value */
proto.rover.audience.v1.StringPredicate.prototype.setOp = function(value) {
  jspb.Message.setField(this, 1, value);
};


/**
 * optional string value = 2;
 * @return {string}
 */
proto.rover.audience.v1.StringPredicate.prototype.getValue = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/** @param {string} value */
proto.rover.audience.v1.StringPredicate.prototype.setValue = function(value) {
  jspb.Message.setField(this, 2, value);
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
proto.rover.audience.v1.BoolPredicate = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.rover.audience.v1.BoolPredicate, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.BoolPredicate.displayName = 'proto.rover.audience.v1.BoolPredicate';
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
proto.rover.audience.v1.BoolPredicate.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.BoolPredicate.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.BoolPredicate} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.BoolPredicate.toObject = function(includeInstance, msg) {
  var f, obj = {
    op: jspb.Message.getFieldWithDefault(msg, 1, 0),
    value: jspb.Message.getFieldWithDefault(msg, 2, false)
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
 * @return {!proto.rover.audience.v1.BoolPredicate}
 */
proto.rover.audience.v1.BoolPredicate.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.BoolPredicate;
  return proto.rover.audience.v1.BoolPredicate.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.BoolPredicate} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.BoolPredicate}
 */
proto.rover.audience.v1.BoolPredicate.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!proto.rover.audience.v1.BoolPredicate.Op} */ (reader.readEnum());
      msg.setOp(value);
      break;
    case 2:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setValue(value);
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
proto.rover.audience.v1.BoolPredicate.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.BoolPredicate.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.BoolPredicate} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.BoolPredicate.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getOp();
  if (f !== 0.0) {
    writer.writeEnum(
      1,
      f
    );
  }
  f = message.getValue();
  if (f) {
    writer.writeBool(
      2,
      f
    );
  }
};


/**
 * @enum {number}
 */
proto.rover.audience.v1.BoolPredicate.Op = {
  UNSET: 0,
  SET: 1,
  EQUALS: 2
};

/**
 * optional Op op = 1;
 * @return {!proto.rover.audience.v1.BoolPredicate.Op}
 */
proto.rover.audience.v1.BoolPredicate.prototype.getOp = function() {
  return /** @type {!proto.rover.audience.v1.BoolPredicate.Op} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/** @param {!proto.rover.audience.v1.BoolPredicate.Op} value */
proto.rover.audience.v1.BoolPredicate.prototype.setOp = function(value) {
  jspb.Message.setField(this, 1, value);
};


/**
 * optional bool value = 2;
 * Note that Boolean fields may be set to 0/1 when serialized from a Java server.
 * You should avoid comparisons like {@code val === true/false} in those cases.
 * @return {boolean}
 */
proto.rover.audience.v1.BoolPredicate.prototype.getValue = function() {
  return /** @type {boolean} */ (jspb.Message.getFieldWithDefault(this, 2, false));
};


/** @param {boolean} value */
proto.rover.audience.v1.BoolPredicate.prototype.setValue = function(value) {
  jspb.Message.setField(this, 2, value);
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
proto.rover.audience.v1.NumberPredicate = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.rover.audience.v1.NumberPredicate, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.NumberPredicate.displayName = 'proto.rover.audience.v1.NumberPredicate';
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
proto.rover.audience.v1.NumberPredicate.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.NumberPredicate.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.NumberPredicate} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.NumberPredicate.toObject = function(includeInstance, msg) {
  var f, obj = {
    op: jspb.Message.getFieldWithDefault(msg, 1, 0),
    value: jspb.Message.getFieldWithDefault(msg, 2, 0),
    value2: jspb.Message.getFieldWithDefault(msg, 3, 0)
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
 * @return {!proto.rover.audience.v1.NumberPredicate}
 */
proto.rover.audience.v1.NumberPredicate.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.NumberPredicate;
  return proto.rover.audience.v1.NumberPredicate.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.NumberPredicate} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.NumberPredicate}
 */
proto.rover.audience.v1.NumberPredicate.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!proto.rover.audience.v1.NumberPredicate.Op} */ (reader.readEnum());
      msg.setOp(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setValue(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setValue2(value);
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
proto.rover.audience.v1.NumberPredicate.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.NumberPredicate.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.NumberPredicate} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.NumberPredicate.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getOp();
  if (f !== 0.0) {
    writer.writeEnum(
      1,
      f
    );
  }
  f = message.getValue();
  if (f !== 0) {
    writer.writeInt64(
      2,
      f
    );
  }
  f = message.getValue2();
  if (f !== 0) {
    writer.writeInt64(
      3,
      f
    );
  }
};


/**
 * @enum {number}
 */
proto.rover.audience.v1.NumberPredicate.Op = {
  UNSET: 0,
  SET: 1,
  EQUAL: 2,
  NOT_EQUAL: 3,
  GREATER_THAN: 4,
  LESS_THAN: 5,
  BETWEEN: 6
};

/**
 * optional Op op = 1;
 * @return {!proto.rover.audience.v1.NumberPredicate.Op}
 */
proto.rover.audience.v1.NumberPredicate.prototype.getOp = function() {
  return /** @type {!proto.rover.audience.v1.NumberPredicate.Op} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/** @param {!proto.rover.audience.v1.NumberPredicate.Op} value */
proto.rover.audience.v1.NumberPredicate.prototype.setOp = function(value) {
  jspb.Message.setField(this, 1, value);
};


/**
 * optional int64 value = 2;
 * @return {number}
 */
proto.rover.audience.v1.NumberPredicate.prototype.getValue = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/** @param {number} value */
proto.rover.audience.v1.NumberPredicate.prototype.setValue = function(value) {
  jspb.Message.setField(this, 2, value);
};


/**
 * optional int64 value2 = 3;
 * @return {number}
 */
proto.rover.audience.v1.NumberPredicate.prototype.getValue2 = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/** @param {number} value */
proto.rover.audience.v1.NumberPredicate.prototype.setValue2 = function(value) {
  jspb.Message.setField(this, 3, value);
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
proto.rover.audience.v1.DatePredicate = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.rover.audience.v1.DatePredicate, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.DatePredicate.displayName = 'proto.rover.audience.v1.DatePredicate';
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
proto.rover.audience.v1.DatePredicate.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.DatePredicate.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.DatePredicate} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.DatePredicate.toObject = function(includeInstance, msg) {
  var f, obj = {
    op: jspb.Message.getFieldWithDefault(msg, 1, 0),
    value: (f = msg.getValue()) && google_protobuf_timestamp_pb.Timestamp.toObject(includeInstance, f),
    value2: (f = msg.getValue2()) && google_protobuf_timestamp_pb.Timestamp.toObject(includeInstance, f)
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
 * @return {!proto.rover.audience.v1.DatePredicate}
 */
proto.rover.audience.v1.DatePredicate.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.DatePredicate;
  return proto.rover.audience.v1.DatePredicate.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.DatePredicate} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.DatePredicate}
 */
proto.rover.audience.v1.DatePredicate.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!proto.rover.audience.v1.DatePredicate.Op} */ (reader.readEnum());
      msg.setOp(value);
      break;
    case 2:
      var value = new google_protobuf_timestamp_pb.Timestamp;
      reader.readMessage(value,google_protobuf_timestamp_pb.Timestamp.deserializeBinaryFromReader);
      msg.setValue(value);
      break;
    case 3:
      var value = new google_protobuf_timestamp_pb.Timestamp;
      reader.readMessage(value,google_protobuf_timestamp_pb.Timestamp.deserializeBinaryFromReader);
      msg.setValue2(value);
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
proto.rover.audience.v1.DatePredicate.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.DatePredicate.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.DatePredicate} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.DatePredicate.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getOp();
  if (f !== 0.0) {
    writer.writeEnum(
      1,
      f
    );
  }
  f = message.getValue();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      google_protobuf_timestamp_pb.Timestamp.serializeBinaryToWriter
    );
  }
  f = message.getValue2();
  if (f != null) {
    writer.writeMessage(
      3,
      f,
      google_protobuf_timestamp_pb.Timestamp.serializeBinaryToWriter
    );
  }
};


/**
 * @enum {number}
 */
proto.rover.audience.v1.DatePredicate.Op = {
  UNSET: 0,
  SET: 1,
  EQUAL: 2,
  NOT_EQUAL: 3,
  GREATER_THAN: 4,
  LESS_THAN: 5,
  BETWEEN: 6,
  AFTER: 7,
  BEFORE: 8,
  ON: 9
};

/**
 * optional Op op = 1;
 * @return {!proto.rover.audience.v1.DatePredicate.Op}
 */
proto.rover.audience.v1.DatePredicate.prototype.getOp = function() {
  return /** @type {!proto.rover.audience.v1.DatePredicate.Op} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/** @param {!proto.rover.audience.v1.DatePredicate.Op} value */
proto.rover.audience.v1.DatePredicate.prototype.setOp = function(value) {
  jspb.Message.setField(this, 1, value);
};


/**
 * optional google.protobuf.Timestamp value = 2;
 * @return {?proto.google.protobuf.Timestamp}
 */
proto.rover.audience.v1.DatePredicate.prototype.getValue = function() {
  return /** @type{?proto.google.protobuf.Timestamp} */ (
    jspb.Message.getWrapperField(this, google_protobuf_timestamp_pb.Timestamp, 2));
};


/** @param {?proto.google.protobuf.Timestamp|undefined} value */
proto.rover.audience.v1.DatePredicate.prototype.setValue = function(value) {
  jspb.Message.setWrapperField(this, 2, value);
};


proto.rover.audience.v1.DatePredicate.prototype.clearValue = function() {
  this.setValue(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.DatePredicate.prototype.hasValue = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional google.protobuf.Timestamp value2 = 3;
 * @return {?proto.google.protobuf.Timestamp}
 */
proto.rover.audience.v1.DatePredicate.prototype.getValue2 = function() {
  return /** @type{?proto.google.protobuf.Timestamp} */ (
    jspb.Message.getWrapperField(this, google_protobuf_timestamp_pb.Timestamp, 3));
};


/** @param {?proto.google.protobuf.Timestamp|undefined} value */
proto.rover.audience.v1.DatePredicate.prototype.setValue2 = function(value) {
  jspb.Message.setWrapperField(this, 3, value);
};


proto.rover.audience.v1.DatePredicate.prototype.clearValue2 = function() {
  this.setValue2(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.DatePredicate.prototype.hasValue2 = function() {
  return jspb.Message.getField(this, 3) != null;
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
proto.rover.audience.v1.GeofencePredicate = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.rover.audience.v1.GeofencePredicate, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.GeofencePredicate.displayName = 'proto.rover.audience.v1.GeofencePredicate';
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
proto.rover.audience.v1.GeofencePredicate.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.GeofencePredicate.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.GeofencePredicate} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.GeofencePredicate.toObject = function(includeInstance, msg) {
  var f, obj = {
    op: jspb.Message.getFieldWithDefault(msg, 1, 0),
    value: (f = msg.getValue()) && proto.rover.audience.v1.Location.toObject(includeInstance, f)
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
 * @return {!proto.rover.audience.v1.GeofencePredicate}
 */
proto.rover.audience.v1.GeofencePredicate.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.GeofencePredicate;
  return proto.rover.audience.v1.GeofencePredicate.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.GeofencePredicate} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.GeofencePredicate}
 */
proto.rover.audience.v1.GeofencePredicate.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!proto.rover.audience.v1.GeofencePredicate.Op} */ (reader.readEnum());
      msg.setOp(value);
      break;
    case 2:
      var value = new proto.rover.audience.v1.Location;
      reader.readMessage(value,proto.rover.audience.v1.Location.deserializeBinaryFromReader);
      msg.setValue(value);
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
proto.rover.audience.v1.GeofencePredicate.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.GeofencePredicate.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.GeofencePredicate} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.GeofencePredicate.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getOp();
  if (f !== 0.0) {
    writer.writeEnum(
      1,
      f
    );
  }
  f = message.getValue();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      proto.rover.audience.v1.Location.serializeBinaryToWriter
    );
  }
};


/**
 * @enum {number}
 */
proto.rover.audience.v1.GeofencePredicate.Op = {
  UNSET: 0,
  SET: 1,
  OUTSIDE: 2,
  WITHIN: 3
};

/**
 * optional Op op = 1;
 * @return {!proto.rover.audience.v1.GeofencePredicate.Op}
 */
proto.rover.audience.v1.GeofencePredicate.prototype.getOp = function() {
  return /** @type {!proto.rover.audience.v1.GeofencePredicate.Op} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/** @param {!proto.rover.audience.v1.GeofencePredicate.Op} value */
proto.rover.audience.v1.GeofencePredicate.prototype.setOp = function(value) {
  jspb.Message.setField(this, 1, value);
};


/**
 * optional Location value = 2;
 * @return {?proto.rover.audience.v1.Location}
 */
proto.rover.audience.v1.GeofencePredicate.prototype.getValue = function() {
  return /** @type{?proto.rover.audience.v1.Location} */ (
    jspb.Message.getWrapperField(this, proto.rover.audience.v1.Location, 2));
};


/** @param {?proto.rover.audience.v1.Location|undefined} value */
proto.rover.audience.v1.GeofencePredicate.prototype.setValue = function(value) {
  jspb.Message.setWrapperField(this, 2, value);
};


proto.rover.audience.v1.GeofencePredicate.prototype.clearValue = function() {
  this.setValue(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.GeofencePredicate.prototype.hasValue = function() {
  return jspb.Message.getField(this, 2) != null;
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
proto.rover.audience.v1.VersionPredicate = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.rover.audience.v1.VersionPredicate, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.VersionPredicate.displayName = 'proto.rover.audience.v1.VersionPredicate';
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
proto.rover.audience.v1.VersionPredicate.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.VersionPredicate.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.VersionPredicate} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.VersionPredicate.toObject = function(includeInstance, msg) {
  var f, obj = {
    op: jspb.Message.getFieldWithDefault(msg, 1, 0),
    value: (f = msg.getValue()) && proto.rover.audience.v1.Version.toObject(includeInstance, f),
    value2: (f = msg.getValue2()) && proto.rover.audience.v1.Version.toObject(includeInstance, f)
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
 * @return {!proto.rover.audience.v1.VersionPredicate}
 */
proto.rover.audience.v1.VersionPredicate.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.VersionPredicate;
  return proto.rover.audience.v1.VersionPredicate.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.VersionPredicate} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.VersionPredicate}
 */
proto.rover.audience.v1.VersionPredicate.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!proto.rover.audience.v1.VersionPredicate.Op} */ (reader.readEnum());
      msg.setOp(value);
      break;
    case 2:
      var value = new proto.rover.audience.v1.Version;
      reader.readMessage(value,proto.rover.audience.v1.Version.deserializeBinaryFromReader);
      msg.setValue(value);
      break;
    case 3:
      var value = new proto.rover.audience.v1.Version;
      reader.readMessage(value,proto.rover.audience.v1.Version.deserializeBinaryFromReader);
      msg.setValue2(value);
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
proto.rover.audience.v1.VersionPredicate.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.VersionPredicate.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.VersionPredicate} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.VersionPredicate.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getOp();
  if (f !== 0.0) {
    writer.writeEnum(
      1,
      f
    );
  }
  f = message.getValue();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      proto.rover.audience.v1.Version.serializeBinaryToWriter
    );
  }
  f = message.getValue2();
  if (f != null) {
    writer.writeMessage(
      3,
      f,
      proto.rover.audience.v1.Version.serializeBinaryToWriter
    );
  }
};


/**
 * @enum {number}
 */
proto.rover.audience.v1.VersionPredicate.Op = {
  UNSET: 0,
  SET: 1,
  EQUAL: 2,
  NOT_EQUAL: 3,
  GREATER_THAN: 4,
  LESS_THAN: 5,
  BETWEEN: 6,
  GREATER_THAN_OR_EQUAL: 7,
  LESS_THAN_OR_EQUAL: 8
};

/**
 * optional Op op = 1;
 * @return {!proto.rover.audience.v1.VersionPredicate.Op}
 */
proto.rover.audience.v1.VersionPredicate.prototype.getOp = function() {
  return /** @type {!proto.rover.audience.v1.VersionPredicate.Op} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/** @param {!proto.rover.audience.v1.VersionPredicate.Op} value */
proto.rover.audience.v1.VersionPredicate.prototype.setOp = function(value) {
  jspb.Message.setField(this, 1, value);
};


/**
 * optional Version value = 2;
 * @return {?proto.rover.audience.v1.Version}
 */
proto.rover.audience.v1.VersionPredicate.prototype.getValue = function() {
  return /** @type{?proto.rover.audience.v1.Version} */ (
    jspb.Message.getWrapperField(this, proto.rover.audience.v1.Version, 2));
};


/** @param {?proto.rover.audience.v1.Version|undefined} value */
proto.rover.audience.v1.VersionPredicate.prototype.setValue = function(value) {
  jspb.Message.setWrapperField(this, 2, value);
};


proto.rover.audience.v1.VersionPredicate.prototype.clearValue = function() {
  this.setValue(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.VersionPredicate.prototype.hasValue = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional Version value2 = 3;
 * @return {?proto.rover.audience.v1.Version}
 */
proto.rover.audience.v1.VersionPredicate.prototype.getValue2 = function() {
  return /** @type{?proto.rover.audience.v1.Version} */ (
    jspb.Message.getWrapperField(this, proto.rover.audience.v1.Version, 3));
};


/** @param {?proto.rover.audience.v1.Version|undefined} value */
proto.rover.audience.v1.VersionPredicate.prototype.setValue2 = function(value) {
  jspb.Message.setWrapperField(this, 3, value);
};


proto.rover.audience.v1.VersionPredicate.prototype.clearValue2 = function() {
  this.setValue2(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.VersionPredicate.prototype.hasValue2 = function() {
  return jspb.Message.getField(this, 3) != null;
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
proto.rover.audience.v1.PredicateAggregate = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.rover.audience.v1.PredicateAggregate.repeatedFields_, null);
};
goog.inherits(proto.rover.audience.v1.PredicateAggregate, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.PredicateAggregate.displayName = 'proto.rover.audience.v1.PredicateAggregate';
}
/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.rover.audience.v1.PredicateAggregate.repeatedFields_ = [2];



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
proto.rover.audience.v1.PredicateAggregate.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.PredicateAggregate.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.PredicateAggregate} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.PredicateAggregate.toObject = function(includeInstance, msg) {
  var f, obj = {
    condition: jspb.Message.getFieldWithDefault(msg, 1, 0),
    predicatesList: jspb.Message.toObjectList(msg.getPredicatesList(),
    proto.rover.audience.v1.Predicate.toObject, includeInstance)
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
 * @return {!proto.rover.audience.v1.PredicateAggregate}
 */
proto.rover.audience.v1.PredicateAggregate.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.PredicateAggregate;
  return proto.rover.audience.v1.PredicateAggregate.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.PredicateAggregate} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.PredicateAggregate}
 */
proto.rover.audience.v1.PredicateAggregate.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!proto.rover.audience.v1.PredicateAggregate.Condition} */ (reader.readEnum());
      msg.setCondition(value);
      break;
    case 2:
      var value = new proto.rover.audience.v1.Predicate;
      reader.readMessage(value,proto.rover.audience.v1.Predicate.deserializeBinaryFromReader);
      msg.addPredicates(value);
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
proto.rover.audience.v1.PredicateAggregate.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.PredicateAggregate.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.PredicateAggregate} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.PredicateAggregate.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getCondition();
  if (f !== 0.0) {
    writer.writeEnum(
      1,
      f
    );
  }
  f = message.getPredicatesList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      2,
      f,
      proto.rover.audience.v1.Predicate.serializeBinaryToWriter
    );
  }
};


/**
 * @enum {number}
 */
proto.rover.audience.v1.PredicateAggregate.Condition = {
  ANY: 0,
  ALL: 1
};

/**
 * optional Condition condition = 1;
 * @return {!proto.rover.audience.v1.PredicateAggregate.Condition}
 */
proto.rover.audience.v1.PredicateAggregate.prototype.getCondition = function() {
  return /** @type {!proto.rover.audience.v1.PredicateAggregate.Condition} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/** @param {!proto.rover.audience.v1.PredicateAggregate.Condition} value */
proto.rover.audience.v1.PredicateAggregate.prototype.setCondition = function(value) {
  jspb.Message.setField(this, 1, value);
};


/**
 * repeated Predicate predicates = 2;
 * If you change this array by adding, removing or replacing elements, or if you
 * replace the array itself, then you must call the setter to update it.
 * @return {!Array.<!proto.rover.audience.v1.Predicate>}
 */
proto.rover.audience.v1.PredicateAggregate.prototype.getPredicatesList = function() {
  return /** @type{!Array.<!proto.rover.audience.v1.Predicate>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.rover.audience.v1.Predicate, 2));
};


/** @param {!Array.<!proto.rover.audience.v1.Predicate>} value */
proto.rover.audience.v1.PredicateAggregate.prototype.setPredicatesList = function(value) {
  jspb.Message.setRepeatedWrapperField(this, 2, value);
};


/**
 * @param {!proto.rover.audience.v1.Predicate=} opt_value
 * @param {number=} opt_index
 * @return {!proto.rover.audience.v1.Predicate}
 */
proto.rover.audience.v1.PredicateAggregate.prototype.addPredicates = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 2, opt_value, proto.rover.audience.v1.Predicate, opt_index);
};


proto.rover.audience.v1.PredicateAggregate.prototype.clearPredicatesList = function() {
  this.setPredicatesList([]);
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
proto.rover.audience.v1.Predicate = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, proto.rover.audience.v1.Predicate.oneofGroups_);
};
goog.inherits(proto.rover.audience.v1.Predicate, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.Predicate.displayName = 'proto.rover.audience.v1.Predicate';
}
/**
 * Oneof group definitions for this message. Each group defines the field
 * numbers belonging to that group. When of these fields' value is set, all
 * other fields in the group are cleared. During deserialization, if multiple
 * fields are encountered for a group, only the last value seen will be kept.
 * @private {!Array<!Array<number>>}
 * @const
 */
proto.rover.audience.v1.Predicate.oneofGroups_ = [[1,2,3,4,5,6]];

/**
 * @enum {number}
 */
proto.rover.audience.v1.Predicate.TypeCase = {
  TYPE_NOT_SET: 0,
  STRINGP: 1,
  BOOLP: 2,
  NUMBERP: 3,
  DATEP: 4,
  VERSIONP: 5,
  GEOFENCEP: 6
};

/**
 * @return {proto.rover.audience.v1.Predicate.TypeCase}
 */
proto.rover.audience.v1.Predicate.prototype.getTypeCase = function() {
  return /** @type {proto.rover.audience.v1.Predicate.TypeCase} */(jspb.Message.computeOneofCase(this, proto.rover.audience.v1.Predicate.oneofGroups_[0]));
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
proto.rover.audience.v1.Predicate.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.Predicate.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.Predicate} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.Predicate.toObject = function(includeInstance, msg) {
  var f, obj = {
    stringp: (f = msg.getStringp()) && proto.rover.audience.v1.StringPredicate.toObject(includeInstance, f),
    boolp: (f = msg.getBoolp()) && proto.rover.audience.v1.BoolPredicate.toObject(includeInstance, f),
    numberp: (f = msg.getNumberp()) && proto.rover.audience.v1.NumberPredicate.toObject(includeInstance, f),
    datep: (f = msg.getDatep()) && proto.rover.audience.v1.DatePredicate.toObject(includeInstance, f),
    versionp: (f = msg.getVersionp()) && proto.rover.audience.v1.VersionPredicate.toObject(includeInstance, f),
    geofencep: (f = msg.getGeofencep()) && proto.rover.audience.v1.GeofencePredicate.toObject(includeInstance, f)
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
 * @return {!proto.rover.audience.v1.Predicate}
 */
proto.rover.audience.v1.Predicate.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.Predicate;
  return proto.rover.audience.v1.Predicate.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.Predicate} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.Predicate}
 */
proto.rover.audience.v1.Predicate.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.rover.audience.v1.StringPredicate;
      reader.readMessage(value,proto.rover.audience.v1.StringPredicate.deserializeBinaryFromReader);
      msg.setStringp(value);
      break;
    case 2:
      var value = new proto.rover.audience.v1.BoolPredicate;
      reader.readMessage(value,proto.rover.audience.v1.BoolPredicate.deserializeBinaryFromReader);
      msg.setBoolp(value);
      break;
    case 3:
      var value = new proto.rover.audience.v1.NumberPredicate;
      reader.readMessage(value,proto.rover.audience.v1.NumberPredicate.deserializeBinaryFromReader);
      msg.setNumberp(value);
      break;
    case 4:
      var value = new proto.rover.audience.v1.DatePredicate;
      reader.readMessage(value,proto.rover.audience.v1.DatePredicate.deserializeBinaryFromReader);
      msg.setDatep(value);
      break;
    case 5:
      var value = new proto.rover.audience.v1.VersionPredicate;
      reader.readMessage(value,proto.rover.audience.v1.VersionPredicate.deserializeBinaryFromReader);
      msg.setVersionp(value);
      break;
    case 6:
      var value = new proto.rover.audience.v1.GeofencePredicate;
      reader.readMessage(value,proto.rover.audience.v1.GeofencePredicate.deserializeBinaryFromReader);
      msg.setGeofencep(value);
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
proto.rover.audience.v1.Predicate.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.Predicate.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.Predicate} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.Predicate.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getStringp();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.rover.audience.v1.StringPredicate.serializeBinaryToWriter
    );
  }
  f = message.getBoolp();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      proto.rover.audience.v1.BoolPredicate.serializeBinaryToWriter
    );
  }
  f = message.getNumberp();
  if (f != null) {
    writer.writeMessage(
      3,
      f,
      proto.rover.audience.v1.NumberPredicate.serializeBinaryToWriter
    );
  }
  f = message.getDatep();
  if (f != null) {
    writer.writeMessage(
      4,
      f,
      proto.rover.audience.v1.DatePredicate.serializeBinaryToWriter
    );
  }
  f = message.getVersionp();
  if (f != null) {
    writer.writeMessage(
      5,
      f,
      proto.rover.audience.v1.VersionPredicate.serializeBinaryToWriter
    );
  }
  f = message.getGeofencep();
  if (f != null) {
    writer.writeMessage(
      6,
      f,
      proto.rover.audience.v1.GeofencePredicate.serializeBinaryToWriter
    );
  }
};


/**
 * optional StringPredicate stringp = 1;
 * @return {?proto.rover.audience.v1.StringPredicate}
 */
proto.rover.audience.v1.Predicate.prototype.getStringp = function() {
  return /** @type{?proto.rover.audience.v1.StringPredicate} */ (
    jspb.Message.getWrapperField(this, proto.rover.audience.v1.StringPredicate, 1));
};


/** @param {?proto.rover.audience.v1.StringPredicate|undefined} value */
proto.rover.audience.v1.Predicate.prototype.setStringp = function(value) {
  jspb.Message.setOneofWrapperField(this, 1, proto.rover.audience.v1.Predicate.oneofGroups_[0], value);
};


proto.rover.audience.v1.Predicate.prototype.clearStringp = function() {
  this.setStringp(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.Predicate.prototype.hasStringp = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional BoolPredicate boolp = 2;
 * @return {?proto.rover.audience.v1.BoolPredicate}
 */
proto.rover.audience.v1.Predicate.prototype.getBoolp = function() {
  return /** @type{?proto.rover.audience.v1.BoolPredicate} */ (
    jspb.Message.getWrapperField(this, proto.rover.audience.v1.BoolPredicate, 2));
};


/** @param {?proto.rover.audience.v1.BoolPredicate|undefined} value */
proto.rover.audience.v1.Predicate.prototype.setBoolp = function(value) {
  jspb.Message.setOneofWrapperField(this, 2, proto.rover.audience.v1.Predicate.oneofGroups_[0], value);
};


proto.rover.audience.v1.Predicate.prototype.clearBoolp = function() {
  this.setBoolp(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.Predicate.prototype.hasBoolp = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional NumberPredicate numberp = 3;
 * @return {?proto.rover.audience.v1.NumberPredicate}
 */
proto.rover.audience.v1.Predicate.prototype.getNumberp = function() {
  return /** @type{?proto.rover.audience.v1.NumberPredicate} */ (
    jspb.Message.getWrapperField(this, proto.rover.audience.v1.NumberPredicate, 3));
};


/** @param {?proto.rover.audience.v1.NumberPredicate|undefined} value */
proto.rover.audience.v1.Predicate.prototype.setNumberp = function(value) {
  jspb.Message.setOneofWrapperField(this, 3, proto.rover.audience.v1.Predicate.oneofGroups_[0], value);
};


proto.rover.audience.v1.Predicate.prototype.clearNumberp = function() {
  this.setNumberp(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.Predicate.prototype.hasNumberp = function() {
  return jspb.Message.getField(this, 3) != null;
};


/**
 * optional DatePredicate datep = 4;
 * @return {?proto.rover.audience.v1.DatePredicate}
 */
proto.rover.audience.v1.Predicate.prototype.getDatep = function() {
  return /** @type{?proto.rover.audience.v1.DatePredicate} */ (
    jspb.Message.getWrapperField(this, proto.rover.audience.v1.DatePredicate, 4));
};


/** @param {?proto.rover.audience.v1.DatePredicate|undefined} value */
proto.rover.audience.v1.Predicate.prototype.setDatep = function(value) {
  jspb.Message.setOneofWrapperField(this, 4, proto.rover.audience.v1.Predicate.oneofGroups_[0], value);
};


proto.rover.audience.v1.Predicate.prototype.clearDatep = function() {
  this.setDatep(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.Predicate.prototype.hasDatep = function() {
  return jspb.Message.getField(this, 4) != null;
};


/**
 * optional VersionPredicate versionp = 5;
 * @return {?proto.rover.audience.v1.VersionPredicate}
 */
proto.rover.audience.v1.Predicate.prototype.getVersionp = function() {
  return /** @type{?proto.rover.audience.v1.VersionPredicate} */ (
    jspb.Message.getWrapperField(this, proto.rover.audience.v1.VersionPredicate, 5));
};


/** @param {?proto.rover.audience.v1.VersionPredicate|undefined} value */
proto.rover.audience.v1.Predicate.prototype.setVersionp = function(value) {
  jspb.Message.setOneofWrapperField(this, 5, proto.rover.audience.v1.Predicate.oneofGroups_[0], value);
};


proto.rover.audience.v1.Predicate.prototype.clearVersionp = function() {
  this.setVersionp(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.Predicate.prototype.hasVersionp = function() {
  return jspb.Message.getField(this, 5) != null;
};


/**
 * optional GeofencePredicate geofencep = 6;
 * @return {?proto.rover.audience.v1.GeofencePredicate}
 */
proto.rover.audience.v1.Predicate.prototype.getGeofencep = function() {
  return /** @type{?proto.rover.audience.v1.GeofencePredicate} */ (
    jspb.Message.getWrapperField(this, proto.rover.audience.v1.GeofencePredicate, 6));
};


/** @param {?proto.rover.audience.v1.GeofencePredicate|undefined} value */
proto.rover.audience.v1.Predicate.prototype.setGeofencep = function(value) {
  jspb.Message.setOneofWrapperField(this, 6, proto.rover.audience.v1.Predicate.oneofGroups_[0], value);
};


proto.rover.audience.v1.Predicate.prototype.clearGeofencep = function() {
  this.setGeofencep(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.Predicate.prototype.hasGeofencep = function() {
  return jspb.Message.getField(this, 6) != null;
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
proto.rover.audience.v1.Location = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.rover.audience.v1.Location, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.Location.displayName = 'proto.rover.audience.v1.Location';
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
proto.rover.audience.v1.Location.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.Location.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.Location} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.Location.toObject = function(includeInstance, msg) {
  var f, obj = {
    longitude: +jspb.Message.getFieldWithDefault(msg, 1, 0.0),
    latitude: +jspb.Message.getFieldWithDefault(msg, 2, 0.0),
    radius: jspb.Message.getFieldWithDefault(msg, 3, 0)
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
 * @return {!proto.rover.audience.v1.Location}
 */
proto.rover.audience.v1.Location.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.Location;
  return proto.rover.audience.v1.Location.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.Location} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.Location}
 */
proto.rover.audience.v1.Location.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readDouble());
      msg.setLongitude(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readDouble());
      msg.setLatitude(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setRadius(value);
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
proto.rover.audience.v1.Location.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.Location.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.Location} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.Location.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getLongitude();
  if (f !== 0.0) {
    writer.writeDouble(
      1,
      f
    );
  }
  f = message.getLatitude();
  if (f !== 0.0) {
    writer.writeDouble(
      2,
      f
    );
  }
  f = message.getRadius();
  if (f !== 0) {
    writer.writeInt32(
      3,
      f
    );
  }
};


/**
 * optional double longitude = 1;
 * @return {number}
 */
proto.rover.audience.v1.Location.prototype.getLongitude = function() {
  return /** @type {number} */ (+jspb.Message.getFieldWithDefault(this, 1, 0.0));
};


/** @param {number} value */
proto.rover.audience.v1.Location.prototype.setLongitude = function(value) {
  jspb.Message.setField(this, 1, value);
};


/**
 * optional double latitude = 2;
 * @return {number}
 */
proto.rover.audience.v1.Location.prototype.getLatitude = function() {
  return /** @type {number} */ (+jspb.Message.getFieldWithDefault(this, 2, 0.0));
};


/** @param {number} value */
proto.rover.audience.v1.Location.prototype.setLatitude = function(value) {
  jspb.Message.setField(this, 2, value);
};


/**
 * optional int32 radius = 3;
 * @return {number}
 */
proto.rover.audience.v1.Location.prototype.getRadius = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/** @param {number} value */
proto.rover.audience.v1.Location.prototype.setRadius = function(value) {
  jspb.Message.setField(this, 3, value);
};


/**
 * @enum {number}
 */
proto.rover.audience.v1.Platform = {
  UNDEFINED: 0,
  MOBILE: 1,
  WEB: 2
};

/**
 * @enum {number}
 */
proto.rover.audience.v1.Null = {
  NULL: 0
};

goog.object.extend(exports, proto.rover.audience.v1);
