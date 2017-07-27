package mongodb

import (
	"time"

	"golang.org/x/net/context"

	mgo "gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"

	"github.com/pkg/errors"
	audience "github.com/roverplatform/rover/apis/go/audience/v1"
	"github.com/roverplatform/rover/go/protobuf/ptypes/timestamp"
)

type devicesStore struct {
	*mongoStore
}

type Version audience.Version

type Device struct {
	Id        bson.ObjectId `bson:"_id"`
	AccountId int32         `bson:"account_id"`
	DeviceId  string        `bson:"device_id"`

	ProfileId bson.ObjectId `bson:"profile_id"`
	CreatedAt *time.Time    `bson:"created_at"`
	UpdatedAt *time.Time    `bson:"updated_at"`

	ApsEnvironment            string     `bson:"aps_environment,omitempty"`
	DeviceTokenKey            string     `bson:"device_token_key,omitempty"`
	DeviceTokenIsActive       bool       `bson:"device_token_is_active"`
	DeviceTokenCreatedAt      *time.Time `bson:"device_token_created_at,omitempty"`
	DeviceTokenUpdatedAt      *time.Time `bson:"device_token_updated_at,omitempty"`
	DeviceTokenUnregisteredAt *time.Time `bson:"device_token_unregistered_at,omitempty"`

	AppName                     string              `bson:"app_name,omitempty"`
	AppVersion                  string              `bson:"app_version,omitempty"`
	AppBuild                    string              `bson:"app_build,omitempty"`
	AppNamespace                string              `bson:"app_namespace,omitempty"`
	DeviceManufacturer          string              `bson:"device_manufacturer,omitempty"`
	DeviceModel                 string              `bson:"device_model,omitempty"`
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

	LocationAccuracy  int32   `bson:"location_accuracy,omitempty"`
	LocationLatitude  float64 `bson:"location_latitude,omitempty"`
	LocationLongitude float64 `bson:"location_longitude,omitempty"`
	LocationRegion    string  `bson:"location_region,omitempty"`
	LocationStreet    string  `bson:"location_street,omitempty"`
	LocationCity      string  `bson:"location_city,omitempty"`

	RegionMonitoringMode string `bson:"region_monitoring_mode,omitempty"`

	IbeaconMonitoringRegionsUpdatedAt  *time.Time                 `bson:"ibeacon_monitoring_regions_updated_at,omitempty"`
	IbeaconMonitoringRegions           []*audience.IBeaconRegion  `bson:"ibeacon_monitoring_regions,omitempty"`
	GeofenceMonitoringRegionsUpdatedAt *time.Time                 `bson:"geofence_monitoring_regions_updated_at,omitempty"`
	GeofenceMonitoringRegions          []*audience.GeofenceRegion `bson:"geofence_monitoring_regions,omitempty"`
}

func (d *Device) fromProto(proto *audience.Device) error {
	d.DeviceId = proto.Id

	d.AccountId = proto.AccountId

	d.ProfileId = bson.ObjectIdHex(proto.ProfileId)

	d.CreatedAt, _ = protoToTime(proto.CreatedAt)
	d.UpdatedAt, _ = protoToTime(proto.UpdatedAt)

	d.DeviceTokenKey = proto.DeviceTokenKey
	d.ApsEnvironment = proto.ApsEnvironment
	d.DeviceTokenIsActive = proto.DeviceTokenIsActive

	d.DeviceTokenUpdatedAt, _ = protoToTime(proto.DeviceTokenUpdatedAt)
	d.DeviceTokenCreatedAt, _ = protoToTime(proto.DeviceTokenCreatedAt)
	// TODO: handle nulls
	d.DeviceTokenUnregisteredAt, _ = protoToTime(proto.DeviceTokenUnregisteredAt)

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
			d.Frameworks[k] = (*Version)(v)
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

	d.LocationAccuracy = proto.LocationAccuracy
	d.LocationLongitude = proto.LocationLongitude
	d.LocationLatitude = proto.LocationLatitude
	d.LocationStreet = proto.LocationStreet
	d.LocationRegion = proto.LocationRegion
	d.LocationCity = proto.LocationCity

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
	proto.ProfileId = d.ProfileId.Hex()
	proto.AccountId = d.AccountId

	proto.CreatedAt, _ = timeToProto(d.CreatedAt)
	proto.UpdatedAt, _ = timeToProto(d.UpdatedAt)

	proto.ApsEnvironment = d.ApsEnvironment
	proto.DeviceTokenKey = d.DeviceTokenKey

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
			proto.Frameworks[k] = (*audience.Version)(v)
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

	proto.DeviceTokenIsActive = d.DeviceTokenIsActive
	proto.DeviceTokenUpdatedAt, _ = timeToProto(d.DeviceTokenUpdatedAt)
	proto.DeviceTokenCreatedAt, _ = timeToProto(d.DeviceTokenCreatedAt)

	proto.DeviceTokenUnregisteredAt, _ = timeToProto(d.DeviceTokenUnregisteredAt)

	proto.LocationAccuracy = d.LocationAccuracy
	proto.LocationLongitude = d.LocationLongitude
	proto.LocationLatitude = d.LocationLatitude
	proto.LocationStreet = d.LocationStreet
	proto.LocationRegion = d.LocationRegion
	proto.LocationCity = d.LocationCity

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

// FindDeviceById finds a device by id.
func (s *devicesStore) FindDeviceById(ctx context.Context, id string) (*audience.Device, error) {
	var (
		d Device

		Q = s.devices.Find(bson.M{"device_id": id})
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
		device_id  = r.GetDeviceId()
		account_id = r.GetAuthContext().GetAccountId()

		d Device
		Q = bson.M{"device_id": device_id, "account_id": account_id}
	)

	if err := s.devices.Find(Q).One(&d); err != nil {
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
		device_token_key = r.GetDeviceTokenKey()
		account_id       = r.GetAuthContext().GetAccountId()

		d Device
		Q = bson.M{"device_token_key": device_token_key, "account_id": account_id}
	)

	if err := s.devices.Find(Q).One(&d); err != nil {
		return nil, wrapError(err, "devices.Find")
	}

	var proto audience.Device
	if err := d.toProto(&proto); err != nil {
		return nil, wrapError(err, "device.toProto")
	}

	return &proto, nil
}

func (s *devicesStore) profileExists(ctx context.Context, profile_id string) error {

	profile_oid, err := StringToObjectID(profile_id)
	if err != nil {
		err = &ErrorInvalidArgument{
			ArgumentName: "ProfileId",
			Value:        profile_oid,
			error:        err,
		}
		return wrapError(err, "StringToObjectID: ProfileId")
	}

	// ensure the profile exists
	// `Count` is used to avoid allocating a profile value
	n, err := s.profiles.Find(bson.M{"_id": profile_oid}).Count()
	if err != nil {
		return wrapError(err, "profiles.Find")
	}

	if n == 0 {
		return &ErrorNotFound{error: mgo.ErrNotFound}
	}

	if n > 1 {
		return errors.New("too many")
	}

	return nil
}

func (s *devicesStore) CreateDevice(ctx context.Context, r *audience.CreateDeviceRequest) error {
	var (
		now = s.timeNow()

		account_id = r.GetAuthContext().GetAccountId()
		profile_id = r.GetProfileId()
		device_id  = r.GetDeviceId()
	)

	if err := s.profileExists(ctx, profile_id); err != nil {
		return wrapError(err, "profiles.Exist")
	}

	var device = Device{
		Id:        s.newObjectId(),
		DeviceId:  device_id,
		AccountId: account_id,
		ProfileId: bson.ObjectIdHex(profile_id),
		// timestamps
		CreatedAt: &now,
		UpdatedAt: &now,
	}

	if err := s.devices.Insert(device); err != nil {
		return wrapError(err, "devices.Insert")
	}

	return nil
}

func (s *devicesStore) UpdateDevice(ctx context.Context, r *audience.UpdateDeviceRequest) error {
	var (
		now = s.timeNow()

		account_id = r.GetAuthContext().GetAccountId()
		device_id  = r.GetDeviceId()
	)

	var (
		device Device
		Q      = bson.M{"account_id": account_id, "device_id": device_id}
	)
	err := s.devices.Find(Q).One(&device)
	if err != nil {
		return wrapError(err, "devices.Find")
	}

	var update = bson.M{}

	if device.DeviceTokenKey != r.DeviceTokenKey {
		if device.DeviceTokenKey == "" {
			update["device_token_created_at"] = now
			update["device_token_unregistered_at"] = nil
			update["device_token_is_active"] = true
		} else if r.DeviceTokenKey == "" {
			update["device_token_is_active"] = false
			update["device_token_unregistered_at"] = now
		}

		update["device_token_updated_at"] = now
	}

	update["updated_at"] = now

	update["aps_environment"] = r.ApsEnvironment
	update["device_token_key"] = r.DeviceTokenKey
	if r.DeviceTokenKey == "" {
		update["device_token_key"] = nil
	}
	update["app_name"] = r.AppName
	update["app_version"] = r.AppVersion
	update["app_build"] = r.AppBuild
	update["app_namespace"] = r.AppNamespace
	update["device_manufacturer"] = r.DeviceManufacturer
	update["device_model"] = r.DeviceModel
	update["os_name"] = r.OsName
	update["os_version"] = r.OsVersion
	update["frameworks"] = r.Frameworks
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

	update["region_monitoring_mode"] = r.RegionMonitoringMode.String()

	err = s.devices.Update(bson.M{
		"device_id":  device_id,
		"account_id": account_id,
	}, bson.M{"$set": update})
	if err != nil {
		return wrapError(err, "devices.Update")
	}

	return nil
}

func (s *devicesStore) UpdateDeviceUnregisterPushToken(ctx context.Context, r *audience.UpdateDeviceUnregisterPushTokenRequest) error {
	var (
		now = s.timeNow()

		account_id = r.GetAuthContext().GetAccountId()
		device_id  = r.GetDeviceId()

		selector = bson.M{"device_id": device_id, "account_id": account_id}
		update   = bson.M{
			"device_token_is_active":       false,
			"device_token_unregistered_at": now,
			"device_token_updated_at":      now,
			"updated_at":                   now,
		}
	)

	if err := s.devices.Update(selector, bson.M{"$set": update}); err != nil {
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
	err := s.devices.Find(Q).One(&device)
	if err != nil {
		return wrapError(err, "devices.Find")
	}

	var update = bson.M{}

	if device.DeviceTokenKey != r.DeviceTokenKey {
		if device.DeviceTokenKey == "" {
			update["device_token_created_at"] = now
			update["device_token_unregistered_at"] = nil
			update["device_token_is_active"] = true
		} else if r.DeviceTokenKey == "" {
			update["device_token_is_active"] = false
			update["device_token_unregistered_at"] = now
		}
		update["device_token_updated_at"] = now
	}

	update["device_token_key"] = r.DeviceTokenKey
	update["aps_environment"] = r.ApsEnvironment
	update["updated_at"] = now

	err = s.devices.Update(bson.M{
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
	}

	err := s.devices.Update(bson.M{
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

	err := s.devices.Update(bson.M{
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

	err := s.devices.Update(bson.M{
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
		device_id  = r.GetDeviceId()
		account_id = r.GetAuthContext().GetAccountId()

		rq = bson.M{"device_id": device_id, "account_id": account_id}
	)

	if err := s.devices.Remove(rq); err != nil {
		return wrapError(err, "devices.Remove")
	}

	return nil
}

func (s *devicesStore) SetDeviceProfile(ctx context.Context, r *audience.SetDeviceProfileRequest) error {
	var (
		profile_id = r.GetProfileId()
		device_id  = r.GetDeviceId()
		account_id = r.GetAuthContext().GetAccountId()
		now        = s.timeNow()
	)

	pid, err := StringToObjectID(profile_id)
	if err != nil {
		err = &ErrorInvalidArgument{
			ArgumentName: "ProfileId",
			Value:        profile_id,
			error:        err,
		}
		return wrapError(err, "StringToObjectID: ProfileId")
	}

	if err := s.profileExists(ctx, pid.Hex()); err != nil {
		return errors.Wrap(err, "profileExists")
	}

	err = s.devices.Update(
		bson.M{
			"device_id":  device_id,
			"account_id": account_id,
		},
		bson.M{"$set": bson.M{
			"profile_id": pid,
			"updated_at": now,
		}})

	if err != nil {
		return wrapError(err, "devices.UpdateId")
	}

	return nil
}

func (s *devicesStore) ListDevicesByProfileId(ctx context.Context, r *audience.ListDevicesByProfileIdRequest) ([]*audience.Device, error) {
	var (
		account_id = r.GetAuthContext().GetAccountId()
		profile_id = r.GetProfileId()
	)

	pid, err := StringToObjectID(profile_id)
	if err != nil {
		err = &ErrorInvalidArgument{
			error:        err,
			ArgumentName: "ProfileId",
			Value:        profile_id,
		}
		return nil, wrapError(err, "StringToObjectID: ProfileId")
	}

	if err := s.profileExists(ctx, pid.Hex()); err != nil {
		return nil, errors.Wrap(err, "profileExists")
	}

	var (
		devices []Device
		Q       = bson.M{"account_id": account_id, "profile_id": pid}
	)

	if err := s.devices.Find(Q).All(&devices); err != nil {
		return nil, wrapError(err, "devices.Find")
	}

	var protoDevices = make([]*audience.Device, len(devices))

	for i := range devices {
		protoDevices[i] = new(audience.Device)
		devices[i].toProto(protoDevices[i])
	}

	return protoDevices, nil
}

func (s *devicesStore) ListDevicesByProfileIdentifier(ctx context.Context, r *audience.ListDevicesByProfileIdentifierRequest) ([]*audience.Device, error) {
	var (
		account_id = r.GetAuthContext().GetAccountId()
		identifier = r.GetIdentifier()

		pQ      = bson.M{"account_id": account_id, "identifier": identifier}
		profile = bson.M{}
	)

	if err := s.profiles.Find(pQ).One(&profile); err != nil {
		return nil, wrapError(err, "profiles.Find")
	}

	var (
		devices []Device
		dQ      = bson.M{"account_id": account_id, "profile_id": profile["_id"]}
	)

	if err := s.devices.Find(dQ).All(&devices); err != nil {
		return nil, wrapError(err, "devices.Find")
	}

	var protoDevices = make([]*audience.Device, len(devices))

	for i := range devices {
		protoDevices[i] = new(audience.Device)
		devices[i].toProto(protoDevices[i])
	}

	return protoDevices, nil
}
