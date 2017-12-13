// Code generated by protoc-gen-go. DO NOT EDIT.
// source: geocoder/v1/geocoder.proto

/*
Package geocoder is a generated protocol buffer package.

It is generated from these files:
	geocoder/v1/geocoder.proto

It has these top-level messages:
	ReverseGeocodeRequest
	ReverseGeocodeResponse
*/
package geocoder

import proto "github.com/golang/protobuf/proto"
import fmt "fmt"
import math "math"

import (
	context "golang.org/x/net/context"
	grpc "google.golang.org/grpc"
)

// Reference imports to suppress errors if they are not otherwise used.
var _ = proto.Marshal
var _ = fmt.Errorf
var _ = math.Inf

// This is a compile-time assertion to ensure that this generated file
// is compatible with the proto package it is being compiled against.
// A compilation error at this line likely means your copy of the
// proto package needs to be updated.
const _ = proto.ProtoPackageIsVersion2 // please upgrade the proto package

type ReverseGeocodeRequest struct {
	Latitude  float64 `protobuf:"fixed64,1,opt,name=latitude" json:"latitude,omitempty"`
	Longitude float64 `protobuf:"fixed64,2,opt,name=longitude" json:"longitude,omitempty"`
	Accuracy  float64 `protobuf:"fixed64,3,opt,name=accuracy" json:"accuracy,omitempty"`
}

func (m *ReverseGeocodeRequest) Reset()                    { *m = ReverseGeocodeRequest{} }
func (m *ReverseGeocodeRequest) String() string            { return proto.CompactTextString(m) }
func (*ReverseGeocodeRequest) ProtoMessage()               {}
func (*ReverseGeocodeRequest) Descriptor() ([]byte, []int) { return fileDescriptor0, []int{0} }

func (m *ReverseGeocodeRequest) GetLatitude() float64 {
	if m != nil {
		return m.Latitude
	}
	return 0
}

func (m *ReverseGeocodeRequest) GetLongitude() float64 {
	if m != nil {
		return m.Longitude
	}
	return 0
}

func (m *ReverseGeocodeRequest) GetAccuracy() float64 {
	if m != nil {
		return m.Accuracy
	}
	return 0
}

type ReverseGeocodeResponse struct {
	Country string `protobuf:"bytes,1,opt,name=country" json:"country,omitempty"`
	State   string `protobuf:"bytes,2,opt,name=state" json:"state,omitempty"`
	City    string `protobuf:"bytes,3,opt,name=city" json:"city,omitempty"`
}

func (m *ReverseGeocodeResponse) Reset()                    { *m = ReverseGeocodeResponse{} }
func (m *ReverseGeocodeResponse) String() string            { return proto.CompactTextString(m) }
func (*ReverseGeocodeResponse) ProtoMessage()               {}
func (*ReverseGeocodeResponse) Descriptor() ([]byte, []int) { return fileDescriptor0, []int{1} }

func (m *ReverseGeocodeResponse) GetCountry() string {
	if m != nil {
		return m.Country
	}
	return ""
}

func (m *ReverseGeocodeResponse) GetState() string {
	if m != nil {
		return m.State
	}
	return ""
}

func (m *ReverseGeocodeResponse) GetCity() string {
	if m != nil {
		return m.City
	}
	return ""
}

func init() {
	proto.RegisterType((*ReverseGeocodeRequest)(nil), "rover.geocoder.v1.ReverseGeocodeRequest")
	proto.RegisterType((*ReverseGeocodeResponse)(nil), "rover.geocoder.v1.ReverseGeocodeResponse")
}

// Reference imports to suppress errors if they are not otherwise used.
var _ context.Context
var _ grpc.ClientConn

// This is a compile-time assertion to ensure that this generated file
// is compatible with the grpc package it is being compiled against.
const _ = grpc.SupportPackageIsVersion4

// Client API for Geocoder service

type GeocoderClient interface {
	ReverseGeocode(ctx context.Context, in *ReverseGeocodeRequest, opts ...grpc.CallOption) (*ReverseGeocodeResponse, error)
}

type geocoderClient struct {
	cc *grpc.ClientConn
}

func NewGeocoderClient(cc *grpc.ClientConn) GeocoderClient {
	return &geocoderClient{cc}
}

func (c *geocoderClient) ReverseGeocode(ctx context.Context, in *ReverseGeocodeRequest, opts ...grpc.CallOption) (*ReverseGeocodeResponse, error) {
	out := new(ReverseGeocodeResponse)
	err := grpc.Invoke(ctx, "/rover.geocoder.v1.Geocoder/ReverseGeocode", in, out, c.cc, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

// Server API for Geocoder service

type GeocoderServer interface {
	ReverseGeocode(context.Context, *ReverseGeocodeRequest) (*ReverseGeocodeResponse, error)
}

func RegisterGeocoderServer(s *grpc.Server, srv GeocoderServer) {
	s.RegisterService(&_Geocoder_serviceDesc, srv)
}

func _Geocoder_ReverseGeocode_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(ReverseGeocodeRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(GeocoderServer).ReverseGeocode(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/rover.geocoder.v1.Geocoder/ReverseGeocode",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(GeocoderServer).ReverseGeocode(ctx, req.(*ReverseGeocodeRequest))
	}
	return interceptor(ctx, in, info, handler)
}

var _Geocoder_serviceDesc = grpc.ServiceDesc{
	ServiceName: "rover.geocoder.v1.Geocoder",
	HandlerType: (*GeocoderServer)(nil),
	Methods: []grpc.MethodDesc{
		{
			MethodName: "ReverseGeocode",
			Handler:    _Geocoder_ReverseGeocode_Handler,
		},
	},
	Streams:  []grpc.StreamDesc{},
	Metadata: "geocoder/v1/geocoder.proto",
}

func init() { proto.RegisterFile("geocoder/v1/geocoder.proto", fileDescriptor0) }

var fileDescriptor0 = []byte{
	// 226 bytes of a gzipped FileDescriptorProto
	0x1f, 0x8b, 0x08, 0x00, 0x00, 0x09, 0x6e, 0x88, 0x02, 0xff, 0x8c, 0x90, 0xbd, 0x4f, 0xc3, 0x30,
	0x10, 0xc5, 0x15, 0x3e, 0xeb, 0x1b, 0x90, 0x38, 0x95, 0x2a, 0x8a, 0x18, 0x50, 0xa7, 0xb2, 0xa4,
	0x2a, 0x8c, 0x6c, 0x2c, 0xec, 0x1e, 0x11, 0x8b, 0x71, 0x4f, 0x55, 0xa5, 0x92, 0x6b, 0xec, 0x73,
	0xa4, 0xfc, 0xf7, 0x04, 0x1b, 0x87, 0xcf, 0xa1, 0xdb, 0x7b, 0xef, 0x7c, 0xfe, 0xdd, 0x1d, 0x54,
	0x1b, 0x62, 0xcb, 0x6b, 0x72, 0xcb, 0x6e, 0xb5, 0xcc, 0xba, 0xde, 0x3b, 0x16, 0xc6, 0x4b, 0xc7,
	0xdd, 0x60, 0xc6, 0xb4, 0x5b, 0xcd, 0xdf, 0xe0, 0x4a, 0xd3, 0x10, 0x7a, 0x7a, 0x4a, 0xa9, 0xa6,
	0x36, 0x90, 0x17, 0xac, 0x60, 0xb2, 0x33, 0xb2, 0x95, 0xb0, 0xa6, 0xb2, 0xb8, 0x29, 0x16, 0x85,
	0x1e, 0x3d, 0x5e, 0x83, 0xda, 0x71, 0xb3, 0x49, 0xc5, 0xa3, 0x58, 0xfc, 0x0a, 0x3e, 0x3a, 0x8d,
	0xb5, 0xc1, 0x19, 0xdb, 0x97, 0xc7, 0xa9, 0x33, 0xfb, 0xf9, 0x0b, 0xcc, 0x7e, 0xe3, 0xfc, 0x9e,
	0x1b, 0x4f, 0x58, 0xc2, 0xb9, 0xe5, 0xd0, 0x88, 0xeb, 0x23, 0x4e, 0xe9, 0x6c, 0x71, 0x0a, 0xa7,
	0x5e, 0x8c, 0x24, 0x92, 0xd2, 0xc9, 0x20, 0xc2, 0x89, 0xdd, 0x4a, 0x22, 0x28, 0x1d, 0xf5, 0x5d,
	0x0b, 0x93, 0xcf, 0x6f, 0x1d, 0x12, 0x5c, 0xfc, 0x24, 0xe1, 0xa2, 0xfe, 0xb3, 0x7e, 0xfd, 0xef,
	0xee, 0xd5, 0xed, 0x01, 0x2f, 0xd3, 0xd8, 0x8f, 0xb3, 0xe7, 0xe9, 0xb7, 0x83, 0x3f, 0x64, 0xfd,
	0x7a, 0x16, 0x2f, 0x7e, 0xff, 0x1e, 0x00, 0x00, 0xff, 0xff, 0x5d, 0x6b, 0x34, 0xa5, 0x8f, 0x01,
	0x00, 0x00,
}