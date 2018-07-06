// Code generated by protoc-gen-go. DO NOT EDIT.
// source: analytics/analytics.proto

/*
Package analytics is a generated protocol buffer package.

It is generated from these files:
	analytics/analytics.proto

It has these top-level messages:
	Cursor
	PageInfo
	GetNotificationOpenedReportRequest
	GetNotificationOpenedReportResponse
	GetNotificationOpenedByDateReportRequest
	GetNotificationOpenedByDateReportResponse
	GetNotificationSentReportRequest
	GetNotificationSentReportResponse
*/
package analytics

import proto "github.com/golang/protobuf/proto"
import fmt "fmt"
import math "math"
import rover_auth_v1 "github.com/roverplatform/rover/apis/go/auth/v1"

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

// TODO make this a global protobuf type
type Cursor struct {
	// Types that are valid to be assigned to Start:
	//	*Cursor_Before
	//	*Cursor_After
	Start isCursor_Start `protobuf_oneof:"start"`
	// Types that are valid to be assigned to Take:
	//	*Cursor_First
	//	*Cursor_Last
	Take isCursor_Take `protobuf_oneof:"take"`
}

func (m *Cursor) Reset()                    { *m = Cursor{} }
func (m *Cursor) String() string            { return proto.CompactTextString(m) }
func (*Cursor) ProtoMessage()               {}
func (*Cursor) Descriptor() ([]byte, []int) { return fileDescriptor0, []int{0} }

type isCursor_Start interface{ isCursor_Start() }
type isCursor_Take interface{ isCursor_Take() }

type Cursor_Before struct {
	Before string `protobuf:"bytes,1,opt,name=before,oneof"`
}
type Cursor_After struct {
	After string `protobuf:"bytes,2,opt,name=after,oneof"`
}
type Cursor_First struct {
	First int32 `protobuf:"varint,3,opt,name=first,oneof"`
}
type Cursor_Last struct {
	Last int32 `protobuf:"varint,4,opt,name=last,oneof"`
}

func (*Cursor_Before) isCursor_Start() {}
func (*Cursor_After) isCursor_Start()  {}
func (*Cursor_First) isCursor_Take()   {}
func (*Cursor_Last) isCursor_Take()    {}

func (m *Cursor) GetStart() isCursor_Start {
	if m != nil {
		return m.Start
	}
	return nil
}
func (m *Cursor) GetTake() isCursor_Take {
	if m != nil {
		return m.Take
	}
	return nil
}

func (m *Cursor) GetBefore() string {
	if x, ok := m.GetStart().(*Cursor_Before); ok {
		return x.Before
	}
	return ""
}

func (m *Cursor) GetAfter() string {
	if x, ok := m.GetStart().(*Cursor_After); ok {
		return x.After
	}
	return ""
}

func (m *Cursor) GetFirst() int32 {
	if x, ok := m.GetTake().(*Cursor_First); ok {
		return x.First
	}
	return 0
}

func (m *Cursor) GetLast() int32 {
	if x, ok := m.GetTake().(*Cursor_Last); ok {
		return x.Last
	}
	return 0
}

// XXX_OneofFuncs is for the internal use of the proto package.
func (*Cursor) XXX_OneofFuncs() (func(msg proto.Message, b *proto.Buffer) error, func(msg proto.Message, tag, wire int, b *proto.Buffer) (bool, error), func(msg proto.Message) (n int), []interface{}) {
	return _Cursor_OneofMarshaler, _Cursor_OneofUnmarshaler, _Cursor_OneofSizer, []interface{}{
		(*Cursor_Before)(nil),
		(*Cursor_After)(nil),
		(*Cursor_First)(nil),
		(*Cursor_Last)(nil),
	}
}

func _Cursor_OneofMarshaler(msg proto.Message, b *proto.Buffer) error {
	m := msg.(*Cursor)
	// start
	switch x := m.Start.(type) {
	case *Cursor_Before:
		b.EncodeVarint(1<<3 | proto.WireBytes)
		b.EncodeStringBytes(x.Before)
	case *Cursor_After:
		b.EncodeVarint(2<<3 | proto.WireBytes)
		b.EncodeStringBytes(x.After)
	case nil:
	default:
		return fmt.Errorf("Cursor.Start has unexpected type %T", x)
	}
	// take
	switch x := m.Take.(type) {
	case *Cursor_First:
		b.EncodeVarint(3<<3 | proto.WireVarint)
		b.EncodeVarint(uint64(x.First))
	case *Cursor_Last:
		b.EncodeVarint(4<<3 | proto.WireVarint)
		b.EncodeVarint(uint64(x.Last))
	case nil:
	default:
		return fmt.Errorf("Cursor.Take has unexpected type %T", x)
	}
	return nil
}

func _Cursor_OneofUnmarshaler(msg proto.Message, tag, wire int, b *proto.Buffer) (bool, error) {
	m := msg.(*Cursor)
	switch tag {
	case 1: // start.before
		if wire != proto.WireBytes {
			return true, proto.ErrInternalBadWireType
		}
		x, err := b.DecodeStringBytes()
		m.Start = &Cursor_Before{x}
		return true, err
	case 2: // start.after
		if wire != proto.WireBytes {
			return true, proto.ErrInternalBadWireType
		}
		x, err := b.DecodeStringBytes()
		m.Start = &Cursor_After{x}
		return true, err
	case 3: // take.first
		if wire != proto.WireVarint {
			return true, proto.ErrInternalBadWireType
		}
		x, err := b.DecodeVarint()
		m.Take = &Cursor_First{int32(x)}
		return true, err
	case 4: // take.last
		if wire != proto.WireVarint {
			return true, proto.ErrInternalBadWireType
		}
		x, err := b.DecodeVarint()
		m.Take = &Cursor_Last{int32(x)}
		return true, err
	default:
		return false, nil
	}
}

func _Cursor_OneofSizer(msg proto.Message) (n int) {
	m := msg.(*Cursor)
	// start
	switch x := m.Start.(type) {
	case *Cursor_Before:
		n += proto.SizeVarint(1<<3 | proto.WireBytes)
		n += proto.SizeVarint(uint64(len(x.Before)))
		n += len(x.Before)
	case *Cursor_After:
		n += proto.SizeVarint(2<<3 | proto.WireBytes)
		n += proto.SizeVarint(uint64(len(x.After)))
		n += len(x.After)
	case nil:
	default:
		panic(fmt.Sprintf("proto: unexpected type %T in oneof", x))
	}
	// take
	switch x := m.Take.(type) {
	case *Cursor_First:
		n += proto.SizeVarint(3<<3 | proto.WireVarint)
		n += proto.SizeVarint(uint64(x.First))
	case *Cursor_Last:
		n += proto.SizeVarint(4<<3 | proto.WireVarint)
		n += proto.SizeVarint(uint64(x.Last))
	case nil:
	default:
		panic(fmt.Sprintf("proto: unexpected type %T in oneof", x))
	}
	return n
}

// TODO make this a global protobuf type
type PageInfo struct {
	HasPreviousPage bool `protobuf:"varint,1,opt,name=has_previous_page,json=hasPreviousPage" json:"has_previous_page,omitempty"`
	HasNextPage     bool `protobuf:"varint,2,opt,name=has_next_page,json=hasNextPage" json:"has_next_page,omitempty"`
}

func (m *PageInfo) Reset()                    { *m = PageInfo{} }
func (m *PageInfo) String() string            { return proto.CompactTextString(m) }
func (*PageInfo) ProtoMessage()               {}
func (*PageInfo) Descriptor() ([]byte, []int) { return fileDescriptor0, []int{1} }

func (m *PageInfo) GetHasPreviousPage() bool {
	if m != nil {
		return m.HasPreviousPage
	}
	return false
}

func (m *PageInfo) GetHasNextPage() bool {
	if m != nil {
		return m.HasNextPage
	}
	return false
}

type GetNotificationOpenedReportRequest struct {
	AuthContext *rover_auth_v1.AuthContext `protobuf:"bytes,1,opt,name=auth_context,json=authContext" json:"auth_context,omitempty"`
	CampaignId  int32                      `protobuf:"varint,2,opt,name=campaign_id,json=campaignId" json:"campaign_id,omitempty"`
}

func (m *GetNotificationOpenedReportRequest) Reset()         { *m = GetNotificationOpenedReportRequest{} }
func (m *GetNotificationOpenedReportRequest) String() string { return proto.CompactTextString(m) }
func (*GetNotificationOpenedReportRequest) ProtoMessage()    {}
func (*GetNotificationOpenedReportRequest) Descriptor() ([]byte, []int) {
	return fileDescriptor0, []int{2}
}

func (m *GetNotificationOpenedReportRequest) GetAuthContext() *rover_auth_v1.AuthContext {
	if m != nil {
		return m.AuthContext
	}
	return nil
}

func (m *GetNotificationOpenedReportRequest) GetCampaignId() int32 {
	if m != nil {
		return m.CampaignId
	}
	return 0
}

type GetNotificationOpenedReportResponse struct {
	// Total opens regardless of source
	Total int32 `protobuf:"varint,1,opt,name=total" json:"total,omitempty"`
	// Total unique opens regardless of source
	Unique int32 `protobuf:"varint,2,opt,name=unique" json:"unique,omitempty"`
	// Breakdown
	NotificationCenterTotal  int32 `protobuf:"varint,3,opt,name=notification_center_total,json=notificationCenterTotal" json:"notification_center_total,omitempty"`
	NotificationCenterUnique int32 `protobuf:"varint,4,opt,name=notification_center_unique,json=notificationCenterUnique" json:"notification_center_unique,omitempty"`
	PushDirectTotal          int32 `protobuf:"varint,5,opt,name=push_direct_total,json=pushDirectTotal" json:"push_direct_total,omitempty"`
	PushDirectUnique         int32 `protobuf:"varint,6,opt,name=push_direct_unique,json=pushDirectUnique" json:"push_direct_unique,omitempty"`
	PushInfluencedTotal      int32 `protobuf:"varint,7,opt,name=push_influenced_total,json=pushInfluencedTotal" json:"push_influenced_total,omitempty"`
	PushInfluencedUnique     int32 `protobuf:"varint,8,opt,name=push_influenced_unique,json=pushInfluencedUnique" json:"push_influenced_unique,omitempty"`
}

func (m *GetNotificationOpenedReportResponse) Reset()         { *m = GetNotificationOpenedReportResponse{} }
func (m *GetNotificationOpenedReportResponse) String() string { return proto.CompactTextString(m) }
func (*GetNotificationOpenedReportResponse) ProtoMessage()    {}
func (*GetNotificationOpenedReportResponse) Descriptor() ([]byte, []int) {
	return fileDescriptor0, []int{3}
}

func (m *GetNotificationOpenedReportResponse) GetTotal() int32 {
	if m != nil {
		return m.Total
	}
	return 0
}

func (m *GetNotificationOpenedReportResponse) GetUnique() int32 {
	if m != nil {
		return m.Unique
	}
	return 0
}

func (m *GetNotificationOpenedReportResponse) GetNotificationCenterTotal() int32 {
	if m != nil {
		return m.NotificationCenterTotal
	}
	return 0
}

func (m *GetNotificationOpenedReportResponse) GetNotificationCenterUnique() int32 {
	if m != nil {
		return m.NotificationCenterUnique
	}
	return 0
}

func (m *GetNotificationOpenedReportResponse) GetPushDirectTotal() int32 {
	if m != nil {
		return m.PushDirectTotal
	}
	return 0
}

func (m *GetNotificationOpenedReportResponse) GetPushDirectUnique() int32 {
	if m != nil {
		return m.PushDirectUnique
	}
	return 0
}

func (m *GetNotificationOpenedReportResponse) GetPushInfluencedTotal() int32 {
	if m != nil {
		return m.PushInfluencedTotal
	}
	return 0
}

func (m *GetNotificationOpenedReportResponse) GetPushInfluencedUnique() int32 {
	if m != nil {
		return m.PushInfluencedUnique
	}
	return 0
}

type GetNotificationOpenedByDateReportRequest struct {
	AuthContext *rover_auth_v1.AuthContext `protobuf:"bytes,1,opt,name=auth_context,json=authContext" json:"auth_context,omitempty"`
	CampaignId  int32                      `protobuf:"varint,2,opt,name=campaign_id,json=campaignId" json:"campaign_id,omitempty"`
	Cursor      *Cursor                    `protobuf:"bytes,3,opt,name=cursor" json:"cursor,omitempty"`
	TimeZone    string                     `protobuf:"bytes,4,opt,name=time_zone,json=timeZone" json:"time_zone,omitempty"`
}

func (m *GetNotificationOpenedByDateReportRequest) Reset() {
	*m = GetNotificationOpenedByDateReportRequest{}
}
func (m *GetNotificationOpenedByDateReportRequest) String() string { return proto.CompactTextString(m) }
func (*GetNotificationOpenedByDateReportRequest) ProtoMessage()    {}
func (*GetNotificationOpenedByDateReportRequest) Descriptor() ([]byte, []int) {
	return fileDescriptor0, []int{4}
}

func (m *GetNotificationOpenedByDateReportRequest) GetAuthContext() *rover_auth_v1.AuthContext {
	if m != nil {
		return m.AuthContext
	}
	return nil
}

func (m *GetNotificationOpenedByDateReportRequest) GetCampaignId() int32 {
	if m != nil {
		return m.CampaignId
	}
	return 0
}

func (m *GetNotificationOpenedByDateReportRequest) GetCursor() *Cursor {
	if m != nil {
		return m.Cursor
	}
	return nil
}

func (m *GetNotificationOpenedByDateReportRequest) GetTimeZone() string {
	if m != nil {
		return m.TimeZone
	}
	return ""
}

type GetNotificationOpenedByDateReportResponse struct {
	Reports  []*GetNotificationOpenedByDateReportResponse_DateReport `protobuf:"bytes,1,rep,name=reports" json:"reports,omitempty"`
	PageInfo *PageInfo                                               `protobuf:"bytes,2,opt,name=page_info,json=pageInfo" json:"page_info,omitempty"`
}

func (m *GetNotificationOpenedByDateReportResponse) Reset() {
	*m = GetNotificationOpenedByDateReportResponse{}
}
func (m *GetNotificationOpenedByDateReportResponse) String() string { return proto.CompactTextString(m) }
func (*GetNotificationOpenedByDateReportResponse) ProtoMessage()    {}
func (*GetNotificationOpenedByDateReportResponse) Descriptor() ([]byte, []int) {
	return fileDescriptor0, []int{5}
}

func (m *GetNotificationOpenedByDateReportResponse) GetReports() []*GetNotificationOpenedByDateReportResponse_DateReport {
	if m != nil {
		return m.Reports
	}
	return nil
}

func (m *GetNotificationOpenedByDateReportResponse) GetPageInfo() *PageInfo {
	if m != nil {
		return m.PageInfo
	}
	return nil
}

type GetNotificationOpenedByDateReportResponse_DateReport struct {
	Id                 string `protobuf:"bytes,1,opt,name=id" json:"id,omitempty"`
	NotificationCenter int32  `protobuf:"varint,2,opt,name=notification_center,json=notificationCenter" json:"notification_center,omitempty"`
	PushDirect         int32  `protobuf:"varint,3,opt,name=push_direct,json=pushDirect" json:"push_direct,omitempty"`
	PushInfluence      int32  `protobuf:"varint,4,opt,name=push_influence,json=pushInfluence" json:"push_influence,omitempty"`
	Cursor             string `protobuf:"bytes,5,opt,name=cursor" json:"cursor,omitempty"`
}

func (m *GetNotificationOpenedByDateReportResponse_DateReport) Reset() {
	*m = GetNotificationOpenedByDateReportResponse_DateReport{}
}
func (m *GetNotificationOpenedByDateReportResponse_DateReport) String() string {
	return proto.CompactTextString(m)
}
func (*GetNotificationOpenedByDateReportResponse_DateReport) ProtoMessage() {}
func (*GetNotificationOpenedByDateReportResponse_DateReport) Descriptor() ([]byte, []int) {
	return fileDescriptor0, []int{5, 0}
}

func (m *GetNotificationOpenedByDateReportResponse_DateReport) GetId() string {
	if m != nil {
		return m.Id
	}
	return ""
}

func (m *GetNotificationOpenedByDateReportResponse_DateReport) GetNotificationCenter() int32 {
	if m != nil {
		return m.NotificationCenter
	}
	return 0
}

func (m *GetNotificationOpenedByDateReportResponse_DateReport) GetPushDirect() int32 {
	if m != nil {
		return m.PushDirect
	}
	return 0
}

func (m *GetNotificationOpenedByDateReportResponse_DateReport) GetPushInfluence() int32 {
	if m != nil {
		return m.PushInfluence
	}
	return 0
}

func (m *GetNotificationOpenedByDateReportResponse_DateReport) GetCursor() string {
	if m != nil {
		return m.Cursor
	}
	return ""
}

type GetNotificationSentReportRequest struct {
	AuthContext *rover_auth_v1.AuthContext `protobuf:"bytes,1,opt,name=auth_context,json=authContext" json:"auth_context,omitempty"`
	CampaignId  int32                      `protobuf:"varint,2,opt,name=campaign_id,json=campaignId" json:"campaign_id,omitempty"`
}

func (m *GetNotificationSentReportRequest) Reset()         { *m = GetNotificationSentReportRequest{} }
func (m *GetNotificationSentReportRequest) String() string { return proto.CompactTextString(m) }
func (*GetNotificationSentReportRequest) ProtoMessage()    {}
func (*GetNotificationSentReportRequest) Descriptor() ([]byte, []int) {
	return fileDescriptor0, []int{6}
}

func (m *GetNotificationSentReportRequest) GetAuthContext() *rover_auth_v1.AuthContext {
	if m != nil {
		return m.AuthContext
	}
	return nil
}

func (m *GetNotificationSentReportRequest) GetCampaignId() int32 {
	if m != nil {
		return m.CampaignId
	}
	return 0
}

type GetNotificationSentReportResponse struct {
	// Total delivered regardless of channel
	TotalDelivered int32 `protobuf:"varint,1,opt,name=total_delivered,json=totalDelivered" json:"total_delivered,omitempty"`
	// Total unique regardless of channel
	UniqueDelivered               int32 `protobuf:"varint,2,opt,name=unique_delivered,json=uniqueDelivered" json:"unique_delivered,omitempty"`
	NotificationCenterAttempted   int32 `protobuf:"varint,3,opt,name=notification_center_attempted,json=notificationCenterAttempted" json:"notification_center_attempted,omitempty"`
	NotificationCenterDelivered   int32 `protobuf:"varint,4,opt,name=notification_center_delivered,json=notificationCenterDelivered" json:"notification_center_delivered,omitempty"`
	NotificationCenterUnreachable int32 `protobuf:"varint,5,opt,name=notification_center_unreachable,json=notificationCenterUnreachable" json:"notification_center_unreachable,omitempty"`
	NotificationCenterInvalid     int32 `protobuf:"varint,6,opt,name=notification_center_invalid,json=notificationCenterInvalid" json:"notification_center_invalid,omitempty"`
	PushAttempted                 int32 `protobuf:"varint,7,opt,name=push_attempted,json=pushAttempted" json:"push_attempted,omitempty"`
	PushDelivered                 int32 `protobuf:"varint,8,opt,name=push_delivered,json=pushDelivered" json:"push_delivered,omitempty"`
	PushUnreachable               int32 `protobuf:"varint,9,opt,name=push_unreachable,json=pushUnreachable" json:"push_unreachable,omitempty"`
	PushInvalid                   int32 `protobuf:"varint,10,opt,name=push_invalid,json=pushInvalid" json:"push_invalid,omitempty"`
}

func (m *GetNotificationSentReportResponse) Reset()         { *m = GetNotificationSentReportResponse{} }
func (m *GetNotificationSentReportResponse) String() string { return proto.CompactTextString(m) }
func (*GetNotificationSentReportResponse) ProtoMessage()    {}
func (*GetNotificationSentReportResponse) Descriptor() ([]byte, []int) {
	return fileDescriptor0, []int{7}
}

func (m *GetNotificationSentReportResponse) GetTotalDelivered() int32 {
	if m != nil {
		return m.TotalDelivered
	}
	return 0
}

func (m *GetNotificationSentReportResponse) GetUniqueDelivered() int32 {
	if m != nil {
		return m.UniqueDelivered
	}
	return 0
}

func (m *GetNotificationSentReportResponse) GetNotificationCenterAttempted() int32 {
	if m != nil {
		return m.NotificationCenterAttempted
	}
	return 0
}

func (m *GetNotificationSentReportResponse) GetNotificationCenterDelivered() int32 {
	if m != nil {
		return m.NotificationCenterDelivered
	}
	return 0
}

func (m *GetNotificationSentReportResponse) GetNotificationCenterUnreachable() int32 {
	if m != nil {
		return m.NotificationCenterUnreachable
	}
	return 0
}

func (m *GetNotificationSentReportResponse) GetNotificationCenterInvalid() int32 {
	if m != nil {
		return m.NotificationCenterInvalid
	}
	return 0
}

func (m *GetNotificationSentReportResponse) GetPushAttempted() int32 {
	if m != nil {
		return m.PushAttempted
	}
	return 0
}

func (m *GetNotificationSentReportResponse) GetPushDelivered() int32 {
	if m != nil {
		return m.PushDelivered
	}
	return 0
}

func (m *GetNotificationSentReportResponse) GetPushUnreachable() int32 {
	if m != nil {
		return m.PushUnreachable
	}
	return 0
}

func (m *GetNotificationSentReportResponse) GetPushInvalid() int32 {
	if m != nil {
		return m.PushInvalid
	}
	return 0
}

func init() {
	proto.RegisterType((*Cursor)(nil), "rover.analytics.Cursor")
	proto.RegisterType((*PageInfo)(nil), "rover.analytics.PageInfo")
	proto.RegisterType((*GetNotificationOpenedReportRequest)(nil), "rover.analytics.GetNotificationOpenedReportRequest")
	proto.RegisterType((*GetNotificationOpenedReportResponse)(nil), "rover.analytics.GetNotificationOpenedReportResponse")
	proto.RegisterType((*GetNotificationOpenedByDateReportRequest)(nil), "rover.analytics.GetNotificationOpenedByDateReportRequest")
	proto.RegisterType((*GetNotificationOpenedByDateReportResponse)(nil), "rover.analytics.GetNotificationOpenedByDateReportResponse")
	proto.RegisterType((*GetNotificationOpenedByDateReportResponse_DateReport)(nil), "rover.analytics.GetNotificationOpenedByDateReportResponse.DateReport")
	proto.RegisterType((*GetNotificationSentReportRequest)(nil), "rover.analytics.GetNotificationSentReportRequest")
	proto.RegisterType((*GetNotificationSentReportResponse)(nil), "rover.analytics.GetNotificationSentReportResponse")
}

// Reference imports to suppress errors if they are not otherwise used.
var _ context.Context
var _ grpc.ClientConn

// This is a compile-time assertion to ensure that this generated file
// is compatible with the grpc package it is being compiled against.
const _ = grpc.SupportPackageIsVersion4

// Client API for Analytics service

type AnalyticsClient interface {
	// Notification Open Reports
	GetNotificationOpenedReport(ctx context.Context, in *GetNotificationOpenedReportRequest, opts ...grpc.CallOption) (*GetNotificationOpenedReportResponse, error)
	GetNotificationOpenedByDateReport(ctx context.Context, in *GetNotificationOpenedByDateReportRequest, opts ...grpc.CallOption) (*GetNotificationOpenedByDateReportResponse, error)
	// Notification Sent Reports
	GetNotificationSentReport(ctx context.Context, in *GetNotificationSentReportRequest, opts ...grpc.CallOption) (*GetNotificationSentReportResponse, error)
}

type analyticsClient struct {
	cc *grpc.ClientConn
}

func NewAnalyticsClient(cc *grpc.ClientConn) AnalyticsClient {
	return &analyticsClient{cc}
}

func (c *analyticsClient) GetNotificationOpenedReport(ctx context.Context, in *GetNotificationOpenedReportRequest, opts ...grpc.CallOption) (*GetNotificationOpenedReportResponse, error) {
	out := new(GetNotificationOpenedReportResponse)
	err := grpc.Invoke(ctx, "/rover.analytics.Analytics/GetNotificationOpenedReport", in, out, c.cc, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *analyticsClient) GetNotificationOpenedByDateReport(ctx context.Context, in *GetNotificationOpenedByDateReportRequest, opts ...grpc.CallOption) (*GetNotificationOpenedByDateReportResponse, error) {
	out := new(GetNotificationOpenedByDateReportResponse)
	err := grpc.Invoke(ctx, "/rover.analytics.Analytics/GetNotificationOpenedByDateReport", in, out, c.cc, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *analyticsClient) GetNotificationSentReport(ctx context.Context, in *GetNotificationSentReportRequest, opts ...grpc.CallOption) (*GetNotificationSentReportResponse, error) {
	out := new(GetNotificationSentReportResponse)
	err := grpc.Invoke(ctx, "/rover.analytics.Analytics/GetNotificationSentReport", in, out, c.cc, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

// Server API for Analytics service

type AnalyticsServer interface {
	// Notification Open Reports
	GetNotificationOpenedReport(context.Context, *GetNotificationOpenedReportRequest) (*GetNotificationOpenedReportResponse, error)
	GetNotificationOpenedByDateReport(context.Context, *GetNotificationOpenedByDateReportRequest) (*GetNotificationOpenedByDateReportResponse, error)
	// Notification Sent Reports
	GetNotificationSentReport(context.Context, *GetNotificationSentReportRequest) (*GetNotificationSentReportResponse, error)
}

func RegisterAnalyticsServer(s *grpc.Server, srv AnalyticsServer) {
	s.RegisterService(&_Analytics_serviceDesc, srv)
}

func _Analytics_GetNotificationOpenedReport_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(GetNotificationOpenedReportRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(AnalyticsServer).GetNotificationOpenedReport(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/rover.analytics.Analytics/GetNotificationOpenedReport",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(AnalyticsServer).GetNotificationOpenedReport(ctx, req.(*GetNotificationOpenedReportRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _Analytics_GetNotificationOpenedByDateReport_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(GetNotificationOpenedByDateReportRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(AnalyticsServer).GetNotificationOpenedByDateReport(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/rover.analytics.Analytics/GetNotificationOpenedByDateReport",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(AnalyticsServer).GetNotificationOpenedByDateReport(ctx, req.(*GetNotificationOpenedByDateReportRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _Analytics_GetNotificationSentReport_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(GetNotificationSentReportRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(AnalyticsServer).GetNotificationSentReport(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/rover.analytics.Analytics/GetNotificationSentReport",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(AnalyticsServer).GetNotificationSentReport(ctx, req.(*GetNotificationSentReportRequest))
	}
	return interceptor(ctx, in, info, handler)
}

var _Analytics_serviceDesc = grpc.ServiceDesc{
	ServiceName: "rover.analytics.Analytics",
	HandlerType: (*AnalyticsServer)(nil),
	Methods: []grpc.MethodDesc{
		{
			MethodName: "GetNotificationOpenedReport",
			Handler:    _Analytics_GetNotificationOpenedReport_Handler,
		},
		{
			MethodName: "GetNotificationOpenedByDateReport",
			Handler:    _Analytics_GetNotificationOpenedByDateReport_Handler,
		},
		{
			MethodName: "GetNotificationSentReport",
			Handler:    _Analytics_GetNotificationSentReport_Handler,
		},
	},
	Streams:  []grpc.StreamDesc{},
	Metadata: "analytics/analytics.proto",
}

func init() { proto.RegisterFile("analytics/analytics.proto", fileDescriptor0) }

var fileDescriptor0 = []byte{
	// 893 bytes of a gzipped FileDescriptorProto
	0x1f, 0x8b, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, 0xff, 0xbc, 0x56, 0xcd, 0x6e, 0xdb, 0x46,
	0x10, 0x2e, 0x65, 0x49, 0x96, 0x86, 0x89, 0x95, 0x6c, 0x5c, 0x87, 0x92, 0x11, 0xc4, 0x61, 0x51,
	0xd4, 0x09, 0x0a, 0x19, 0x56, 0x82, 0x02, 0x4d, 0x7f, 0x00, 0xcb, 0x6e, 0x1b, 0x5d, 0xd2, 0x80,
	0x6d, 0x2f, 0xbe, 0x10, 0x6b, 0x72, 0x64, 0x2d, 0x2a, 0xef, 0x32, 0xcb, 0xa5, 0x60, 0xf7, 0x18,
	0xf4, 0xd0, 0x6b, 0xaf, 0xbd, 0xf6, 0xdc, 0x7b, 0x1f, 0xa5, 0x0f, 0xd2, 0x07, 0x28, 0xb8, 0xbb,
	0x12, 0x29, 0x53, 0x76, 0x9d, 0x1c, 0x72, 0xb2, 0x66, 0xf6, 0x9b, 0x9f, 0xdd, 0xf9, 0xe6, 0x33,
	0xa1, 0x4b, 0x39, 0x9d, 0x5e, 0x28, 0x16, 0xa5, 0x7b, 0x8b, 0x5f, 0xfd, 0x44, 0x0a, 0x25, 0x48,
	0x47, 0x8a, 0x19, 0xca, 0xfe, 0xc2, 0xdd, 0x23, 0x34, 0x53, 0x93, 0xbd, 0xd9, 0xfe, 0x5e, 0xfe,
	0xd7, 0x80, 0xfc, 0x0b, 0x68, 0x1e, 0x66, 0x32, 0x15, 0x92, 0x78, 0xd0, 0x3c, 0xc1, 0xb1, 0x90,
	0xe8, 0x39, 0x3b, 0xce, 0x6e, 0xfb, 0xc5, 0x07, 0x81, 0xb5, 0xc9, 0x16, 0x34, 0xe8, 0x58, 0xa1,
	0xf4, 0x6a, 0xf6, 0xc0, 0x98, 0xb9, 0x7f, 0xcc, 0x64, 0xaa, 0xbc, 0xb5, 0x1d, 0x67, 0xb7, 0xf1,
	0xc2, 0x09, 0x8c, 0x49, 0x36, 0xa1, 0x3e, 0xa5, 0xa9, 0xf2, 0xea, 0xd6, 0xad, 0xad, 0xe1, 0x3a,
	0x34, 0x52, 0x45, 0xa5, 0x1a, 0x36, 0xa1, 0xae, 0xe8, 0xcf, 0xe8, 0x1f, 0x43, 0xeb, 0x15, 0x3d,
	0xc5, 0x11, 0x1f, 0x0b, 0xf2, 0x04, 0xee, 0x4e, 0x68, 0x1a, 0x26, 0x12, 0x67, 0x4c, 0x64, 0x69,
	0x98, 0xd0, 0x53, 0xd3, 0x47, 0x2b, 0xe8, 0x4c, 0x68, 0xfa, 0xca, 0xfa, 0x73, 0x3c, 0xf1, 0xe1,
	0x76, 0x8e, 0xe5, 0x78, 0xae, 0x0c, 0xae, 0xa6, 0x71, 0xee, 0x84, 0xa6, 0x2f, 0xf1, 0x5c, 0xe5,
	0x18, 0xff, 0x57, 0x07, 0xfc, 0xef, 0x50, 0xbd, 0x14, 0x8a, 0x8d, 0x59, 0x44, 0x15, 0x13, 0xfc,
	0xfb, 0x04, 0x39, 0xc6, 0x01, 0x26, 0x42, 0xaa, 0x00, 0x5f, 0x67, 0x98, 0x2a, 0xf2, 0x15, 0xdc,
	0xca, 0xdf, 0x22, 0x8c, 0x04, 0x57, 0x78, 0xae, 0x74, 0x45, 0x77, 0xd0, 0xeb, 0xdb, 0x97, 0xcb,
	0x9f, 0x69, 0xb6, 0xdf, 0x3f, 0xc8, 0xd4, 0xe4, 0xd0, 0x20, 0x02, 0x97, 0x16, 0x06, 0x79, 0x08,
	0x6e, 0x44, 0xcf, 0x12, 0xca, 0x4e, 0x79, 0xc8, 0x62, 0xdd, 0x47, 0x23, 0x80, 0xb9, 0x6b, 0x14,
	0xfb, 0xbf, 0xaf, 0xc1, 0x47, 0xd7, 0xb6, 0x91, 0x26, 0x82, 0xa7, 0x48, 0x36, 0xa1, 0xa1, 0x84,
	0xa2, 0x53, 0xdd, 0x40, 0x23, 0x30, 0x06, 0xd9, 0x82, 0x66, 0xc6, 0xd9, 0xeb, 0x0c, 0x6d, 0x66,
	0x6b, 0x91, 0xe7, 0xd0, 0xe5, 0xa5, 0x8c, 0x61, 0x84, 0x5c, 0xa1, 0x0c, 0x4d, 0x06, 0x3d, 0x8b,
	0xe0, 0x7e, 0x19, 0x70, 0xa8, 0xcf, 0x7f, 0xd4, 0x39, 0xbf, 0x84, 0xde, 0xaa, 0x58, 0x5b, 0x47,
	0x4f, 0x2c, 0xf0, 0xaa, 0xc1, 0x3f, 0x99, 0xca, 0x4f, 0xe0, 0x6e, 0x92, 0xa5, 0x93, 0x30, 0x66,
	0x12, 0x23, 0x65, 0x2b, 0x36, 0x74, 0x50, 0x27, 0x3f, 0x38, 0xd2, 0x7e, 0x53, 0xe9, 0x53, 0x20,
	0x65, 0xac, 0xad, 0xd0, 0xd4, 0xe0, 0x3b, 0x05, 0xd8, 0x66, 0x1e, 0xc0, 0x87, 0x1a, 0xcd, 0xf8,
	0x78, 0x9a, 0x21, 0x8f, 0x30, 0xb6, 0xd9, 0xd7, 0x75, 0xc0, 0xbd, 0xfc, 0x70, 0xb4, 0x38, 0x33,
	0x15, 0x9e, 0xc1, 0xd6, 0xe5, 0x18, 0x5b, 0xa5, 0xa5, 0x83, 0x36, 0x97, 0x83, 0x4c, 0x25, 0xff,
	0x1f, 0x07, 0x76, 0x57, 0xce, 0x64, 0x78, 0x71, 0x44, 0x15, 0xbe, 0x57, 0x82, 0x90, 0x3d, 0x68,
	0x46, 0x7a, 0xfd, 0xf4, 0xdc, 0xdc, 0xc1, 0xfd, 0xfe, 0xa5, 0xa5, 0xed, 0x9b, 0xed, 0x0c, 0x2c,
	0x8c, 0x6c, 0x43, 0x5b, 0xb1, 0x33, 0x0c, 0x7f, 0x11, 0xdc, 0x8c, 0xab, 0x1d, 0xb4, 0x72, 0xc7,
	0xb1, 0xe0, 0xe8, 0xff, 0x5b, 0x83, 0xc7, 0x37, 0xb8, 0x9a, 0x25, 0x5d, 0x08, 0xeb, 0x52, 0x7b,
	0x52, 0xcf, 0xd9, 0x59, 0xdb, 0x75, 0x07, 0xdf, 0x54, 0x8a, 0xdf, 0x38, 0x59, 0xbf, 0xe4, 0x9a,
	0x67, 0x25, 0x9f, 0x41, 0x3b, 0xdf, 0xcf, 0x7c, 0x3e, 0x42, 0xdf, 0xdd, 0x1d, 0x74, 0x2b, 0x25,
	0xe6, 0x12, 0x10, 0xb4, 0x12, 0xfb, 0xab, 0xf7, 0x97, 0x03, 0x50, 0xe4, 0x23, 0x1b, 0x50, 0x63,
	0xb1, 0x11, 0xa5, 0xa0, 0xc6, 0xf2, 0x37, 0xbb, 0xb7, 0x82, 0xc2, 0xf6, 0x71, 0x49, 0x95, 0xbb,
	0xf9, 0x14, 0x4a, 0x4c, 0xb4, 0x1b, 0x02, 0x05, 0x05, 0xc9, 0xc7, 0xb0, 0xb1, 0x4c, 0x24, 0xbb,
	0x08, 0xb7, 0x97, 0x08, 0x94, 0xef, 0xa3, 0x1d, 0x56, 0x43, 0x37, 0x63, 0x2d, 0xff, 0x8d, 0x03,
	0x3b, 0x97, 0x5e, 0xea, 0x07, 0xe4, 0xea, 0xfd, 0x4a, 0xcd, 0x9f, 0x75, 0x78, 0x74, 0x4d, 0x13,
	0x76, 0xe6, 0x9f, 0x40, 0x47, 0xaf, 0x55, 0x18, 0xe3, 0x94, 0xcd, 0x50, 0x62, 0x6c, 0x25, 0x67,
	0x43, 0xbb, 0x8f, 0xe6, 0x5e, 0xf2, 0x18, 0xee, 0x98, 0x5d, 0x2a, 0x21, 0x4d, 0xd1, 0x8e, 0xf1,
	0x17, 0xd0, 0x21, 0x3c, 0x58, 0x25, 0x29, 0x54, 0x29, 0x3c, 0x4b, 0x14, 0xc6, 0xf6, 0xc1, 0xb7,
	0xab, 0x93, 0x39, 0x98, 0x43, 0xae, 0xca, 0x51, 0xd4, 0xae, 0x5f, 0x95, 0xa3, 0xe8, 0xe3, 0x5b,
	0x78, 0xb8, 0x5a, 0xda, 0x24, 0xd2, 0x68, 0x42, 0x4f, 0xa6, 0x68, 0xa5, 0xea, 0xc1, 0x2a, 0x7d,
	0x5b, 0x80, 0xc8, 0xd7, 0xb0, 0xbd, 0x2a, 0x0f, 0xe3, 0x33, 0x3a, 0x65, 0xb1, 0x55, 0xb0, 0x6e,
	0x35, 0xc7, 0xc8, 0x00, 0x16, 0x6c, 0x2a, 0x1e, 0x60, 0xbd, 0x60, 0x53, 0x71, 0xe5, 0x39, 0xac,
	0xb8, 0x63, 0xab, 0x80, 0x2d, 0x0d, 0x42, 0xc3, 0xca, 0xd7, 0x68, 0x17, 0x8a, 0x5b, 0x6e, 0xfc,
	0x11, 0xdc, 0xb2, 0x34, 0x36, 0x9d, 0x82, 0x86, 0xb9, 0x86, 0xc4, 0xda, 0x35, 0xf8, 0x7b, 0x0d,
	0xda, 0x07, 0xf3, 0xdd, 0x23, 0xbf, 0x39, 0xb0, 0x7d, 0xcd, 0xbf, 0x27, 0xf2, 0xf4, 0x66, 0x82,
	0xb0, 0x44, 0xf4, 0xde, 0xb3, 0xb7, 0x0b, 0xb2, 0xc4, 0xfc, 0xc3, 0xa9, 0xd0, 0xb7, 0xaa, 0x36,
	0xe4, 0xf3, 0x77, 0x51, 0x28, 0xd3, 0xd6, 0xf3, 0x77, 0x17, 0x37, 0xf2, 0xc6, 0x81, 0xee, 0x95,
	0xbb, 0x45, 0xf6, 0xff, 0x2f, 0x73, 0x45, 0x0c, 0x7a, 0x83, 0xb7, 0x09, 0x31, 0x4d, 0x0c, 0xbd,
	0xe3, 0xad, 0xe2, 0x5b, 0x6f, 0xb6, 0xff, 0xc5, 0xc2, 0x38, 0x69, 0xea, 0x4f, 0xb9, 0xa7, 0xff,
	0x05, 0x00, 0x00, 0xff, 0xff, 0x0d, 0x27, 0xc5, 0xa0, 0x0c, 0x0a, 0x00, 0x00,
}