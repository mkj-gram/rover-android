package mongodb

import (
	"time"

	"golang.org/x/net/context"
	"gopkg.in/mgo.v2/bson"

	"github.com/roverplatform/rover/apis/go/audience/v1"
	"github.com/roverplatform/rover/go/protobuf/ptypes/timestamp"
)

type devicesStore struct {
	*mongoStore
}

type DeviceSchema struct {
	Attributes []*SchemaAttribute
}

func (ps *DeviceSchema) toProto(proto *audience.DeviceSchema) error {
	for _, v := range ps.Attributes {
		var protoattr audience.SchemaAttribute
		if err := v.toProto(&protoattr); err != nil {
			return wrapError(err, "schemaAttr.toProto")
		}
		proto.Attributes = append(proto.Attributes, &protoattr)
	}

	return nil
}

func (ps *DeviceSchema) fromProto(proto *audience.DeviceSchema) error {
	for _, v := range proto.Attributes {
		var sattr SchemaAttribute
		if err := sattr.fromProto(v); err != nil {
			return wrapError(err, "schemaAttr.fromProto")
		}
		ps.Attributes = append(ps.Attributes, &sattr)
	}

	return nil
}

type Version audience.Version

type Device struct {
	Id        bson.ObjectId `bson:"_id"`
	AccountId int32         `bson:"account_id"`
	DeviceId  string        `bson:"device_id"`

	// deprecated
	ProfileId bson.ObjectId `bson:"profile_id,omitempty"`
	CreatedAt *time.Time    `bson:"created_at"`
	UpdatedAt *time.Time    `bson:"updated_at"`

	ProfileIdentifier string `bson:"profile_identifier"`

	// custom attributes
	Attributes map[string]interface{} `bson:"attributes,omitempty"`

	IsTestDevice            bool       `bson:"is_test_device,omitempty"`
	Label                   string     `bson:"label,omitempty"`
	PushEnvironment         string     `bson:"push_environment,omitempty"`
	PushTokenKey            string     `bson:"push_token_key,omitempty"`
	PushTokenIsActive       bool       `bson:"push_token_is_active"`
	PushTokenCreatedAt      *time.Time `bson:"push_token_created_at,omitempty"`
	PushTokenUpdatedAt      *time.Time `bson:"push_token_updated_at,omitempty"`
	PushTokenUnregisteredAt *time.Time `bson:"push_token_unregistered_at,omitempty"`

	AppName                     string              `bson:"app_name,omitempty"`
	AppVersion                  string              `bson:"app_version,omitempty"`
	AppBuild                    string              `bson:"app_build,omitempty"`
	AppNamespace                string              `bson:"app_namespace,omitempty"`
	DeviceManufacturer          string              `bson:"device_manufacturer,omitempty"`
	DeviceModel                 string              `bson:"device_model,omitempty"`
	DeviceModelRaw              string              `bson:"device_model_raw,omitempty"`
	OsName                      string              `bson:"os_name,omitempty"`
	OsVersion                   *Version            `bson:"os_version,omitempty"`
	Frameworks                  map[string]*Version `bson:"frameworks,omitempty"`
	LocaleLanguage              string              `bson:"locale_language,omitempty"`
	LocaleRegion                string              `bson:"locale_region,omitempty"`
	LocaleScript                string              `bson:"locale_script,omitempty"`
	IsWifiEnabled               bool                `bson:"is_wifi_enabled"`
	IsCellularEnabled           bool                `bson:"is_cellular_enabled"`
	ScreenWidth                 int32               `bson:"screen_width,omitempty"`
	ScreenHeight                int32               `bson:"screen_height,omitempty"`
	CarrierName                 string              `bson:"carrier_name,omitempty"`
	Radio                       string              `bson:"radio,omitempty"`
	TimeZone                    string              `bson:"time_zone,omitempty"`
	Platform                    string              `bson:"platform,omitempty"`
	IsBackgroundEnabled         bool                `bson:"is_background_enabled"`
	IsLocationMonitoringEnabled bool                `bson:"is_location_monitoring_enabled"`
	IsBluetoothEnabled          bool                `bson:"is_bluetooth_enabled"`
	AdvertisingId               string              `bson:"advertising_id,omitempty"`
	Ip                          string              `bson:"ip,omitempty"`
	NotificationAuthorization   string              `bson:"notification_authorization,omitempty"`

	LocationAccuracy  int32   `bson:"location_accuracy,omitempty"`
	LocationLatitude  float64 `bson:"location_latitude,omitempty"`
	LocationLongitude float64 `bson:"location_longitude,omitempty"`

	LocationCountry   string     `bson:"location_country,omitempty"`
	LocationState     string     `bson:"location_state,omitempty"`
	LocationCity      string     `bson:"location_city,omitempty"`
	LocationUpdatedAt *time.Time `bson:"location_updated_at,omitempty"`

	// deprecated
	LocationRegion string `bson:"location_region,omitempty"`
	// deprecated
	LocationStreet string `bson:"location_street,omitempty"`

	RegionMonitoringMode string `bson:"region_monitoring_mode,omitempty"`

	IbeaconMonitoringRegionsUpdatedAt  *time.Time                 `bson:"ibeacon_monitoring_regions_updated_at,omitempty"`
	IbeaconMonitoringRegions           []*audience.IBeaconRegion  `bson:"ibeacon_monitoring_regions,omitempty"`
	GeofenceMonitoringRegionsUpdatedAt *time.Time                 `bson:"geofence_monitoring_regions_updated_at,omitempty"`
	GeofenceMonitoringRegions          []*audience.GeofenceRegion `bson:"geofence_monitoring_regions,omitempty"`
}

func (d *Device) fromProto(proto *audience.Device) error {
	d.DeviceId = proto.Id
	d.AccountId = proto.AccountId
	d.ProfileIdentifier = proto.ProfileIdentifier

	d.CreatedAt, _ = protoToTime(proto.CreatedAt)
	d.UpdatedAt, _ = protoToTime(proto.UpdatedAt)

	// custom attributes
	if len(proto.Attributes) > 0 {
		d.Attributes = make(map[string]interface{})
		for k, v := range proto.Attributes {
			// TODO: handle errors
			var err error
			d.Attributes[k], err = v.Value()
			if err != nil {
				panic(err)
			}
		}
	}

	d.IsTestDevice = proto.IsTestDevice
	d.Label = proto.Label

	d.PushTokenKey = proto.PushTokenKey
	d.PushEnvironment = proto.PushEnvironment
	d.PushTokenIsActive = proto.PushTokenIsActive

	d.PushTokenUpdatedAt, _ = protoToTime(proto.PushTokenUpdatedAt)
	d.PushTokenCreatedAt, _ = protoToTime(proto.PushTokenCreatedAt)
	d.PushTokenUnregisteredAt, _ = protoToTime(proto.PushTokenUnregisteredAt)

	d.AppName = proto.AppName
	d.AppVersion = proto.AppVersion
	d.AppBuild = proto.AppBuild
	d.AppNamespace = proto.AppNamespace
	d.DeviceManufacturer = proto.DeviceManufacturer
	d.OsName = proto.OsName
	d.OsVersion = (*Version)(proto.OsVersion)
	d.DeviceModel = proto.DeviceModel
	if len(proto.Frameworks) > 0 {
		d.Frameworks = make(map[string]*Version)
		for k, v := range proto.Frameworks {
			d.Frameworks[escape(k, InvalidKeyChars)] = (*Version)(v)
		}
	}
	d.LocaleLanguage = proto.LocaleLanguage
	d.LocaleRegion = proto.LocaleRegion
	d.LocaleScript = proto.LocaleScript
	d.IsWifiEnabled = proto.IsWifiEnabled
	d.IsCellularEnabled = proto.IsCellularEnabled
	d.ScreenWidth = proto.ScreenWidth
	d.ScreenHeight = proto.ScreenHeight
	d.CarrierName = proto.CarrierName
	d.Radio = proto.Radio
	d.TimeZone = proto.TimeZone
	d.Platform = proto.Platform.String()

	d.IsBackgroundEnabled = proto.IsBackgroundEnabled
	d.IsLocationMonitoringEnabled = proto.IsLocationMonitoringEnabled
	d.IsBluetoothEnabled = proto.IsBluetoothEnabled
	d.AdvertisingId = proto.AdvertisingId

	d.Ip = proto.Ip
	d.NotificationAuthorization = proto.NotificationAuthorization.String()

	d.LocationAccuracy = proto.LocationAccuracy
	d.LocationLongitude = proto.LocationLongitude
	d.LocationLatitude = proto.LocationLatitude
	d.LocationCountry = proto.LocationCountry
	d.LocationState = proto.LocationState
	d.LocationCity = proto.LocationCity
	d.LocationUpdatedAt, _ = protoToTime(proto.LocationUpdatedAt)

	d.RegionMonitoringMode = proto.RegionMonitoringMode.String()

	d.IbeaconMonitoringRegions = proto.IbeaconMonitoringRegions
	d.IbeaconMonitoringRegionsUpdatedAt, _ = protoToTime(proto.IbeaconMonitoringRegionsUpdatedAt)

	d.GeofenceMonitoringRegions = proto.GeofenceMonitoringRegions
	d.GeofenceMonitoringRegionsUpdatedAt, _ = protoToTime(proto.GeofenceMonitoringRegionsUpdatedAt)

	return nil
}

func (d *Device) toProto(proto *audience.Device) error {
	proto.Id = d.Id.Hex()

	proto.DeviceId = d.DeviceId
	proto.ProfileIdentifier = d.ProfileIdentifier
	if d.ProfileId != "" {
		proto.ProfileId = d.ProfileId.Hex()
	}

	proto.AccountId = d.AccountId

	proto.CreatedAt, _ = timeToProto(d.CreatedAt)
	proto.UpdatedAt, _ = timeToProto(d.UpdatedAt)

	if len(d.Attributes) > 0 {
		proto.Attributes = make(map[string]*audience.Value)
		for k, v := range d.Attributes {
			var val audience.Value
			// TODO: handle errors
			if err := val.Load(v); err != nil {
				panic(err)
			}
			proto.Attributes[k] = &val
		}
	}

	proto.IsTestDevice = d.IsTestDevice
	proto.Label = d.Label

	proto.PushEnvironment = d.PushEnvironment
	proto.PushTokenKey = d.PushTokenKey

	proto.AppName = d.AppName
	proto.AppVersion = d.AppVersion
	proto.AppBuild = d.AppBuild
	proto.AppNamespace = d.AppNamespace
	proto.DeviceManufacturer = d.DeviceManufacturer
	proto.OsName = d.OsName
	proto.OsVersion = (*audience.Version)(d.OsVersion)
	proto.DeviceModel = d.DeviceModel
	if len(d.Frameworks) > 0 {
		proto.Frameworks = make(map[string]*audience.Version)
		for k, v := range d.Frameworks {
			if k, err := unescape(k); err != nil {
				errorf("error reading key: %s: %v", k, err)
			} else {
				proto.Frameworks[k] = (*audience.Version)(v)
			}
		}
	}
	proto.LocaleLanguage = d.LocaleLanguage
	proto.LocaleRegion = d.LocaleRegion
	proto.LocaleScript = d.LocaleScript
	proto.IsWifiEnabled = d.IsWifiEnabled
	proto.IsCellularEnabled = d.IsCellularEnabled
	proto.ScreenWidth = d.ScreenWidth
	proto.ScreenHeight = d.ScreenHeight
	proto.CarrierName = d.CarrierName
	proto.Radio = d.Radio
	proto.TimeZone = d.TimeZone

	proto.Platform = audience.Platform(audience.Platform_value[d.Platform])

	proto.IsBackgroundEnabled = d.IsBackgroundEnabled
	proto.IsLocationMonitoringEnabled = d.IsLocationMonitoringEnabled
	proto.IsBluetoothEnabled = d.IsBluetoothEnabled
	proto.AdvertisingId = d.AdvertisingId

	proto.Ip = d.Ip
	proto.NotificationAuthorization = audience.NotificationAuthorization(audience.NotificationAuthorization_value[d.NotificationAuthorization])

	proto.PushTokenIsActive = d.PushTokenIsActive
	proto.PushTokenUpdatedAt, _ = timeToProto(d.PushTokenUpdatedAt)
	proto.PushTokenCreatedAt, _ = timeToProto(d.PushTokenCreatedAt)
	proto.PushTokenUnregisteredAt, _ = timeToProto(d.PushTokenUnregisteredAt)

	proto.LocationAccuracy = d.LocationAccuracy
	proto.LocationLongitude = d.LocationLongitude
	proto.LocationLatitude = d.LocationLatitude
	proto.LocationCountry = d.LocationCountry
	proto.LocationState = d.LocationState
	proto.LocationCity = d.LocationCity
	proto.LocationUpdatedAt, _ = timeToProto(d.LocationUpdatedAt)

	proto.RegionMonitoringMode = audience.Device_RegionMonitoringMode(audience.Device_RegionMonitoringMode_value[d.RegionMonitoringMode])

	proto.IbeaconMonitoringRegions = d.IbeaconMonitoringRegions
	proto.IbeaconMonitoringRegionsUpdatedAt, _ = timeToProto(d.IbeaconMonitoringRegionsUpdatedAt)

	proto.GeofenceMonitoringRegions = d.GeofenceMonitoringRegions
	proto.GeofenceMonitoringRegionsUpdatedAt, _ = timeToProto(d.GeofenceMonitoringRegionsUpdatedAt)

	return nil
}

func protoToTime(ts *timestamp.Timestamp) (*time.Time, error) {
	if ts == nil {
		return nil, nil
	}

	t, err := timestamp.Time(ts)
	if err != nil {
		return nil, err
	}

	return &t, nil
}

func timeToProto(ts *time.Time) (*timestamp.Timestamp, error) {
	if ts == nil {
		return nil, nil
	}

	pts, err := timestamp.TimestampProto(*ts)
	if err != nil {
		return nil, err
	}

	return pts, nil
}

func (s *devicesStore) getDeviceSchema(ctx context.Context, account_id int) (*DeviceSchema, error) {
	var (
		schema DeviceSchema

		Q = s.devices_schemas().
			Find(bson.M{"account_id": account_id}).
			Sort("_id")
	)

	if err := Q.All(&schema.Attributes); err != nil {
		return nil, wrapError(err, "devices_schemas.Find")
	}

	return &schema, nil
}

func (s *devicesStore) GetDeviceSchemaByAccountId(ctx context.Context, accountId int) (*audience.DeviceSchema, error) {
	var schema, err = s.getDeviceSchema(ctx, accountId)
	if err != nil {
		return nil, wrapError(err, "getDeviceSchema")
	}

	var proto audience.DeviceSchema
	if err := schema.toProto(&proto); err != nil {
		return nil, wrapError(err, "schema.toProto")
	}

	return &proto, nil
}

// FindDeviceById finds a device by device_id.
func (s *devicesStore) FindDeviceById(ctx context.Context, id string) (*audience.Device, error) {
	var (
		d Device

		Q = s.devices().Find(bson.M{"device_id": id})
	)

	if err := Q.One(&d); err != nil {
		return nil, wrapError(err, "devices.FindId")
	}

	var proto audience.Device
	if err := d.toProto(&proto); err != nil {
		return nil, wrapError(err, "device.toProto")
	}

	return &proto, nil
}

func (s *devicesStore) GetDevice(ctx context.Context, r *audience.GetDeviceRequest) (*audience.Device, error) {
	var (
		deviceId  = r.GetDeviceId()
		accountId = r.GetAuthContext().GetAccountId()

		d Device
		Q = bson.M{"device_id": deviceId, "account_id": accountId}
	)

	if err := s.devices().Find(Q).One(&d); err != nil {
		return nil, wrapError(err, "devices.Find")
	}

	var proto audience.Device
	if err := d.toProto(&proto); err != nil {
		return nil, wrapError(err, "device.toProto")
	}

	return &proto, nil
}

func (s *devicesStore) GetDeviceByPushToken(ctx context.Context, r *audience.GetDeviceByPushTokenRequest) (*audience.Device, error) {
	var (
		pushTokenKey = r.GetPushTokenKey()
		accountId    = r.GetAuthContext().GetAccountId()

		d Device
		// TODO: fix the index
		// `Hint` didn't fix the issue
		// specifying "$type" seem to be properly using index
		Q = bson.M{"push_token_key": bson.M{"$eq": pushTokenKey, "$type": "string"}, "account_id": accountId}
	)

	if err := s.devices().Find(Q).One(&d); err != nil {
		return nil, wrapError(err, "devices.Find")
	}

	var proto audience.Device
	if err := d.toProto(&proto); err != nil {
		return nil, wrapError(err, "device.toProto")
	}

	return &proto, nil
}

func (s *devicesStore) findProfileByIdentifier(ctx context.Context, account_id int32, identifier string) (*Profile, error) {
	var (
		Q = s.profiles().Find(bson.M{"account_id": account_id, "identifier": identifier})
		p Profile
	)

	if err := Q.One(&p); err != nil {
		return nil, wrapError(err, "profiles.Find")
	}

	return &p, nil
}

// CreateDevice creates a Device for a profile
func (s *devicesStore) CreateDevice(ctx context.Context, r *audience.CreateDeviceRequest) (*audience.Device, error) {
	var (
		now = s.timeNow()

		accountId         = r.GetAuthContext().GetAccountId()
		profileIdentifier = r.GetProfileIdentifier()
		deviceId          = r.GetDeviceId()
	)

	var device = Device{
		Id:                s.newObjectId(),
		ProfileIdentifier: profileIdentifier,
		DeviceId:          deviceId,
		AccountId:         accountId,

		// timestamps
		CreatedAt: &now,
		UpdatedAt: &now,
	}

	if err := s.devices().Insert(device); err != nil {
		return nil, wrapError(err, "devices.Insert")
	}

	var proto audience.Device
	if err := device.toProto(&proto); err != nil {
		return nil, wrapError(err, "devices.Insert.toProto")
	}

	return &proto, nil
}

func (s *devicesStore) UpdateDevice(ctx context.Context, r *audience.UpdateDeviceRequest) error {
	var (
		now = s.timeNow()

		accountId = r.GetAuthContext().GetAccountId()
		deviceId  = r.GetDeviceId()
	)

	var (
		device Device
		Q      = bson.M{"account_id": accountId, "device_id": deviceId}
	)
	err := s.devices().Find(Q).One(&device)
	if err != nil {
		return wrapError(err, "devices.Find")
	}

	var update = bson.M{}

	if device.PushTokenKey != r.PushTokenKey {
		if device.PushTokenKey == "" {
			update["push_token_created_at"] = now
			update["push_token_unregistered_at"] = nil
			update["push_token_is_active"] = true
		} else if r.PushTokenKey == "" {
			update["push_token_is_active"] = false
			update["push_token_unregistered_at"] = now
		}

		update["push_token_updated_at"] = now
	}

	update["updated_at"] = now

	update["push_environment"] = r.PushEnvironment
	update["push_token_key"] = r.PushTokenKey
	if r.PushTokenKey == "" {
		update["push_token_key"] = nil
	}
	update["app_name"] = r.AppName
	update["app_version"] = r.AppVersion
	update["app_build"] = r.AppBuild
	update["app_namespace"] = r.AppNamespace
	update["device_manufacturer"] = r.DeviceManufacturer
	update["device_model"] = r.DeviceModel
	update["device_model_raw"] = r.DeviceModelRaw
	update["os_name"] = r.OsName
	update["os_version"] = r.OsVersion
	update["locale_language"] = r.LocaleLanguage
	update["locale_region"] = r.LocaleRegion
	update["locale_script"] = r.LocaleScript
	update["is_wifi_enabled"] = r.IsWifiEnabled
	update["is_cellular_enabled"] = r.IsCellularEnabled
	update["screen_width"] = r.ScreenWidth
	update["screen_height"] = r.ScreenHeight
	update["carrier_name"] = r.CarrierName
	update["radio"] = r.Radio
	update["time_zone"] = r.TimeZone
	update["platform"] = r.Platform.String()
	update["is_background_enabled"] = r.IsBackgroundEnabled
	update["is_location_monitoring_enabled"] = r.IsLocationMonitoringEnabled
	update["is_bluetooth_enabled"] = r.IsBluetoothEnabled
	update["advertising_id"] = r.AdvertisingId
	update["ip"] = r.Ip
	update["notification_authorization"] = r.NotificationAuthorization.String()

	frameworks := bson.M{}
	for k, v := range r.Frameworks {
		frameworks[escape(k, InvalidKeyChars)] = v
	}

	update["frameworks"] = frameworks

	update["region_monitoring_mode"] = r.RegionMonitoringMode.String()

	err = s.devices().Update(bson.M{
		"device_id":  deviceId,
		"account_id": accountId,
	}, bson.M{"$set": update})
	if err != nil {
		return wrapError(err, "devices.Update")
	}

	return nil
}

func (s *devicesStore) UpdateDeviceCustomAttributes(ctx context.Context, r *audience.UpdateDeviceCustomAttributesRequest) (bool, error) {
	var (
		deviceId    = r.GetDeviceId()
		accountId   = r.GetAuthContext().GetAccountId()
		attrUpdates = r.GetAttributes()

		d Device
		Q = s.devices().Find(bson.M{
			"device_id":  deviceId,
			"account_id": accountId,
		})
	)

	if err := Q.One(&d); err != nil {
		return false, wrapError(err, "devices.Find")
	}

	// schema is a bag of `SchemaAttribute`s
	schema, err := s.getDeviceSchema(ctx, int(accountId))
	if err != nil {
		return false, wrapError(err, "getDeviceSchema")
	}

	// the update is accepted in case everything is ok or
	// rejected if there's an attribute that doesn't match the schema.
	schemaLess, err := validateUpdateWithSchema(schema.Attributes, attrUpdates)
	if err != nil {
		return false, wrapError(err, "SchemaValidation")
	}

	// now for all the schemaLess attributes create the corresponding schema
	if len(schemaLess) > 0 {
		schemaUpdate, err := s.buildSchema(ctx, accountId, attrUpdates, schemaLess)
		if err != nil {
			return false, wrapError(err, "buildSchema")
		}

		if err := updateSchema(ctx, s.devices_schemas(), schemaUpdate); err != nil {
			return false, wrapError(err, "device.updateSchema")
		}
	}

	if err := updateAttributes(ctx, s.devices(), attrUpdates, d.Id); err != nil {
		return false, wrapError(err, "devices.updateAttributes")
	}

	return len(schemaLess) > 0, nil
}

func (s *devicesStore) UpdateDeviceUnregisterPushToken(ctx context.Context, r *audience.UpdateDeviceUnregisterPushTokenRequest) error {
	var (
		now = s.timeNow()

		account_id = r.GetAuthContext().GetAccountId()
		device_id  = r.GetDeviceId()

		selector = bson.M{"device_id": device_id, "account_id": account_id}
		update   = bson.M{
			"push_token_is_active":       false,
			"push_token_unregistered_at": now,
			"push_token_updated_at":      now,
			"updated_at":                 now,
		}
	)

	if err := s.devices().Update(selector, bson.M{"$set": update}); err != nil {
		return wrapError(err, "devices.Update")
	}

	return nil
}

func (s *devicesStore) UpdateDeviceTestProperty(ctx context.Context, r *audience.UpdateDeviceTestPropertyRequest) error {
	var (
		now = s.timeNow()

		account_id   = r.GetAuthContext().GetAccountId()
		device_id    = r.GetDeviceId()
		isTestDevice = r.GetIsTestDevice()

		selector = bson.M{"device_id": device_id, "account_id": account_id}
		update   = bson.M{
			"is_test_device": isTestDevice,
			"updated_at":     now,
		}
	)

	if err := s.devices().Update(selector, bson.M{"$set": update}); err != nil {
		return wrapError(err, "devices.Update")
	}

	return nil
}

func (s *devicesStore) UpdateDeviceLabelProperty(ctx context.Context, r *audience.UpdateDeviceLabelPropertyRequest) error {
	now := s.timeNow()

	account_id := r.GetAuthContext().GetAccountId()
	device_id := r.GetDeviceId()
	label := r.GetLabel()

	selector := bson.M{"device_id": device_id, "account_id": account_id}
	update := bson.M{
		"label":      label,
		"updated_at": now,
	}

	if err := s.devices().Update(selector, bson.M{"$set": update}); err != nil {
		return wrapError(err, "devices.Update")
	}

	return nil
}

func (s *devicesStore) UpdateDevicePushToken(ctx context.Context, r *audience.UpdateDevicePushTokenRequest) error {
	var (
		now = s.timeNow()

		account_id = r.GetAuthContext().GetAccountId()
		device_id  = r.GetDeviceId()
	)

	var (
		device Device
		Q      = bson.M{"account_id": account_id, "device_id": device_id}
	)
	err := s.devices().Find(Q).One(&device)
	if err != nil {
		return wrapError(err, "devices.Find")
	}

	var update = bson.M{}

	if device.PushTokenKey != r.PushTokenKey {
		if device.PushTokenKey == "" {
			update["push_token_created_at"] = now
			update["push_token_unregistered_at"] = nil
			update["push_token_is_active"] = true
		} else if r.PushTokenKey == "" {
			update["push_token_is_active"] = false
			update["push_token_unregistered_at"] = now
		}
		update["push_token_updated_at"] = now
	}

	update["push_token_key"] = r.PushTokenKey
	update["push_environment"] = r.PushEnvironment
	update["updated_at"] = now

	err = s.devices().Update(bson.M{
		"device_id":  device_id,
		"account_id": account_id,
	}, bson.M{"$set": update})
	if err != nil {
		return wrapError(err, "devices.Update")
	}

	return nil
}

func (s *devicesStore) UpdateDeviceLocation(ctx context.Context, r *audience.UpdateDeviceLocationRequest) error {
	var (
		now = s.timeNow()

		account_id = r.GetAuthContext().GetAccountId()
		device_id  = r.GetDeviceId()
	)

	var update = bson.M{
		"updated_at": now,

		"location_accuracy":  r.LocationAccuracy,
		"location_latitude":  r.LocationLatitude,
		"location_longitude": r.LocationLongitude,

		"location_country":    r.LocationCountry,
		"location_state":      r.LocationState,
		"location_city":       r.LocationCity,
		"location_updated_at": now,
	}

	err := s.devices().Update(bson.M{
		"device_id":  device_id,
		"account_id": account_id,
	}, bson.M{"$set": update})
	if err != nil {
		return wrapError(err, "devices.Update")
	}

	return nil
}

func (s *devicesStore) UpdateDeviceGeofenceMonitoring(ctx context.Context, r *audience.UpdateDeviceGeofenceMonitoringRequest) error {
	var (
		now = s.timeNow()

		account_id = r.GetAuthContext().GetAccountId()
		device_id  = r.GetDeviceId()
	)

	var update = bson.M{
		"updated_at":                             now,
		"geofence_monitoring_regions_updated_at": now,
		"geofence_monitoring_regions":            r.Regions,
	}

	err := s.devices().Update(bson.M{
		"device_id":  device_id,
		"account_id": account_id,
	}, bson.M{"$set": update})
	if err != nil {
		return wrapError(err, "devices.Update")
	}

	return nil
}

func (s *devicesStore) UpdateDeviceIBeaconMonitoring(ctx context.Context, r *audience.UpdateDeviceIBeaconMonitoringRequest) error {
	var (
		now = s.timeNow()

		account_id = r.GetAuthContext().GetAccountId()
		device_id  = r.GetDeviceId()
	)

	var update = bson.M{
		"updated_at":                            now,
		"ibeacon_monitoring_regions_updated_at": now,
		"ibeacon_monitoring_regions":            r.Regions,
	}

	err := s.devices().Update(bson.M{
		"device_id":  device_id,
		"account_id": account_id,
	}, bson.M{"$set": update})
	if err != nil {
		return wrapError(err, "devices.Update")
	}

	return nil
}

func (s *devicesStore) DeleteDevice(ctx context.Context, r *audience.DeleteDeviceRequest) error {
	var (
		deviceId  = r.GetDeviceId()
		accountId = r.GetAuthContext().GetAccountId()

		rq = bson.M{"device_id": deviceId, "account_id": accountId}
	)

	if err := s.devices().Remove(rq); err != nil {
		return wrapError(err, "devices.Remove")
	}

	return nil
}

func (s *devicesStore) SetDeviceProfileIdentifier(ctx context.Context, r *audience.SetDeviceProfileIdentifierRequest) error {
	var (
		profileIdentifier = r.GetProfileIdentifier()
		deviceId          = r.GetDeviceId()
		accountId         = r.GetAuthContext().GetAccountId()
		now               = s.timeNow()
	)

	err := s.devices().Update(
		bson.M{
			"device_id":  deviceId,
			"account_id": accountId,
		},
		bson.M{"$set": bson.M{
			"profile_identifier": profileIdentifier,
			"updated_at":         now,
		}})

	if err != nil {
		return wrapError(err, "devices.SetDeviceProfileIdentifier")
	}

	return nil
}

func (s *devicesStore) ListDevicesByProfileIdentifier(ctx context.Context, r *audience.ListDevicesByProfileIdentifierRequest) ([]*audience.Device, error) {
	var (
		accountId  = r.GetAuthContext().GetAccountId()
		identifier = r.GetProfileIdentifier()

		devices []Device
		Q       = bson.M{"account_id": accountId, "profile_identifier": identifier}
	)

	if err := s.devices().Find(Q).All(&devices); err != nil {
		return nil, wrapError(err, "devices.Find")
	}

	var protoDevices = make([]*audience.Device, len(devices))

	for i := range devices {
		protoDevices[i] = new(audience.Device)
		devices[i].toProto(protoDevices[i])
	}

	return protoDevices, nil
}
