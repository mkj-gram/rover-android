// Code generated by protoc-gen-go. DO NOT EDIT.
// source: event/v1/event.proto

/*
Package event is a generated protocol buffer package.

It is generated from these files:
	event/v1/event.proto

It has these top-level messages:
	DeviceContext
	Event
*/
package event

import proto "github.com/golang/protobuf/proto"
import fmt "fmt"
import math "math"
import google_protobuf "github.com/roverplatform/rover/go/protobuf/ptypes/timestamp"
import rover_protobuf "github.com/roverplatform/rover/apis/go/protobuf/wrappers"
import rover_protobuf1 "github.com/roverplatform/rover/apis/go/protobuf"
import rover_protobuf2 "github.com/roverplatform/rover/apis/go/protobuf/struct"
import rover_protobuf3 "github.com/roverplatform/rover/apis/go/protobuf/timestamp"
import rover_auth_v1 "github.com/roverplatform/rover/apis/go/auth/v1"
import rover_audience_v1 "github.com/roverplatform/rover/apis/go/audience/v1"

// Reference imports to suppress errors if they are not otherwise used.
var _ = proto.Marshal
var _ = fmt.Errorf
var _ = math.Inf

// This is a compile-time assertion to ensure that this generated file
// is compatible with the proto package it is being compiled against.
// A compilation error at this line likely means your copy of the
// proto package needs to be updated.
const _ = proto.ProtoPackageIsVersion2 // please upgrade the proto package

type DeviceContext struct {
	DeviceIdentifier  string `protobuf:"bytes,1,opt,name=device_identifier,json=deviceIdentifier" json:"device_identifier,omitempty"`
	ProfileIdentifier string `protobuf:"bytes,2,opt,name=profile_identifier,json=profileIdentifier" json:"profile_identifier,omitempty"`
	// Custom attributes
	// Should we use a struct
	Attributes                *rover_protobuf2.Struct                           `protobuf:"bytes,3,opt,name=attributes" json:"attributes,omitempty"`
	AppBuild                  string                                            `protobuf:"bytes,4,opt,name=app_build,json=appBuild" json:"app_build,omitempty"`
	AppName                   string                                            `protobuf:"bytes,5,opt,name=app_name,json=appName" json:"app_name,omitempty"`
	AppNamespace              string                                            `protobuf:"bytes,6,opt,name=app_namespace,json=appNamespace" json:"app_namespace,omitempty"`
	AppVersion                string                                            `protobuf:"bytes,7,opt,name=app_version,json=appVersion" json:"app_version,omitempty"`
	AppBadgeNumber            *rover_protobuf.Int32Value                        `protobuf:"bytes,8,opt,name=app_badge_number,json=appBadgeNumber" json:"app_badge_number,omitempty"`
	DeviceManufacturer        string                                            `protobuf:"bytes,9,opt,name=device_manufacturer,json=deviceManufacturer" json:"device_manufacturer,omitempty"`
	DeviceModel               string                                            `protobuf:"bytes,10,opt,name=device_model,json=deviceModel" json:"device_model,omitempty"`
	IsLocationServicesEnabled *rover_protobuf.BoolValue                         `protobuf:"bytes,11,opt,name=is_location_services_enabled,json=isLocationServicesEnabled" json:"is_location_services_enabled,omitempty"`
	LocationAuthorization     rover_audience_v1.LocationAuthorization_Value     `protobuf:"varint,12,opt,name=location_authorization,json=locationAuthorization,enum=rover.audience.v1.LocationAuthorization_Value" json:"location_authorization,omitempty"`
	LocaleLanguage            string                                            `protobuf:"bytes,13,opt,name=locale_language,json=localeLanguage" json:"locale_language,omitempty"`
	LocaleRegion              string                                            `protobuf:"bytes,14,opt,name=locale_region,json=localeRegion" json:"locale_region,omitempty"`
	LocaleScript              string                                            `protobuf:"bytes,15,opt,name=locale_script,json=localeScript" json:"locale_script,omitempty"`
	OperatingSystemName       string                                            `protobuf:"bytes,16,opt,name=operating_system_name,json=operatingSystemName" json:"operating_system_name,omitempty"`
	OperatingSystemVersion    *rover_protobuf1.Version                          `protobuf:"bytes,17,opt,name=operating_system_version,json=operatingSystemVersion" json:"operating_system_version,omitempty"`
	NotificationAuthorization rover_audience_v1.NotificationAuthorization_Value `protobuf:"varint,18,opt,name=notification_authorization,json=notificationAuthorization,enum=rover.audience.v1.NotificationAuthorization_Value" json:"notification_authorization,omitempty"`
	PushEnvironment           rover_audience_v1.PushEnvironment_Value           `protobuf:"varint,19,opt,name=push_environment,json=pushEnvironment,enum=rover.audience.v1.PushEnvironment_Value" json:"push_environment,omitempty"`
	PushToken                 string                                            `protobuf:"bytes,20,opt,name=push_token,json=pushToken" json:"push_token,omitempty"`
	Radio                     string                                            `protobuf:"bytes,21,opt,name=radio" json:"radio,omitempty"`
	CarrierName               string                                            `protobuf:"bytes,22,opt,name=carrier_name,json=carrierName" json:"carrier_name,omitempty"`
	TimeZone                  string                                            `protobuf:"bytes,23,opt,name=time_zone,json=timeZone" json:"time_zone,omitempty"`
	Ip                        string                                            `protobuf:"bytes,24,opt,name=ip" json:"ip,omitempty"`
	IsCellularEnabled         *rover_protobuf.BoolValue                         `protobuf:"bytes,25,opt,name=is_cellular_enabled,json=isCellularEnabled" json:"is_cellular_enabled,omitempty"`
	IsWifiEnabled             *rover_protobuf.BoolValue                         `protobuf:"bytes,26,opt,name=is_wifi_enabled,json=isWifiEnabled" json:"is_wifi_enabled,omitempty"`
	ScreenWidth               int32                                             `protobuf:"varint,27,opt,name=screen_width,json=screenWidth" json:"screen_width,omitempty"`
	ScreenHeight              int32                                             `protobuf:"varint,28,opt,name=screen_height,json=screenHeight" json:"screen_height,omitempty"`
	SdkVersion                *rover_protobuf1.Version                          `protobuf:"bytes,29,opt,name=sdk_version,json=sdkVersion" json:"sdk_version,omitempty"`
	DeviceName                string                                            `protobuf:"bytes,30,opt,name=device_name,json=deviceName" json:"device_name,omitempty"`
	AdvertisingId             string                                            `protobuf:"bytes,31,opt,name=advertising_id,json=advertisingId" json:"advertising_id,omitempty"`
	IsBluetoothEnabled        *rover_protobuf.BoolValue                         `protobuf:"bytes,32,opt,name=is_bluetooth_enabled,json=isBluetoothEnabled" json:"is_bluetooth_enabled,omitempty"`
	IsTestDevice              *rover_protobuf.BoolValue                         `protobuf:"bytes,33,opt,name=is_test_device,json=isTestDevice" json:"is_test_device,omitempty"`
}

func (m *DeviceContext) Reset()                    { *m = DeviceContext{} }
func (m *DeviceContext) String() string            { return proto.CompactTextString(m) }
func (*DeviceContext) ProtoMessage()               {}
func (*DeviceContext) Descriptor() ([]byte, []int) { return fileDescriptor0, []int{0} }

func (m *DeviceContext) GetDeviceIdentifier() string {
	if m != nil {
		return m.DeviceIdentifier
	}
	return ""
}

func (m *DeviceContext) GetProfileIdentifier() string {
	if m != nil {
		return m.ProfileIdentifier
	}
	return ""
}

func (m *DeviceContext) GetAttributes() *rover_protobuf2.Struct {
	if m != nil {
		return m.Attributes
	}
	return nil
}

func (m *DeviceContext) GetAppBuild() string {
	if m != nil {
		return m.AppBuild
	}
	return ""
}

func (m *DeviceContext) GetAppName() string {
	if m != nil {
		return m.AppName
	}
	return ""
}

func (m *DeviceContext) GetAppNamespace() string {
	if m != nil {
		return m.AppNamespace
	}
	return ""
}

func (m *DeviceContext) GetAppVersion() string {
	if m != nil {
		return m.AppVersion
	}
	return ""
}

func (m *DeviceContext) GetAppBadgeNumber() *rover_protobuf.Int32Value {
	if m != nil {
		return m.AppBadgeNumber
	}
	return nil
}

func (m *DeviceContext) GetDeviceManufacturer() string {
	if m != nil {
		return m.DeviceManufacturer
	}
	return ""
}

func (m *DeviceContext) GetDeviceModel() string {
	if m != nil {
		return m.DeviceModel
	}
	return ""
}

func (m *DeviceContext) GetIsLocationServicesEnabled() *rover_protobuf.BoolValue {
	if m != nil {
		return m.IsLocationServicesEnabled
	}
	return nil
}

func (m *DeviceContext) GetLocationAuthorization() rover_audience_v1.LocationAuthorization_Value {
	if m != nil {
		return m.LocationAuthorization
	}
	return rover_audience_v1.LocationAuthorization_UNKNOWN
}

func (m *DeviceContext) GetLocaleLanguage() string {
	if m != nil {
		return m.LocaleLanguage
	}
	return ""
}

func (m *DeviceContext) GetLocaleRegion() string {
	if m != nil {
		return m.LocaleRegion
	}
	return ""
}

func (m *DeviceContext) GetLocaleScript() string {
	if m != nil {
		return m.LocaleScript
	}
	return ""
}

func (m *DeviceContext) GetOperatingSystemName() string {
	if m != nil {
		return m.OperatingSystemName
	}
	return ""
}

func (m *DeviceContext) GetOperatingSystemVersion() *rover_protobuf1.Version {
	if m != nil {
		return m.OperatingSystemVersion
	}
	return nil
}

func (m *DeviceContext) GetNotificationAuthorization() rover_audience_v1.NotificationAuthorization_Value {
	if m != nil {
		return m.NotificationAuthorization
	}
	return rover_audience_v1.NotificationAuthorization_UNKNOWN
}

func (m *DeviceContext) GetPushEnvironment() rover_audience_v1.PushEnvironment_Value {
	if m != nil {
		return m.PushEnvironment
	}
	return rover_audience_v1.PushEnvironment_UNKNOWN
}

func (m *DeviceContext) GetPushToken() string {
	if m != nil {
		return m.PushToken
	}
	return ""
}

func (m *DeviceContext) GetRadio() string {
	if m != nil {
		return m.Radio
	}
	return ""
}

func (m *DeviceContext) GetCarrierName() string {
	if m != nil {
		return m.CarrierName
	}
	return ""
}

func (m *DeviceContext) GetTimeZone() string {
	if m != nil {
		return m.TimeZone
	}
	return ""
}

func (m *DeviceContext) GetIp() string {
	if m != nil {
		return m.Ip
	}
	return ""
}

func (m *DeviceContext) GetIsCellularEnabled() *rover_protobuf.BoolValue {
	if m != nil {
		return m.IsCellularEnabled
	}
	return nil
}

func (m *DeviceContext) GetIsWifiEnabled() *rover_protobuf.BoolValue {
	if m != nil {
		return m.IsWifiEnabled
	}
	return nil
}

func (m *DeviceContext) GetScreenWidth() int32 {
	if m != nil {
		return m.ScreenWidth
	}
	return 0
}

func (m *DeviceContext) GetScreenHeight() int32 {
	if m != nil {
		return m.ScreenHeight
	}
	return 0
}

func (m *DeviceContext) GetSdkVersion() *rover_protobuf1.Version {
	if m != nil {
		return m.SdkVersion
	}
	return nil
}

func (m *DeviceContext) GetDeviceName() string {
	if m != nil {
		return m.DeviceName
	}
	return ""
}

func (m *DeviceContext) GetAdvertisingId() string {
	if m != nil {
		return m.AdvertisingId
	}
	return ""
}

func (m *DeviceContext) GetIsBluetoothEnabled() *rover_protobuf.BoolValue {
	if m != nil {
		return m.IsBluetoothEnabled
	}
	return nil
}

func (m *DeviceContext) GetIsTestDevice() *rover_protobuf.BoolValue {
	if m != nil {
		return m.IsTestDevice
	}
	return nil
}

// Event generated by the SDK or an outside server
type Event struct {
	AuthContext *rover_auth_v1.AuthContext `protobuf:"bytes,1,opt,name=auth_context,json=authContext" json:"auth_context,omitempty"`
	// Namespace describes the grouping of events. In the case where an event is coming from the sdk
	// the namespace is set to "rover"
	Namespace string `protobuf:"bytes,2,opt,name=namespace" json:"namespace,omitempty"`
	// A unique id the client generated for this event
	Id   string `protobuf:"bytes,3,opt,name=id" json:"id,omitempty"`
	Name string `protobuf:"bytes,4,opt,name=name" json:"name,omitempty"`
	// the timestamp the event was generated by the caller
	// use our custom timestamp to preserve timezone offset
	Timestamp *rover_protobuf3.Timestamp `protobuf:"bytes,5,opt,name=timestamp" json:"timestamp,omitempty"`
	// represents when the gateways received this event
	ReceivedAt *google_protobuf.Timestamp `protobuf:"bytes,6,opt,name=received_at,json=receivedAt" json:"received_at,omitempty"`
	// free form attributes representing JSON data
	Attributes *rover_protobuf2.Struct `protobuf:"bytes,7,opt,name=attributes" json:"attributes,omitempty"`
	// Optional Device
	Device           *DeviceContext          `protobuf:"bytes,8,opt,name=device" json:"device,omitempty"`
	SchemaIdentifier *Event_SchemaIdentifier `protobuf:"bytes,9,opt,name=schema_identifier,json=schemaIdentifier" json:"schema_identifier,omitempty"`
	// represents when the pipeline received the event as input
	ProcessedAt *google_protobuf.Timestamp `protobuf:"bytes,10,opt,name=processed_at,json=processedAt" json:"processed_at,omitempty"`
}

func (m *Event) Reset()                    { *m = Event{} }
func (m *Event) String() string            { return proto.CompactTextString(m) }
func (*Event) ProtoMessage()               {}
func (*Event) Descriptor() ([]byte, []int) { return fileDescriptor0, []int{1} }

func (m *Event) GetAuthContext() *rover_auth_v1.AuthContext {
	if m != nil {
		return m.AuthContext
	}
	return nil
}

func (m *Event) GetNamespace() string {
	if m != nil {
		return m.Namespace
	}
	return ""
}

func (m *Event) GetId() string {
	if m != nil {
		return m.Id
	}
	return ""
}

func (m *Event) GetName() string {
	if m != nil {
		return m.Name
	}
	return ""
}

func (m *Event) GetTimestamp() *rover_protobuf3.Timestamp {
	if m != nil {
		return m.Timestamp
	}
	return nil
}

func (m *Event) GetReceivedAt() *google_protobuf.Timestamp {
	if m != nil {
		return m.ReceivedAt
	}
	return nil
}

func (m *Event) GetAttributes() *rover_protobuf2.Struct {
	if m != nil {
		return m.Attributes
	}
	return nil
}

func (m *Event) GetDevice() *DeviceContext {
	if m != nil {
		return m.Device
	}
	return nil
}

func (m *Event) GetSchemaIdentifier() *Event_SchemaIdentifier {
	if m != nil {
		return m.SchemaIdentifier
	}
	return nil
}

func (m *Event) GetProcessedAt() *google_protobuf.Timestamp {
	if m != nil {
		return m.ProcessedAt
	}
	return nil
}

type Event_SchemaIdentifier struct {
	Id      int64 `protobuf:"varint,1,opt,name=id" json:"id,omitempty"`
	Version int64 `protobuf:"varint,2,opt,name=version" json:"version,omitempty"`
}

func (m *Event_SchemaIdentifier) Reset()                    { *m = Event_SchemaIdentifier{} }
func (m *Event_SchemaIdentifier) String() string            { return proto.CompactTextString(m) }
func (*Event_SchemaIdentifier) ProtoMessage()               {}
func (*Event_SchemaIdentifier) Descriptor() ([]byte, []int) { return fileDescriptor0, []int{1, 0} }

func (m *Event_SchemaIdentifier) GetId() int64 {
	if m != nil {
		return m.Id
	}
	return 0
}

func (m *Event_SchemaIdentifier) GetVersion() int64 {
	if m != nil {
		return m.Version
	}
	return 0
}

func init() {
	proto.RegisterType((*DeviceContext)(nil), "rover.event.v1.DeviceContext")
	proto.RegisterType((*Event)(nil), "rover.event.v1.Event")
	proto.RegisterType((*Event_SchemaIdentifier)(nil), "rover.event.v1.Event.SchemaIdentifier")
}

func init() { proto.RegisterFile("event/v1/event.proto", fileDescriptor0) }

var fileDescriptor0 = []byte{
	// 1084 bytes of a gzipped FileDescriptorProto
	0x1f, 0x8b, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, 0xff, 0x8c, 0x56, 0x6d, 0x6f, 0xdb, 0x36,
	0x10, 0x46, 0xd2, 0xa6, 0xa9, 0xcf, 0x2f, 0x71, 0x98, 0x97, 0x32, 0x6e, 0xbb, 0xa4, 0x1d, 0xb6,
	0x05, 0x18, 0xe6, 0x20, 0x29, 0xf6, 0x02, 0x74, 0xc3, 0x90, 0xb4, 0x05, 0x16, 0xac, 0x0b, 0x36,
	0x3b, 0x68, 0x81, 0x7c, 0x11, 0x68, 0xe9, 0x6c, 0x13, 0x91, 0x45, 0x8d, 0xa4, 0x9c, 0xad, 0x7f,
	0x69, 0x3f, 0x62, 0x7f, 0x6d, 0xe0, 0x91, 0x92, 0x1d, 0xcf, 0x5d, 0xf6, 0xc9, 0xe2, 0x73, 0xcf,
	0x1d, 0xcf, 0x0f, 0x1f, 0xea, 0x04, 0xdb, 0x38, 0xc5, 0xcc, 0x1e, 0x4d, 0x8f, 0x8f, 0xe8, 0xa1,
	0x9b, 0x6b, 0x65, 0x15, 0x6b, 0x69, 0x35, 0x45, 0xdd, 0xf5, 0xd0, 0xf4, 0xb8, 0xb3, 0x3f, 0x52,
	0x6a, 0x94, 0xe2, 0x11, 0x45, 0x07, 0xc5, 0xf0, 0xc8, 0xca, 0x09, 0x1a, 0x2b, 0x26, 0xb9, 0x4f,
	0xe8, 0x3c, 0xaa, 0x22, 0x37, 0x5a, 0xe4, 0x39, 0x6a, 0x13, 0x02, 0xbb, 0x55, 0x60, 0x8a, 0xda,
	0x48, 0x95, 0x05, 0x7c, 0xa7, 0xc2, 0x8d, 0xd5, 0x45, 0x1c, 0x36, 0xee, 0xf0, 0x8f, 0xee, 0xc0,
	0x44, 0x61, 0xc7, 0xae, 0x4f, 0xf7, 0x1b, 0xb0, 0x8e, 0x28, 0x12, 0x89, 0x59, 0x8c, 0x1e, 0xf7,
	0xcf, 0x3e, 0xf6, 0xfc, 0xaf, 0x26, 0x34, 0x5f, 0xe3, 0x54, 0xc6, 0xf8, 0x4a, 0x65, 0x16, 0xff,
	0xb0, 0xec, 0x4b, 0xd8, 0x4c, 0x08, 0x88, 0x64, 0x82, 0x99, 0x95, 0x43, 0x89, 0x9a, 0xaf, 0x1c,
	0xac, 0x1c, 0xd6, 0x7a, 0x6d, 0x1f, 0x38, 0xaf, 0x70, 0xf6, 0x15, 0xb0, 0x5c, 0xab, 0xa1, 0x4c,
	0x6f, 0xb1, 0x57, 0x89, 0xbd, 0x19, 0x22, 0x73, 0xf4, 0x6f, 0x00, 0x84, 0xb5, 0x5a, 0x0e, 0x0a,
	0x8b, 0x86, 0xdf, 0x3b, 0x58, 0x39, 0xac, 0x9f, 0xec, 0x76, 0xbd, 0x8a, 0xe5, 0x5f, 0xea, 0xf6,
	0xe9, 0x9f, 0xf6, 0xe6, 0x98, 0xec, 0x31, 0xd4, 0x44, 0x9e, 0x47, 0x83, 0x42, 0xa6, 0x09, 0xbf,
	0x4f, 0xd5, 0x1f, 0x8a, 0x3c, 0x3f, 0x73, 0x6b, 0xb6, 0x07, 0xee, 0x39, 0xca, 0xc4, 0x04, 0xf9,
	0x1a, 0xc5, 0xd6, 0x45, 0x9e, 0x5f, 0x88, 0x09, 0xb2, 0x4f, 0xa1, 0x59, 0x86, 0x4c, 0x2e, 0x62,
	0xe4, 0x0f, 0x28, 0xde, 0x08, 0x71, 0xc2, 0xd8, 0x3e, 0xd4, 0x1d, 0x29, 0x08, 0xcf, 0xd7, 0x89,
	0x02, 0x22, 0xcf, 0xdf, 0x79, 0x84, 0xbd, 0x86, 0x36, 0xed, 0x2e, 0x92, 0x11, 0x46, 0x59, 0x31,
	0x19, 0xa0, 0xe6, 0x0f, 0xa9, 0xf7, 0xce, 0x62, 0xef, 0xe7, 0x99, 0x7d, 0x71, 0xf2, 0x4e, 0xa4,
	0x05, 0xf6, 0x5a, 0xae, 0x41, 0x97, 0x72, 0x41, 0x19, 0xec, 0x08, 0xb6, 0x82, 0xae, 0x13, 0x91,
	0x15, 0x43, 0x11, 0xdb, 0x42, 0xa3, 0xe6, 0x35, 0xda, 0x8e, 0xf9, 0xd0, 0x2f, 0x73, 0x11, 0xf6,
	0x0c, 0x1a, 0x65, 0x82, 0x4a, 0x30, 0xe5, 0x40, 0xcc, 0x7a, 0x60, 0x3a, 0x88, 0x5d, 0xc1, 0x13,
	0x69, 0xa2, 0x54, 0xc5, 0xc2, 0x4a, 0x95, 0x45, 0x06, 0xb5, 0x8b, 0x99, 0x08, 0x33, 0x31, 0x48,
	0x31, 0xe1, 0x75, 0xea, 0x72, 0x6f, 0xb1, 0xcb, 0x33, 0xa5, 0x52, 0xdf, 0xe4, 0x9e, 0x34, 0x6f,
	0x43, 0x76, 0x3f, 0x24, 0xbf, 0xf1, 0xb9, 0x0c, 0x61, 0xb7, 0x2a, 0xec, 0xcc, 0xa4, 0xb4, 0xfc,
	0x40, 0x2b, 0xde, 0x38, 0x58, 0x39, 0x6c, 0x9d, 0x74, 0x43, 0xd5, 0xca, 0x50, 0xd3, 0xe3, 0x6e,
	0x59, 0xeb, 0x74, 0x9e, 0xdf, 0xf5, 0x5b, 0xed, 0xa4, 0xcb, 0x82, 0xec, 0x0b, 0xd8, 0x70, 0x81,
	0x14, 0xa3, 0x54, 0x64, 0xa3, 0x42, 0x8c, 0x90, 0x37, 0xe9, 0x8f, 0xb6, 0x3c, 0xfc, 0x36, 0xa0,
	0xee, 0x2c, 0x03, 0x51, 0xe3, 0xc8, 0xb5, 0xd1, 0xf2, 0x67, 0xe9, 0xc1, 0x1e, 0x61, 0x73, 0x24,
	0x13, 0x6b, 0x99, 0x5b, 0xbe, 0x31, 0x4f, 0xea, 0x13, 0xc6, 0x4e, 0x60, 0x47, 0xe5, 0xa8, 0x85,
	0x95, 0xd9, 0x28, 0x32, 0x7f, 0x1a, 0x8b, 0x13, 0xef, 0x9e, 0x36, 0x91, 0xb7, 0xaa, 0x60, 0x9f,
	0x62, 0xe4, 0xa4, 0xdf, 0x80, 0xff, 0x2b, 0xa7, 0x74, 0xcc, 0x26, 0xa9, 0xfc, 0x68, 0x51, 0xe5,
	0x60, 0x9f, 0xde, 0xee, 0x42, 0xbd, 0xd2, 0x56, 0xbf, 0x43, 0x27, 0x53, 0xee, 0x62, 0x2c, 0x15,
	0x99, 0x91, 0xc8, 0x27, 0x4b, 0x44, 0xbe, 0x98, 0x4b, 0x5a, 0x26, 0xf4, 0x5e, 0xf6, 0x31, 0x02,
	0xeb, 0x43, 0x3b, 0x2f, 0xcc, 0x38, 0xc2, 0x6c, 0x2a, 0xb5, 0xca, 0x26, 0x98, 0x59, 0xbe, 0x45,
	0x1b, 0x1d, 0x2e, 0xd9, 0xe8, 0xd7, 0xc2, 0x8c, 0xdf, 0xcc, 0x98, 0xa1, 0xfc, 0x46, 0x7e, 0x1b,
	0x66, 0x4f, 0x01, 0xa8, 0xa8, 0x55, 0xd7, 0x98, 0xf1, 0x6d, 0xd2, 0xb0, 0xe6, 0x90, 0x4b, 0x07,
	0xb0, 0x6d, 0x58, 0xd3, 0x22, 0x91, 0x8a, 0xef, 0x50, 0xc4, 0x2f, 0x9c, 0xb9, 0x63, 0xa1, 0xb5,
	0x44, 0xed, 0xa5, 0xdf, 0xf5, 0xe6, 0x0e, 0x18, 0x49, 0xfe, 0x18, 0x6a, 0xee, 0xed, 0x16, 0x7d,
	0x50, 0x19, 0xf2, 0x47, 0xfe, 0xd2, 0x3b, 0xe0, 0x4a, 0x65, 0xc8, 0x5a, 0xb0, 0x2a, 0x73, 0xce,
	0x09, 0x5d, 0x95, 0x39, 0x3b, 0x87, 0x2d, 0x69, 0xa2, 0x18, 0xd3, 0xb4, 0x48, 0x85, 0xae, 0x2e,
	0xc0, 0xde, 0x5d, 0x17, 0x60, 0x53, 0x9a, 0x57, 0x21, 0xa9, 0x34, 0xfe, 0x29, 0x6c, 0x48, 0x13,
	0xdd, 0xc8, 0xa1, 0xac, 0xca, 0x74, 0xee, 0x2a, 0xd3, 0x94, 0xe6, 0xbd, 0x1c, 0xca, 0xb2, 0xc4,
	0x33, 0x68, 0x98, 0x58, 0x23, 0x66, 0xd1, 0x8d, 0x4c, 0xec, 0x98, 0x3f, 0x3e, 0x58, 0x39, 0x5c,
	0xeb, 0xd5, 0x3d, 0xf6, 0xde, 0x41, 0xce, 0xa9, 0x81, 0x32, 0x46, 0x39, 0x1a, 0x5b, 0xfe, 0x84,
	0x38, 0x21, 0xef, 0x27, 0xc2, 0xd8, 0x77, 0x50, 0x37, 0xc9, 0x75, 0x65, 0xb4, 0xa7, 0xff, 0x6d,
	0x34, 0x30, 0xc9, 0x75, 0x69, 0xae, 0x7d, 0x08, 0x2f, 0x0a, 0x2f, 0xef, 0x27, 0xfe, 0xa5, 0xe6,
	0x21, 0x52, 0xf7, 0x33, 0x68, 0x89, 0x64, 0x8a, 0xda, 0x4a, 0xe3, 0x2c, 0x2d, 0x13, 0xbe, 0x4f,
	0x9c, 0xe6, 0x1c, 0x7a, 0x9e, 0xb0, 0x9f, 0x61, 0x5b, 0x9a, 0x68, 0x90, 0x16, 0x68, 0x95, 0xb2,
	0xe3, 0x4a, 0x91, 0x83, 0xbb, 0x14, 0x61, 0xd2, 0x9c, 0x95, 0x59, 0xa5, 0x2c, 0x3f, 0x42, 0x4b,
	0x9a, 0xc8, 0xa2, 0xb1, 0x91, 0xef, 0x84, 0x3f, 0xbb, 0xab, 0x4c, 0x43, 0x9a, 0x4b, 0x34, 0xd6,
	0x8f, 0xa8, 0xe7, 0x7f, 0xdf, 0x87, 0xb5, 0x37, 0x6e, 0xda, 0xb2, 0x1f, 0xa0, 0xe1, 0xee, 0x4b,
	0x14, 0xfb, 0xa9, 0x45, 0x03, 0x6a, 0xf6, 0x3e, 0xa6, 0xe1, 0x37, 0x3d, 0xee, 0x3a, 0xf7, 0x87,
	0xb9, 0xd6, 0xab, 0x8b, 0xd9, 0x82, 0x3d, 0x81, 0xda, 0x6c, 0x28, 0xf8, 0x71, 0x35, 0x03, 0xc8,
	0x5c, 0x09, 0x8d, 0x27, 0x67, 0xae, 0x84, 0x31, 0xb8, 0x4f, 0x2a, 0xfa, 0xc9, 0x43, 0xcf, 0xec,
	0x5b, 0xef, 0x4e, 0x9a, 0xbd, 0x34, 0x76, 0x96, 0xfc, 0x8d, 0xcb, 0x92, 0xd0, 0x9b, 0x71, 0xd9,
	0x4b, 0xa8, 0x6b, 0x8c, 0x51, 0x4e, 0x31, 0x89, 0x84, 0xa5, 0x89, 0xe4, 0x1a, 0xf7, 0x9f, 0x0e,
	0xcb, 0x72, 0xa1, 0xa4, 0x9f, 0xda, 0x85, 0x01, 0xba, 0xfe, 0xbf, 0x07, 0xe8, 0xd7, 0xf0, 0x20,
	0x28, 0xee, 0x07, 0xd7, 0xd3, 0xee, 0xed, 0x4f, 0x97, 0xee, 0xad, 0x6f, 0x80, 0x5e, 0x20, 0xb3,
	0x3e, 0x6c, 0x9a, 0x78, 0x8c, 0x13, 0x31, 0x3f, 0xdd, 0x6b, 0x54, 0xe1, 0xf3, 0xc5, 0x0a, 0x74,
	0x2e, 0xdd, 0x3e, 0xd1, 0x67, 0x23, 0xbf, 0xd7, 0x36, 0x0b, 0x88, 0x3b, 0xba, 0x5c, 0xab, 0x18,
	0x8d, 0xf1, 0x0a, 0xc0, 0x9d, 0x0a, 0xd4, 0x2b, 0xfe, 0xa9, 0xed, 0x7c, 0x0f, 0xed, 0xc5, 0x4d,
	0xc2, 0x81, 0x39, 0x0f, 0xdc, 0xa3, 0x03, 0xe3, 0xb0, 0x5e, 0xde, 0x99, 0x55, 0x02, 0xcb, 0xe5,
	0x59, 0xfb, 0xaa, 0x55, 0x7e, 0xca, 0xbd, 0xa4, 0x87, 0xc1, 0x03, 0xda, 0xf0, 0xc5, 0x3f, 0x01,
	0x00, 0x00, 0xff, 0xff, 0x7d, 0xbb, 0xa7, 0xa2, 0xe3, 0x09, 0x00, 0x00,
}
