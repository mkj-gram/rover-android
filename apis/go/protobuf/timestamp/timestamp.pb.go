// Code generated by protoc-gen-go. DO NOT EDIT.
// source: protobuf/timestamp.proto

/*
Package timestamp is a generated protocol buffer package.

It is generated from these files:
	protobuf/timestamp.proto

It has these top-level messages:
	Timestamp
*/
package timestamp

import proto "github.com/golang/protobuf/proto"
import fmt "fmt"
import math "math"

// Reference imports to suppress errors if they are not otherwise used.
var _ = proto.Marshal
var _ = fmt.Errorf
var _ = math.Inf

// This is a compile-time assertion to ensure that this generated file
// is compatible with the proto package it is being compiled against.
// A compilation error at this line likely means your copy of the
// proto package needs to be updated.
const _ = proto.ProtoPackageIsVersion2 // please upgrade the proto package

type Timestamp struct {
	// Represents seconds of UTC time since Unix epoch
	// 1970-01-01T00:00:00Z. Must be from 0001-01-01T00:00:00Z to
	// 9999-12-31T23:59:59Z inclusive.
	Seconds int64 `protobuf:"varint,1,opt,name=seconds" json:"seconds,omitempty"`
	// Non-negative fractions of a second at nanosecond resolution. Negative
	// second values with fractions must still have non-negative nanos values
	// that count forward in time. Must be from 0 to 999,999,999
	// inclusive.
	Nanos int32 `protobuf:"varint,2,opt,name=nanos" json:"nanos,omitempty"`
	// Represents the utc offset in number of seconds east of UTC
	UtcOffset int64 `protobuf:"varint,3,opt,name=utc_offset,json=utcOffset" json:"utc_offset,omitempty"`
}

func (m *Timestamp) Reset()                    { *m = Timestamp{} }
func (m *Timestamp) String() string            { return proto.CompactTextString(m) }
func (*Timestamp) ProtoMessage()               {}
func (*Timestamp) Descriptor() ([]byte, []int) { return fileDescriptor0, []int{0} }

func (m *Timestamp) GetSeconds() int64 {
	if m != nil {
		return m.Seconds
	}
	return 0
}

func (m *Timestamp) GetNanos() int32 {
	if m != nil {
		return m.Nanos
	}
	return 0
}

func (m *Timestamp) GetUtcOffset() int64 {
	if m != nil {
		return m.UtcOffset
	}
	return 0
}

func init() {
	proto.RegisterType((*Timestamp)(nil), "rover.protobuf.Timestamp")
}

func init() { proto.RegisterFile("protobuf/timestamp.proto", fileDescriptor0) }

var fileDescriptor0 = []byte{
	// 138 bytes of a gzipped FileDescriptorProto
	0x1f, 0x8b, 0x08, 0x00, 0x00, 0x09, 0x6e, 0x88, 0x02, 0xff, 0xe2, 0x92, 0x28, 0x28, 0xca, 0x2f,
	0xc9, 0x4f, 0x2a, 0x4d, 0xd3, 0x2f, 0xc9, 0xcc, 0x4d, 0x2d, 0x2e, 0x49, 0xcc, 0x2d, 0xd0, 0x03,
	0x0b, 0x09, 0xf1, 0x15, 0xe5, 0x97, 0xa5, 0x16, 0xe9, 0xc1, 0xe4, 0x95, 0xa2, 0xb8, 0x38, 0x43,
	0x60, 0x4a, 0x84, 0x24, 0xb8, 0xd8, 0x8b, 0x53, 0x93, 0xf3, 0xf3, 0x52, 0x8a, 0x25, 0x18, 0x15,
	0x18, 0x35, 0x98, 0x83, 0x60, 0x5c, 0x21, 0x11, 0x2e, 0xd6, 0xbc, 0xc4, 0xbc, 0xfc, 0x62, 0x09,
	0x26, 0xa0, 0x38, 0x6b, 0x10, 0x84, 0x23, 0x24, 0xcb, 0xc5, 0x55, 0x5a, 0x92, 0x1c, 0x9f, 0x9f,
	0x96, 0x56, 0x9c, 0x5a, 0x22, 0xc1, 0x0c, 0xd6, 0xc2, 0x09, 0x14, 0xf1, 0x07, 0x0b, 0x38, 0xc9,
	0x45, 0xc9, 0x60, 0xba, 0xc3, 0x1a, 0xce, 0x4a, 0x62, 0x03, 0xcb, 0x1a, 0x03, 0x02, 0x00, 0x00,
	0xff, 0xff, 0x60, 0xf8, 0xe1, 0x61, 0xae, 0x00, 0x00, 0x00,
}
