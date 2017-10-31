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
goog.exportSymbol('proto.rover.audience.v1.CreateDynamicSegmentRequest', null, global);
goog.exportSymbol('proto.rover.audience.v1.CreateDynamicSegmentResponse', null, global);
goog.exportSymbol('proto.rover.audience.v1.CreateProfileRequest', null, global);
goog.exportSymbol('proto.rover.audience.v1.CreateProfileResponse', null, global);
goog.exportSymbol('proto.rover.audience.v1.DatePredicate', null, global);
goog.exportSymbol('proto.rover.audience.v1.DatePredicate.Date', null, global);
goog.exportSymbol('proto.rover.audience.v1.DatePredicate.Op', null, global);
goog.exportSymbol('proto.rover.audience.v1.DeleteDeviceRequest', null, global);
goog.exportSymbol('proto.rover.audience.v1.DeleteDeviceResponse', null, global);
goog.exportSymbol('proto.rover.audience.v1.DeleteProfileRequest', null, global);
goog.exportSymbol('proto.rover.audience.v1.DeleteProfileResponse', null, global);
goog.exportSymbol('proto.rover.audience.v1.Device', null, global);
goog.exportSymbol('proto.rover.audience.v1.Device.RegionMonitoringMode', null, global);
goog.exportSymbol('proto.rover.audience.v1.DeviceIsInDynamicSegmentRequest', null, global);
goog.exportSymbol('proto.rover.audience.v1.DeviceIsInDynamicSegmentResponse', null, global);
goog.exportSymbol('proto.rover.audience.v1.DeviceSchema', null, global);
goog.exportSymbol('proto.rover.audience.v1.DoublePredicate', null, global);
goog.exportSymbol('proto.rover.audience.v1.DoublePredicate.Op', null, global);
goog.exportSymbol('proto.rover.audience.v1.DurationPredicate', null, global);
goog.exportSymbol('proto.rover.audience.v1.DurationPredicate.Duration', null, global);
goog.exportSymbol('proto.rover.audience.v1.DurationPredicate.Duration.Type', null, global);
goog.exportSymbol('proto.rover.audience.v1.DurationPredicate.Op', null, global);
goog.exportSymbol('proto.rover.audience.v1.DynamicSegment', null, global);
goog.exportSymbol('proto.rover.audience.v1.GeofencePredicate', null, global);
goog.exportSymbol('proto.rover.audience.v1.GeofencePredicate.Location', null, global);
goog.exportSymbol('proto.rover.audience.v1.GeofencePredicate.Op', null, global);
goog.exportSymbol('proto.rover.audience.v1.GeofenceRegion', null, global);
goog.exportSymbol('proto.rover.audience.v1.GetDeviceByPushTokenRequest', null, global);
goog.exportSymbol('proto.rover.audience.v1.GetDeviceByPushTokenResponse', null, global);
goog.exportSymbol('proto.rover.audience.v1.GetDeviceRequest', null, global);
goog.exportSymbol('proto.rover.audience.v1.GetDeviceResponse', null, global);
goog.exportSymbol('proto.rover.audience.v1.GetDeviceSchemaRequest', null, global);
goog.exportSymbol('proto.rover.audience.v1.GetDeviceSchemaResponse', null, global);
goog.exportSymbol('proto.rover.audience.v1.GetDevicesTotalCountRequest', null, global);
goog.exportSymbol('proto.rover.audience.v1.GetDevicesTotalCountResponse', null, global);
goog.exportSymbol('proto.rover.audience.v1.GetDynamicSegmentByIdRequest', null, global);
goog.exportSymbol('proto.rover.audience.v1.GetDynamicSegmentByIdResponse', null, global);
goog.exportSymbol('proto.rover.audience.v1.GetFieldSuggestionRequest', null, global);
goog.exportSymbol('proto.rover.audience.v1.GetFieldSuggestionRequest.Selector', null, global);
goog.exportSymbol('proto.rover.audience.v1.GetFieldSuggestionResponse', null, global);
goog.exportSymbol('proto.rover.audience.v1.GetProfileByDeviceIdRequest', null, global);
goog.exportSymbol('proto.rover.audience.v1.GetProfileByDeviceIdResponse', null, global);
goog.exportSymbol('proto.rover.audience.v1.GetProfileByIdentifierRequest', null, global);
goog.exportSymbol('proto.rover.audience.v1.GetProfileByIdentifierResponse', null, global);
goog.exportSymbol('proto.rover.audience.v1.GetProfileRequest', null, global);
goog.exportSymbol('proto.rover.audience.v1.GetProfileResponse', null, global);
goog.exportSymbol('proto.rover.audience.v1.GetProfileSchemaRequest', null, global);
goog.exportSymbol('proto.rover.audience.v1.GetProfileSchemaResponse', null, global);
goog.exportSymbol('proto.rover.audience.v1.GetProfilesTotalCountRequest', null, global);
goog.exportSymbol('proto.rover.audience.v1.GetProfilesTotalCountResponse', null, global);
goog.exportSymbol('proto.rover.audience.v1.IBeaconRegion', null, global);
goog.exportSymbol('proto.rover.audience.v1.IsInDynamicSegmentRequest', null, global);
goog.exportSymbol('proto.rover.audience.v1.IsInDynamicSegmentResponse', null, global);
goog.exportSymbol('proto.rover.audience.v1.ListDevicesByProfileIdRequest', null, global);
goog.exportSymbol('proto.rover.audience.v1.ListDevicesByProfileIdResponse', null, global);
goog.exportSymbol('proto.rover.audience.v1.ListDevicesByProfileIdentifierRequest', null, global);
goog.exportSymbol('proto.rover.audience.v1.ListDevicesByProfileIdentifierResponse', null, global);
goog.exportSymbol('proto.rover.audience.v1.ListDynamicSegmentsRequest', null, global);
goog.exportSymbol('proto.rover.audience.v1.ListDynamicSegmentsRequest.ArchivedStatus', null, global);
goog.exportSymbol('proto.rover.audience.v1.ListDynamicSegmentsResponse', null, global);
goog.exportSymbol('proto.rover.audience.v1.ListProfilesByIdentifiersRequest', null, global);
goog.exportSymbol('proto.rover.audience.v1.ListProfilesByIdentifiersResponse', null, global);
goog.exportSymbol('proto.rover.audience.v1.ListProfilesByIdsRequest', null, global);
goog.exportSymbol('proto.rover.audience.v1.ListProfilesByIdsResponse', null, global);
goog.exportSymbol('proto.rover.audience.v1.Null', null, global);
goog.exportSymbol('proto.rover.audience.v1.NumberPredicate', null, global);
goog.exportSymbol('proto.rover.audience.v1.NumberPredicate.Op', null, global);
goog.exportSymbol('proto.rover.audience.v1.Platform', null, global);
goog.exportSymbol('proto.rover.audience.v1.Predicate', null, global);
goog.exportSymbol('proto.rover.audience.v1.Predicate.Selector', null, global);
goog.exportSymbol('proto.rover.audience.v1.PredicateAggregate', null, global);
goog.exportSymbol('proto.rover.audience.v1.PredicateAggregate.Condition', null, global);
goog.exportSymbol('proto.rover.audience.v1.Profile', null, global);
goog.exportSymbol('proto.rover.audience.v1.ProfileSchema', null, global);
goog.exportSymbol('proto.rover.audience.v1.QueryRequest', null, global);
goog.exportSymbol('proto.rover.audience.v1.QueryRequest.PageIterator', null, global);
goog.exportSymbol('proto.rover.audience.v1.QueryRequest.ScrollIterator', null, global);
goog.exportSymbol('proto.rover.audience.v1.QueryRequest.ScrollIterator.Clear', null, global);
goog.exportSymbol('proto.rover.audience.v1.QueryRequest.ScrollIterator.Next', null, global);
goog.exportSymbol('proto.rover.audience.v1.QueryRequest.ScrollIterator.StartParallelScroll', null, global);
goog.exportSymbol('proto.rover.audience.v1.QueryRequest.ScrollIterator.StartScroll', null, global);
goog.exportSymbol('proto.rover.audience.v1.QueryRequest.TimeZoneOffset', null, global);
goog.exportSymbol('proto.rover.audience.v1.QueryResponse', null, global);
goog.exportSymbol('proto.rover.audience.v1.SchemaAttribute', null, global);
goog.exportSymbol('proto.rover.audience.v1.SetDeviceProfileRequest', null, global);
goog.exportSymbol('proto.rover.audience.v1.SetDeviceProfileResponse', null, global);
goog.exportSymbol('proto.rover.audience.v1.StringArrayPredicate', null, global);
goog.exportSymbol('proto.rover.audience.v1.StringArrayPredicate.Op', null, global);
goog.exportSymbol('proto.rover.audience.v1.StringPredicate', null, global);
goog.exportSymbol('proto.rover.audience.v1.StringPredicate.Op', null, global);
goog.exportSymbol('proto.rover.audience.v1.UpdateDeviceGeofenceMonitoringRequest', null, global);
goog.exportSymbol('proto.rover.audience.v1.UpdateDeviceGeofenceMonitoringResponse', null, global);
goog.exportSymbol('proto.rover.audience.v1.UpdateDeviceIBeaconMonitoringRequest', null, global);
goog.exportSymbol('proto.rover.audience.v1.UpdateDeviceIBeaconMonitoringResponse', null, global);
goog.exportSymbol('proto.rover.audience.v1.UpdateDeviceLabelPropertyRequest', null, global);
goog.exportSymbol('proto.rover.audience.v1.UpdateDeviceLabelPropertyResponse', null, global);
goog.exportSymbol('proto.rover.audience.v1.UpdateDeviceLocationRequest', null, global);
goog.exportSymbol('proto.rover.audience.v1.UpdateDeviceLocationResponse', null, global);
goog.exportSymbol('proto.rover.audience.v1.UpdateDevicePushTokenRequest', null, global);
goog.exportSymbol('proto.rover.audience.v1.UpdateDevicePushTokenResponse', null, global);
goog.exportSymbol('proto.rover.audience.v1.UpdateDeviceRequest', null, global);
goog.exportSymbol('proto.rover.audience.v1.UpdateDeviceResponse', null, global);
goog.exportSymbol('proto.rover.audience.v1.UpdateDeviceTestPropertyRequest', null, global);
goog.exportSymbol('proto.rover.audience.v1.UpdateDeviceTestPropertyResponse', null, global);
goog.exportSymbol('proto.rover.audience.v1.UpdateDeviceUnregisterPushTokenRequest', null, global);
goog.exportSymbol('proto.rover.audience.v1.UpdateDeviceUnregisterPushTokenResponse', null, global);
goog.exportSymbol('proto.rover.audience.v1.UpdateDynamicSegmentArchiveStatusRequest', null, global);
goog.exportSymbol('proto.rover.audience.v1.UpdateDynamicSegmentArchiveStatusResponse', null, global);
goog.exportSymbol('proto.rover.audience.v1.UpdateDynamicSegmentPredicatesRequest', null, global);
goog.exportSymbol('proto.rover.audience.v1.UpdateDynamicSegmentPredicatesResponse', null, global);
goog.exportSymbol('proto.rover.audience.v1.UpdateDynamicSegmentTitleRequest', null, global);
goog.exportSymbol('proto.rover.audience.v1.UpdateDynamicSegmentTitleResponse', null, global);
goog.exportSymbol('proto.rover.audience.v1.UpdateProfileIdentifierRequest', null, global);
goog.exportSymbol('proto.rover.audience.v1.UpdateProfileIdentifierResponse', null, global);
goog.exportSymbol('proto.rover.audience.v1.UpdateProfileRequest', null, global);
goog.exportSymbol('proto.rover.audience.v1.UpdateProfileResponse', null, global);
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
 * optional string identifier = 2;
 * @return {string}
 */
proto.rover.audience.v1.CreateProfileRequest.prototype.getIdentifier = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/** @param {string} value */
proto.rover.audience.v1.CreateProfileRequest.prototype.setIdentifier = function(value) {
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
proto.rover.audience.v1.ListProfilesByIdentifiersRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.rover.audience.v1.ListProfilesByIdentifiersRequest.repeatedFields_, null);
};
goog.inherits(proto.rover.audience.v1.ListProfilesByIdentifiersRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.ListProfilesByIdentifiersRequest.displayName = 'proto.rover.audience.v1.ListProfilesByIdentifiersRequest';
}
/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.rover.audience.v1.ListProfilesByIdentifiersRequest.repeatedFields_ = [2];



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
proto.rover.audience.v1.ListProfilesByIdentifiersRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.ListProfilesByIdentifiersRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.ListProfilesByIdentifiersRequest} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.ListProfilesByIdentifiersRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    authContext: (f = msg.getAuthContext()) && auth_v1_auth_pb.AuthContext.toObject(includeInstance, f),
    profileIdentifiersList: jspb.Message.getField(msg, 2)
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
 * @return {!proto.rover.audience.v1.ListProfilesByIdentifiersRequest}
 */
proto.rover.audience.v1.ListProfilesByIdentifiersRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.ListProfilesByIdentifiersRequest;
  return proto.rover.audience.v1.ListProfilesByIdentifiersRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.ListProfilesByIdentifiersRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.ListProfilesByIdentifiersRequest}
 */
proto.rover.audience.v1.ListProfilesByIdentifiersRequest.deserializeBinaryFromReader = function(msg, reader) {
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
      msg.addProfileIdentifiers(value);
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
proto.rover.audience.v1.ListProfilesByIdentifiersRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.ListProfilesByIdentifiersRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.ListProfilesByIdentifiersRequest} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.ListProfilesByIdentifiersRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getAuthContext();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      auth_v1_auth_pb.AuthContext.serializeBinaryToWriter
    );
  }
  f = message.getProfileIdentifiersList();
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
proto.rover.audience.v1.ListProfilesByIdentifiersRequest.prototype.getAuthContext = function() {
  return /** @type{?proto.rover.auth.v1.AuthContext} */ (
    jspb.Message.getWrapperField(this, auth_v1_auth_pb.AuthContext, 1));
};


/** @param {?proto.rover.auth.v1.AuthContext|undefined} value */
proto.rover.audience.v1.ListProfilesByIdentifiersRequest.prototype.setAuthContext = function(value) {
  jspb.Message.setWrapperField(this, 1, value);
};


proto.rover.audience.v1.ListProfilesByIdentifiersRequest.prototype.clearAuthContext = function() {
  this.setAuthContext(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.ListProfilesByIdentifiersRequest.prototype.hasAuthContext = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * repeated string profile_identifiers = 2;
 * If you change this array by adding, removing or replacing elements, or if you
 * replace the array itself, then you must call the setter to update it.
 * @return {!Array.<string>}
 */
proto.rover.audience.v1.ListProfilesByIdentifiersRequest.prototype.getProfileIdentifiersList = function() {
  return /** @type {!Array.<string>} */ (jspb.Message.getField(this, 2));
};


/** @param {!Array.<string>} value */
proto.rover.audience.v1.ListProfilesByIdentifiersRequest.prototype.setProfileIdentifiersList = function(value) {
  jspb.Message.setField(this, 2, value || []);
};


/**
 * @param {!string} value
 * @param {number=} opt_index
 */
proto.rover.audience.v1.ListProfilesByIdentifiersRequest.prototype.addProfileIdentifiers = function(value, opt_index) {
  jspb.Message.addToRepeatedField(this, 2, value, opt_index);
};


proto.rover.audience.v1.ListProfilesByIdentifiersRequest.prototype.clearProfileIdentifiersList = function() {
  this.setProfileIdentifiersList([]);
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
proto.rover.audience.v1.ListProfilesByIdentifiersResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.rover.audience.v1.ListProfilesByIdentifiersResponse.repeatedFields_, null);
};
goog.inherits(proto.rover.audience.v1.ListProfilesByIdentifiersResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.ListProfilesByIdentifiersResponse.displayName = 'proto.rover.audience.v1.ListProfilesByIdentifiersResponse';
}
/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.rover.audience.v1.ListProfilesByIdentifiersResponse.repeatedFields_ = [2];



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
proto.rover.audience.v1.ListProfilesByIdentifiersResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.ListProfilesByIdentifiersResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.ListProfilesByIdentifiersResponse} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.ListProfilesByIdentifiersResponse.toObject = function(includeInstance, msg) {
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
 * @return {!proto.rover.audience.v1.ListProfilesByIdentifiersResponse}
 */
proto.rover.audience.v1.ListProfilesByIdentifiersResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.ListProfilesByIdentifiersResponse;
  return proto.rover.audience.v1.ListProfilesByIdentifiersResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.ListProfilesByIdentifiersResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.ListProfilesByIdentifiersResponse}
 */
proto.rover.audience.v1.ListProfilesByIdentifiersResponse.deserializeBinaryFromReader = function(msg, reader) {
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
proto.rover.audience.v1.ListProfilesByIdentifiersResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.ListProfilesByIdentifiersResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.ListProfilesByIdentifiersResponse} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.ListProfilesByIdentifiersResponse.serializeBinaryToWriter = function(message, writer) {
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
proto.rover.audience.v1.ListProfilesByIdentifiersResponse.prototype.getProfilesList = function() {
  return /** @type{!Array.<!proto.rover.audience.v1.Profile>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.rover.audience.v1.Profile, 2));
};


/** @param {!Array.<!proto.rover.audience.v1.Profile>} value */
proto.rover.audience.v1.ListProfilesByIdentifiersResponse.prototype.setProfilesList = function(value) {
  jspb.Message.setRepeatedWrapperField(this, 2, value);
};


/**
 * @param {!proto.rover.audience.v1.Profile=} opt_value
 * @param {number=} opt_index
 * @return {!proto.rover.audience.v1.Profile}
 */
proto.rover.audience.v1.ListProfilesByIdentifiersResponse.prototype.addProfiles = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 2, opt_value, proto.rover.audience.v1.Profile, opt_index);
};


proto.rover.audience.v1.ListProfilesByIdentifiersResponse.prototype.clearProfilesList = function() {
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
    pushTokenKey: jspb.Message.getFieldWithDefault(msg, 2, "")
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
      msg.setPushTokenKey(value);
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
  f = message.getPushTokenKey();
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
 * optional string push_token_key = 2;
 * @return {string}
 */
proto.rover.audience.v1.GetDeviceByPushTokenRequest.prototype.getPushTokenKey = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/** @param {string} value */
proto.rover.audience.v1.GetDeviceByPushTokenRequest.prototype.setPushTokenKey = function(value) {
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
    pushTokenKey: jspb.Message.getFieldWithDefault(msg, 3, ""),
    pushEnvironment: jspb.Message.getFieldWithDefault(msg, 4, "")
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
      msg.setPushTokenKey(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setPushEnvironment(value);
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
  f = message.getPushTokenKey();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getPushEnvironment();
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
 * optional string push_token_key = 3;
 * @return {string}
 */
proto.rover.audience.v1.UpdateDevicePushTokenRequest.prototype.getPushTokenKey = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/** @param {string} value */
proto.rover.audience.v1.UpdateDevicePushTokenRequest.prototype.setPushTokenKey = function(value) {
  jspb.Message.setField(this, 3, value);
};


/**
 * optional string push_environment = 4;
 * @return {string}
 */
proto.rover.audience.v1.UpdateDevicePushTokenRequest.prototype.getPushEnvironment = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/** @param {string} value */
proto.rover.audience.v1.UpdateDevicePushTokenRequest.prototype.setPushEnvironment = function(value) {
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
proto.rover.audience.v1.UpdateDeviceTestPropertyRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.rover.audience.v1.UpdateDeviceTestPropertyRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.UpdateDeviceTestPropertyRequest.displayName = 'proto.rover.audience.v1.UpdateDeviceTestPropertyRequest';
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
proto.rover.audience.v1.UpdateDeviceTestPropertyRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.UpdateDeviceTestPropertyRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.UpdateDeviceTestPropertyRequest} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.UpdateDeviceTestPropertyRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    authContext: (f = msg.getAuthContext()) && auth_v1_auth_pb.AuthContext.toObject(includeInstance, f),
    deviceId: jspb.Message.getFieldWithDefault(msg, 2, ""),
    isTestDevice: jspb.Message.getFieldWithDefault(msg, 3, false)
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
 * @return {!proto.rover.audience.v1.UpdateDeviceTestPropertyRequest}
 */
proto.rover.audience.v1.UpdateDeviceTestPropertyRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.UpdateDeviceTestPropertyRequest;
  return proto.rover.audience.v1.UpdateDeviceTestPropertyRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.UpdateDeviceTestPropertyRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.UpdateDeviceTestPropertyRequest}
 */
proto.rover.audience.v1.UpdateDeviceTestPropertyRequest.deserializeBinaryFromReader = function(msg, reader) {
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
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setIsTestDevice(value);
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
proto.rover.audience.v1.UpdateDeviceTestPropertyRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.UpdateDeviceTestPropertyRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.UpdateDeviceTestPropertyRequest} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.UpdateDeviceTestPropertyRequest.serializeBinaryToWriter = function(message, writer) {
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
  f = message.getIsTestDevice();
  if (f) {
    writer.writeBool(
      3,
      f
    );
  }
};


/**
 * optional rover.auth.v1.AuthContext auth_context = 1;
 * @return {?proto.rover.auth.v1.AuthContext}
 */
proto.rover.audience.v1.UpdateDeviceTestPropertyRequest.prototype.getAuthContext = function() {
  return /** @type{?proto.rover.auth.v1.AuthContext} */ (
    jspb.Message.getWrapperField(this, auth_v1_auth_pb.AuthContext, 1));
};


/** @param {?proto.rover.auth.v1.AuthContext|undefined} value */
proto.rover.audience.v1.UpdateDeviceTestPropertyRequest.prototype.setAuthContext = function(value) {
  jspb.Message.setWrapperField(this, 1, value);
};


proto.rover.audience.v1.UpdateDeviceTestPropertyRequest.prototype.clearAuthContext = function() {
  this.setAuthContext(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.UpdateDeviceTestPropertyRequest.prototype.hasAuthContext = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional string device_id = 2;
 * @return {string}
 */
proto.rover.audience.v1.UpdateDeviceTestPropertyRequest.prototype.getDeviceId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/** @param {string} value */
proto.rover.audience.v1.UpdateDeviceTestPropertyRequest.prototype.setDeviceId = function(value) {
  jspb.Message.setField(this, 2, value);
};


/**
 * optional bool is_test_device = 3;
 * Note that Boolean fields may be set to 0/1 when serialized from a Java server.
 * You should avoid comparisons like {@code val === true/false} in those cases.
 * @return {boolean}
 */
proto.rover.audience.v1.UpdateDeviceTestPropertyRequest.prototype.getIsTestDevice = function() {
  return /** @type {boolean} */ (jspb.Message.getFieldWithDefault(this, 3, false));
};


/** @param {boolean} value */
proto.rover.audience.v1.UpdateDeviceTestPropertyRequest.prototype.setIsTestDevice = function(value) {
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
proto.rover.audience.v1.UpdateDeviceTestPropertyResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.rover.audience.v1.UpdateDeviceTestPropertyResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.UpdateDeviceTestPropertyResponse.displayName = 'proto.rover.audience.v1.UpdateDeviceTestPropertyResponse';
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
proto.rover.audience.v1.UpdateDeviceTestPropertyResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.UpdateDeviceTestPropertyResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.UpdateDeviceTestPropertyResponse} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.UpdateDeviceTestPropertyResponse.toObject = function(includeInstance, msg) {
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
 * @return {!proto.rover.audience.v1.UpdateDeviceTestPropertyResponse}
 */
proto.rover.audience.v1.UpdateDeviceTestPropertyResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.UpdateDeviceTestPropertyResponse;
  return proto.rover.audience.v1.UpdateDeviceTestPropertyResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.UpdateDeviceTestPropertyResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.UpdateDeviceTestPropertyResponse}
 */
proto.rover.audience.v1.UpdateDeviceTestPropertyResponse.deserializeBinaryFromReader = function(msg, reader) {
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
proto.rover.audience.v1.UpdateDeviceTestPropertyResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.UpdateDeviceTestPropertyResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.UpdateDeviceTestPropertyResponse} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.UpdateDeviceTestPropertyResponse.serializeBinaryToWriter = function(message, writer) {
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
proto.rover.audience.v1.UpdateDeviceLabelPropertyRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.rover.audience.v1.UpdateDeviceLabelPropertyRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.UpdateDeviceLabelPropertyRequest.displayName = 'proto.rover.audience.v1.UpdateDeviceLabelPropertyRequest';
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
proto.rover.audience.v1.UpdateDeviceLabelPropertyRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.UpdateDeviceLabelPropertyRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.UpdateDeviceLabelPropertyRequest} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.UpdateDeviceLabelPropertyRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    authContext: (f = msg.getAuthContext()) && auth_v1_auth_pb.AuthContext.toObject(includeInstance, f),
    deviceId: jspb.Message.getFieldWithDefault(msg, 2, ""),
    label: jspb.Message.getFieldWithDefault(msg, 3, "")
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
 * @return {!proto.rover.audience.v1.UpdateDeviceLabelPropertyRequest}
 */
proto.rover.audience.v1.UpdateDeviceLabelPropertyRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.UpdateDeviceLabelPropertyRequest;
  return proto.rover.audience.v1.UpdateDeviceLabelPropertyRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.UpdateDeviceLabelPropertyRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.UpdateDeviceLabelPropertyRequest}
 */
proto.rover.audience.v1.UpdateDeviceLabelPropertyRequest.deserializeBinaryFromReader = function(msg, reader) {
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
      msg.setLabel(value);
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
proto.rover.audience.v1.UpdateDeviceLabelPropertyRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.UpdateDeviceLabelPropertyRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.UpdateDeviceLabelPropertyRequest} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.UpdateDeviceLabelPropertyRequest.serializeBinaryToWriter = function(message, writer) {
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
  f = message.getLabel();
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
proto.rover.audience.v1.UpdateDeviceLabelPropertyRequest.prototype.getAuthContext = function() {
  return /** @type{?proto.rover.auth.v1.AuthContext} */ (
    jspb.Message.getWrapperField(this, auth_v1_auth_pb.AuthContext, 1));
};


/** @param {?proto.rover.auth.v1.AuthContext|undefined} value */
proto.rover.audience.v1.UpdateDeviceLabelPropertyRequest.prototype.setAuthContext = function(value) {
  jspb.Message.setWrapperField(this, 1, value);
};


proto.rover.audience.v1.UpdateDeviceLabelPropertyRequest.prototype.clearAuthContext = function() {
  this.setAuthContext(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.UpdateDeviceLabelPropertyRequest.prototype.hasAuthContext = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional string device_id = 2;
 * @return {string}
 */
proto.rover.audience.v1.UpdateDeviceLabelPropertyRequest.prototype.getDeviceId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/** @param {string} value */
proto.rover.audience.v1.UpdateDeviceLabelPropertyRequest.prototype.setDeviceId = function(value) {
  jspb.Message.setField(this, 2, value);
};


/**
 * optional string label = 3;
 * @return {string}
 */
proto.rover.audience.v1.UpdateDeviceLabelPropertyRequest.prototype.getLabel = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/** @param {string} value */
proto.rover.audience.v1.UpdateDeviceLabelPropertyRequest.prototype.setLabel = function(value) {
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
proto.rover.audience.v1.UpdateDeviceLabelPropertyResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.rover.audience.v1.UpdateDeviceLabelPropertyResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.UpdateDeviceLabelPropertyResponse.displayName = 'proto.rover.audience.v1.UpdateDeviceLabelPropertyResponse';
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
proto.rover.audience.v1.UpdateDeviceLabelPropertyResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.UpdateDeviceLabelPropertyResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.UpdateDeviceLabelPropertyResponse} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.UpdateDeviceLabelPropertyResponse.toObject = function(includeInstance, msg) {
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
 * @return {!proto.rover.audience.v1.UpdateDeviceLabelPropertyResponse}
 */
proto.rover.audience.v1.UpdateDeviceLabelPropertyResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.UpdateDeviceLabelPropertyResponse;
  return proto.rover.audience.v1.UpdateDeviceLabelPropertyResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.UpdateDeviceLabelPropertyResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.UpdateDeviceLabelPropertyResponse}
 */
proto.rover.audience.v1.UpdateDeviceLabelPropertyResponse.deserializeBinaryFromReader = function(msg, reader) {
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
proto.rover.audience.v1.UpdateDeviceLabelPropertyResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.UpdateDeviceLabelPropertyResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.UpdateDeviceLabelPropertyResponse} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.UpdateDeviceLabelPropertyResponse.serializeBinaryToWriter = function(message, writer) {
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
proto.rover.audience.v1.GetDeviceSchemaRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.rover.audience.v1.GetDeviceSchemaRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.GetDeviceSchemaRequest.displayName = 'proto.rover.audience.v1.GetDeviceSchemaRequest';
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
proto.rover.audience.v1.GetDeviceSchemaRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.GetDeviceSchemaRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.GetDeviceSchemaRequest} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.GetDeviceSchemaRequest.toObject = function(includeInstance, msg) {
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
 * @return {!proto.rover.audience.v1.GetDeviceSchemaRequest}
 */
proto.rover.audience.v1.GetDeviceSchemaRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.GetDeviceSchemaRequest;
  return proto.rover.audience.v1.GetDeviceSchemaRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.GetDeviceSchemaRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.GetDeviceSchemaRequest}
 */
proto.rover.audience.v1.GetDeviceSchemaRequest.deserializeBinaryFromReader = function(msg, reader) {
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
proto.rover.audience.v1.GetDeviceSchemaRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.GetDeviceSchemaRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.GetDeviceSchemaRequest} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.GetDeviceSchemaRequest.serializeBinaryToWriter = function(message, writer) {
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
proto.rover.audience.v1.GetDeviceSchemaRequest.prototype.getAuthContext = function() {
  return /** @type{?proto.rover.auth.v1.AuthContext} */ (
    jspb.Message.getWrapperField(this, auth_v1_auth_pb.AuthContext, 1));
};


/** @param {?proto.rover.auth.v1.AuthContext|undefined} value */
proto.rover.audience.v1.GetDeviceSchemaRequest.prototype.setAuthContext = function(value) {
  jspb.Message.setWrapperField(this, 1, value);
};


proto.rover.audience.v1.GetDeviceSchemaRequest.prototype.clearAuthContext = function() {
  this.setAuthContext(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.GetDeviceSchemaRequest.prototype.hasAuthContext = function() {
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
proto.rover.audience.v1.GetDeviceSchemaResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.rover.audience.v1.GetDeviceSchemaResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.GetDeviceSchemaResponse.displayName = 'proto.rover.audience.v1.GetDeviceSchemaResponse';
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
proto.rover.audience.v1.GetDeviceSchemaResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.GetDeviceSchemaResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.GetDeviceSchemaResponse} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.GetDeviceSchemaResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    schema: (f = msg.getSchema()) && proto.rover.audience.v1.DeviceSchema.toObject(includeInstance, f)
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
 * @return {!proto.rover.audience.v1.GetDeviceSchemaResponse}
 */
proto.rover.audience.v1.GetDeviceSchemaResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.GetDeviceSchemaResponse;
  return proto.rover.audience.v1.GetDeviceSchemaResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.GetDeviceSchemaResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.GetDeviceSchemaResponse}
 */
proto.rover.audience.v1.GetDeviceSchemaResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.rover.audience.v1.DeviceSchema;
      reader.readMessage(value,proto.rover.audience.v1.DeviceSchema.deserializeBinaryFromReader);
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
proto.rover.audience.v1.GetDeviceSchemaResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.GetDeviceSchemaResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.GetDeviceSchemaResponse} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.GetDeviceSchemaResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSchema();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.rover.audience.v1.DeviceSchema.serializeBinaryToWriter
    );
  }
};


/**
 * optional DeviceSchema schema = 1;
 * @return {?proto.rover.audience.v1.DeviceSchema}
 */
proto.rover.audience.v1.GetDeviceSchemaResponse.prototype.getSchema = function() {
  return /** @type{?proto.rover.audience.v1.DeviceSchema} */ (
    jspb.Message.getWrapperField(this, proto.rover.audience.v1.DeviceSchema, 1));
};


/** @param {?proto.rover.audience.v1.DeviceSchema|undefined} value */
proto.rover.audience.v1.GetDeviceSchemaResponse.prototype.setSchema = function(value) {
  jspb.Message.setWrapperField(this, 1, value);
};


proto.rover.audience.v1.GetDeviceSchemaResponse.prototype.clearSchema = function() {
  this.setSchema(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.GetDeviceSchemaResponse.prototype.hasSchema = function() {
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
proto.rover.audience.v1.DeviceSchema = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.rover.audience.v1.DeviceSchema.repeatedFields_, null);
};
goog.inherits(proto.rover.audience.v1.DeviceSchema, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.DeviceSchema.displayName = 'proto.rover.audience.v1.DeviceSchema';
}
/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.rover.audience.v1.DeviceSchema.repeatedFields_ = [1];



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
proto.rover.audience.v1.DeviceSchema.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.DeviceSchema.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.DeviceSchema} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.DeviceSchema.toObject = function(includeInstance, msg) {
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
 * @return {!proto.rover.audience.v1.DeviceSchema}
 */
proto.rover.audience.v1.DeviceSchema.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.DeviceSchema;
  return proto.rover.audience.v1.DeviceSchema.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.DeviceSchema} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.DeviceSchema}
 */
proto.rover.audience.v1.DeviceSchema.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
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
proto.rover.audience.v1.DeviceSchema.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.DeviceSchema.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.DeviceSchema} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.DeviceSchema.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getAttributesList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      proto.rover.audience.v1.SchemaAttribute.serializeBinaryToWriter
    );
  }
};


/**
 * repeated SchemaAttribute attributes = 1;
 * If you change this array by adding, removing or replacing elements, or if you
 * replace the array itself, then you must call the setter to update it.
 * @return {!Array.<!proto.rover.audience.v1.SchemaAttribute>}
 */
proto.rover.audience.v1.DeviceSchema.prototype.getAttributesList = function() {
  return /** @type{!Array.<!proto.rover.audience.v1.SchemaAttribute>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.rover.audience.v1.SchemaAttribute, 1));
};


/** @param {!Array.<!proto.rover.audience.v1.SchemaAttribute>} value */
proto.rover.audience.v1.DeviceSchema.prototype.setAttributesList = function(value) {
  jspb.Message.setRepeatedWrapperField(this, 1, value);
};


/**
 * @param {!proto.rover.audience.v1.SchemaAttribute=} opt_value
 * @param {number=} opt_index
 * @return {!proto.rover.audience.v1.SchemaAttribute}
 */
proto.rover.audience.v1.DeviceSchema.prototype.addAttributes = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.rover.audience.v1.SchemaAttribute, opt_index);
};


proto.rover.audience.v1.DeviceSchema.prototype.clearAttributesList = function() {
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
    pushEnvironment: jspb.Message.getFieldWithDefault(msg, 10, ""),
    pushTokenKey: jspb.Message.getFieldWithDefault(msg, 11, ""),
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
      msg.setPushEnvironment(value);
      break;
    case 11:
      var value = /** @type {string} */ (reader.readString());
      msg.setPushTokenKey(value);
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
  f = message.getPushEnvironment();
  if (f.length > 0) {
    writer.writeString(
      10,
      f
    );
  }
  f = message.getPushTokenKey();
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
 * optional string push_environment = 10;
 * @return {string}
 */
proto.rover.audience.v1.UpdateDeviceRequest.prototype.getPushEnvironment = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 10, ""));
};


/** @param {string} value */
proto.rover.audience.v1.UpdateDeviceRequest.prototype.setPushEnvironment = function(value) {
  jspb.Message.setField(this, 10, value);
};


/**
 * optional string push_token_key = 11;
 * @return {string}
 */
proto.rover.audience.v1.UpdateDeviceRequest.prototype.getPushTokenKey = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 11, ""));
};


/** @param {string} value */
proto.rover.audience.v1.UpdateDeviceRequest.prototype.setPushTokenKey = function(value) {
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
    isTestDevice: jspb.Message.getFieldWithDefault(msg, 7, false),
    label: jspb.Message.getFieldWithDefault(msg, 8, ""),
    pushEnvironment: jspb.Message.getFieldWithDefault(msg, 10, ""),
    pushTokenKey: jspb.Message.getFieldWithDefault(msg, 11, ""),
    pushTokenIsActive: jspb.Message.getFieldWithDefault(msg, 12, false),
    pushTokenCreatedAt: (f = msg.getPushTokenCreatedAt()) && google_protobuf_timestamp_pb.Timestamp.toObject(includeInstance, f),
    pushTokenUpdatedAt: (f = msg.getPushTokenUpdatedAt()) && google_protobuf_timestamp_pb.Timestamp.toObject(includeInstance, f),
    pushTokenUnregisteredAt: (f = msg.getPushTokenUnregisteredAt()) && google_protobuf_timestamp_pb.Timestamp.toObject(includeInstance, f),
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
    locationUpdatedAt: (f = msg.getLocationUpdatedAt()) && google_protobuf_timestamp_pb.Timestamp.toObject(includeInstance, f),
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
    case 7:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setIsTestDevice(value);
      break;
    case 8:
      var value = /** @type {string} */ (reader.readString());
      msg.setLabel(value);
      break;
    case 10:
      var value = /** @type {string} */ (reader.readString());
      msg.setPushEnvironment(value);
      break;
    case 11:
      var value = /** @type {string} */ (reader.readString());
      msg.setPushTokenKey(value);
      break;
    case 12:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setPushTokenIsActive(value);
      break;
    case 13:
      var value = new google_protobuf_timestamp_pb.Timestamp;
      reader.readMessage(value,google_protobuf_timestamp_pb.Timestamp.deserializeBinaryFromReader);
      msg.setPushTokenCreatedAt(value);
      break;
    case 14:
      var value = new google_protobuf_timestamp_pb.Timestamp;
      reader.readMessage(value,google_protobuf_timestamp_pb.Timestamp.deserializeBinaryFromReader);
      msg.setPushTokenUpdatedAt(value);
      break;
    case 15:
      var value = new google_protobuf_timestamp_pb.Timestamp;
      reader.readMessage(value,google_protobuf_timestamp_pb.Timestamp.deserializeBinaryFromReader);
      msg.setPushTokenUnregisteredAt(value);
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
    case 52:
      var value = new google_protobuf_timestamp_pb.Timestamp;
      reader.readMessage(value,google_protobuf_timestamp_pb.Timestamp.deserializeBinaryFromReader);
      msg.setLocationUpdatedAt(value);
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
  f = message.getIsTestDevice();
  if (f) {
    writer.writeBool(
      7,
      f
    );
  }
  f = message.getLabel();
  if (f.length > 0) {
    writer.writeString(
      8,
      f
    );
  }
  f = message.getPushEnvironment();
  if (f.length > 0) {
    writer.writeString(
      10,
      f
    );
  }
  f = message.getPushTokenKey();
  if (f.length > 0) {
    writer.writeString(
      11,
      f
    );
  }
  f = message.getPushTokenIsActive();
  if (f) {
    writer.writeBool(
      12,
      f
    );
  }
  f = message.getPushTokenCreatedAt();
  if (f != null) {
    writer.writeMessage(
      13,
      f,
      google_protobuf_timestamp_pb.Timestamp.serializeBinaryToWriter
    );
  }
  f = message.getPushTokenUpdatedAt();
  if (f != null) {
    writer.writeMessage(
      14,
      f,
      google_protobuf_timestamp_pb.Timestamp.serializeBinaryToWriter
    );
  }
  f = message.getPushTokenUnregisteredAt();
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
  f = message.getLocationUpdatedAt();
  if (f != null) {
    writer.writeMessage(
      52,
      f,
      google_protobuf_timestamp_pb.Timestamp.serializeBinaryToWriter
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
 * optional bool is_test_device = 7;
 * Note that Boolean fields may be set to 0/1 when serialized from a Java server.
 * You should avoid comparisons like {@code val === true/false} in those cases.
 * @return {boolean}
 */
proto.rover.audience.v1.Device.prototype.getIsTestDevice = function() {
  return /** @type {boolean} */ (jspb.Message.getFieldWithDefault(this, 7, false));
};


/** @param {boolean} value */
proto.rover.audience.v1.Device.prototype.setIsTestDevice = function(value) {
  jspb.Message.setField(this, 7, value);
};


/**
 * optional string label = 8;
 * @return {string}
 */
proto.rover.audience.v1.Device.prototype.getLabel = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 8, ""));
};


/** @param {string} value */
proto.rover.audience.v1.Device.prototype.setLabel = function(value) {
  jspb.Message.setField(this, 8, value);
};


/**
 * optional string push_environment = 10;
 * @return {string}
 */
proto.rover.audience.v1.Device.prototype.getPushEnvironment = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 10, ""));
};


/** @param {string} value */
proto.rover.audience.v1.Device.prototype.setPushEnvironment = function(value) {
  jspb.Message.setField(this, 10, value);
};


/**
 * optional string push_token_key = 11;
 * @return {string}
 */
proto.rover.audience.v1.Device.prototype.getPushTokenKey = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 11, ""));
};


/** @param {string} value */
proto.rover.audience.v1.Device.prototype.setPushTokenKey = function(value) {
  jspb.Message.setField(this, 11, value);
};


/**
 * optional bool push_token_is_active = 12;
 * Note that Boolean fields may be set to 0/1 when serialized from a Java server.
 * You should avoid comparisons like {@code val === true/false} in those cases.
 * @return {boolean}
 */
proto.rover.audience.v1.Device.prototype.getPushTokenIsActive = function() {
  return /** @type {boolean} */ (jspb.Message.getFieldWithDefault(this, 12, false));
};


/** @param {boolean} value */
proto.rover.audience.v1.Device.prototype.setPushTokenIsActive = function(value) {
  jspb.Message.setField(this, 12, value);
};


/**
 * optional google.protobuf.Timestamp push_token_created_at = 13;
 * @return {?proto.google.protobuf.Timestamp}
 */
proto.rover.audience.v1.Device.prototype.getPushTokenCreatedAt = function() {
  return /** @type{?proto.google.protobuf.Timestamp} */ (
    jspb.Message.getWrapperField(this, google_protobuf_timestamp_pb.Timestamp, 13));
};


/** @param {?proto.google.protobuf.Timestamp|undefined} value */
proto.rover.audience.v1.Device.prototype.setPushTokenCreatedAt = function(value) {
  jspb.Message.setWrapperField(this, 13, value);
};


proto.rover.audience.v1.Device.prototype.clearPushTokenCreatedAt = function() {
  this.setPushTokenCreatedAt(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.Device.prototype.hasPushTokenCreatedAt = function() {
  return jspb.Message.getField(this, 13) != null;
};


/**
 * optional google.protobuf.Timestamp push_token_updated_at = 14;
 * @return {?proto.google.protobuf.Timestamp}
 */
proto.rover.audience.v1.Device.prototype.getPushTokenUpdatedAt = function() {
  return /** @type{?proto.google.protobuf.Timestamp} */ (
    jspb.Message.getWrapperField(this, google_protobuf_timestamp_pb.Timestamp, 14));
};


/** @param {?proto.google.protobuf.Timestamp|undefined} value */
proto.rover.audience.v1.Device.prototype.setPushTokenUpdatedAt = function(value) {
  jspb.Message.setWrapperField(this, 14, value);
};


proto.rover.audience.v1.Device.prototype.clearPushTokenUpdatedAt = function() {
  this.setPushTokenUpdatedAt(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.Device.prototype.hasPushTokenUpdatedAt = function() {
  return jspb.Message.getField(this, 14) != null;
};


/**
 * optional google.protobuf.Timestamp push_token_unregistered_at = 15;
 * @return {?proto.google.protobuf.Timestamp}
 */
proto.rover.audience.v1.Device.prototype.getPushTokenUnregisteredAt = function() {
  return /** @type{?proto.google.protobuf.Timestamp} */ (
    jspb.Message.getWrapperField(this, google_protobuf_timestamp_pb.Timestamp, 15));
};


/** @param {?proto.google.protobuf.Timestamp|undefined} value */
proto.rover.audience.v1.Device.prototype.setPushTokenUnregisteredAt = function(value) {
  jspb.Message.setWrapperField(this, 15, value);
};


proto.rover.audience.v1.Device.prototype.clearPushTokenUnregisteredAt = function() {
  this.setPushTokenUnregisteredAt(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.Device.prototype.hasPushTokenUnregisteredAt = function() {
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
 * optional google.protobuf.Timestamp location_updated_at = 52;
 * @return {?proto.google.protobuf.Timestamp}
 */
proto.rover.audience.v1.Device.prototype.getLocationUpdatedAt = function() {
  return /** @type{?proto.google.protobuf.Timestamp} */ (
    jspb.Message.getWrapperField(this, google_protobuf_timestamp_pb.Timestamp, 52));
};


/** @param {?proto.google.protobuf.Timestamp|undefined} value */
proto.rover.audience.v1.Device.prototype.setLocationUpdatedAt = function(value) {
  jspb.Message.setWrapperField(this, 52, value);
};


proto.rover.audience.v1.Device.prototype.clearLocationUpdatedAt = function() {
  this.setLocationUpdatedAt(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.Device.prototype.hasLocationUpdatedAt = function() {
  return jspb.Message.getField(this, 52) != null;
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
    label: jspb.Message.getFieldWithDefault(msg, 4, ""),
    attributeType: jspb.Message.getFieldWithDefault(msg, 5, ""),
    path: jspb.Message.getFieldWithDefault(msg, 6, ""),
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
      msg.setLabel(value);
      break;
    case 5:
      var value = /** @type {string} */ (reader.readString());
      msg.setAttributeType(value);
      break;
    case 6:
      var value = /** @type {string} */ (reader.readString());
      msg.setPath(value);
      break;
    case 7:
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
  f = message.getLabel();
  if (f.length > 0) {
    writer.writeString(
      4,
      f
    );
  }
  f = message.getAttributeType();
  if (f.length > 0) {
    writer.writeString(
      5,
      f
    );
  }
  f = message.getPath();
  if (f.length > 0) {
    writer.writeString(
      6,
      f
    );
  }
  f = message.getCreatedAt();
  if (f != null) {
    writer.writeMessage(
      7,
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
 * optional string label = 4;
 * @return {string}
 */
proto.rover.audience.v1.SchemaAttribute.prototype.getLabel = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/** @param {string} value */
proto.rover.audience.v1.SchemaAttribute.prototype.setLabel = function(value) {
  jspb.Message.setField(this, 4, value);
};


/**
 * optional string attribute_type = 5;
 * @return {string}
 */
proto.rover.audience.v1.SchemaAttribute.prototype.getAttributeType = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 5, ""));
};


/** @param {string} value */
proto.rover.audience.v1.SchemaAttribute.prototype.setAttributeType = function(value) {
  jspb.Message.setField(this, 5, value);
};


/**
 * optional string path = 6;
 * @return {string}
 */
proto.rover.audience.v1.SchemaAttribute.prototype.getPath = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 6, ""));
};


/** @param {string} value */
proto.rover.audience.v1.SchemaAttribute.prototype.setPath = function(value) {
  jspb.Message.setField(this, 6, value);
};


/**
 * optional google.protobuf.Timestamp created_at = 7;
 * @return {?proto.google.protobuf.Timestamp}
 */
proto.rover.audience.v1.SchemaAttribute.prototype.getCreatedAt = function() {
  return /** @type{?proto.google.protobuf.Timestamp} */ (
    jspb.Message.getWrapperField(this, google_protobuf_timestamp_pb.Timestamp, 7));
};


/** @param {?proto.google.protobuf.Timestamp|undefined} value */
proto.rover.audience.v1.SchemaAttribute.prototype.setCreatedAt = function(value) {
  jspb.Message.setWrapperField(this, 7, value);
};


proto.rover.audience.v1.SchemaAttribute.prototype.clearCreatedAt = function() {
  this.setCreatedAt(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.SchemaAttribute.prototype.hasCreatedAt = function() {
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
proto.rover.audience.v1.GetProfilesTotalCountRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.rover.audience.v1.GetProfilesTotalCountRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.GetProfilesTotalCountRequest.displayName = 'proto.rover.audience.v1.GetProfilesTotalCountRequest';
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
proto.rover.audience.v1.GetProfilesTotalCountRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.GetProfilesTotalCountRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.GetProfilesTotalCountRequest} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.GetProfilesTotalCountRequest.toObject = function(includeInstance, msg) {
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
 * @return {!proto.rover.audience.v1.GetProfilesTotalCountRequest}
 */
proto.rover.audience.v1.GetProfilesTotalCountRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.GetProfilesTotalCountRequest;
  return proto.rover.audience.v1.GetProfilesTotalCountRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.GetProfilesTotalCountRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.GetProfilesTotalCountRequest}
 */
proto.rover.audience.v1.GetProfilesTotalCountRequest.deserializeBinaryFromReader = function(msg, reader) {
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
proto.rover.audience.v1.GetProfilesTotalCountRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.GetProfilesTotalCountRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.GetProfilesTotalCountRequest} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.GetProfilesTotalCountRequest.serializeBinaryToWriter = function(message, writer) {
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
proto.rover.audience.v1.GetProfilesTotalCountRequest.prototype.getAuthContext = function() {
  return /** @type{?proto.rover.auth.v1.AuthContext} */ (
    jspb.Message.getWrapperField(this, auth_v1_auth_pb.AuthContext, 1));
};


/** @param {?proto.rover.auth.v1.AuthContext|undefined} value */
proto.rover.audience.v1.GetProfilesTotalCountRequest.prototype.setAuthContext = function(value) {
  jspb.Message.setWrapperField(this, 1, value);
};


proto.rover.audience.v1.GetProfilesTotalCountRequest.prototype.clearAuthContext = function() {
  this.setAuthContext(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.GetProfilesTotalCountRequest.prototype.hasAuthContext = function() {
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
proto.rover.audience.v1.GetProfilesTotalCountResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.rover.audience.v1.GetProfilesTotalCountResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.GetProfilesTotalCountResponse.displayName = 'proto.rover.audience.v1.GetProfilesTotalCountResponse';
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
proto.rover.audience.v1.GetProfilesTotalCountResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.GetProfilesTotalCountResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.GetProfilesTotalCountResponse} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.GetProfilesTotalCountResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    total: jspb.Message.getFieldWithDefault(msg, 1, 0)
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
 * @return {!proto.rover.audience.v1.GetProfilesTotalCountResponse}
 */
proto.rover.audience.v1.GetProfilesTotalCountResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.GetProfilesTotalCountResponse;
  return proto.rover.audience.v1.GetProfilesTotalCountResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.GetProfilesTotalCountResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.GetProfilesTotalCountResponse}
 */
proto.rover.audience.v1.GetProfilesTotalCountResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setTotal(value);
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
proto.rover.audience.v1.GetProfilesTotalCountResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.GetProfilesTotalCountResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.GetProfilesTotalCountResponse} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.GetProfilesTotalCountResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getTotal();
  if (f !== 0) {
    writer.writeInt64(
      1,
      f
    );
  }
};


/**
 * optional int64 total = 1;
 * @return {number}
 */
proto.rover.audience.v1.GetProfilesTotalCountResponse.prototype.getTotal = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/** @param {number} value */
proto.rover.audience.v1.GetProfilesTotalCountResponse.prototype.setTotal = function(value) {
  jspb.Message.setField(this, 1, value);
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
proto.rover.audience.v1.GetDevicesTotalCountRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.rover.audience.v1.GetDevicesTotalCountRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.GetDevicesTotalCountRequest.displayName = 'proto.rover.audience.v1.GetDevicesTotalCountRequest';
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
proto.rover.audience.v1.GetDevicesTotalCountRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.GetDevicesTotalCountRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.GetDevicesTotalCountRequest} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.GetDevicesTotalCountRequest.toObject = function(includeInstance, msg) {
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
 * @return {!proto.rover.audience.v1.GetDevicesTotalCountRequest}
 */
proto.rover.audience.v1.GetDevicesTotalCountRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.GetDevicesTotalCountRequest;
  return proto.rover.audience.v1.GetDevicesTotalCountRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.GetDevicesTotalCountRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.GetDevicesTotalCountRequest}
 */
proto.rover.audience.v1.GetDevicesTotalCountRequest.deserializeBinaryFromReader = function(msg, reader) {
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
proto.rover.audience.v1.GetDevicesTotalCountRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.GetDevicesTotalCountRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.GetDevicesTotalCountRequest} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.GetDevicesTotalCountRequest.serializeBinaryToWriter = function(message, writer) {
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
proto.rover.audience.v1.GetDevicesTotalCountRequest.prototype.getAuthContext = function() {
  return /** @type{?proto.rover.auth.v1.AuthContext} */ (
    jspb.Message.getWrapperField(this, auth_v1_auth_pb.AuthContext, 1));
};


/** @param {?proto.rover.auth.v1.AuthContext|undefined} value */
proto.rover.audience.v1.GetDevicesTotalCountRequest.prototype.setAuthContext = function(value) {
  jspb.Message.setWrapperField(this, 1, value);
};


proto.rover.audience.v1.GetDevicesTotalCountRequest.prototype.clearAuthContext = function() {
  this.setAuthContext(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.GetDevicesTotalCountRequest.prototype.hasAuthContext = function() {
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
proto.rover.audience.v1.GetDevicesTotalCountResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.rover.audience.v1.GetDevicesTotalCountResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.GetDevicesTotalCountResponse.displayName = 'proto.rover.audience.v1.GetDevicesTotalCountResponse';
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
proto.rover.audience.v1.GetDevicesTotalCountResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.GetDevicesTotalCountResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.GetDevicesTotalCountResponse} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.GetDevicesTotalCountResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    total: jspb.Message.getFieldWithDefault(msg, 1, 0)
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
 * @return {!proto.rover.audience.v1.GetDevicesTotalCountResponse}
 */
proto.rover.audience.v1.GetDevicesTotalCountResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.GetDevicesTotalCountResponse;
  return proto.rover.audience.v1.GetDevicesTotalCountResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.GetDevicesTotalCountResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.GetDevicesTotalCountResponse}
 */
proto.rover.audience.v1.GetDevicesTotalCountResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setTotal(value);
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
proto.rover.audience.v1.GetDevicesTotalCountResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.GetDevicesTotalCountResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.GetDevicesTotalCountResponse} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.GetDevicesTotalCountResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getTotal();
  if (f !== 0) {
    writer.writeInt64(
      1,
      f
    );
  }
};


/**
 * optional int64 total = 1;
 * @return {number}
 */
proto.rover.audience.v1.GetDevicesTotalCountResponse.prototype.getTotal = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/** @param {number} value */
proto.rover.audience.v1.GetDevicesTotalCountResponse.prototype.setTotal = function(value) {
  jspb.Message.setField(this, 1, value);
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
proto.rover.audience.v1.CreateDynamicSegmentRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.rover.audience.v1.CreateDynamicSegmentRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.CreateDynamicSegmentRequest.displayName = 'proto.rover.audience.v1.CreateDynamicSegmentRequest';
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
proto.rover.audience.v1.CreateDynamicSegmentRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.CreateDynamicSegmentRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.CreateDynamicSegmentRequest} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.CreateDynamicSegmentRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    authContext: (f = msg.getAuthContext()) && auth_v1_auth_pb.AuthContext.toObject(includeInstance, f),
    title: jspb.Message.getFieldWithDefault(msg, 2, ""),
    predicateAggregate: (f = msg.getPredicateAggregate()) && proto.rover.audience.v1.PredicateAggregate.toObject(includeInstance, f)
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
 * @return {!proto.rover.audience.v1.CreateDynamicSegmentRequest}
 */
proto.rover.audience.v1.CreateDynamicSegmentRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.CreateDynamicSegmentRequest;
  return proto.rover.audience.v1.CreateDynamicSegmentRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.CreateDynamicSegmentRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.CreateDynamicSegmentRequest}
 */
proto.rover.audience.v1.CreateDynamicSegmentRequest.deserializeBinaryFromReader = function(msg, reader) {
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
    case 3:
      var value = new proto.rover.audience.v1.PredicateAggregate;
      reader.readMessage(value,proto.rover.audience.v1.PredicateAggregate.deserializeBinaryFromReader);
      msg.setPredicateAggregate(value);
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
proto.rover.audience.v1.CreateDynamicSegmentRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.CreateDynamicSegmentRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.CreateDynamicSegmentRequest} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.CreateDynamicSegmentRequest.serializeBinaryToWriter = function(message, writer) {
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
  f = message.getPredicateAggregate();
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
proto.rover.audience.v1.CreateDynamicSegmentRequest.prototype.getAuthContext = function() {
  return /** @type{?proto.rover.auth.v1.AuthContext} */ (
    jspb.Message.getWrapperField(this, auth_v1_auth_pb.AuthContext, 1));
};


/** @param {?proto.rover.auth.v1.AuthContext|undefined} value */
proto.rover.audience.v1.CreateDynamicSegmentRequest.prototype.setAuthContext = function(value) {
  jspb.Message.setWrapperField(this, 1, value);
};


proto.rover.audience.v1.CreateDynamicSegmentRequest.prototype.clearAuthContext = function() {
  this.setAuthContext(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.CreateDynamicSegmentRequest.prototype.hasAuthContext = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional string title = 2;
 * @return {string}
 */
proto.rover.audience.v1.CreateDynamicSegmentRequest.prototype.getTitle = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/** @param {string} value */
proto.rover.audience.v1.CreateDynamicSegmentRequest.prototype.setTitle = function(value) {
  jspb.Message.setField(this, 2, value);
};


/**
 * optional PredicateAggregate predicate_aggregate = 3;
 * @return {?proto.rover.audience.v1.PredicateAggregate}
 */
proto.rover.audience.v1.CreateDynamicSegmentRequest.prototype.getPredicateAggregate = function() {
  return /** @type{?proto.rover.audience.v1.PredicateAggregate} */ (
    jspb.Message.getWrapperField(this, proto.rover.audience.v1.PredicateAggregate, 3));
};


/** @param {?proto.rover.audience.v1.PredicateAggregate|undefined} value */
proto.rover.audience.v1.CreateDynamicSegmentRequest.prototype.setPredicateAggregate = function(value) {
  jspb.Message.setWrapperField(this, 3, value);
};


proto.rover.audience.v1.CreateDynamicSegmentRequest.prototype.clearPredicateAggregate = function() {
  this.setPredicateAggregate(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.CreateDynamicSegmentRequest.prototype.hasPredicateAggregate = function() {
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
proto.rover.audience.v1.CreateDynamicSegmentResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.rover.audience.v1.CreateDynamicSegmentResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.CreateDynamicSegmentResponse.displayName = 'proto.rover.audience.v1.CreateDynamicSegmentResponse';
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
proto.rover.audience.v1.CreateDynamicSegmentResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.CreateDynamicSegmentResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.CreateDynamicSegmentResponse} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.CreateDynamicSegmentResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    segment: (f = msg.getSegment()) && proto.rover.audience.v1.DynamicSegment.toObject(includeInstance, f)
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
 * @return {!proto.rover.audience.v1.CreateDynamicSegmentResponse}
 */
proto.rover.audience.v1.CreateDynamicSegmentResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.CreateDynamicSegmentResponse;
  return proto.rover.audience.v1.CreateDynamicSegmentResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.CreateDynamicSegmentResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.CreateDynamicSegmentResponse}
 */
proto.rover.audience.v1.CreateDynamicSegmentResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.rover.audience.v1.DynamicSegment;
      reader.readMessage(value,proto.rover.audience.v1.DynamicSegment.deserializeBinaryFromReader);
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
proto.rover.audience.v1.CreateDynamicSegmentResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.CreateDynamicSegmentResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.CreateDynamicSegmentResponse} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.CreateDynamicSegmentResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSegment();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.rover.audience.v1.DynamicSegment.serializeBinaryToWriter
    );
  }
};


/**
 * optional DynamicSegment segment = 1;
 * @return {?proto.rover.audience.v1.DynamicSegment}
 */
proto.rover.audience.v1.CreateDynamicSegmentResponse.prototype.getSegment = function() {
  return /** @type{?proto.rover.audience.v1.DynamicSegment} */ (
    jspb.Message.getWrapperField(this, proto.rover.audience.v1.DynamicSegment, 1));
};


/** @param {?proto.rover.audience.v1.DynamicSegment|undefined} value */
proto.rover.audience.v1.CreateDynamicSegmentResponse.prototype.setSegment = function(value) {
  jspb.Message.setWrapperField(this, 1, value);
};


proto.rover.audience.v1.CreateDynamicSegmentResponse.prototype.clearSegment = function() {
  this.setSegment(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.CreateDynamicSegmentResponse.prototype.hasSegment = function() {
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
proto.rover.audience.v1.GetDynamicSegmentByIdRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.rover.audience.v1.GetDynamicSegmentByIdRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.GetDynamicSegmentByIdRequest.displayName = 'proto.rover.audience.v1.GetDynamicSegmentByIdRequest';
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
proto.rover.audience.v1.GetDynamicSegmentByIdRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.GetDynamicSegmentByIdRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.GetDynamicSegmentByIdRequest} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.GetDynamicSegmentByIdRequest.toObject = function(includeInstance, msg) {
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
 * @return {!proto.rover.audience.v1.GetDynamicSegmentByIdRequest}
 */
proto.rover.audience.v1.GetDynamicSegmentByIdRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.GetDynamicSegmentByIdRequest;
  return proto.rover.audience.v1.GetDynamicSegmentByIdRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.GetDynamicSegmentByIdRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.GetDynamicSegmentByIdRequest}
 */
proto.rover.audience.v1.GetDynamicSegmentByIdRequest.deserializeBinaryFromReader = function(msg, reader) {
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
proto.rover.audience.v1.GetDynamicSegmentByIdRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.GetDynamicSegmentByIdRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.GetDynamicSegmentByIdRequest} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.GetDynamicSegmentByIdRequest.serializeBinaryToWriter = function(message, writer) {
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
proto.rover.audience.v1.GetDynamicSegmentByIdRequest.prototype.getAuthContext = function() {
  return /** @type{?proto.rover.auth.v1.AuthContext} */ (
    jspb.Message.getWrapperField(this, auth_v1_auth_pb.AuthContext, 1));
};


/** @param {?proto.rover.auth.v1.AuthContext|undefined} value */
proto.rover.audience.v1.GetDynamicSegmentByIdRequest.prototype.setAuthContext = function(value) {
  jspb.Message.setWrapperField(this, 1, value);
};


proto.rover.audience.v1.GetDynamicSegmentByIdRequest.prototype.clearAuthContext = function() {
  this.setAuthContext(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.GetDynamicSegmentByIdRequest.prototype.hasAuthContext = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional string segment_id = 2;
 * @return {string}
 */
proto.rover.audience.v1.GetDynamicSegmentByIdRequest.prototype.getSegmentId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/** @param {string} value */
proto.rover.audience.v1.GetDynamicSegmentByIdRequest.prototype.setSegmentId = function(value) {
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
proto.rover.audience.v1.GetDynamicSegmentByIdResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.rover.audience.v1.GetDynamicSegmentByIdResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.GetDynamicSegmentByIdResponse.displayName = 'proto.rover.audience.v1.GetDynamicSegmentByIdResponse';
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
proto.rover.audience.v1.GetDynamicSegmentByIdResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.GetDynamicSegmentByIdResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.GetDynamicSegmentByIdResponse} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.GetDynamicSegmentByIdResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    segment: (f = msg.getSegment()) && proto.rover.audience.v1.DynamicSegment.toObject(includeInstance, f)
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
 * @return {!proto.rover.audience.v1.GetDynamicSegmentByIdResponse}
 */
proto.rover.audience.v1.GetDynamicSegmentByIdResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.GetDynamicSegmentByIdResponse;
  return proto.rover.audience.v1.GetDynamicSegmentByIdResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.GetDynamicSegmentByIdResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.GetDynamicSegmentByIdResponse}
 */
proto.rover.audience.v1.GetDynamicSegmentByIdResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.rover.audience.v1.DynamicSegment;
      reader.readMessage(value,proto.rover.audience.v1.DynamicSegment.deserializeBinaryFromReader);
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
proto.rover.audience.v1.GetDynamicSegmentByIdResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.GetDynamicSegmentByIdResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.GetDynamicSegmentByIdResponse} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.GetDynamicSegmentByIdResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSegment();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.rover.audience.v1.DynamicSegment.serializeBinaryToWriter
    );
  }
};


/**
 * optional DynamicSegment segment = 1;
 * @return {?proto.rover.audience.v1.DynamicSegment}
 */
proto.rover.audience.v1.GetDynamicSegmentByIdResponse.prototype.getSegment = function() {
  return /** @type{?proto.rover.audience.v1.DynamicSegment} */ (
    jspb.Message.getWrapperField(this, proto.rover.audience.v1.DynamicSegment, 1));
};


/** @param {?proto.rover.audience.v1.DynamicSegment|undefined} value */
proto.rover.audience.v1.GetDynamicSegmentByIdResponse.prototype.setSegment = function(value) {
  jspb.Message.setWrapperField(this, 1, value);
};


proto.rover.audience.v1.GetDynamicSegmentByIdResponse.prototype.clearSegment = function() {
  this.setSegment(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.GetDynamicSegmentByIdResponse.prototype.hasSegment = function() {
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
proto.rover.audience.v1.UpdateDynamicSegmentTitleRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.rover.audience.v1.UpdateDynamicSegmentTitleRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.UpdateDynamicSegmentTitleRequest.displayName = 'proto.rover.audience.v1.UpdateDynamicSegmentTitleRequest';
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
proto.rover.audience.v1.UpdateDynamicSegmentTitleRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.UpdateDynamicSegmentTitleRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.UpdateDynamicSegmentTitleRequest} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.UpdateDynamicSegmentTitleRequest.toObject = function(includeInstance, msg) {
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
 * @return {!proto.rover.audience.v1.UpdateDynamicSegmentTitleRequest}
 */
proto.rover.audience.v1.UpdateDynamicSegmentTitleRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.UpdateDynamicSegmentTitleRequest;
  return proto.rover.audience.v1.UpdateDynamicSegmentTitleRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.UpdateDynamicSegmentTitleRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.UpdateDynamicSegmentTitleRequest}
 */
proto.rover.audience.v1.UpdateDynamicSegmentTitleRequest.deserializeBinaryFromReader = function(msg, reader) {
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
proto.rover.audience.v1.UpdateDynamicSegmentTitleRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.UpdateDynamicSegmentTitleRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.UpdateDynamicSegmentTitleRequest} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.UpdateDynamicSegmentTitleRequest.serializeBinaryToWriter = function(message, writer) {
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
proto.rover.audience.v1.UpdateDynamicSegmentTitleRequest.prototype.getAuthContext = function() {
  return /** @type{?proto.rover.auth.v1.AuthContext} */ (
    jspb.Message.getWrapperField(this, auth_v1_auth_pb.AuthContext, 1));
};


/** @param {?proto.rover.auth.v1.AuthContext|undefined} value */
proto.rover.audience.v1.UpdateDynamicSegmentTitleRequest.prototype.setAuthContext = function(value) {
  jspb.Message.setWrapperField(this, 1, value);
};


proto.rover.audience.v1.UpdateDynamicSegmentTitleRequest.prototype.clearAuthContext = function() {
  this.setAuthContext(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.UpdateDynamicSegmentTitleRequest.prototype.hasAuthContext = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional string segment_id = 2;
 * @return {string}
 */
proto.rover.audience.v1.UpdateDynamicSegmentTitleRequest.prototype.getSegmentId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/** @param {string} value */
proto.rover.audience.v1.UpdateDynamicSegmentTitleRequest.prototype.setSegmentId = function(value) {
  jspb.Message.setField(this, 2, value);
};


/**
 * optional string title = 3;
 * @return {string}
 */
proto.rover.audience.v1.UpdateDynamicSegmentTitleRequest.prototype.getTitle = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/** @param {string} value */
proto.rover.audience.v1.UpdateDynamicSegmentTitleRequest.prototype.setTitle = function(value) {
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
proto.rover.audience.v1.UpdateDynamicSegmentTitleResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.rover.audience.v1.UpdateDynamicSegmentTitleResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.UpdateDynamicSegmentTitleResponse.displayName = 'proto.rover.audience.v1.UpdateDynamicSegmentTitleResponse';
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
proto.rover.audience.v1.UpdateDynamicSegmentTitleResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.UpdateDynamicSegmentTitleResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.UpdateDynamicSegmentTitleResponse} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.UpdateDynamicSegmentTitleResponse.toObject = function(includeInstance, msg) {
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
 * @return {!proto.rover.audience.v1.UpdateDynamicSegmentTitleResponse}
 */
proto.rover.audience.v1.UpdateDynamicSegmentTitleResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.UpdateDynamicSegmentTitleResponse;
  return proto.rover.audience.v1.UpdateDynamicSegmentTitleResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.UpdateDynamicSegmentTitleResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.UpdateDynamicSegmentTitleResponse}
 */
proto.rover.audience.v1.UpdateDynamicSegmentTitleResponse.deserializeBinaryFromReader = function(msg, reader) {
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
proto.rover.audience.v1.UpdateDynamicSegmentTitleResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.UpdateDynamicSegmentTitleResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.UpdateDynamicSegmentTitleResponse} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.UpdateDynamicSegmentTitleResponse.serializeBinaryToWriter = function(message, writer) {
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
proto.rover.audience.v1.UpdateDynamicSegmentPredicatesRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.rover.audience.v1.UpdateDynamicSegmentPredicatesRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.UpdateDynamicSegmentPredicatesRequest.displayName = 'proto.rover.audience.v1.UpdateDynamicSegmentPredicatesRequest';
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
proto.rover.audience.v1.UpdateDynamicSegmentPredicatesRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.UpdateDynamicSegmentPredicatesRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.UpdateDynamicSegmentPredicatesRequest} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.UpdateDynamicSegmentPredicatesRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    authContext: (f = msg.getAuthContext()) && auth_v1_auth_pb.AuthContext.toObject(includeInstance, f),
    segmentId: jspb.Message.getFieldWithDefault(msg, 2, ""),
    predicateAggregate: (f = msg.getPredicateAggregate()) && proto.rover.audience.v1.PredicateAggregate.toObject(includeInstance, f)
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
 * @return {!proto.rover.audience.v1.UpdateDynamicSegmentPredicatesRequest}
 */
proto.rover.audience.v1.UpdateDynamicSegmentPredicatesRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.UpdateDynamicSegmentPredicatesRequest;
  return proto.rover.audience.v1.UpdateDynamicSegmentPredicatesRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.UpdateDynamicSegmentPredicatesRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.UpdateDynamicSegmentPredicatesRequest}
 */
proto.rover.audience.v1.UpdateDynamicSegmentPredicatesRequest.deserializeBinaryFromReader = function(msg, reader) {
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
      msg.setPredicateAggregate(value);
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
proto.rover.audience.v1.UpdateDynamicSegmentPredicatesRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.UpdateDynamicSegmentPredicatesRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.UpdateDynamicSegmentPredicatesRequest} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.UpdateDynamicSegmentPredicatesRequest.serializeBinaryToWriter = function(message, writer) {
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
  f = message.getPredicateAggregate();
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
proto.rover.audience.v1.UpdateDynamicSegmentPredicatesRequest.prototype.getAuthContext = function() {
  return /** @type{?proto.rover.auth.v1.AuthContext} */ (
    jspb.Message.getWrapperField(this, auth_v1_auth_pb.AuthContext, 1));
};


/** @param {?proto.rover.auth.v1.AuthContext|undefined} value */
proto.rover.audience.v1.UpdateDynamicSegmentPredicatesRequest.prototype.setAuthContext = function(value) {
  jspb.Message.setWrapperField(this, 1, value);
};


proto.rover.audience.v1.UpdateDynamicSegmentPredicatesRequest.prototype.clearAuthContext = function() {
  this.setAuthContext(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.UpdateDynamicSegmentPredicatesRequest.prototype.hasAuthContext = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional string segment_id = 2;
 * @return {string}
 */
proto.rover.audience.v1.UpdateDynamicSegmentPredicatesRequest.prototype.getSegmentId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/** @param {string} value */
proto.rover.audience.v1.UpdateDynamicSegmentPredicatesRequest.prototype.setSegmentId = function(value) {
  jspb.Message.setField(this, 2, value);
};


/**
 * optional PredicateAggregate predicate_aggregate = 3;
 * @return {?proto.rover.audience.v1.PredicateAggregate}
 */
proto.rover.audience.v1.UpdateDynamicSegmentPredicatesRequest.prototype.getPredicateAggregate = function() {
  return /** @type{?proto.rover.audience.v1.PredicateAggregate} */ (
    jspb.Message.getWrapperField(this, proto.rover.audience.v1.PredicateAggregate, 3));
};


/** @param {?proto.rover.audience.v1.PredicateAggregate|undefined} value */
proto.rover.audience.v1.UpdateDynamicSegmentPredicatesRequest.prototype.setPredicateAggregate = function(value) {
  jspb.Message.setWrapperField(this, 3, value);
};


proto.rover.audience.v1.UpdateDynamicSegmentPredicatesRequest.prototype.clearPredicateAggregate = function() {
  this.setPredicateAggregate(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.UpdateDynamicSegmentPredicatesRequest.prototype.hasPredicateAggregate = function() {
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
proto.rover.audience.v1.UpdateDynamicSegmentPredicatesResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.rover.audience.v1.UpdateDynamicSegmentPredicatesResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.UpdateDynamicSegmentPredicatesResponse.displayName = 'proto.rover.audience.v1.UpdateDynamicSegmentPredicatesResponse';
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
proto.rover.audience.v1.UpdateDynamicSegmentPredicatesResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.UpdateDynamicSegmentPredicatesResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.UpdateDynamicSegmentPredicatesResponse} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.UpdateDynamicSegmentPredicatesResponse.toObject = function(includeInstance, msg) {
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
 * @return {!proto.rover.audience.v1.UpdateDynamicSegmentPredicatesResponse}
 */
proto.rover.audience.v1.UpdateDynamicSegmentPredicatesResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.UpdateDynamicSegmentPredicatesResponse;
  return proto.rover.audience.v1.UpdateDynamicSegmentPredicatesResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.UpdateDynamicSegmentPredicatesResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.UpdateDynamicSegmentPredicatesResponse}
 */
proto.rover.audience.v1.UpdateDynamicSegmentPredicatesResponse.deserializeBinaryFromReader = function(msg, reader) {
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
proto.rover.audience.v1.UpdateDynamicSegmentPredicatesResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.UpdateDynamicSegmentPredicatesResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.UpdateDynamicSegmentPredicatesResponse} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.UpdateDynamicSegmentPredicatesResponse.serializeBinaryToWriter = function(message, writer) {
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
proto.rover.audience.v1.UpdateDynamicSegmentArchiveStatusRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.rover.audience.v1.UpdateDynamicSegmentArchiveStatusRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.UpdateDynamicSegmentArchiveStatusRequest.displayName = 'proto.rover.audience.v1.UpdateDynamicSegmentArchiveStatusRequest';
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
proto.rover.audience.v1.UpdateDynamicSegmentArchiveStatusRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.UpdateDynamicSegmentArchiveStatusRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.UpdateDynamicSegmentArchiveStatusRequest} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.UpdateDynamicSegmentArchiveStatusRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    authContext: (f = msg.getAuthContext()) && auth_v1_auth_pb.AuthContext.toObject(includeInstance, f),
    segmentId: jspb.Message.getFieldWithDefault(msg, 2, ""),
    archived: jspb.Message.getFieldWithDefault(msg, 3, false)
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
 * @return {!proto.rover.audience.v1.UpdateDynamicSegmentArchiveStatusRequest}
 */
proto.rover.audience.v1.UpdateDynamicSegmentArchiveStatusRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.UpdateDynamicSegmentArchiveStatusRequest;
  return proto.rover.audience.v1.UpdateDynamicSegmentArchiveStatusRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.UpdateDynamicSegmentArchiveStatusRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.UpdateDynamicSegmentArchiveStatusRequest}
 */
proto.rover.audience.v1.UpdateDynamicSegmentArchiveStatusRequest.deserializeBinaryFromReader = function(msg, reader) {
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
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setArchived(value);
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
proto.rover.audience.v1.UpdateDynamicSegmentArchiveStatusRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.UpdateDynamicSegmentArchiveStatusRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.UpdateDynamicSegmentArchiveStatusRequest} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.UpdateDynamicSegmentArchiveStatusRequest.serializeBinaryToWriter = function(message, writer) {
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
  f = message.getArchived();
  if (f) {
    writer.writeBool(
      3,
      f
    );
  }
};


/**
 * optional rover.auth.v1.AuthContext auth_context = 1;
 * @return {?proto.rover.auth.v1.AuthContext}
 */
proto.rover.audience.v1.UpdateDynamicSegmentArchiveStatusRequest.prototype.getAuthContext = function() {
  return /** @type{?proto.rover.auth.v1.AuthContext} */ (
    jspb.Message.getWrapperField(this, auth_v1_auth_pb.AuthContext, 1));
};


/** @param {?proto.rover.auth.v1.AuthContext|undefined} value */
proto.rover.audience.v1.UpdateDynamicSegmentArchiveStatusRequest.prototype.setAuthContext = function(value) {
  jspb.Message.setWrapperField(this, 1, value);
};


proto.rover.audience.v1.UpdateDynamicSegmentArchiveStatusRequest.prototype.clearAuthContext = function() {
  this.setAuthContext(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.UpdateDynamicSegmentArchiveStatusRequest.prototype.hasAuthContext = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional string segment_id = 2;
 * @return {string}
 */
proto.rover.audience.v1.UpdateDynamicSegmentArchiveStatusRequest.prototype.getSegmentId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/** @param {string} value */
proto.rover.audience.v1.UpdateDynamicSegmentArchiveStatusRequest.prototype.setSegmentId = function(value) {
  jspb.Message.setField(this, 2, value);
};


/**
 * optional bool archived = 3;
 * Note that Boolean fields may be set to 0/1 when serialized from a Java server.
 * You should avoid comparisons like {@code val === true/false} in those cases.
 * @return {boolean}
 */
proto.rover.audience.v1.UpdateDynamicSegmentArchiveStatusRequest.prototype.getArchived = function() {
  return /** @type {boolean} */ (jspb.Message.getFieldWithDefault(this, 3, false));
};


/** @param {boolean} value */
proto.rover.audience.v1.UpdateDynamicSegmentArchiveStatusRequest.prototype.setArchived = function(value) {
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
proto.rover.audience.v1.UpdateDynamicSegmentArchiveStatusResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.rover.audience.v1.UpdateDynamicSegmentArchiveStatusResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.UpdateDynamicSegmentArchiveStatusResponse.displayName = 'proto.rover.audience.v1.UpdateDynamicSegmentArchiveStatusResponse';
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
proto.rover.audience.v1.UpdateDynamicSegmentArchiveStatusResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.UpdateDynamicSegmentArchiveStatusResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.UpdateDynamicSegmentArchiveStatusResponse} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.UpdateDynamicSegmentArchiveStatusResponse.toObject = function(includeInstance, msg) {
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
 * @return {!proto.rover.audience.v1.UpdateDynamicSegmentArchiveStatusResponse}
 */
proto.rover.audience.v1.UpdateDynamicSegmentArchiveStatusResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.UpdateDynamicSegmentArchiveStatusResponse;
  return proto.rover.audience.v1.UpdateDynamicSegmentArchiveStatusResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.UpdateDynamicSegmentArchiveStatusResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.UpdateDynamicSegmentArchiveStatusResponse}
 */
proto.rover.audience.v1.UpdateDynamicSegmentArchiveStatusResponse.deserializeBinaryFromReader = function(msg, reader) {
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
proto.rover.audience.v1.UpdateDynamicSegmentArchiveStatusResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.UpdateDynamicSegmentArchiveStatusResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.UpdateDynamicSegmentArchiveStatusResponse} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.UpdateDynamicSegmentArchiveStatusResponse.serializeBinaryToWriter = function(message, writer) {
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
proto.rover.audience.v1.ListDynamicSegmentsRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.rover.audience.v1.ListDynamicSegmentsRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.ListDynamicSegmentsRequest.displayName = 'proto.rover.audience.v1.ListDynamicSegmentsRequest';
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
proto.rover.audience.v1.ListDynamicSegmentsRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.ListDynamicSegmentsRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.ListDynamicSegmentsRequest} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.ListDynamicSegmentsRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    authContext: (f = msg.getAuthContext()) && auth_v1_auth_pb.AuthContext.toObject(includeInstance, f),
    archivedStatus: jspb.Message.getFieldWithDefault(msg, 2, 0)
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
 * @return {!proto.rover.audience.v1.ListDynamicSegmentsRequest}
 */
proto.rover.audience.v1.ListDynamicSegmentsRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.ListDynamicSegmentsRequest;
  return proto.rover.audience.v1.ListDynamicSegmentsRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.ListDynamicSegmentsRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.ListDynamicSegmentsRequest}
 */
proto.rover.audience.v1.ListDynamicSegmentsRequest.deserializeBinaryFromReader = function(msg, reader) {
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
      var value = /** @type {!proto.rover.audience.v1.ListDynamicSegmentsRequest.ArchivedStatus} */ (reader.readEnum());
      msg.setArchivedStatus(value);
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
proto.rover.audience.v1.ListDynamicSegmentsRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.ListDynamicSegmentsRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.ListDynamicSegmentsRequest} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.ListDynamicSegmentsRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getAuthContext();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      auth_v1_auth_pb.AuthContext.serializeBinaryToWriter
    );
  }
  f = message.getArchivedStatus();
  if (f !== 0.0) {
    writer.writeEnum(
      2,
      f
    );
  }
};


/**
 * @enum {number}
 */
proto.rover.audience.v1.ListDynamicSegmentsRequest.ArchivedStatus = {
  UNARCHIVED: 0,
  ARCHIVED: 1,
  ALL: 2
};

/**
 * optional rover.auth.v1.AuthContext auth_context = 1;
 * @return {?proto.rover.auth.v1.AuthContext}
 */
proto.rover.audience.v1.ListDynamicSegmentsRequest.prototype.getAuthContext = function() {
  return /** @type{?proto.rover.auth.v1.AuthContext} */ (
    jspb.Message.getWrapperField(this, auth_v1_auth_pb.AuthContext, 1));
};


/** @param {?proto.rover.auth.v1.AuthContext|undefined} value */
proto.rover.audience.v1.ListDynamicSegmentsRequest.prototype.setAuthContext = function(value) {
  jspb.Message.setWrapperField(this, 1, value);
};


proto.rover.audience.v1.ListDynamicSegmentsRequest.prototype.clearAuthContext = function() {
  this.setAuthContext(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.ListDynamicSegmentsRequest.prototype.hasAuthContext = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional ArchivedStatus archived_status = 2;
 * @return {!proto.rover.audience.v1.ListDynamicSegmentsRequest.ArchivedStatus}
 */
proto.rover.audience.v1.ListDynamicSegmentsRequest.prototype.getArchivedStatus = function() {
  return /** @type {!proto.rover.audience.v1.ListDynamicSegmentsRequest.ArchivedStatus} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/** @param {!proto.rover.audience.v1.ListDynamicSegmentsRequest.ArchivedStatus} value */
proto.rover.audience.v1.ListDynamicSegmentsRequest.prototype.setArchivedStatus = function(value) {
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
proto.rover.audience.v1.ListDynamicSegmentsResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.rover.audience.v1.ListDynamicSegmentsResponse.repeatedFields_, null);
};
goog.inherits(proto.rover.audience.v1.ListDynamicSegmentsResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.ListDynamicSegmentsResponse.displayName = 'proto.rover.audience.v1.ListDynamicSegmentsResponse';
}
/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.rover.audience.v1.ListDynamicSegmentsResponse.repeatedFields_ = [1];



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
proto.rover.audience.v1.ListDynamicSegmentsResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.ListDynamicSegmentsResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.ListDynamicSegmentsResponse} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.ListDynamicSegmentsResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    segmentsList: jspb.Message.toObjectList(msg.getSegmentsList(),
    proto.rover.audience.v1.DynamicSegment.toObject, includeInstance)
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
 * @return {!proto.rover.audience.v1.ListDynamicSegmentsResponse}
 */
proto.rover.audience.v1.ListDynamicSegmentsResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.ListDynamicSegmentsResponse;
  return proto.rover.audience.v1.ListDynamicSegmentsResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.ListDynamicSegmentsResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.ListDynamicSegmentsResponse}
 */
proto.rover.audience.v1.ListDynamicSegmentsResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.rover.audience.v1.DynamicSegment;
      reader.readMessage(value,proto.rover.audience.v1.DynamicSegment.deserializeBinaryFromReader);
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
proto.rover.audience.v1.ListDynamicSegmentsResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.ListDynamicSegmentsResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.ListDynamicSegmentsResponse} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.ListDynamicSegmentsResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSegmentsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      proto.rover.audience.v1.DynamicSegment.serializeBinaryToWriter
    );
  }
};


/**
 * repeated DynamicSegment segments = 1;
 * If you change this array by adding, removing or replacing elements, or if you
 * replace the array itself, then you must call the setter to update it.
 * @return {!Array.<!proto.rover.audience.v1.DynamicSegment>}
 */
proto.rover.audience.v1.ListDynamicSegmentsResponse.prototype.getSegmentsList = function() {
  return /** @type{!Array.<!proto.rover.audience.v1.DynamicSegment>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.rover.audience.v1.DynamicSegment, 1));
};


/** @param {!Array.<!proto.rover.audience.v1.DynamicSegment>} value */
proto.rover.audience.v1.ListDynamicSegmentsResponse.prototype.setSegmentsList = function(value) {
  jspb.Message.setRepeatedWrapperField(this, 1, value);
};


/**
 * @param {!proto.rover.audience.v1.DynamicSegment=} opt_value
 * @param {number=} opt_index
 * @return {!proto.rover.audience.v1.DynamicSegment}
 */
proto.rover.audience.v1.ListDynamicSegmentsResponse.prototype.addSegments = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.rover.audience.v1.DynamicSegment, opt_index);
};


proto.rover.audience.v1.ListDynamicSegmentsResponse.prototype.clearSegmentsList = function() {
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
proto.rover.audience.v1.DynamicSegment = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.rover.audience.v1.DynamicSegment, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.DynamicSegment.displayName = 'proto.rover.audience.v1.DynamicSegment';
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
proto.rover.audience.v1.DynamicSegment.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.DynamicSegment.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.DynamicSegment} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.DynamicSegment.toObject = function(includeInstance, msg) {
  var f, obj = {
    id: jspb.Message.getFieldWithDefault(msg, 1, ""),
    accountId: jspb.Message.getFieldWithDefault(msg, 2, 0),
    createdAt: (f = msg.getCreatedAt()) && google_protobuf_timestamp_pb.Timestamp.toObject(includeInstance, f),
    updatedAt: (f = msg.getUpdatedAt()) && google_protobuf_timestamp_pb.Timestamp.toObject(includeInstance, f),
    title: jspb.Message.getFieldWithDefault(msg, 5, ""),
    isArchived: jspb.Message.getFieldWithDefault(msg, 6, false),
    segmentSize: jspb.Message.getFieldWithDefault(msg, 7, 0),
    predicateAggregate: (f = msg.getPredicateAggregate()) && proto.rover.audience.v1.PredicateAggregate.toObject(includeInstance, f)
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
 * @return {!proto.rover.audience.v1.DynamicSegment}
 */
proto.rover.audience.v1.DynamicSegment.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.DynamicSegment;
  return proto.rover.audience.v1.DynamicSegment.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.DynamicSegment} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.DynamicSegment}
 */
proto.rover.audience.v1.DynamicSegment.deserializeBinaryFromReader = function(msg, reader) {
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
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setIsArchived(value);
      break;
    case 7:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setSegmentSize(value);
      break;
    case 8:
      var value = new proto.rover.audience.v1.PredicateAggregate;
      reader.readMessage(value,proto.rover.audience.v1.PredicateAggregate.deserializeBinaryFromReader);
      msg.setPredicateAggregate(value);
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
proto.rover.audience.v1.DynamicSegment.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.DynamicSegment.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.DynamicSegment} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.DynamicSegment.serializeBinaryToWriter = function(message, writer) {
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
  f = message.getIsArchived();
  if (f) {
    writer.writeBool(
      6,
      f
    );
  }
  f = message.getSegmentSize();
  if (f !== 0) {
    writer.writeInt64(
      7,
      f
    );
  }
  f = message.getPredicateAggregate();
  if (f != null) {
    writer.writeMessage(
      8,
      f,
      proto.rover.audience.v1.PredicateAggregate.serializeBinaryToWriter
    );
  }
};


/**
 * optional string id = 1;
 * @return {string}
 */
proto.rover.audience.v1.DynamicSegment.prototype.getId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/** @param {string} value */
proto.rover.audience.v1.DynamicSegment.prototype.setId = function(value) {
  jspb.Message.setField(this, 1, value);
};


/**
 * optional int32 account_id = 2;
 * @return {number}
 */
proto.rover.audience.v1.DynamicSegment.prototype.getAccountId = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/** @param {number} value */
proto.rover.audience.v1.DynamicSegment.prototype.setAccountId = function(value) {
  jspb.Message.setField(this, 2, value);
};


/**
 * optional google.protobuf.Timestamp created_at = 3;
 * @return {?proto.google.protobuf.Timestamp}
 */
proto.rover.audience.v1.DynamicSegment.prototype.getCreatedAt = function() {
  return /** @type{?proto.google.protobuf.Timestamp} */ (
    jspb.Message.getWrapperField(this, google_protobuf_timestamp_pb.Timestamp, 3));
};


/** @param {?proto.google.protobuf.Timestamp|undefined} value */
proto.rover.audience.v1.DynamicSegment.prototype.setCreatedAt = function(value) {
  jspb.Message.setWrapperField(this, 3, value);
};


proto.rover.audience.v1.DynamicSegment.prototype.clearCreatedAt = function() {
  this.setCreatedAt(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.DynamicSegment.prototype.hasCreatedAt = function() {
  return jspb.Message.getField(this, 3) != null;
};


/**
 * optional google.protobuf.Timestamp updated_at = 4;
 * @return {?proto.google.protobuf.Timestamp}
 */
proto.rover.audience.v1.DynamicSegment.prototype.getUpdatedAt = function() {
  return /** @type{?proto.google.protobuf.Timestamp} */ (
    jspb.Message.getWrapperField(this, google_protobuf_timestamp_pb.Timestamp, 4));
};


/** @param {?proto.google.protobuf.Timestamp|undefined} value */
proto.rover.audience.v1.DynamicSegment.prototype.setUpdatedAt = function(value) {
  jspb.Message.setWrapperField(this, 4, value);
};


proto.rover.audience.v1.DynamicSegment.prototype.clearUpdatedAt = function() {
  this.setUpdatedAt(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.DynamicSegment.prototype.hasUpdatedAt = function() {
  return jspb.Message.getField(this, 4) != null;
};


/**
 * optional string title = 5;
 * @return {string}
 */
proto.rover.audience.v1.DynamicSegment.prototype.getTitle = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 5, ""));
};


/** @param {string} value */
proto.rover.audience.v1.DynamicSegment.prototype.setTitle = function(value) {
  jspb.Message.setField(this, 5, value);
};


/**
 * optional bool is_archived = 6;
 * Note that Boolean fields may be set to 0/1 when serialized from a Java server.
 * You should avoid comparisons like {@code val === true/false} in those cases.
 * @return {boolean}
 */
proto.rover.audience.v1.DynamicSegment.prototype.getIsArchived = function() {
  return /** @type {boolean} */ (jspb.Message.getFieldWithDefault(this, 6, false));
};


/** @param {boolean} value */
proto.rover.audience.v1.DynamicSegment.prototype.setIsArchived = function(value) {
  jspb.Message.setField(this, 6, value);
};


/**
 * optional int64 segment_size = 7;
 * @return {number}
 */
proto.rover.audience.v1.DynamicSegment.prototype.getSegmentSize = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 7, 0));
};


/** @param {number} value */
proto.rover.audience.v1.DynamicSegment.prototype.setSegmentSize = function(value) {
  jspb.Message.setField(this, 7, value);
};


/**
 * optional PredicateAggregate predicate_aggregate = 8;
 * @return {?proto.rover.audience.v1.PredicateAggregate}
 */
proto.rover.audience.v1.DynamicSegment.prototype.getPredicateAggregate = function() {
  return /** @type{?proto.rover.audience.v1.PredicateAggregate} */ (
    jspb.Message.getWrapperField(this, proto.rover.audience.v1.PredicateAggregate, 8));
};


/** @param {?proto.rover.audience.v1.PredicateAggregate|undefined} value */
proto.rover.audience.v1.DynamicSegment.prototype.setPredicateAggregate = function(value) {
  jspb.Message.setWrapperField(this, 8, value);
};


proto.rover.audience.v1.DynamicSegment.prototype.clearPredicateAggregate = function() {
  this.setPredicateAggregate(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.DynamicSegment.prototype.hasPredicateAggregate = function() {
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
    attributeName: jspb.Message.getFieldWithDefault(msg, 2, ""),
    value: jspb.Message.getFieldWithDefault(msg, 3, "")
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
      msg.setAttributeName(value);
      break;
    case 3:
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
  f = message.getAttributeName();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getValue();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
};


/**
 * @enum {number}
 */
proto.rover.audience.v1.StringPredicate.Op = {
  IS_UNSET: 0,
  IS_SET: 1,
  IS_EQUAL: 2,
  IS_NOT_EQUAL: 3,
  STARTS_WITH: 4,
  ENDS_WITH: 5,
  CONTAINS: 6,
  DOES_NOT_CONTAIN: 7
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
 * optional string attribute_name = 2;
 * @return {string}
 */
proto.rover.audience.v1.StringPredicate.prototype.getAttributeName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/** @param {string} value */
proto.rover.audience.v1.StringPredicate.prototype.setAttributeName = function(value) {
  jspb.Message.setField(this, 2, value);
};


/**
 * optional string value = 3;
 * @return {string}
 */
proto.rover.audience.v1.StringPredicate.prototype.getValue = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/** @param {string} value */
proto.rover.audience.v1.StringPredicate.prototype.setValue = function(value) {
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
    attributeName: jspb.Message.getFieldWithDefault(msg, 2, ""),
    value: jspb.Message.getFieldWithDefault(msg, 3, false)
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
      var value = /** @type {string} */ (reader.readString());
      msg.setAttributeName(value);
      break;
    case 3:
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
  f = message.getAttributeName();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getValue();
  if (f) {
    writer.writeBool(
      3,
      f
    );
  }
};


/**
 * @enum {number}
 */
proto.rover.audience.v1.BoolPredicate.Op = {
  IS_UNSET: 0,
  IS_SET: 1,
  IS_EQUAL: 2
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
 * optional string attribute_name = 2;
 * @return {string}
 */
proto.rover.audience.v1.BoolPredicate.prototype.getAttributeName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/** @param {string} value */
proto.rover.audience.v1.BoolPredicate.prototype.setAttributeName = function(value) {
  jspb.Message.setField(this, 2, value);
};


/**
 * optional bool value = 3;
 * Note that Boolean fields may be set to 0/1 when serialized from a Java server.
 * You should avoid comparisons like {@code val === true/false} in those cases.
 * @return {boolean}
 */
proto.rover.audience.v1.BoolPredicate.prototype.getValue = function() {
  return /** @type {boolean} */ (jspb.Message.getFieldWithDefault(this, 3, false));
};


/** @param {boolean} value */
proto.rover.audience.v1.BoolPredicate.prototype.setValue = function(value) {
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
    attributeName: jspb.Message.getFieldWithDefault(msg, 2, ""),
    value: jspb.Message.getFieldWithDefault(msg, 3, 0),
    value2: jspb.Message.getFieldWithDefault(msg, 4, 0)
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
      var value = /** @type {string} */ (reader.readString());
      msg.setAttributeName(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setValue(value);
      break;
    case 4:
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
  f = message.getAttributeName();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getValue();
  if (f !== 0) {
    writer.writeInt64(
      3,
      f
    );
  }
  f = message.getValue2();
  if (f !== 0) {
    writer.writeInt64(
      4,
      f
    );
  }
};


/**
 * @enum {number}
 */
proto.rover.audience.v1.NumberPredicate.Op = {
  IS_UNSET: 0,
  IS_SET: 1,
  IS_EQUAL: 2,
  IS_NOT_EQUAL: 3,
  IS_GREATER_THAN: 4,
  IS_LESS_THAN: 5,
  IS_BETWEEN: 6
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
 * optional string attribute_name = 2;
 * @return {string}
 */
proto.rover.audience.v1.NumberPredicate.prototype.getAttributeName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/** @param {string} value */
proto.rover.audience.v1.NumberPredicate.prototype.setAttributeName = function(value) {
  jspb.Message.setField(this, 2, value);
};


/**
 * optional int64 value = 3;
 * @return {number}
 */
proto.rover.audience.v1.NumberPredicate.prototype.getValue = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/** @param {number} value */
proto.rover.audience.v1.NumberPredicate.prototype.setValue = function(value) {
  jspb.Message.setField(this, 3, value);
};


/**
 * optional int64 value2 = 4;
 * @return {number}
 */
proto.rover.audience.v1.NumberPredicate.prototype.getValue2 = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 4, 0));
};


/** @param {number} value */
proto.rover.audience.v1.NumberPredicate.prototype.setValue2 = function(value) {
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
proto.rover.audience.v1.DoublePredicate = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.rover.audience.v1.DoublePredicate, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.DoublePredicate.displayName = 'proto.rover.audience.v1.DoublePredicate';
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
proto.rover.audience.v1.DoublePredicate.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.DoublePredicate.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.DoublePredicate} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.DoublePredicate.toObject = function(includeInstance, msg) {
  var f, obj = {
    op: jspb.Message.getFieldWithDefault(msg, 1, 0),
    attributeName: jspb.Message.getFieldWithDefault(msg, 2, ""),
    value: +jspb.Message.getFieldWithDefault(msg, 3, 0.0),
    value2: +jspb.Message.getFieldWithDefault(msg, 4, 0.0)
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
 * @return {!proto.rover.audience.v1.DoublePredicate}
 */
proto.rover.audience.v1.DoublePredicate.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.DoublePredicate;
  return proto.rover.audience.v1.DoublePredicate.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.DoublePredicate} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.DoublePredicate}
 */
proto.rover.audience.v1.DoublePredicate.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!proto.rover.audience.v1.DoublePredicate.Op} */ (reader.readEnum());
      msg.setOp(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setAttributeName(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readDouble());
      msg.setValue(value);
      break;
    case 4:
      var value = /** @type {number} */ (reader.readDouble());
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
proto.rover.audience.v1.DoublePredicate.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.DoublePredicate.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.DoublePredicate} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.DoublePredicate.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getOp();
  if (f !== 0.0) {
    writer.writeEnum(
      1,
      f
    );
  }
  f = message.getAttributeName();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getValue();
  if (f !== 0.0) {
    writer.writeDouble(
      3,
      f
    );
  }
  f = message.getValue2();
  if (f !== 0.0) {
    writer.writeDouble(
      4,
      f
    );
  }
};


/**
 * @enum {number}
 */
proto.rover.audience.v1.DoublePredicate.Op = {
  IS_UNSET: 0,
  IS_SET: 1,
  IS_EQUAL: 2,
  IS_NOT_EQUAL: 3,
  IS_GREATER_THAN: 4,
  IS_LESS_THAN: 5,
  IS_BETWEEN: 6
};

/**
 * optional Op op = 1;
 * @return {!proto.rover.audience.v1.DoublePredicate.Op}
 */
proto.rover.audience.v1.DoublePredicate.prototype.getOp = function() {
  return /** @type {!proto.rover.audience.v1.DoublePredicate.Op} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/** @param {!proto.rover.audience.v1.DoublePredicate.Op} value */
proto.rover.audience.v1.DoublePredicate.prototype.setOp = function(value) {
  jspb.Message.setField(this, 1, value);
};


/**
 * optional string attribute_name = 2;
 * @return {string}
 */
proto.rover.audience.v1.DoublePredicate.prototype.getAttributeName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/** @param {string} value */
proto.rover.audience.v1.DoublePredicate.prototype.setAttributeName = function(value) {
  jspb.Message.setField(this, 2, value);
};


/**
 * optional double value = 3;
 * @return {number}
 */
proto.rover.audience.v1.DoublePredicate.prototype.getValue = function() {
  return /** @type {number} */ (+jspb.Message.getFieldWithDefault(this, 3, 0.0));
};


/** @param {number} value */
proto.rover.audience.v1.DoublePredicate.prototype.setValue = function(value) {
  jspb.Message.setField(this, 3, value);
};


/**
 * optional double value2 = 4;
 * @return {number}
 */
proto.rover.audience.v1.DoublePredicate.prototype.getValue2 = function() {
  return /** @type {number} */ (+jspb.Message.getFieldWithDefault(this, 4, 0.0));
};


/** @param {number} value */
proto.rover.audience.v1.DoublePredicate.prototype.setValue2 = function(value) {
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
    value: (f = msg.getValue()) && proto.rover.audience.v1.DatePredicate.Date.toObject(includeInstance, f),
    attributeName: jspb.Message.getFieldWithDefault(msg, 3, "")
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
      var value = new proto.rover.audience.v1.DatePredicate.Date;
      reader.readMessage(value,proto.rover.audience.v1.DatePredicate.Date.deserializeBinaryFromReader);
      msg.setValue(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setAttributeName(value);
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
      proto.rover.audience.v1.DatePredicate.Date.serializeBinaryToWriter
    );
  }
  f = message.getAttributeName();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
};


/**
 * @enum {number}
 */
proto.rover.audience.v1.DatePredicate.Op = {
  IS_UNSET: 0,
  IS_SET: 1,
  IS_AFTER: 2,
  IS_BEFORE: 3,
  IS_ON: 4
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
proto.rover.audience.v1.DatePredicate.Date = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.rover.audience.v1.DatePredicate.Date, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.DatePredicate.Date.displayName = 'proto.rover.audience.v1.DatePredicate.Date';
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
proto.rover.audience.v1.DatePredicate.Date.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.DatePredicate.Date.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.DatePredicate.Date} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.DatePredicate.Date.toObject = function(includeInstance, msg) {
  var f, obj = {
    day: jspb.Message.getFieldWithDefault(msg, 1, 0),
    month: jspb.Message.getFieldWithDefault(msg, 2, 0),
    year: jspb.Message.getFieldWithDefault(msg, 3, 0)
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
 * @return {!proto.rover.audience.v1.DatePredicate.Date}
 */
proto.rover.audience.v1.DatePredicate.Date.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.DatePredicate.Date;
  return proto.rover.audience.v1.DatePredicate.Date.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.DatePredicate.Date} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.DatePredicate.Date}
 */
proto.rover.audience.v1.DatePredicate.Date.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setDay(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setMonth(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setYear(value);
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
proto.rover.audience.v1.DatePredicate.Date.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.DatePredicate.Date.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.DatePredicate.Date} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.DatePredicate.Date.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getDay();
  if (f !== 0) {
    writer.writeUint32(
      1,
      f
    );
  }
  f = message.getMonth();
  if (f !== 0) {
    writer.writeUint32(
      2,
      f
    );
  }
  f = message.getYear();
  if (f !== 0) {
    writer.writeUint32(
      3,
      f
    );
  }
};


/**
 * optional uint32 day = 1;
 * @return {number}
 */
proto.rover.audience.v1.DatePredicate.Date.prototype.getDay = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/** @param {number} value */
proto.rover.audience.v1.DatePredicate.Date.prototype.setDay = function(value) {
  jspb.Message.setField(this, 1, value);
};


/**
 * optional uint32 month = 2;
 * @return {number}
 */
proto.rover.audience.v1.DatePredicate.Date.prototype.getMonth = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/** @param {number} value */
proto.rover.audience.v1.DatePredicate.Date.prototype.setMonth = function(value) {
  jspb.Message.setField(this, 2, value);
};


/**
 * optional uint32 year = 3;
 * @return {number}
 */
proto.rover.audience.v1.DatePredicate.Date.prototype.getYear = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/** @param {number} value */
proto.rover.audience.v1.DatePredicate.Date.prototype.setYear = function(value) {
  jspb.Message.setField(this, 3, value);
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
 * optional Date value = 2;
 * @return {?proto.rover.audience.v1.DatePredicate.Date}
 */
proto.rover.audience.v1.DatePredicate.prototype.getValue = function() {
  return /** @type{?proto.rover.audience.v1.DatePredicate.Date} */ (
    jspb.Message.getWrapperField(this, proto.rover.audience.v1.DatePredicate.Date, 2));
};


/** @param {?proto.rover.audience.v1.DatePredicate.Date|undefined} value */
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
 * optional string attribute_name = 3;
 * @return {string}
 */
proto.rover.audience.v1.DatePredicate.prototype.getAttributeName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/** @param {string} value */
proto.rover.audience.v1.DatePredicate.prototype.setAttributeName = function(value) {
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
proto.rover.audience.v1.DurationPredicate = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.rover.audience.v1.DurationPredicate, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.DurationPredicate.displayName = 'proto.rover.audience.v1.DurationPredicate';
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
proto.rover.audience.v1.DurationPredicate.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.DurationPredicate.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.DurationPredicate} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.DurationPredicate.toObject = function(includeInstance, msg) {
  var f, obj = {
    op: jspb.Message.getFieldWithDefault(msg, 1, 0),
    value: (f = msg.getValue()) && proto.rover.audience.v1.DurationPredicate.Duration.toObject(includeInstance, f),
    attributeName: jspb.Message.getFieldWithDefault(msg, 3, "")
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
 * @return {!proto.rover.audience.v1.DurationPredicate}
 */
proto.rover.audience.v1.DurationPredicate.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.DurationPredicate;
  return proto.rover.audience.v1.DurationPredicate.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.DurationPredicate} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.DurationPredicate}
 */
proto.rover.audience.v1.DurationPredicate.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!proto.rover.audience.v1.DurationPredicate.Op} */ (reader.readEnum());
      msg.setOp(value);
      break;
    case 2:
      var value = new proto.rover.audience.v1.DurationPredicate.Duration;
      reader.readMessage(value,proto.rover.audience.v1.DurationPredicate.Duration.deserializeBinaryFromReader);
      msg.setValue(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setAttributeName(value);
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
proto.rover.audience.v1.DurationPredicate.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.DurationPredicate.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.DurationPredicate} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.DurationPredicate.serializeBinaryToWriter = function(message, writer) {
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
      proto.rover.audience.v1.DurationPredicate.Duration.serializeBinaryToWriter
    );
  }
  f = message.getAttributeName();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
};


/**
 * @enum {number}
 */
proto.rover.audience.v1.DurationPredicate.Op = {
  IS_GREATER_THAN: 0,
  IS_LESS_THAN: 1,
  IS_EQUAL: 2
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
proto.rover.audience.v1.DurationPredicate.Duration = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.rover.audience.v1.DurationPredicate.Duration, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.DurationPredicate.Duration.displayName = 'proto.rover.audience.v1.DurationPredicate.Duration';
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
proto.rover.audience.v1.DurationPredicate.Duration.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.DurationPredicate.Duration.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.DurationPredicate.Duration} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.DurationPredicate.Duration.toObject = function(includeInstance, msg) {
  var f, obj = {
    duration: jspb.Message.getFieldWithDefault(msg, 1, 0),
    type: jspb.Message.getFieldWithDefault(msg, 2, 0)
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
 * @return {!proto.rover.audience.v1.DurationPredicate.Duration}
 */
proto.rover.audience.v1.DurationPredicate.Duration.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.DurationPredicate.Duration;
  return proto.rover.audience.v1.DurationPredicate.Duration.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.DurationPredicate.Duration} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.DurationPredicate.Duration}
 */
proto.rover.audience.v1.DurationPredicate.Duration.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setDuration(value);
      break;
    case 2:
      var value = /** @type {!proto.rover.audience.v1.DurationPredicate.Duration.Type} */ (reader.readEnum());
      msg.setType(value);
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
proto.rover.audience.v1.DurationPredicate.Duration.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.DurationPredicate.Duration.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.DurationPredicate.Duration} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.DurationPredicate.Duration.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getDuration();
  if (f !== 0) {
    writer.writeUint32(
      1,
      f
    );
  }
  f = message.getType();
  if (f !== 0.0) {
    writer.writeEnum(
      2,
      f
    );
  }
};


/**
 * @enum {number}
 */
proto.rover.audience.v1.DurationPredicate.Duration.Type = {
  DAYS: 0
};

/**
 * optional uint32 duration = 1;
 * @return {number}
 */
proto.rover.audience.v1.DurationPredicate.Duration.prototype.getDuration = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/** @param {number} value */
proto.rover.audience.v1.DurationPredicate.Duration.prototype.setDuration = function(value) {
  jspb.Message.setField(this, 1, value);
};


/**
 * optional Type type = 2;
 * @return {!proto.rover.audience.v1.DurationPredicate.Duration.Type}
 */
proto.rover.audience.v1.DurationPredicate.Duration.prototype.getType = function() {
  return /** @type {!proto.rover.audience.v1.DurationPredicate.Duration.Type} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/** @param {!proto.rover.audience.v1.DurationPredicate.Duration.Type} value */
proto.rover.audience.v1.DurationPredicate.Duration.prototype.setType = function(value) {
  jspb.Message.setField(this, 2, value);
};


/**
 * optional Op op = 1;
 * @return {!proto.rover.audience.v1.DurationPredicate.Op}
 */
proto.rover.audience.v1.DurationPredicate.prototype.getOp = function() {
  return /** @type {!proto.rover.audience.v1.DurationPredicate.Op} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/** @param {!proto.rover.audience.v1.DurationPredicate.Op} value */
proto.rover.audience.v1.DurationPredicate.prototype.setOp = function(value) {
  jspb.Message.setField(this, 1, value);
};


/**
 * optional Duration value = 2;
 * @return {?proto.rover.audience.v1.DurationPredicate.Duration}
 */
proto.rover.audience.v1.DurationPredicate.prototype.getValue = function() {
  return /** @type{?proto.rover.audience.v1.DurationPredicate.Duration} */ (
    jspb.Message.getWrapperField(this, proto.rover.audience.v1.DurationPredicate.Duration, 2));
};


/** @param {?proto.rover.audience.v1.DurationPredicate.Duration|undefined} value */
proto.rover.audience.v1.DurationPredicate.prototype.setValue = function(value) {
  jspb.Message.setWrapperField(this, 2, value);
};


proto.rover.audience.v1.DurationPredicate.prototype.clearValue = function() {
  this.setValue(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.DurationPredicate.prototype.hasValue = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional string attribute_name = 3;
 * @return {string}
 */
proto.rover.audience.v1.DurationPredicate.prototype.getAttributeName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/** @param {string} value */
proto.rover.audience.v1.DurationPredicate.prototype.setAttributeName = function(value) {
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
    attributeName: jspb.Message.getFieldWithDefault(msg, 2, ""),
    value: (f = msg.getValue()) && proto.rover.audience.v1.GeofencePredicate.Location.toObject(includeInstance, f)
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
      var value = /** @type {string} */ (reader.readString());
      msg.setAttributeName(value);
      break;
    case 3:
      var value = new proto.rover.audience.v1.GeofencePredicate.Location;
      reader.readMessage(value,proto.rover.audience.v1.GeofencePredicate.Location.deserializeBinaryFromReader);
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
  f = message.getAttributeName();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getValue();
  if (f != null) {
    writer.writeMessage(
      3,
      f,
      proto.rover.audience.v1.GeofencePredicate.Location.serializeBinaryToWriter
    );
  }
};


/**
 * @enum {number}
 */
proto.rover.audience.v1.GeofencePredicate.Op = {
  IS_UNSET: 0,
  IS_SET: 1,
  IS_OUTSIDE: 2,
  IS_WITHIN: 3
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
proto.rover.audience.v1.GeofencePredicate.Location = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.rover.audience.v1.GeofencePredicate.Location, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.GeofencePredicate.Location.displayName = 'proto.rover.audience.v1.GeofencePredicate.Location';
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
proto.rover.audience.v1.GeofencePredicate.Location.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.GeofencePredicate.Location.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.GeofencePredicate.Location} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.GeofencePredicate.Location.toObject = function(includeInstance, msg) {
  var f, obj = {
    longitude: +jspb.Message.getFieldWithDefault(msg, 1, 0.0),
    latitude: +jspb.Message.getFieldWithDefault(msg, 2, 0.0),
    radius: jspb.Message.getFieldWithDefault(msg, 3, 0),
    name: jspb.Message.getFieldWithDefault(msg, 4, "")
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
 * @return {!proto.rover.audience.v1.GeofencePredicate.Location}
 */
proto.rover.audience.v1.GeofencePredicate.Location.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.GeofencePredicate.Location;
  return proto.rover.audience.v1.GeofencePredicate.Location.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.GeofencePredicate.Location} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.GeofencePredicate.Location}
 */
proto.rover.audience.v1.GeofencePredicate.Location.deserializeBinaryFromReader = function(msg, reader) {
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
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setName(value);
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
proto.rover.audience.v1.GeofencePredicate.Location.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.GeofencePredicate.Location.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.GeofencePredicate.Location} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.GeofencePredicate.Location.serializeBinaryToWriter = function(message, writer) {
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
  f = message.getName();
  if (f.length > 0) {
    writer.writeString(
      4,
      f
    );
  }
};


/**
 * optional double longitude = 1;
 * @return {number}
 */
proto.rover.audience.v1.GeofencePredicate.Location.prototype.getLongitude = function() {
  return /** @type {number} */ (+jspb.Message.getFieldWithDefault(this, 1, 0.0));
};


/** @param {number} value */
proto.rover.audience.v1.GeofencePredicate.Location.prototype.setLongitude = function(value) {
  jspb.Message.setField(this, 1, value);
};


/**
 * optional double latitude = 2;
 * @return {number}
 */
proto.rover.audience.v1.GeofencePredicate.Location.prototype.getLatitude = function() {
  return /** @type {number} */ (+jspb.Message.getFieldWithDefault(this, 2, 0.0));
};


/** @param {number} value */
proto.rover.audience.v1.GeofencePredicate.Location.prototype.setLatitude = function(value) {
  jspb.Message.setField(this, 2, value);
};


/**
 * optional int32 radius = 3;
 * @return {number}
 */
proto.rover.audience.v1.GeofencePredicate.Location.prototype.getRadius = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/** @param {number} value */
proto.rover.audience.v1.GeofencePredicate.Location.prototype.setRadius = function(value) {
  jspb.Message.setField(this, 3, value);
};


/**
 * optional string name = 4;
 * @return {string}
 */
proto.rover.audience.v1.GeofencePredicate.Location.prototype.getName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/** @param {string} value */
proto.rover.audience.v1.GeofencePredicate.Location.prototype.setName = function(value) {
  jspb.Message.setField(this, 4, value);
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
 * optional string attribute_name = 2;
 * @return {string}
 */
proto.rover.audience.v1.GeofencePredicate.prototype.getAttributeName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/** @param {string} value */
proto.rover.audience.v1.GeofencePredicate.prototype.setAttributeName = function(value) {
  jspb.Message.setField(this, 2, value);
};


/**
 * optional Location value = 3;
 * @return {?proto.rover.audience.v1.GeofencePredicate.Location}
 */
proto.rover.audience.v1.GeofencePredicate.prototype.getValue = function() {
  return /** @type{?proto.rover.audience.v1.GeofencePredicate.Location} */ (
    jspb.Message.getWrapperField(this, proto.rover.audience.v1.GeofencePredicate.Location, 3));
};


/** @param {?proto.rover.audience.v1.GeofencePredicate.Location|undefined} value */
proto.rover.audience.v1.GeofencePredicate.prototype.setValue = function(value) {
  jspb.Message.setWrapperField(this, 3, value);
};


proto.rover.audience.v1.GeofencePredicate.prototype.clearValue = function() {
  this.setValue(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.GeofencePredicate.prototype.hasValue = function() {
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
    attributeName: jspb.Message.getFieldWithDefault(msg, 2, ""),
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
      var value = /** @type {string} */ (reader.readString());
      msg.setAttributeName(value);
      break;
    case 3:
      var value = new proto.rover.audience.v1.Version;
      reader.readMessage(value,proto.rover.audience.v1.Version.deserializeBinaryFromReader);
      msg.setValue(value);
      break;
    case 4:
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
  f = message.getAttributeName();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getValue();
  if (f != null) {
    writer.writeMessage(
      3,
      f,
      proto.rover.audience.v1.Version.serializeBinaryToWriter
    );
  }
  f = message.getValue2();
  if (f != null) {
    writer.writeMessage(
      4,
      f,
      proto.rover.audience.v1.Version.serializeBinaryToWriter
    );
  }
};


/**
 * @enum {number}
 */
proto.rover.audience.v1.VersionPredicate.Op = {
  IS_UNSET: 0,
  IS_SET: 1,
  IS_EQUAL: 2,
  IS_NOT_EQUAL: 3,
  IS_GREATER_THAN: 4,
  IS_LESS_THAN: 5,
  IS_BETWEEN: 6,
  IS_GREATER_THAN_OR_EQUAL: 7,
  IS_LESS_THAN_OR_EQUAL: 8
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
 * optional string attribute_name = 2;
 * @return {string}
 */
proto.rover.audience.v1.VersionPredicate.prototype.getAttributeName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/** @param {string} value */
proto.rover.audience.v1.VersionPredicate.prototype.setAttributeName = function(value) {
  jspb.Message.setField(this, 2, value);
};


/**
 * optional Version value = 3;
 * @return {?proto.rover.audience.v1.Version}
 */
proto.rover.audience.v1.VersionPredicate.prototype.getValue = function() {
  return /** @type{?proto.rover.audience.v1.Version} */ (
    jspb.Message.getWrapperField(this, proto.rover.audience.v1.Version, 3));
};


/** @param {?proto.rover.audience.v1.Version|undefined} value */
proto.rover.audience.v1.VersionPredicate.prototype.setValue = function(value) {
  jspb.Message.setWrapperField(this, 3, value);
};


proto.rover.audience.v1.VersionPredicate.prototype.clearValue = function() {
  this.setValue(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.VersionPredicate.prototype.hasValue = function() {
  return jspb.Message.getField(this, 3) != null;
};


/**
 * optional Version value2 = 4;
 * @return {?proto.rover.audience.v1.Version}
 */
proto.rover.audience.v1.VersionPredicate.prototype.getValue2 = function() {
  return /** @type{?proto.rover.audience.v1.Version} */ (
    jspb.Message.getWrapperField(this, proto.rover.audience.v1.Version, 4));
};


/** @param {?proto.rover.audience.v1.Version|undefined} value */
proto.rover.audience.v1.VersionPredicate.prototype.setValue2 = function(value) {
  jspb.Message.setWrapperField(this, 4, value);
};


proto.rover.audience.v1.VersionPredicate.prototype.clearValue2 = function() {
  this.setValue2(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.VersionPredicate.prototype.hasValue2 = function() {
  return jspb.Message.getField(this, 4) != null;
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
proto.rover.audience.v1.StringArrayPredicate = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.rover.audience.v1.StringArrayPredicate.repeatedFields_, null);
};
goog.inherits(proto.rover.audience.v1.StringArrayPredicate, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.StringArrayPredicate.displayName = 'proto.rover.audience.v1.StringArrayPredicate';
}
/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.rover.audience.v1.StringArrayPredicate.repeatedFields_ = [3];



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
proto.rover.audience.v1.StringArrayPredicate.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.StringArrayPredicate.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.StringArrayPredicate} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.StringArrayPredicate.toObject = function(includeInstance, msg) {
  var f, obj = {
    op: jspb.Message.getFieldWithDefault(msg, 1, 0),
    attributeName: jspb.Message.getFieldWithDefault(msg, 2, ""),
    valueList: jspb.Message.getField(msg, 3)
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
 * @return {!proto.rover.audience.v1.StringArrayPredicate}
 */
proto.rover.audience.v1.StringArrayPredicate.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.StringArrayPredicate;
  return proto.rover.audience.v1.StringArrayPredicate.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.StringArrayPredicate} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.StringArrayPredicate}
 */
proto.rover.audience.v1.StringArrayPredicate.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!proto.rover.audience.v1.StringArrayPredicate.Op} */ (reader.readEnum());
      msg.setOp(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setAttributeName(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.addValue(value);
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
proto.rover.audience.v1.StringArrayPredicate.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.StringArrayPredicate.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.StringArrayPredicate} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.StringArrayPredicate.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getOp();
  if (f !== 0.0) {
    writer.writeEnum(
      1,
      f
    );
  }
  f = message.getAttributeName();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getValueList();
  if (f.length > 0) {
    writer.writeRepeatedString(
      3,
      f
    );
  }
};


/**
 * @enum {number}
 */
proto.rover.audience.v1.StringArrayPredicate.Op = {
  IS_UNSET: 0,
  IS_SET: 1,
  CONTAINS_ANY: 2,
  DOES_NOT_CONTAIN_ANY: 3,
  CONTAINS_ALL: 4,
  DOES_NOT_CONTAIN_ALL: 5
};

/**
 * optional Op op = 1;
 * @return {!proto.rover.audience.v1.StringArrayPredicate.Op}
 */
proto.rover.audience.v1.StringArrayPredicate.prototype.getOp = function() {
  return /** @type {!proto.rover.audience.v1.StringArrayPredicate.Op} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/** @param {!proto.rover.audience.v1.StringArrayPredicate.Op} value */
proto.rover.audience.v1.StringArrayPredicate.prototype.setOp = function(value) {
  jspb.Message.setField(this, 1, value);
};


/**
 * optional string attribute_name = 2;
 * @return {string}
 */
proto.rover.audience.v1.StringArrayPredicate.prototype.getAttributeName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/** @param {string} value */
proto.rover.audience.v1.StringArrayPredicate.prototype.setAttributeName = function(value) {
  jspb.Message.setField(this, 2, value);
};


/**
 * repeated string value = 3;
 * If you change this array by adding, removing or replacing elements, or if you
 * replace the array itself, then you must call the setter to update it.
 * @return {!Array.<string>}
 */
proto.rover.audience.v1.StringArrayPredicate.prototype.getValueList = function() {
  return /** @type {!Array.<string>} */ (jspb.Message.getField(this, 3));
};


/** @param {!Array.<string>} value */
proto.rover.audience.v1.StringArrayPredicate.prototype.setValueList = function(value) {
  jspb.Message.setField(this, 3, value || []);
};


/**
 * @param {!string} value
 * @param {number=} opt_index
 */
proto.rover.audience.v1.StringArrayPredicate.prototype.addValue = function(value, opt_index) {
  jspb.Message.addToRepeatedField(this, 3, value, opt_index);
};


proto.rover.audience.v1.StringArrayPredicate.prototype.clearValueList = function() {
  this.setValueList([]);
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
proto.rover.audience.v1.Predicate.oneofGroups_ = [[2,3,4,5,6,7,8,9,10]];

/**
 * @enum {number}
 */
proto.rover.audience.v1.Predicate.ValueCase = {
  VALUE_NOT_SET: 0,
  STRING_PREDICATE: 2,
  BOOL_PREDICATE: 3,
  NUMBER_PREDICATE: 4,
  DATE_PREDICATE: 5,
  VERSION_PREDICATE: 6,
  GEOFENCE_PREDICATE: 7,
  DOUBLE_PREDICATE: 8,
  STRING_ARRAY_PREDICATE: 9,
  DURATION_PREDICATE: 10
};

/**
 * @return {proto.rover.audience.v1.Predicate.ValueCase}
 */
proto.rover.audience.v1.Predicate.prototype.getValueCase = function() {
  return /** @type {proto.rover.audience.v1.Predicate.ValueCase} */(jspb.Message.computeOneofCase(this, proto.rover.audience.v1.Predicate.oneofGroups_[0]));
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
    selector: jspb.Message.getFieldWithDefault(msg, 1, 0),
    stringPredicate: (f = msg.getStringPredicate()) && proto.rover.audience.v1.StringPredicate.toObject(includeInstance, f),
    boolPredicate: (f = msg.getBoolPredicate()) && proto.rover.audience.v1.BoolPredicate.toObject(includeInstance, f),
    numberPredicate: (f = msg.getNumberPredicate()) && proto.rover.audience.v1.NumberPredicate.toObject(includeInstance, f),
    datePredicate: (f = msg.getDatePredicate()) && proto.rover.audience.v1.DatePredicate.toObject(includeInstance, f),
    versionPredicate: (f = msg.getVersionPredicate()) && proto.rover.audience.v1.VersionPredicate.toObject(includeInstance, f),
    geofencePredicate: (f = msg.getGeofencePredicate()) && proto.rover.audience.v1.GeofencePredicate.toObject(includeInstance, f),
    doublePredicate: (f = msg.getDoublePredicate()) && proto.rover.audience.v1.DoublePredicate.toObject(includeInstance, f),
    stringArrayPredicate: (f = msg.getStringArrayPredicate()) && proto.rover.audience.v1.StringArrayPredicate.toObject(includeInstance, f),
    durationPredicate: (f = msg.getDurationPredicate()) && proto.rover.audience.v1.DurationPredicate.toObject(includeInstance, f)
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
      var value = /** @type {!proto.rover.audience.v1.Predicate.Selector} */ (reader.readEnum());
      msg.setSelector(value);
      break;
    case 2:
      var value = new proto.rover.audience.v1.StringPredicate;
      reader.readMessage(value,proto.rover.audience.v1.StringPredicate.deserializeBinaryFromReader);
      msg.setStringPredicate(value);
      break;
    case 3:
      var value = new proto.rover.audience.v1.BoolPredicate;
      reader.readMessage(value,proto.rover.audience.v1.BoolPredicate.deserializeBinaryFromReader);
      msg.setBoolPredicate(value);
      break;
    case 4:
      var value = new proto.rover.audience.v1.NumberPredicate;
      reader.readMessage(value,proto.rover.audience.v1.NumberPredicate.deserializeBinaryFromReader);
      msg.setNumberPredicate(value);
      break;
    case 5:
      var value = new proto.rover.audience.v1.DatePredicate;
      reader.readMessage(value,proto.rover.audience.v1.DatePredicate.deserializeBinaryFromReader);
      msg.setDatePredicate(value);
      break;
    case 6:
      var value = new proto.rover.audience.v1.VersionPredicate;
      reader.readMessage(value,proto.rover.audience.v1.VersionPredicate.deserializeBinaryFromReader);
      msg.setVersionPredicate(value);
      break;
    case 7:
      var value = new proto.rover.audience.v1.GeofencePredicate;
      reader.readMessage(value,proto.rover.audience.v1.GeofencePredicate.deserializeBinaryFromReader);
      msg.setGeofencePredicate(value);
      break;
    case 8:
      var value = new proto.rover.audience.v1.DoublePredicate;
      reader.readMessage(value,proto.rover.audience.v1.DoublePredicate.deserializeBinaryFromReader);
      msg.setDoublePredicate(value);
      break;
    case 9:
      var value = new proto.rover.audience.v1.StringArrayPredicate;
      reader.readMessage(value,proto.rover.audience.v1.StringArrayPredicate.deserializeBinaryFromReader);
      msg.setStringArrayPredicate(value);
      break;
    case 10:
      var value = new proto.rover.audience.v1.DurationPredicate;
      reader.readMessage(value,proto.rover.audience.v1.DurationPredicate.deserializeBinaryFromReader);
      msg.setDurationPredicate(value);
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
  f = message.getSelector();
  if (f !== 0.0) {
    writer.writeEnum(
      1,
      f
    );
  }
  f = message.getStringPredicate();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      proto.rover.audience.v1.StringPredicate.serializeBinaryToWriter
    );
  }
  f = message.getBoolPredicate();
  if (f != null) {
    writer.writeMessage(
      3,
      f,
      proto.rover.audience.v1.BoolPredicate.serializeBinaryToWriter
    );
  }
  f = message.getNumberPredicate();
  if (f != null) {
    writer.writeMessage(
      4,
      f,
      proto.rover.audience.v1.NumberPredicate.serializeBinaryToWriter
    );
  }
  f = message.getDatePredicate();
  if (f != null) {
    writer.writeMessage(
      5,
      f,
      proto.rover.audience.v1.DatePredicate.serializeBinaryToWriter
    );
  }
  f = message.getVersionPredicate();
  if (f != null) {
    writer.writeMessage(
      6,
      f,
      proto.rover.audience.v1.VersionPredicate.serializeBinaryToWriter
    );
  }
  f = message.getGeofencePredicate();
  if (f != null) {
    writer.writeMessage(
      7,
      f,
      proto.rover.audience.v1.GeofencePredicate.serializeBinaryToWriter
    );
  }
  f = message.getDoublePredicate();
  if (f != null) {
    writer.writeMessage(
      8,
      f,
      proto.rover.audience.v1.DoublePredicate.serializeBinaryToWriter
    );
  }
  f = message.getStringArrayPredicate();
  if (f != null) {
    writer.writeMessage(
      9,
      f,
      proto.rover.audience.v1.StringArrayPredicate.serializeBinaryToWriter
    );
  }
  f = message.getDurationPredicate();
  if (f != null) {
    writer.writeMessage(
      10,
      f,
      proto.rover.audience.v1.DurationPredicate.serializeBinaryToWriter
    );
  }
};


/**
 * @enum {number}
 */
proto.rover.audience.v1.Predicate.Selector = {
  CUSTOM_PROFILE: 0,
  DEVICE: 1,
  ROVER_PROFILE: 2
};

/**
 * optional Selector selector = 1;
 * @return {!proto.rover.audience.v1.Predicate.Selector}
 */
proto.rover.audience.v1.Predicate.prototype.getSelector = function() {
  return /** @type {!proto.rover.audience.v1.Predicate.Selector} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/** @param {!proto.rover.audience.v1.Predicate.Selector} value */
proto.rover.audience.v1.Predicate.prototype.setSelector = function(value) {
  jspb.Message.setField(this, 1, value);
};


/**
 * optional StringPredicate string_predicate = 2;
 * @return {?proto.rover.audience.v1.StringPredicate}
 */
proto.rover.audience.v1.Predicate.prototype.getStringPredicate = function() {
  return /** @type{?proto.rover.audience.v1.StringPredicate} */ (
    jspb.Message.getWrapperField(this, proto.rover.audience.v1.StringPredicate, 2));
};


/** @param {?proto.rover.audience.v1.StringPredicate|undefined} value */
proto.rover.audience.v1.Predicate.prototype.setStringPredicate = function(value) {
  jspb.Message.setOneofWrapperField(this, 2, proto.rover.audience.v1.Predicate.oneofGroups_[0], value);
};


proto.rover.audience.v1.Predicate.prototype.clearStringPredicate = function() {
  this.setStringPredicate(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.Predicate.prototype.hasStringPredicate = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional BoolPredicate bool_predicate = 3;
 * @return {?proto.rover.audience.v1.BoolPredicate}
 */
proto.rover.audience.v1.Predicate.prototype.getBoolPredicate = function() {
  return /** @type{?proto.rover.audience.v1.BoolPredicate} */ (
    jspb.Message.getWrapperField(this, proto.rover.audience.v1.BoolPredicate, 3));
};


/** @param {?proto.rover.audience.v1.BoolPredicate|undefined} value */
proto.rover.audience.v1.Predicate.prototype.setBoolPredicate = function(value) {
  jspb.Message.setOneofWrapperField(this, 3, proto.rover.audience.v1.Predicate.oneofGroups_[0], value);
};


proto.rover.audience.v1.Predicate.prototype.clearBoolPredicate = function() {
  this.setBoolPredicate(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.Predicate.prototype.hasBoolPredicate = function() {
  return jspb.Message.getField(this, 3) != null;
};


/**
 * optional NumberPredicate number_predicate = 4;
 * @return {?proto.rover.audience.v1.NumberPredicate}
 */
proto.rover.audience.v1.Predicate.prototype.getNumberPredicate = function() {
  return /** @type{?proto.rover.audience.v1.NumberPredicate} */ (
    jspb.Message.getWrapperField(this, proto.rover.audience.v1.NumberPredicate, 4));
};


/** @param {?proto.rover.audience.v1.NumberPredicate|undefined} value */
proto.rover.audience.v1.Predicate.prototype.setNumberPredicate = function(value) {
  jspb.Message.setOneofWrapperField(this, 4, proto.rover.audience.v1.Predicate.oneofGroups_[0], value);
};


proto.rover.audience.v1.Predicate.prototype.clearNumberPredicate = function() {
  this.setNumberPredicate(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.Predicate.prototype.hasNumberPredicate = function() {
  return jspb.Message.getField(this, 4) != null;
};


/**
 * optional DatePredicate date_predicate = 5;
 * @return {?proto.rover.audience.v1.DatePredicate}
 */
proto.rover.audience.v1.Predicate.prototype.getDatePredicate = function() {
  return /** @type{?proto.rover.audience.v1.DatePredicate} */ (
    jspb.Message.getWrapperField(this, proto.rover.audience.v1.DatePredicate, 5));
};


/** @param {?proto.rover.audience.v1.DatePredicate|undefined} value */
proto.rover.audience.v1.Predicate.prototype.setDatePredicate = function(value) {
  jspb.Message.setOneofWrapperField(this, 5, proto.rover.audience.v1.Predicate.oneofGroups_[0], value);
};


proto.rover.audience.v1.Predicate.prototype.clearDatePredicate = function() {
  this.setDatePredicate(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.Predicate.prototype.hasDatePredicate = function() {
  return jspb.Message.getField(this, 5) != null;
};


/**
 * optional VersionPredicate version_predicate = 6;
 * @return {?proto.rover.audience.v1.VersionPredicate}
 */
proto.rover.audience.v1.Predicate.prototype.getVersionPredicate = function() {
  return /** @type{?proto.rover.audience.v1.VersionPredicate} */ (
    jspb.Message.getWrapperField(this, proto.rover.audience.v1.VersionPredicate, 6));
};


/** @param {?proto.rover.audience.v1.VersionPredicate|undefined} value */
proto.rover.audience.v1.Predicate.prototype.setVersionPredicate = function(value) {
  jspb.Message.setOneofWrapperField(this, 6, proto.rover.audience.v1.Predicate.oneofGroups_[0], value);
};


proto.rover.audience.v1.Predicate.prototype.clearVersionPredicate = function() {
  this.setVersionPredicate(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.Predicate.prototype.hasVersionPredicate = function() {
  return jspb.Message.getField(this, 6) != null;
};


/**
 * optional GeofencePredicate geofence_predicate = 7;
 * @return {?proto.rover.audience.v1.GeofencePredicate}
 */
proto.rover.audience.v1.Predicate.prototype.getGeofencePredicate = function() {
  return /** @type{?proto.rover.audience.v1.GeofencePredicate} */ (
    jspb.Message.getWrapperField(this, proto.rover.audience.v1.GeofencePredicate, 7));
};


/** @param {?proto.rover.audience.v1.GeofencePredicate|undefined} value */
proto.rover.audience.v1.Predicate.prototype.setGeofencePredicate = function(value) {
  jspb.Message.setOneofWrapperField(this, 7, proto.rover.audience.v1.Predicate.oneofGroups_[0], value);
};


proto.rover.audience.v1.Predicate.prototype.clearGeofencePredicate = function() {
  this.setGeofencePredicate(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.Predicate.prototype.hasGeofencePredicate = function() {
  return jspb.Message.getField(this, 7) != null;
};


/**
 * optional DoublePredicate double_predicate = 8;
 * @return {?proto.rover.audience.v1.DoublePredicate}
 */
proto.rover.audience.v1.Predicate.prototype.getDoublePredicate = function() {
  return /** @type{?proto.rover.audience.v1.DoublePredicate} */ (
    jspb.Message.getWrapperField(this, proto.rover.audience.v1.DoublePredicate, 8));
};


/** @param {?proto.rover.audience.v1.DoublePredicate|undefined} value */
proto.rover.audience.v1.Predicate.prototype.setDoublePredicate = function(value) {
  jspb.Message.setOneofWrapperField(this, 8, proto.rover.audience.v1.Predicate.oneofGroups_[0], value);
};


proto.rover.audience.v1.Predicate.prototype.clearDoublePredicate = function() {
  this.setDoublePredicate(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.Predicate.prototype.hasDoublePredicate = function() {
  return jspb.Message.getField(this, 8) != null;
};


/**
 * optional StringArrayPredicate string_array_predicate = 9;
 * @return {?proto.rover.audience.v1.StringArrayPredicate}
 */
proto.rover.audience.v1.Predicate.prototype.getStringArrayPredicate = function() {
  return /** @type{?proto.rover.audience.v1.StringArrayPredicate} */ (
    jspb.Message.getWrapperField(this, proto.rover.audience.v1.StringArrayPredicate, 9));
};


/** @param {?proto.rover.audience.v1.StringArrayPredicate|undefined} value */
proto.rover.audience.v1.Predicate.prototype.setStringArrayPredicate = function(value) {
  jspb.Message.setOneofWrapperField(this, 9, proto.rover.audience.v1.Predicate.oneofGroups_[0], value);
};


proto.rover.audience.v1.Predicate.prototype.clearStringArrayPredicate = function() {
  this.setStringArrayPredicate(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.Predicate.prototype.hasStringArrayPredicate = function() {
  return jspb.Message.getField(this, 9) != null;
};


/**
 * optional DurationPredicate duration_predicate = 10;
 * @return {?proto.rover.audience.v1.DurationPredicate}
 */
proto.rover.audience.v1.Predicate.prototype.getDurationPredicate = function() {
  return /** @type{?proto.rover.audience.v1.DurationPredicate} */ (
    jspb.Message.getWrapperField(this, proto.rover.audience.v1.DurationPredicate, 10));
};


/** @param {?proto.rover.audience.v1.DurationPredicate|undefined} value */
proto.rover.audience.v1.Predicate.prototype.setDurationPredicate = function(value) {
  jspb.Message.setOneofWrapperField(this, 10, proto.rover.audience.v1.Predicate.oneofGroups_[0], value);
};


proto.rover.audience.v1.Predicate.prototype.clearDurationPredicate = function() {
  this.setDurationPredicate(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.Predicate.prototype.hasDurationPredicate = function() {
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
proto.rover.audience.v1.QueryRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, proto.rover.audience.v1.QueryRequest.oneofGroups_);
};
goog.inherits(proto.rover.audience.v1.QueryRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.QueryRequest.displayName = 'proto.rover.audience.v1.QueryRequest';
}
/**
 * Oneof group definitions for this message. Each group defines the field
 * numbers belonging to that group. When of these fields' value is set, all
 * other fields in the group are cleared. During deserialization, if multiple
 * fields are encountered for a group, only the last value seen will be kept.
 * @private {!Array<!Array<number>>}
 * @const
 */
proto.rover.audience.v1.QueryRequest.oneofGroups_ = [[3,4]];

/**
 * @enum {number}
 */
proto.rover.audience.v1.QueryRequest.IteratorCase = {
  ITERATOR_NOT_SET: 0,
  PAGE_ITERATOR: 3,
  SCROLL_ITERATOR: 4
};

/**
 * @return {proto.rover.audience.v1.QueryRequest.IteratorCase}
 */
proto.rover.audience.v1.QueryRequest.prototype.getIteratorCase = function() {
  return /** @type {proto.rover.audience.v1.QueryRequest.IteratorCase} */(jspb.Message.computeOneofCase(this, proto.rover.audience.v1.QueryRequest.oneofGroups_[0]));
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
proto.rover.audience.v1.QueryRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.QueryRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.QueryRequest} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.QueryRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    authContext: (f = msg.getAuthContext()) && auth_v1_auth_pb.AuthContext.toObject(includeInstance, f),
    predicateAggregate: (f = msg.getPredicateAggregate()) && proto.rover.audience.v1.PredicateAggregate.toObject(includeInstance, f),
    pageIterator: (f = msg.getPageIterator()) && proto.rover.audience.v1.QueryRequest.PageIterator.toObject(includeInstance, f),
    scrollIterator: (f = msg.getScrollIterator()) && proto.rover.audience.v1.QueryRequest.ScrollIterator.toObject(includeInstance, f),
    timeZoneOffset: (f = msg.getTimeZoneOffset()) && proto.rover.audience.v1.QueryRequest.TimeZoneOffset.toObject(includeInstance, f)
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
 * @return {!proto.rover.audience.v1.QueryRequest}
 */
proto.rover.audience.v1.QueryRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.QueryRequest;
  return proto.rover.audience.v1.QueryRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.QueryRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.QueryRequest}
 */
proto.rover.audience.v1.QueryRequest.deserializeBinaryFromReader = function(msg, reader) {
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
      var value = new proto.rover.audience.v1.PredicateAggregate;
      reader.readMessage(value,proto.rover.audience.v1.PredicateAggregate.deserializeBinaryFromReader);
      msg.setPredicateAggregate(value);
      break;
    case 3:
      var value = new proto.rover.audience.v1.QueryRequest.PageIterator;
      reader.readMessage(value,proto.rover.audience.v1.QueryRequest.PageIterator.deserializeBinaryFromReader);
      msg.setPageIterator(value);
      break;
    case 4:
      var value = new proto.rover.audience.v1.QueryRequest.ScrollIterator;
      reader.readMessage(value,proto.rover.audience.v1.QueryRequest.ScrollIterator.deserializeBinaryFromReader);
      msg.setScrollIterator(value);
      break;
    case 5:
      var value = new proto.rover.audience.v1.QueryRequest.TimeZoneOffset;
      reader.readMessage(value,proto.rover.audience.v1.QueryRequest.TimeZoneOffset.deserializeBinaryFromReader);
      msg.setTimeZoneOffset(value);
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
proto.rover.audience.v1.QueryRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.QueryRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.QueryRequest} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.QueryRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getAuthContext();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      auth_v1_auth_pb.AuthContext.serializeBinaryToWriter
    );
  }
  f = message.getPredicateAggregate();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      proto.rover.audience.v1.PredicateAggregate.serializeBinaryToWriter
    );
  }
  f = message.getPageIterator();
  if (f != null) {
    writer.writeMessage(
      3,
      f,
      proto.rover.audience.v1.QueryRequest.PageIterator.serializeBinaryToWriter
    );
  }
  f = message.getScrollIterator();
  if (f != null) {
    writer.writeMessage(
      4,
      f,
      proto.rover.audience.v1.QueryRequest.ScrollIterator.serializeBinaryToWriter
    );
  }
  f = message.getTimeZoneOffset();
  if (f != null) {
    writer.writeMessage(
      5,
      f,
      proto.rover.audience.v1.QueryRequest.TimeZoneOffset.serializeBinaryToWriter
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
proto.rover.audience.v1.QueryRequest.PageIterator = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.rover.audience.v1.QueryRequest.PageIterator, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.QueryRequest.PageIterator.displayName = 'proto.rover.audience.v1.QueryRequest.PageIterator';
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
proto.rover.audience.v1.QueryRequest.PageIterator.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.QueryRequest.PageIterator.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.QueryRequest.PageIterator} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.QueryRequest.PageIterator.toObject = function(includeInstance, msg) {
  var f, obj = {
    page: jspb.Message.getFieldWithDefault(msg, 1, 0),
    size: jspb.Message.getFieldWithDefault(msg, 2, 0)
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
 * @return {!proto.rover.audience.v1.QueryRequest.PageIterator}
 */
proto.rover.audience.v1.QueryRequest.PageIterator.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.QueryRequest.PageIterator;
  return proto.rover.audience.v1.QueryRequest.PageIterator.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.QueryRequest.PageIterator} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.QueryRequest.PageIterator}
 */
proto.rover.audience.v1.QueryRequest.PageIterator.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setPage(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setSize(value);
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
proto.rover.audience.v1.QueryRequest.PageIterator.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.QueryRequest.PageIterator.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.QueryRequest.PageIterator} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.QueryRequest.PageIterator.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getPage();
  if (f !== 0) {
    writer.writeInt32(
      1,
      f
    );
  }
  f = message.getSize();
  if (f !== 0) {
    writer.writeInt32(
      2,
      f
    );
  }
};


/**
 * optional int32 page = 1;
 * @return {number}
 */
proto.rover.audience.v1.QueryRequest.PageIterator.prototype.getPage = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/** @param {number} value */
proto.rover.audience.v1.QueryRequest.PageIterator.prototype.setPage = function(value) {
  jspb.Message.setField(this, 1, value);
};


/**
 * optional int32 size = 2;
 * @return {number}
 */
proto.rover.audience.v1.QueryRequest.PageIterator.prototype.getSize = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/** @param {number} value */
proto.rover.audience.v1.QueryRequest.PageIterator.prototype.setSize = function(value) {
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
proto.rover.audience.v1.QueryRequest.ScrollIterator = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, proto.rover.audience.v1.QueryRequest.ScrollIterator.oneofGroups_);
};
goog.inherits(proto.rover.audience.v1.QueryRequest.ScrollIterator, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.QueryRequest.ScrollIterator.displayName = 'proto.rover.audience.v1.QueryRequest.ScrollIterator';
}
/**
 * Oneof group definitions for this message. Each group defines the field
 * numbers belonging to that group. When of these fields' value is set, all
 * other fields in the group are cleared. During deserialization, if multiple
 * fields are encountered for a group, only the last value seen will be kept.
 * @private {!Array<!Array<number>>}
 * @const
 */
proto.rover.audience.v1.QueryRequest.ScrollIterator.oneofGroups_ = [[1,2,3,4]];

/**
 * @enum {number}
 */
proto.rover.audience.v1.QueryRequest.ScrollIterator.OperationCase = {
  OPERATION_NOT_SET: 0,
  START_PARALLEL_SCROLL: 1,
  START_SCROLL: 2,
  CLEAR: 3,
  NEXT: 4
};

/**
 * @return {proto.rover.audience.v1.QueryRequest.ScrollIterator.OperationCase}
 */
proto.rover.audience.v1.QueryRequest.ScrollIterator.prototype.getOperationCase = function() {
  return /** @type {proto.rover.audience.v1.QueryRequest.ScrollIterator.OperationCase} */(jspb.Message.computeOneofCase(this, proto.rover.audience.v1.QueryRequest.ScrollIterator.oneofGroups_[0]));
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
proto.rover.audience.v1.QueryRequest.ScrollIterator.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.QueryRequest.ScrollIterator.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.QueryRequest.ScrollIterator} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.QueryRequest.ScrollIterator.toObject = function(includeInstance, msg) {
  var f, obj = {
    startParallelScroll: (f = msg.getStartParallelScroll()) && proto.rover.audience.v1.QueryRequest.ScrollIterator.StartParallelScroll.toObject(includeInstance, f),
    startScroll: (f = msg.getStartScroll()) && proto.rover.audience.v1.QueryRequest.ScrollIterator.StartScroll.toObject(includeInstance, f),
    clear: (f = msg.getClear()) && proto.rover.audience.v1.QueryRequest.ScrollIterator.Clear.toObject(includeInstance, f),
    next: (f = msg.getNext()) && proto.rover.audience.v1.QueryRequest.ScrollIterator.Next.toObject(includeInstance, f)
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
 * @return {!proto.rover.audience.v1.QueryRequest.ScrollIterator}
 */
proto.rover.audience.v1.QueryRequest.ScrollIterator.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.QueryRequest.ScrollIterator;
  return proto.rover.audience.v1.QueryRequest.ScrollIterator.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.QueryRequest.ScrollIterator} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.QueryRequest.ScrollIterator}
 */
proto.rover.audience.v1.QueryRequest.ScrollIterator.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.rover.audience.v1.QueryRequest.ScrollIterator.StartParallelScroll;
      reader.readMessage(value,proto.rover.audience.v1.QueryRequest.ScrollIterator.StartParallelScroll.deserializeBinaryFromReader);
      msg.setStartParallelScroll(value);
      break;
    case 2:
      var value = new proto.rover.audience.v1.QueryRequest.ScrollIterator.StartScroll;
      reader.readMessage(value,proto.rover.audience.v1.QueryRequest.ScrollIterator.StartScroll.deserializeBinaryFromReader);
      msg.setStartScroll(value);
      break;
    case 3:
      var value = new proto.rover.audience.v1.QueryRequest.ScrollIterator.Clear;
      reader.readMessage(value,proto.rover.audience.v1.QueryRequest.ScrollIterator.Clear.deserializeBinaryFromReader);
      msg.setClear(value);
      break;
    case 4:
      var value = new proto.rover.audience.v1.QueryRequest.ScrollIterator.Next;
      reader.readMessage(value,proto.rover.audience.v1.QueryRequest.ScrollIterator.Next.deserializeBinaryFromReader);
      msg.setNext(value);
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
proto.rover.audience.v1.QueryRequest.ScrollIterator.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.QueryRequest.ScrollIterator.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.QueryRequest.ScrollIterator} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.QueryRequest.ScrollIterator.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getStartParallelScroll();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.rover.audience.v1.QueryRequest.ScrollIterator.StartParallelScroll.serializeBinaryToWriter
    );
  }
  f = message.getStartScroll();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      proto.rover.audience.v1.QueryRequest.ScrollIterator.StartScroll.serializeBinaryToWriter
    );
  }
  f = message.getClear();
  if (f != null) {
    writer.writeMessage(
      3,
      f,
      proto.rover.audience.v1.QueryRequest.ScrollIterator.Clear.serializeBinaryToWriter
    );
  }
  f = message.getNext();
  if (f != null) {
    writer.writeMessage(
      4,
      f,
      proto.rover.audience.v1.QueryRequest.ScrollIterator.Next.serializeBinaryToWriter
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
proto.rover.audience.v1.QueryRequest.ScrollIterator.StartParallelScroll = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.rover.audience.v1.QueryRequest.ScrollIterator.StartParallelScroll, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.QueryRequest.ScrollIterator.StartParallelScroll.displayName = 'proto.rover.audience.v1.QueryRequest.ScrollIterator.StartParallelScroll';
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
proto.rover.audience.v1.QueryRequest.ScrollIterator.StartParallelScroll.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.QueryRequest.ScrollIterator.StartParallelScroll.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.QueryRequest.ScrollIterator.StartParallelScroll} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.QueryRequest.ScrollIterator.StartParallelScroll.toObject = function(includeInstance, msg) {
  var f, obj = {
    maxStreams: jspb.Message.getFieldWithDefault(msg, 1, 0),
    streamId: jspb.Message.getFieldWithDefault(msg, 2, 0),
    batchSize: jspb.Message.getFieldWithDefault(msg, 3, 0)
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
 * @return {!proto.rover.audience.v1.QueryRequest.ScrollIterator.StartParallelScroll}
 */
proto.rover.audience.v1.QueryRequest.ScrollIterator.StartParallelScroll.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.QueryRequest.ScrollIterator.StartParallelScroll;
  return proto.rover.audience.v1.QueryRequest.ScrollIterator.StartParallelScroll.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.QueryRequest.ScrollIterator.StartParallelScroll} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.QueryRequest.ScrollIterator.StartParallelScroll}
 */
proto.rover.audience.v1.QueryRequest.ScrollIterator.StartParallelScroll.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setMaxStreams(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setStreamId(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setBatchSize(value);
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
proto.rover.audience.v1.QueryRequest.ScrollIterator.StartParallelScroll.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.QueryRequest.ScrollIterator.StartParallelScroll.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.QueryRequest.ScrollIterator.StartParallelScroll} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.QueryRequest.ScrollIterator.StartParallelScroll.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getMaxStreams();
  if (f !== 0) {
    writer.writeInt32(
      1,
      f
    );
  }
  f = message.getStreamId();
  if (f !== 0) {
    writer.writeInt32(
      2,
      f
    );
  }
  f = message.getBatchSize();
  if (f !== 0) {
    writer.writeInt32(
      3,
      f
    );
  }
};


/**
 * optional int32 max_streams = 1;
 * @return {number}
 */
proto.rover.audience.v1.QueryRequest.ScrollIterator.StartParallelScroll.prototype.getMaxStreams = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/** @param {number} value */
proto.rover.audience.v1.QueryRequest.ScrollIterator.StartParallelScroll.prototype.setMaxStreams = function(value) {
  jspb.Message.setField(this, 1, value);
};


/**
 * optional int32 stream_id = 2;
 * @return {number}
 */
proto.rover.audience.v1.QueryRequest.ScrollIterator.StartParallelScroll.prototype.getStreamId = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/** @param {number} value */
proto.rover.audience.v1.QueryRequest.ScrollIterator.StartParallelScroll.prototype.setStreamId = function(value) {
  jspb.Message.setField(this, 2, value);
};


/**
 * optional int32 batch_size = 3;
 * @return {number}
 */
proto.rover.audience.v1.QueryRequest.ScrollIterator.StartParallelScroll.prototype.getBatchSize = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/** @param {number} value */
proto.rover.audience.v1.QueryRequest.ScrollIterator.StartParallelScroll.prototype.setBatchSize = function(value) {
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
proto.rover.audience.v1.QueryRequest.ScrollIterator.StartScroll = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.rover.audience.v1.QueryRequest.ScrollIterator.StartScroll, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.QueryRequest.ScrollIterator.StartScroll.displayName = 'proto.rover.audience.v1.QueryRequest.ScrollIterator.StartScroll';
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
proto.rover.audience.v1.QueryRequest.ScrollIterator.StartScroll.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.QueryRequest.ScrollIterator.StartScroll.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.QueryRequest.ScrollIterator.StartScroll} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.QueryRequest.ScrollIterator.StartScroll.toObject = function(includeInstance, msg) {
  var f, obj = {
    batchSize: jspb.Message.getFieldWithDefault(msg, 1, 0)
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
 * @return {!proto.rover.audience.v1.QueryRequest.ScrollIterator.StartScroll}
 */
proto.rover.audience.v1.QueryRequest.ScrollIterator.StartScroll.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.QueryRequest.ScrollIterator.StartScroll;
  return proto.rover.audience.v1.QueryRequest.ScrollIterator.StartScroll.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.QueryRequest.ScrollIterator.StartScroll} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.QueryRequest.ScrollIterator.StartScroll}
 */
proto.rover.audience.v1.QueryRequest.ScrollIterator.StartScroll.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setBatchSize(value);
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
proto.rover.audience.v1.QueryRequest.ScrollIterator.StartScroll.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.QueryRequest.ScrollIterator.StartScroll.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.QueryRequest.ScrollIterator.StartScroll} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.QueryRequest.ScrollIterator.StartScroll.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getBatchSize();
  if (f !== 0) {
    writer.writeInt32(
      1,
      f
    );
  }
};


/**
 * optional int32 batch_size = 1;
 * @return {number}
 */
proto.rover.audience.v1.QueryRequest.ScrollIterator.StartScroll.prototype.getBatchSize = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/** @param {number} value */
proto.rover.audience.v1.QueryRequest.ScrollIterator.StartScroll.prototype.setBatchSize = function(value) {
  jspb.Message.setField(this, 1, value);
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
proto.rover.audience.v1.QueryRequest.ScrollIterator.Next = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.rover.audience.v1.QueryRequest.ScrollIterator.Next, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.QueryRequest.ScrollIterator.Next.displayName = 'proto.rover.audience.v1.QueryRequest.ScrollIterator.Next';
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
proto.rover.audience.v1.QueryRequest.ScrollIterator.Next.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.QueryRequest.ScrollIterator.Next.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.QueryRequest.ScrollIterator.Next} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.QueryRequest.ScrollIterator.Next.toObject = function(includeInstance, msg) {
  var f, obj = {
    scrollId: jspb.Message.getFieldWithDefault(msg, 1, "")
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
 * @return {!proto.rover.audience.v1.QueryRequest.ScrollIterator.Next}
 */
proto.rover.audience.v1.QueryRequest.ScrollIterator.Next.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.QueryRequest.ScrollIterator.Next;
  return proto.rover.audience.v1.QueryRequest.ScrollIterator.Next.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.QueryRequest.ScrollIterator.Next} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.QueryRequest.ScrollIterator.Next}
 */
proto.rover.audience.v1.QueryRequest.ScrollIterator.Next.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setScrollId(value);
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
proto.rover.audience.v1.QueryRequest.ScrollIterator.Next.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.QueryRequest.ScrollIterator.Next.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.QueryRequest.ScrollIterator.Next} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.QueryRequest.ScrollIterator.Next.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getScrollId();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
};


/**
 * optional string scroll_id = 1;
 * @return {string}
 */
proto.rover.audience.v1.QueryRequest.ScrollIterator.Next.prototype.getScrollId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/** @param {string} value */
proto.rover.audience.v1.QueryRequest.ScrollIterator.Next.prototype.setScrollId = function(value) {
  jspb.Message.setField(this, 1, value);
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
proto.rover.audience.v1.QueryRequest.ScrollIterator.Clear = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.rover.audience.v1.QueryRequest.ScrollIterator.Clear, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.QueryRequest.ScrollIterator.Clear.displayName = 'proto.rover.audience.v1.QueryRequest.ScrollIterator.Clear';
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
proto.rover.audience.v1.QueryRequest.ScrollIterator.Clear.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.QueryRequest.ScrollIterator.Clear.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.QueryRequest.ScrollIterator.Clear} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.QueryRequest.ScrollIterator.Clear.toObject = function(includeInstance, msg) {
  var f, obj = {
    scrollId: jspb.Message.getFieldWithDefault(msg, 1, "")
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
 * @return {!proto.rover.audience.v1.QueryRequest.ScrollIterator.Clear}
 */
proto.rover.audience.v1.QueryRequest.ScrollIterator.Clear.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.QueryRequest.ScrollIterator.Clear;
  return proto.rover.audience.v1.QueryRequest.ScrollIterator.Clear.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.QueryRequest.ScrollIterator.Clear} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.QueryRequest.ScrollIterator.Clear}
 */
proto.rover.audience.v1.QueryRequest.ScrollIterator.Clear.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setScrollId(value);
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
proto.rover.audience.v1.QueryRequest.ScrollIterator.Clear.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.QueryRequest.ScrollIterator.Clear.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.QueryRequest.ScrollIterator.Clear} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.QueryRequest.ScrollIterator.Clear.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getScrollId();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
};


/**
 * optional string scroll_id = 1;
 * @return {string}
 */
proto.rover.audience.v1.QueryRequest.ScrollIterator.Clear.prototype.getScrollId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/** @param {string} value */
proto.rover.audience.v1.QueryRequest.ScrollIterator.Clear.prototype.setScrollId = function(value) {
  jspb.Message.setField(this, 1, value);
};


/**
 * optional StartParallelScroll start_parallel_scroll = 1;
 * @return {?proto.rover.audience.v1.QueryRequest.ScrollIterator.StartParallelScroll}
 */
proto.rover.audience.v1.QueryRequest.ScrollIterator.prototype.getStartParallelScroll = function() {
  return /** @type{?proto.rover.audience.v1.QueryRequest.ScrollIterator.StartParallelScroll} */ (
    jspb.Message.getWrapperField(this, proto.rover.audience.v1.QueryRequest.ScrollIterator.StartParallelScroll, 1));
};


/** @param {?proto.rover.audience.v1.QueryRequest.ScrollIterator.StartParallelScroll|undefined} value */
proto.rover.audience.v1.QueryRequest.ScrollIterator.prototype.setStartParallelScroll = function(value) {
  jspb.Message.setOneofWrapperField(this, 1, proto.rover.audience.v1.QueryRequest.ScrollIterator.oneofGroups_[0], value);
};


proto.rover.audience.v1.QueryRequest.ScrollIterator.prototype.clearStartParallelScroll = function() {
  this.setStartParallelScroll(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.QueryRequest.ScrollIterator.prototype.hasStartParallelScroll = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional StartScroll start_scroll = 2;
 * @return {?proto.rover.audience.v1.QueryRequest.ScrollIterator.StartScroll}
 */
proto.rover.audience.v1.QueryRequest.ScrollIterator.prototype.getStartScroll = function() {
  return /** @type{?proto.rover.audience.v1.QueryRequest.ScrollIterator.StartScroll} */ (
    jspb.Message.getWrapperField(this, proto.rover.audience.v1.QueryRequest.ScrollIterator.StartScroll, 2));
};


/** @param {?proto.rover.audience.v1.QueryRequest.ScrollIterator.StartScroll|undefined} value */
proto.rover.audience.v1.QueryRequest.ScrollIterator.prototype.setStartScroll = function(value) {
  jspb.Message.setOneofWrapperField(this, 2, proto.rover.audience.v1.QueryRequest.ScrollIterator.oneofGroups_[0], value);
};


proto.rover.audience.v1.QueryRequest.ScrollIterator.prototype.clearStartScroll = function() {
  this.setStartScroll(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.QueryRequest.ScrollIterator.prototype.hasStartScroll = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional Clear clear = 3;
 * @return {?proto.rover.audience.v1.QueryRequest.ScrollIterator.Clear}
 */
proto.rover.audience.v1.QueryRequest.ScrollIterator.prototype.getClear = function() {
  return /** @type{?proto.rover.audience.v1.QueryRequest.ScrollIterator.Clear} */ (
    jspb.Message.getWrapperField(this, proto.rover.audience.v1.QueryRequest.ScrollIterator.Clear, 3));
};


/** @param {?proto.rover.audience.v1.QueryRequest.ScrollIterator.Clear|undefined} value */
proto.rover.audience.v1.QueryRequest.ScrollIterator.prototype.setClear = function(value) {
  jspb.Message.setOneofWrapperField(this, 3, proto.rover.audience.v1.QueryRequest.ScrollIterator.oneofGroups_[0], value);
};


proto.rover.audience.v1.QueryRequest.ScrollIterator.prototype.clearClear = function() {
  this.setClear(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.QueryRequest.ScrollIterator.prototype.hasClear = function() {
  return jspb.Message.getField(this, 3) != null;
};


/**
 * optional Next next = 4;
 * @return {?proto.rover.audience.v1.QueryRequest.ScrollIterator.Next}
 */
proto.rover.audience.v1.QueryRequest.ScrollIterator.prototype.getNext = function() {
  return /** @type{?proto.rover.audience.v1.QueryRequest.ScrollIterator.Next} */ (
    jspb.Message.getWrapperField(this, proto.rover.audience.v1.QueryRequest.ScrollIterator.Next, 4));
};


/** @param {?proto.rover.audience.v1.QueryRequest.ScrollIterator.Next|undefined} value */
proto.rover.audience.v1.QueryRequest.ScrollIterator.prototype.setNext = function(value) {
  jspb.Message.setOneofWrapperField(this, 4, proto.rover.audience.v1.QueryRequest.ScrollIterator.oneofGroups_[0], value);
};


proto.rover.audience.v1.QueryRequest.ScrollIterator.prototype.clearNext = function() {
  this.setNext(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.QueryRequest.ScrollIterator.prototype.hasNext = function() {
  return jspb.Message.getField(this, 4) != null;
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
proto.rover.audience.v1.QueryRequest.TimeZoneOffset = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.rover.audience.v1.QueryRequest.TimeZoneOffset, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.QueryRequest.TimeZoneOffset.displayName = 'proto.rover.audience.v1.QueryRequest.TimeZoneOffset';
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
proto.rover.audience.v1.QueryRequest.TimeZoneOffset.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.QueryRequest.TimeZoneOffset.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.QueryRequest.TimeZoneOffset} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.QueryRequest.TimeZoneOffset.toObject = function(includeInstance, msg) {
  var f, obj = {
    seconds: jspb.Message.getFieldWithDefault(msg, 1, 0)
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
 * @return {!proto.rover.audience.v1.QueryRequest.TimeZoneOffset}
 */
proto.rover.audience.v1.QueryRequest.TimeZoneOffset.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.QueryRequest.TimeZoneOffset;
  return proto.rover.audience.v1.QueryRequest.TimeZoneOffset.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.QueryRequest.TimeZoneOffset} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.QueryRequest.TimeZoneOffset}
 */
proto.rover.audience.v1.QueryRequest.TimeZoneOffset.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setSeconds(value);
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
proto.rover.audience.v1.QueryRequest.TimeZoneOffset.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.QueryRequest.TimeZoneOffset.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.QueryRequest.TimeZoneOffset} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.QueryRequest.TimeZoneOffset.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSeconds();
  if (f !== 0) {
    writer.writeInt32(
      1,
      f
    );
  }
};


/**
 * optional int32 seconds = 1;
 * @return {number}
 */
proto.rover.audience.v1.QueryRequest.TimeZoneOffset.prototype.getSeconds = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/** @param {number} value */
proto.rover.audience.v1.QueryRequest.TimeZoneOffset.prototype.setSeconds = function(value) {
  jspb.Message.setField(this, 1, value);
};


/**
 * optional rover.auth.v1.AuthContext auth_context = 1;
 * @return {?proto.rover.auth.v1.AuthContext}
 */
proto.rover.audience.v1.QueryRequest.prototype.getAuthContext = function() {
  return /** @type{?proto.rover.auth.v1.AuthContext} */ (
    jspb.Message.getWrapperField(this, auth_v1_auth_pb.AuthContext, 1));
};


/** @param {?proto.rover.auth.v1.AuthContext|undefined} value */
proto.rover.audience.v1.QueryRequest.prototype.setAuthContext = function(value) {
  jspb.Message.setWrapperField(this, 1, value);
};


proto.rover.audience.v1.QueryRequest.prototype.clearAuthContext = function() {
  this.setAuthContext(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.QueryRequest.prototype.hasAuthContext = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional PredicateAggregate predicate_aggregate = 2;
 * @return {?proto.rover.audience.v1.PredicateAggregate}
 */
proto.rover.audience.v1.QueryRequest.prototype.getPredicateAggregate = function() {
  return /** @type{?proto.rover.audience.v1.PredicateAggregate} */ (
    jspb.Message.getWrapperField(this, proto.rover.audience.v1.PredicateAggregate, 2));
};


/** @param {?proto.rover.audience.v1.PredicateAggregate|undefined} value */
proto.rover.audience.v1.QueryRequest.prototype.setPredicateAggregate = function(value) {
  jspb.Message.setWrapperField(this, 2, value);
};


proto.rover.audience.v1.QueryRequest.prototype.clearPredicateAggregate = function() {
  this.setPredicateAggregate(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.QueryRequest.prototype.hasPredicateAggregate = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional PageIterator page_iterator = 3;
 * @return {?proto.rover.audience.v1.QueryRequest.PageIterator}
 */
proto.rover.audience.v1.QueryRequest.prototype.getPageIterator = function() {
  return /** @type{?proto.rover.audience.v1.QueryRequest.PageIterator} */ (
    jspb.Message.getWrapperField(this, proto.rover.audience.v1.QueryRequest.PageIterator, 3));
};


/** @param {?proto.rover.audience.v1.QueryRequest.PageIterator|undefined} value */
proto.rover.audience.v1.QueryRequest.prototype.setPageIterator = function(value) {
  jspb.Message.setOneofWrapperField(this, 3, proto.rover.audience.v1.QueryRequest.oneofGroups_[0], value);
};


proto.rover.audience.v1.QueryRequest.prototype.clearPageIterator = function() {
  this.setPageIterator(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.QueryRequest.prototype.hasPageIterator = function() {
  return jspb.Message.getField(this, 3) != null;
};


/**
 * optional ScrollIterator scroll_iterator = 4;
 * @return {?proto.rover.audience.v1.QueryRequest.ScrollIterator}
 */
proto.rover.audience.v1.QueryRequest.prototype.getScrollIterator = function() {
  return /** @type{?proto.rover.audience.v1.QueryRequest.ScrollIterator} */ (
    jspb.Message.getWrapperField(this, proto.rover.audience.v1.QueryRequest.ScrollIterator, 4));
};


/** @param {?proto.rover.audience.v1.QueryRequest.ScrollIterator|undefined} value */
proto.rover.audience.v1.QueryRequest.prototype.setScrollIterator = function(value) {
  jspb.Message.setOneofWrapperField(this, 4, proto.rover.audience.v1.QueryRequest.oneofGroups_[0], value);
};


proto.rover.audience.v1.QueryRequest.prototype.clearScrollIterator = function() {
  this.setScrollIterator(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.QueryRequest.prototype.hasScrollIterator = function() {
  return jspb.Message.getField(this, 4) != null;
};


/**
 * optional TimeZoneOffset time_zone_offset = 5;
 * @return {?proto.rover.audience.v1.QueryRequest.TimeZoneOffset}
 */
proto.rover.audience.v1.QueryRequest.prototype.getTimeZoneOffset = function() {
  return /** @type{?proto.rover.audience.v1.QueryRequest.TimeZoneOffset} */ (
    jspb.Message.getWrapperField(this, proto.rover.audience.v1.QueryRequest.TimeZoneOffset, 5));
};


/** @param {?proto.rover.audience.v1.QueryRequest.TimeZoneOffset|undefined} value */
proto.rover.audience.v1.QueryRequest.prototype.setTimeZoneOffset = function(value) {
  jspb.Message.setWrapperField(this, 5, value);
};


proto.rover.audience.v1.QueryRequest.prototype.clearTimeZoneOffset = function() {
  this.setTimeZoneOffset(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.QueryRequest.prototype.hasTimeZoneOffset = function() {
  return jspb.Message.getField(this, 5) != null;
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
proto.rover.audience.v1.QueryResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.rover.audience.v1.QueryResponse.repeatedFields_, null);
};
goog.inherits(proto.rover.audience.v1.QueryResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.QueryResponse.displayName = 'proto.rover.audience.v1.QueryResponse';
}
/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.rover.audience.v1.QueryResponse.repeatedFields_ = [2,3];



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
proto.rover.audience.v1.QueryResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.QueryResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.QueryResponse} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.QueryResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    totalSize: jspb.Message.getFieldWithDefault(msg, 1, 0),
    profilesList: jspb.Message.toObjectList(msg.getProfilesList(),
    proto.rover.audience.v1.Profile.toObject, includeInstance),
    devicesList: jspb.Message.toObjectList(msg.getDevicesList(),
    proto.rover.audience.v1.Device.toObject, includeInstance),
    scrollId: jspb.Message.getFieldWithDefault(msg, 9, "")
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
 * @return {!proto.rover.audience.v1.QueryResponse}
 */
proto.rover.audience.v1.QueryResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.QueryResponse;
  return proto.rover.audience.v1.QueryResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.QueryResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.QueryResponse}
 */
proto.rover.audience.v1.QueryResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setTotalSize(value);
      break;
    case 2:
      var value = new proto.rover.audience.v1.Profile;
      reader.readMessage(value,proto.rover.audience.v1.Profile.deserializeBinaryFromReader);
      msg.addProfiles(value);
      break;
    case 3:
      var value = new proto.rover.audience.v1.Device;
      reader.readMessage(value,proto.rover.audience.v1.Device.deserializeBinaryFromReader);
      msg.addDevices(value);
      break;
    case 9:
      var value = /** @type {string} */ (reader.readString());
      msg.setScrollId(value);
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
proto.rover.audience.v1.QueryResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.QueryResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.QueryResponse} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.QueryResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getTotalSize();
  if (f !== 0) {
    writer.writeInt64(
      1,
      f
    );
  }
  f = message.getProfilesList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      2,
      f,
      proto.rover.audience.v1.Profile.serializeBinaryToWriter
    );
  }
  f = message.getDevicesList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      3,
      f,
      proto.rover.audience.v1.Device.serializeBinaryToWriter
    );
  }
  f = message.getScrollId();
  if (f.length > 0) {
    writer.writeString(
      9,
      f
    );
  }
};


/**
 * optional int64 total_size = 1;
 * @return {number}
 */
proto.rover.audience.v1.QueryResponse.prototype.getTotalSize = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/** @param {number} value */
proto.rover.audience.v1.QueryResponse.prototype.setTotalSize = function(value) {
  jspb.Message.setField(this, 1, value);
};


/**
 * repeated Profile profiles = 2;
 * If you change this array by adding, removing or replacing elements, or if you
 * replace the array itself, then you must call the setter to update it.
 * @return {!Array.<!proto.rover.audience.v1.Profile>}
 */
proto.rover.audience.v1.QueryResponse.prototype.getProfilesList = function() {
  return /** @type{!Array.<!proto.rover.audience.v1.Profile>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.rover.audience.v1.Profile, 2));
};


/** @param {!Array.<!proto.rover.audience.v1.Profile>} value */
proto.rover.audience.v1.QueryResponse.prototype.setProfilesList = function(value) {
  jspb.Message.setRepeatedWrapperField(this, 2, value);
};


/**
 * @param {!proto.rover.audience.v1.Profile=} opt_value
 * @param {number=} opt_index
 * @return {!proto.rover.audience.v1.Profile}
 */
proto.rover.audience.v1.QueryResponse.prototype.addProfiles = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 2, opt_value, proto.rover.audience.v1.Profile, opt_index);
};


proto.rover.audience.v1.QueryResponse.prototype.clearProfilesList = function() {
  this.setProfilesList([]);
};


/**
 * repeated Device devices = 3;
 * If you change this array by adding, removing or replacing elements, or if you
 * replace the array itself, then you must call the setter to update it.
 * @return {!Array.<!proto.rover.audience.v1.Device>}
 */
proto.rover.audience.v1.QueryResponse.prototype.getDevicesList = function() {
  return /** @type{!Array.<!proto.rover.audience.v1.Device>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.rover.audience.v1.Device, 3));
};


/** @param {!Array.<!proto.rover.audience.v1.Device>} value */
proto.rover.audience.v1.QueryResponse.prototype.setDevicesList = function(value) {
  jspb.Message.setRepeatedWrapperField(this, 3, value);
};


/**
 * @param {!proto.rover.audience.v1.Device=} opt_value
 * @param {number=} opt_index
 * @return {!proto.rover.audience.v1.Device}
 */
proto.rover.audience.v1.QueryResponse.prototype.addDevices = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 3, opt_value, proto.rover.audience.v1.Device, opt_index);
};


proto.rover.audience.v1.QueryResponse.prototype.clearDevicesList = function() {
  this.setDevicesList([]);
};


/**
 * optional string scroll_id = 9;
 * @return {string}
 */
proto.rover.audience.v1.QueryResponse.prototype.getScrollId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 9, ""));
};


/** @param {string} value */
proto.rover.audience.v1.QueryResponse.prototype.setScrollId = function(value) {
  jspb.Message.setField(this, 9, value);
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
proto.rover.audience.v1.IsInDynamicSegmentRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.rover.audience.v1.IsInDynamicSegmentRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.IsInDynamicSegmentRequest.displayName = 'proto.rover.audience.v1.IsInDynamicSegmentRequest';
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
proto.rover.audience.v1.IsInDynamicSegmentRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.IsInDynamicSegmentRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.IsInDynamicSegmentRequest} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.IsInDynamicSegmentRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    authContext: (f = msg.getAuthContext()) && auth_v1_auth_pb.AuthContext.toObject(includeInstance, f),
    segmentId: jspb.Message.getFieldWithDefault(msg, 2, ""),
    profile: (f = msg.getProfile()) && proto.rover.audience.v1.Profile.toObject(includeInstance, f),
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
 * @return {!proto.rover.audience.v1.IsInDynamicSegmentRequest}
 */
proto.rover.audience.v1.IsInDynamicSegmentRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.IsInDynamicSegmentRequest;
  return proto.rover.audience.v1.IsInDynamicSegmentRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.IsInDynamicSegmentRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.IsInDynamicSegmentRequest}
 */
proto.rover.audience.v1.IsInDynamicSegmentRequest.deserializeBinaryFromReader = function(msg, reader) {
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
      var value = new proto.rover.audience.v1.Profile;
      reader.readMessage(value,proto.rover.audience.v1.Profile.deserializeBinaryFromReader);
      msg.setProfile(value);
      break;
    case 4:
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
proto.rover.audience.v1.IsInDynamicSegmentRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.IsInDynamicSegmentRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.IsInDynamicSegmentRequest} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.IsInDynamicSegmentRequest.serializeBinaryToWriter = function(message, writer) {
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
  f = message.getProfile();
  if (f != null) {
    writer.writeMessage(
      3,
      f,
      proto.rover.audience.v1.Profile.serializeBinaryToWriter
    );
  }
  f = message.getDevice();
  if (f != null) {
    writer.writeMessage(
      4,
      f,
      proto.rover.audience.v1.Device.serializeBinaryToWriter
    );
  }
};


/**
 * optional rover.auth.v1.AuthContext auth_context = 1;
 * @return {?proto.rover.auth.v1.AuthContext}
 */
proto.rover.audience.v1.IsInDynamicSegmentRequest.prototype.getAuthContext = function() {
  return /** @type{?proto.rover.auth.v1.AuthContext} */ (
    jspb.Message.getWrapperField(this, auth_v1_auth_pb.AuthContext, 1));
};


/** @param {?proto.rover.auth.v1.AuthContext|undefined} value */
proto.rover.audience.v1.IsInDynamicSegmentRequest.prototype.setAuthContext = function(value) {
  jspb.Message.setWrapperField(this, 1, value);
};


proto.rover.audience.v1.IsInDynamicSegmentRequest.prototype.clearAuthContext = function() {
  this.setAuthContext(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.IsInDynamicSegmentRequest.prototype.hasAuthContext = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional string segment_id = 2;
 * @return {string}
 */
proto.rover.audience.v1.IsInDynamicSegmentRequest.prototype.getSegmentId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/** @param {string} value */
proto.rover.audience.v1.IsInDynamicSegmentRequest.prototype.setSegmentId = function(value) {
  jspb.Message.setField(this, 2, value);
};


/**
 * optional Profile profile = 3;
 * @return {?proto.rover.audience.v1.Profile}
 */
proto.rover.audience.v1.IsInDynamicSegmentRequest.prototype.getProfile = function() {
  return /** @type{?proto.rover.audience.v1.Profile} */ (
    jspb.Message.getWrapperField(this, proto.rover.audience.v1.Profile, 3));
};


/** @param {?proto.rover.audience.v1.Profile|undefined} value */
proto.rover.audience.v1.IsInDynamicSegmentRequest.prototype.setProfile = function(value) {
  jspb.Message.setWrapperField(this, 3, value);
};


proto.rover.audience.v1.IsInDynamicSegmentRequest.prototype.clearProfile = function() {
  this.setProfile(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.IsInDynamicSegmentRequest.prototype.hasProfile = function() {
  return jspb.Message.getField(this, 3) != null;
};


/**
 * optional Device device = 4;
 * @return {?proto.rover.audience.v1.Device}
 */
proto.rover.audience.v1.IsInDynamicSegmentRequest.prototype.getDevice = function() {
  return /** @type{?proto.rover.audience.v1.Device} */ (
    jspb.Message.getWrapperField(this, proto.rover.audience.v1.Device, 4));
};


/** @param {?proto.rover.audience.v1.Device|undefined} value */
proto.rover.audience.v1.IsInDynamicSegmentRequest.prototype.setDevice = function(value) {
  jspb.Message.setWrapperField(this, 4, value);
};


proto.rover.audience.v1.IsInDynamicSegmentRequest.prototype.clearDevice = function() {
  this.setDevice(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.IsInDynamicSegmentRequest.prototype.hasDevice = function() {
  return jspb.Message.getField(this, 4) != null;
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
proto.rover.audience.v1.IsInDynamicSegmentResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.rover.audience.v1.IsInDynamicSegmentResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.IsInDynamicSegmentResponse.displayName = 'proto.rover.audience.v1.IsInDynamicSegmentResponse';
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
proto.rover.audience.v1.IsInDynamicSegmentResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.IsInDynamicSegmentResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.IsInDynamicSegmentResponse} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.IsInDynamicSegmentResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    yes: jspb.Message.getFieldWithDefault(msg, 1, false)
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
 * @return {!proto.rover.audience.v1.IsInDynamicSegmentResponse}
 */
proto.rover.audience.v1.IsInDynamicSegmentResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.IsInDynamicSegmentResponse;
  return proto.rover.audience.v1.IsInDynamicSegmentResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.IsInDynamicSegmentResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.IsInDynamicSegmentResponse}
 */
proto.rover.audience.v1.IsInDynamicSegmentResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setYes(value);
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
proto.rover.audience.v1.IsInDynamicSegmentResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.IsInDynamicSegmentResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.IsInDynamicSegmentResponse} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.IsInDynamicSegmentResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getYes();
  if (f) {
    writer.writeBool(
      1,
      f
    );
  }
};


/**
 * optional bool yes = 1;
 * Note that Boolean fields may be set to 0/1 when serialized from a Java server.
 * You should avoid comparisons like {@code val === true/false} in those cases.
 * @return {boolean}
 */
proto.rover.audience.v1.IsInDynamicSegmentResponse.prototype.getYes = function() {
  return /** @type {boolean} */ (jspb.Message.getFieldWithDefault(this, 1, false));
};


/** @param {boolean} value */
proto.rover.audience.v1.IsInDynamicSegmentResponse.prototype.setYes = function(value) {
  jspb.Message.setField(this, 1, value);
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
proto.rover.audience.v1.DeviceIsInDynamicSegmentRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.rover.audience.v1.DeviceIsInDynamicSegmentRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.DeviceIsInDynamicSegmentRequest.displayName = 'proto.rover.audience.v1.DeviceIsInDynamicSegmentRequest';
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
proto.rover.audience.v1.DeviceIsInDynamicSegmentRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.DeviceIsInDynamicSegmentRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.DeviceIsInDynamicSegmentRequest} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.DeviceIsInDynamicSegmentRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    authContext: (f = msg.getAuthContext()) && auth_v1_auth_pb.AuthContext.toObject(includeInstance, f),
    segmentId: jspb.Message.getFieldWithDefault(msg, 2, ""),
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
 * @return {!proto.rover.audience.v1.DeviceIsInDynamicSegmentRequest}
 */
proto.rover.audience.v1.DeviceIsInDynamicSegmentRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.DeviceIsInDynamicSegmentRequest;
  return proto.rover.audience.v1.DeviceIsInDynamicSegmentRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.DeviceIsInDynamicSegmentRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.DeviceIsInDynamicSegmentRequest}
 */
proto.rover.audience.v1.DeviceIsInDynamicSegmentRequest.deserializeBinaryFromReader = function(msg, reader) {
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
proto.rover.audience.v1.DeviceIsInDynamicSegmentRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.DeviceIsInDynamicSegmentRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.DeviceIsInDynamicSegmentRequest} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.DeviceIsInDynamicSegmentRequest.serializeBinaryToWriter = function(message, writer) {
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
proto.rover.audience.v1.DeviceIsInDynamicSegmentRequest.prototype.getAuthContext = function() {
  return /** @type{?proto.rover.auth.v1.AuthContext} */ (
    jspb.Message.getWrapperField(this, auth_v1_auth_pb.AuthContext, 1));
};


/** @param {?proto.rover.auth.v1.AuthContext|undefined} value */
proto.rover.audience.v1.DeviceIsInDynamicSegmentRequest.prototype.setAuthContext = function(value) {
  jspb.Message.setWrapperField(this, 1, value);
};


proto.rover.audience.v1.DeviceIsInDynamicSegmentRequest.prototype.clearAuthContext = function() {
  this.setAuthContext(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.DeviceIsInDynamicSegmentRequest.prototype.hasAuthContext = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional string segment_id = 2;
 * @return {string}
 */
proto.rover.audience.v1.DeviceIsInDynamicSegmentRequest.prototype.getSegmentId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/** @param {string} value */
proto.rover.audience.v1.DeviceIsInDynamicSegmentRequest.prototype.setSegmentId = function(value) {
  jspb.Message.setField(this, 2, value);
};


/**
 * optional string device_id = 3;
 * @return {string}
 */
proto.rover.audience.v1.DeviceIsInDynamicSegmentRequest.prototype.getDeviceId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/** @param {string} value */
proto.rover.audience.v1.DeviceIsInDynamicSegmentRequest.prototype.setDeviceId = function(value) {
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
proto.rover.audience.v1.DeviceIsInDynamicSegmentResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.rover.audience.v1.DeviceIsInDynamicSegmentResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.DeviceIsInDynamicSegmentResponse.displayName = 'proto.rover.audience.v1.DeviceIsInDynamicSegmentResponse';
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
proto.rover.audience.v1.DeviceIsInDynamicSegmentResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.DeviceIsInDynamicSegmentResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.DeviceIsInDynamicSegmentResponse} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.DeviceIsInDynamicSegmentResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    yes: jspb.Message.getFieldWithDefault(msg, 1, false)
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
 * @return {!proto.rover.audience.v1.DeviceIsInDynamicSegmentResponse}
 */
proto.rover.audience.v1.DeviceIsInDynamicSegmentResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.DeviceIsInDynamicSegmentResponse;
  return proto.rover.audience.v1.DeviceIsInDynamicSegmentResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.DeviceIsInDynamicSegmentResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.DeviceIsInDynamicSegmentResponse}
 */
proto.rover.audience.v1.DeviceIsInDynamicSegmentResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setYes(value);
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
proto.rover.audience.v1.DeviceIsInDynamicSegmentResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.DeviceIsInDynamicSegmentResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.DeviceIsInDynamicSegmentResponse} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.DeviceIsInDynamicSegmentResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getYes();
  if (f) {
    writer.writeBool(
      1,
      f
    );
  }
};


/**
 * optional bool yes = 1;
 * Note that Boolean fields may be set to 0/1 when serialized from a Java server.
 * You should avoid comparisons like {@code val === true/false} in those cases.
 * @return {boolean}
 */
proto.rover.audience.v1.DeviceIsInDynamicSegmentResponse.prototype.getYes = function() {
  return /** @type {boolean} */ (jspb.Message.getFieldWithDefault(this, 1, false));
};


/** @param {boolean} value */
proto.rover.audience.v1.DeviceIsInDynamicSegmentResponse.prototype.setYes = function(value) {
  jspb.Message.setField(this, 1, value);
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
proto.rover.audience.v1.GetFieldSuggestionRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.rover.audience.v1.GetFieldSuggestionRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.GetFieldSuggestionRequest.displayName = 'proto.rover.audience.v1.GetFieldSuggestionRequest';
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
proto.rover.audience.v1.GetFieldSuggestionRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.GetFieldSuggestionRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.GetFieldSuggestionRequest} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.GetFieldSuggestionRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    authContext: (f = msg.getAuthContext()) && auth_v1_auth_pb.AuthContext.toObject(includeInstance, f),
    selector: jspb.Message.getFieldWithDefault(msg, 2, 0),
    field: jspb.Message.getFieldWithDefault(msg, 3, ""),
    size: jspb.Message.getFieldWithDefault(msg, 5, 0)
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
 * @return {!proto.rover.audience.v1.GetFieldSuggestionRequest}
 */
proto.rover.audience.v1.GetFieldSuggestionRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.GetFieldSuggestionRequest;
  return proto.rover.audience.v1.GetFieldSuggestionRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.GetFieldSuggestionRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.GetFieldSuggestionRequest}
 */
proto.rover.audience.v1.GetFieldSuggestionRequest.deserializeBinaryFromReader = function(msg, reader) {
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
      var value = /** @type {!proto.rover.audience.v1.GetFieldSuggestionRequest.Selector} */ (reader.readEnum());
      msg.setSelector(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setField(value);
      break;
    case 5:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setSize(value);
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
proto.rover.audience.v1.GetFieldSuggestionRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.GetFieldSuggestionRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.GetFieldSuggestionRequest} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.GetFieldSuggestionRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getAuthContext();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      auth_v1_auth_pb.AuthContext.serializeBinaryToWriter
    );
  }
  f = message.getSelector();
  if (f !== 0.0) {
    writer.writeEnum(
      2,
      f
    );
  }
  f = message.getField();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getSize();
  if (f !== 0) {
    writer.writeInt64(
      5,
      f
    );
  }
};


/**
 * @enum {number}
 */
proto.rover.audience.v1.GetFieldSuggestionRequest.Selector = {
  ROVER_PROFILE: 0,
  CUSTOM_PROFILE: 1,
  DEVICE: 2
};

/**
 * optional rover.auth.v1.AuthContext auth_context = 1;
 * @return {?proto.rover.auth.v1.AuthContext}
 */
proto.rover.audience.v1.GetFieldSuggestionRequest.prototype.getAuthContext = function() {
  return /** @type{?proto.rover.auth.v1.AuthContext} */ (
    jspb.Message.getWrapperField(this, auth_v1_auth_pb.AuthContext, 1));
};


/** @param {?proto.rover.auth.v1.AuthContext|undefined} value */
proto.rover.audience.v1.GetFieldSuggestionRequest.prototype.setAuthContext = function(value) {
  jspb.Message.setWrapperField(this, 1, value);
};


proto.rover.audience.v1.GetFieldSuggestionRequest.prototype.clearAuthContext = function() {
  this.setAuthContext(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.rover.audience.v1.GetFieldSuggestionRequest.prototype.hasAuthContext = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional Selector selector = 2;
 * @return {!proto.rover.audience.v1.GetFieldSuggestionRequest.Selector}
 */
proto.rover.audience.v1.GetFieldSuggestionRequest.prototype.getSelector = function() {
  return /** @type {!proto.rover.audience.v1.GetFieldSuggestionRequest.Selector} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/** @param {!proto.rover.audience.v1.GetFieldSuggestionRequest.Selector} value */
proto.rover.audience.v1.GetFieldSuggestionRequest.prototype.setSelector = function(value) {
  jspb.Message.setField(this, 2, value);
};


/**
 * optional string field = 3;
 * @return {string}
 */
proto.rover.audience.v1.GetFieldSuggestionRequest.prototype.getField = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/** @param {string} value */
proto.rover.audience.v1.GetFieldSuggestionRequest.prototype.setField = function(value) {
  jspb.Message.setField(this, 3, value);
};


/**
 * optional int64 size = 5;
 * @return {number}
 */
proto.rover.audience.v1.GetFieldSuggestionRequest.prototype.getSize = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 5, 0));
};


/** @param {number} value */
proto.rover.audience.v1.GetFieldSuggestionRequest.prototype.setSize = function(value) {
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
proto.rover.audience.v1.GetFieldSuggestionResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.rover.audience.v1.GetFieldSuggestionResponse.repeatedFields_, null);
};
goog.inherits(proto.rover.audience.v1.GetFieldSuggestionResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.rover.audience.v1.GetFieldSuggestionResponse.displayName = 'proto.rover.audience.v1.GetFieldSuggestionResponse';
}
/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.rover.audience.v1.GetFieldSuggestionResponse.repeatedFields_ = [1];



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
proto.rover.audience.v1.GetFieldSuggestionResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.rover.audience.v1.GetFieldSuggestionResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rover.audience.v1.GetFieldSuggestionResponse} msg The msg instance to transform.
 * @return {!Object}
 */
proto.rover.audience.v1.GetFieldSuggestionResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    suggestionsList: jspb.Message.getField(msg, 1)
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
 * @return {!proto.rover.audience.v1.GetFieldSuggestionResponse}
 */
proto.rover.audience.v1.GetFieldSuggestionResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rover.audience.v1.GetFieldSuggestionResponse;
  return proto.rover.audience.v1.GetFieldSuggestionResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rover.audience.v1.GetFieldSuggestionResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rover.audience.v1.GetFieldSuggestionResponse}
 */
proto.rover.audience.v1.GetFieldSuggestionResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.addSuggestions(value);
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
proto.rover.audience.v1.GetFieldSuggestionResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rover.audience.v1.GetFieldSuggestionResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rover.audience.v1.GetFieldSuggestionResponse} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.rover.audience.v1.GetFieldSuggestionResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSuggestionsList();
  if (f.length > 0) {
    writer.writeRepeatedString(
      1,
      f
    );
  }
};


/**
 * repeated string suggestions = 1;
 * If you change this array by adding, removing or replacing elements, or if you
 * replace the array itself, then you must call the setter to update it.
 * @return {!Array.<string>}
 */
proto.rover.audience.v1.GetFieldSuggestionResponse.prototype.getSuggestionsList = function() {
  return /** @type {!Array.<string>} */ (jspb.Message.getField(this, 1));
};


/** @param {!Array.<string>} value */
proto.rover.audience.v1.GetFieldSuggestionResponse.prototype.setSuggestionsList = function(value) {
  jspb.Message.setField(this, 1, value || []);
};


/**
 * @param {!string} value
 * @param {number=} opt_index
 */
proto.rover.audience.v1.GetFieldSuggestionResponse.prototype.addSuggestions = function(value, opt_index) {
  jspb.Message.addToRepeatedField(this, 1, value, opt_index);
};


proto.rover.audience.v1.GetFieldSuggestionResponse.prototype.clearSuggestionsList = function() {
  this.setSuggestionsList([]);
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
