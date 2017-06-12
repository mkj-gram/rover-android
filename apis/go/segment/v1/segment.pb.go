// Code generated by protoc-gen-go.
// source: segment/v1/segment.proto
// DO NOT EDIT!

/*
Package segment is a generated protocol buffer package.

It is generated from these files:
	segment/v1/segment.proto

It has these top-level messages:
	StaticSegment
	ListStaticSegmentRequest
	ListStaticSegmentResponse
	GetStaticSegmentRequest
	GetStaticSegmentReply
	CreateStaticSegmentRequest
	CreateStaticSegmentReply
	DeleteStaticSegmentRequest
	DeleteStaticSegmentReply
	UpdateStaticSegmentIdsReply
	GetStaticSegmentPushIdsRequest
	GetStaticSegmentPushIdsReply
	PushId
*/
package segment

import proto "github.com/golang/protobuf/proto"
import fmt "fmt"
import math "math"
import google_protobuf "github.com/roverplatform/rover/go/protobuf/ptypes/timestamp"
import rover_auth_v1 "auth/v1"

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

type PushIdType int32

const (
	PushIdType_ROVER PushIdType = 0
	PushIdType_ALIAS PushIdType = 1
)

var PushIdType_name = map[int32]string{
	0: "ROVER",
	1: "ALIAS",
}
var PushIdType_value = map[string]int32{
	"ROVER": 0,
	"ALIAS": 1,
}

func (x PushIdType) String() string {
	return proto.EnumName(PushIdType_name, int32(x))
}
func (PushIdType) EnumDescriptor() ([]byte, []int) { return fileDescriptor0, []int{0} }

type StaticSegment struct {
	Id        int32                      `protobuf:"varint,1,opt,name=id" json:"id,omitempty"`
	AccountId int32                      `protobuf:"varint,2,opt,name=account_id,json=accountId" json:"account_id,omitempty"`
	Title     string                     `protobuf:"bytes,3,opt,name=title" json:"title,omitempty"`
	Size      int64                      `protobuf:"varint,4,opt,name=size" json:"size,omitempty"`
	UpdatedAt *google_protobuf.Timestamp `protobuf:"bytes,5,opt,name=updated_at,json=updatedAt" json:"updated_at,omitempty"`
	CreatedAt *google_protobuf.Timestamp `protobuf:"bytes,6,opt,name=created_at,json=createdAt" json:"created_at,omitempty"`
}

func (m *StaticSegment) Reset()                    { *m = StaticSegment{} }
func (m *StaticSegment) String() string            { return proto.CompactTextString(m) }
func (*StaticSegment) ProtoMessage()               {}
func (*StaticSegment) Descriptor() ([]byte, []int) { return fileDescriptor0, []int{0} }

func (m *StaticSegment) GetId() int32 {
	if m != nil {
		return m.Id
	}
	return 0
}

func (m *StaticSegment) GetAccountId() int32 {
	if m != nil {
		return m.AccountId
	}
	return 0
}

func (m *StaticSegment) GetTitle() string {
	if m != nil {
		return m.Title
	}
	return ""
}

func (m *StaticSegment) GetSize() int64 {
	if m != nil {
		return m.Size
	}
	return 0
}

func (m *StaticSegment) GetUpdatedAt() *google_protobuf.Timestamp {
	if m != nil {
		return m.UpdatedAt
	}
	return nil
}

func (m *StaticSegment) GetCreatedAt() *google_protobuf.Timestamp {
	if m != nil {
		return m.CreatedAt
	}
	return nil
}

type ListStaticSegmentRequest struct {
	AuthContext *rover_auth_v1.AuthContext `protobuf:"bytes,1,opt,name=auth_context,json=authContext" json:"auth_context,omitempty"`
	OrderBy     string                     `protobuf:"bytes,2,opt,name=order_by,json=orderBy" json:"order_by,omitempty"`
	PageSize    int32                      `protobuf:"varint,3,opt,name=page_size,json=pageSize" json:"page_size,omitempty"`
	PageToken   string                     `protobuf:"bytes,4,opt,name=page_token,json=pageToken" json:"page_token,omitempty"`
}

func (m *ListStaticSegmentRequest) Reset()                    { *m = ListStaticSegmentRequest{} }
func (m *ListStaticSegmentRequest) String() string            { return proto.CompactTextString(m) }
func (*ListStaticSegmentRequest) ProtoMessage()               {}
func (*ListStaticSegmentRequest) Descriptor() ([]byte, []int) { return fileDescriptor0, []int{1} }

func (m *ListStaticSegmentRequest) GetAuthContext() *rover_auth_v1.AuthContext {
	if m != nil {
		return m.AuthContext
	}
	return nil
}

func (m *ListStaticSegmentRequest) GetOrderBy() string {
	if m != nil {
		return m.OrderBy
	}
	return ""
}

func (m *ListStaticSegmentRequest) GetPageSize() int32 {
	if m != nil {
		return m.PageSize
	}
	return 0
}

func (m *ListStaticSegmentRequest) GetPageToken() string {
	if m != nil {
		return m.PageToken
	}
	return ""
}

type ListStaticSegmentResponse struct {
	Segments      []*StaticSegment `protobuf:"bytes,1,rep,name=segments" json:"segments,omitempty"`
	NextPageToken string           `protobuf:"bytes,2,opt,name=next_page_token,json=nextPageToken" json:"next_page_token,omitempty"`
}

func (m *ListStaticSegmentResponse) Reset()                    { *m = ListStaticSegmentResponse{} }
func (m *ListStaticSegmentResponse) String() string            { return proto.CompactTextString(m) }
func (*ListStaticSegmentResponse) ProtoMessage()               {}
func (*ListStaticSegmentResponse) Descriptor() ([]byte, []int) { return fileDescriptor0, []int{2} }

func (m *ListStaticSegmentResponse) GetSegments() []*StaticSegment {
	if m != nil {
		return m.Segments
	}
	return nil
}

func (m *ListStaticSegmentResponse) GetNextPageToken() string {
	if m != nil {
		return m.NextPageToken
	}
	return ""
}

type GetStaticSegmentRequest struct {
	AuthContext *rover_auth_v1.AuthContext `protobuf:"bytes,1,opt,name=auth_context,json=authContext" json:"auth_context,omitempty"`
	Id          int32                      `protobuf:"varint,2,opt,name=id" json:"id,omitempty"`
}

func (m *GetStaticSegmentRequest) Reset()                    { *m = GetStaticSegmentRequest{} }
func (m *GetStaticSegmentRequest) String() string            { return proto.CompactTextString(m) }
func (*GetStaticSegmentRequest) ProtoMessage()               {}
func (*GetStaticSegmentRequest) Descriptor() ([]byte, []int) { return fileDescriptor0, []int{3} }

func (m *GetStaticSegmentRequest) GetAuthContext() *rover_auth_v1.AuthContext {
	if m != nil {
		return m.AuthContext
	}
	return nil
}

func (m *GetStaticSegmentRequest) GetId() int32 {
	if m != nil {
		return m.Id
	}
	return 0
}

type GetStaticSegmentReply struct {
	Segment *StaticSegment `protobuf:"bytes,1,opt,name=segment" json:"segment,omitempty"`
}

func (m *GetStaticSegmentReply) Reset()                    { *m = GetStaticSegmentReply{} }
func (m *GetStaticSegmentReply) String() string            { return proto.CompactTextString(m) }
func (*GetStaticSegmentReply) ProtoMessage()               {}
func (*GetStaticSegmentReply) Descriptor() ([]byte, []int) { return fileDescriptor0, []int{4} }

func (m *GetStaticSegmentReply) GetSegment() *StaticSegment {
	if m != nil {
		return m.Segment
	}
	return nil
}

type CreateStaticSegmentRequest struct {
	AuthContext *rover_auth_v1.AuthContext `protobuf:"bytes,1,opt,name=auth_context,json=authContext" json:"auth_context,omitempty"`
	Title       string                     `protobuf:"bytes,2,opt,name=title" json:"title,omitempty"`
}

func (m *CreateStaticSegmentRequest) Reset()                    { *m = CreateStaticSegmentRequest{} }
func (m *CreateStaticSegmentRequest) String() string            { return proto.CompactTextString(m) }
func (*CreateStaticSegmentRequest) ProtoMessage()               {}
func (*CreateStaticSegmentRequest) Descriptor() ([]byte, []int) { return fileDescriptor0, []int{5} }

func (m *CreateStaticSegmentRequest) GetAuthContext() *rover_auth_v1.AuthContext {
	if m != nil {
		return m.AuthContext
	}
	return nil
}

func (m *CreateStaticSegmentRequest) GetTitle() string {
	if m != nil {
		return m.Title
	}
	return ""
}

type CreateStaticSegmentReply struct {
	Segment *StaticSegment `protobuf:"bytes,1,opt,name=segment" json:"segment,omitempty"`
}

func (m *CreateStaticSegmentReply) Reset()                    { *m = CreateStaticSegmentReply{} }
func (m *CreateStaticSegmentReply) String() string            { return proto.CompactTextString(m) }
func (*CreateStaticSegmentReply) ProtoMessage()               {}
func (*CreateStaticSegmentReply) Descriptor() ([]byte, []int) { return fileDescriptor0, []int{6} }

func (m *CreateStaticSegmentReply) GetSegment() *StaticSegment {
	if m != nil {
		return m.Segment
	}
	return nil
}

type DeleteStaticSegmentRequest struct {
	AuthContext *rover_auth_v1.AuthContext `protobuf:"bytes,1,opt,name=auth_context,json=authContext" json:"auth_context,omitempty"`
	Id          int32                      `protobuf:"varint,2,opt,name=id" json:"id,omitempty"`
}

func (m *DeleteStaticSegmentRequest) Reset()                    { *m = DeleteStaticSegmentRequest{} }
func (m *DeleteStaticSegmentRequest) String() string            { return proto.CompactTextString(m) }
func (*DeleteStaticSegmentRequest) ProtoMessage()               {}
func (*DeleteStaticSegmentRequest) Descriptor() ([]byte, []int) { return fileDescriptor0, []int{7} }

func (m *DeleteStaticSegmentRequest) GetAuthContext() *rover_auth_v1.AuthContext {
	if m != nil {
		return m.AuthContext
	}
	return nil
}

func (m *DeleteStaticSegmentRequest) GetId() int32 {
	if m != nil {
		return m.Id
	}
	return 0
}

type DeleteStaticSegmentReply struct {
}

func (m *DeleteStaticSegmentReply) Reset()                    { *m = DeleteStaticSegmentReply{} }
func (m *DeleteStaticSegmentReply) String() string            { return proto.CompactTextString(m) }
func (*DeleteStaticSegmentReply) ProtoMessage()               {}
func (*DeleteStaticSegmentReply) Descriptor() ([]byte, []int) { return fileDescriptor0, []int{8} }

type UpdateStaticSegmentIdsReply struct {
	Segment *StaticSegment `protobuf:"bytes,1,opt,name=segment" json:"segment,omitempty"`
}

func (m *UpdateStaticSegmentIdsReply) Reset()                    { *m = UpdateStaticSegmentIdsReply{} }
func (m *UpdateStaticSegmentIdsReply) String() string            { return proto.CompactTextString(m) }
func (*UpdateStaticSegmentIdsReply) ProtoMessage()               {}
func (*UpdateStaticSegmentIdsReply) Descriptor() ([]byte, []int) { return fileDescriptor0, []int{9} }

func (m *UpdateStaticSegmentIdsReply) GetSegment() *StaticSegment {
	if m != nil {
		return m.Segment
	}
	return nil
}

// Internal
type GetStaticSegmentPushIdsRequest struct {
	AuthContext *rover_auth_v1.AuthContext `protobuf:"bytes,1,opt,name=auth_context,json=authContext" json:"auth_context,omitempty"`
	SegmentId   int32                      `protobuf:"varint,2,opt,name=segment_id,json=segmentId" json:"segment_id,omitempty"`
	Cursor      string                     `protobuf:"bytes,3,opt,name=cursor" json:"cursor,omitempty"`
	BatchSize   int32                      `protobuf:"varint,4,opt,name=batch_size,json=batchSize" json:"batch_size,omitempty"`
}

func (m *GetStaticSegmentPushIdsRequest) Reset()                    { *m = GetStaticSegmentPushIdsRequest{} }
func (m *GetStaticSegmentPushIdsRequest) String() string            { return proto.CompactTextString(m) }
func (*GetStaticSegmentPushIdsRequest) ProtoMessage()               {}
func (*GetStaticSegmentPushIdsRequest) Descriptor() ([]byte, []int) { return fileDescriptor0, []int{10} }

func (m *GetStaticSegmentPushIdsRequest) GetAuthContext() *rover_auth_v1.AuthContext {
	if m != nil {
		return m.AuthContext
	}
	return nil
}

func (m *GetStaticSegmentPushIdsRequest) GetSegmentId() int32 {
	if m != nil {
		return m.SegmentId
	}
	return 0
}

func (m *GetStaticSegmentPushIdsRequest) GetCursor() string {
	if m != nil {
		return m.Cursor
	}
	return ""
}

func (m *GetStaticSegmentPushIdsRequest) GetBatchSize() int32 {
	if m != nil {
		return m.BatchSize
	}
	return 0
}

type GetStaticSegmentPushIdsReply struct {
	PushIds    []*PushId `protobuf:"bytes,1,rep,name=push_ids,json=pushIds" json:"push_ids,omitempty"`
	NextCursor string    `protobuf:"bytes,2,opt,name=next_cursor,json=nextCursor" json:"next_cursor,omitempty"`
	Finished   bool      `protobuf:"varint,3,opt,name=finished" json:"finished,omitempty"`
}

func (m *GetStaticSegmentPushIdsReply) Reset()                    { *m = GetStaticSegmentPushIdsReply{} }
func (m *GetStaticSegmentPushIdsReply) String() string            { return proto.CompactTextString(m) }
func (*GetStaticSegmentPushIdsReply) ProtoMessage()               {}
func (*GetStaticSegmentPushIdsReply) Descriptor() ([]byte, []int) { return fileDescriptor0, []int{11} }

func (m *GetStaticSegmentPushIdsReply) GetPushIds() []*PushId {
	if m != nil {
		return m.PushIds
	}
	return nil
}

func (m *GetStaticSegmentPushIdsReply) GetNextCursor() string {
	if m != nil {
		return m.NextCursor
	}
	return ""
}

func (m *GetStaticSegmentPushIdsReply) GetFinished() bool {
	if m != nil {
		return m.Finished
	}
	return false
}

type PushId struct {
	Id   string     `protobuf:"bytes,1,opt,name=id" json:"id,omitempty"`
	Type PushIdType `protobuf:"varint,2,opt,name=type,enum=rover.segment.v1.PushIdType" json:"type,omitempty"`
}

func (m *PushId) Reset()                    { *m = PushId{} }
func (m *PushId) String() string            { return proto.CompactTextString(m) }
func (*PushId) ProtoMessage()               {}
func (*PushId) Descriptor() ([]byte, []int) { return fileDescriptor0, []int{12} }

func (m *PushId) GetId() string {
	if m != nil {
		return m.Id
	}
	return ""
}

func (m *PushId) GetType() PushIdType {
	if m != nil {
		return m.Type
	}
	return PushIdType_ROVER
}

func init() {
	proto.RegisterType((*StaticSegment)(nil), "rover.segment.v1.StaticSegment")
	proto.RegisterType((*ListStaticSegmentRequest)(nil), "rover.segment.v1.ListStaticSegmentRequest")
	proto.RegisterType((*ListStaticSegmentResponse)(nil), "rover.segment.v1.ListStaticSegmentResponse")
	proto.RegisterType((*GetStaticSegmentRequest)(nil), "rover.segment.v1.GetStaticSegmentRequest")
	proto.RegisterType((*GetStaticSegmentReply)(nil), "rover.segment.v1.GetStaticSegmentReply")
	proto.RegisterType((*CreateStaticSegmentRequest)(nil), "rover.segment.v1.CreateStaticSegmentRequest")
	proto.RegisterType((*CreateStaticSegmentReply)(nil), "rover.segment.v1.CreateStaticSegmentReply")
	proto.RegisterType((*DeleteStaticSegmentRequest)(nil), "rover.segment.v1.DeleteStaticSegmentRequest")
	proto.RegisterType((*DeleteStaticSegmentReply)(nil), "rover.segment.v1.DeleteStaticSegmentReply")
	proto.RegisterType((*UpdateStaticSegmentIdsReply)(nil), "rover.segment.v1.UpdateStaticSegmentIdsReply")
	proto.RegisterType((*GetStaticSegmentPushIdsRequest)(nil), "rover.segment.v1.GetStaticSegmentPushIdsRequest")
	proto.RegisterType((*GetStaticSegmentPushIdsReply)(nil), "rover.segment.v1.GetStaticSegmentPushIdsReply")
	proto.RegisterType((*PushId)(nil), "rover.segment.v1.PushId")
	proto.RegisterEnum("rover.segment.v1.PushIdType", PushIdType_name, PushIdType_value)
}

// Reference imports to suppress errors if they are not otherwise used.
var _ context.Context
var _ grpc.ClientConn

// This is a compile-time assertion to ensure that this generated file
// is compatible with the grpc package it is being compiled against.
const _ = grpc.SupportPackageIsVersion4

// Client API for Segment service

type SegmentClient interface {
	ListStaticSegments(ctx context.Context, in *ListStaticSegmentRequest, opts ...grpc.CallOption) (*ListStaticSegmentResponse, error)
	GetStaticSegment(ctx context.Context, in *GetStaticSegmentRequest, opts ...grpc.CallOption) (*GetStaticSegmentReply, error)
	CreateStaticSegment(ctx context.Context, in *CreateStaticSegmentRequest, opts ...grpc.CallOption) (*CreateStaticSegmentReply, error)
	DeleteStaticSegment(ctx context.Context, in *DeleteStaticSegmentRequest, opts ...grpc.CallOption) (*DeleteStaticSegmentReply, error)
	UpdateStaticSegmentPushIds(ctx context.Context, opts ...grpc.CallOption) (Segment_UpdateStaticSegmentPushIdsClient, error)
	GetStaticSegmentPushIds(ctx context.Context, in *GetStaticSegmentPushIdsRequest, opts ...grpc.CallOption) (*GetStaticSegmentPushIdsReply, error)
}

type segmentClient struct {
	cc *grpc.ClientConn
}

func NewSegmentClient(cc *grpc.ClientConn) SegmentClient {
	return &segmentClient{cc}
}

func (c *segmentClient) ListStaticSegments(ctx context.Context, in *ListStaticSegmentRequest, opts ...grpc.CallOption) (*ListStaticSegmentResponse, error) {
	out := new(ListStaticSegmentResponse)
	err := grpc.Invoke(ctx, "/rover.segment.v1.Segment/ListStaticSegments", in, out, c.cc, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *segmentClient) GetStaticSegment(ctx context.Context, in *GetStaticSegmentRequest, opts ...grpc.CallOption) (*GetStaticSegmentReply, error) {
	out := new(GetStaticSegmentReply)
	err := grpc.Invoke(ctx, "/rover.segment.v1.Segment/GetStaticSegment", in, out, c.cc, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *segmentClient) CreateStaticSegment(ctx context.Context, in *CreateStaticSegmentRequest, opts ...grpc.CallOption) (*CreateStaticSegmentReply, error) {
	out := new(CreateStaticSegmentReply)
	err := grpc.Invoke(ctx, "/rover.segment.v1.Segment/CreateStaticSegment", in, out, c.cc, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *segmentClient) DeleteStaticSegment(ctx context.Context, in *DeleteStaticSegmentRequest, opts ...grpc.CallOption) (*DeleteStaticSegmentReply, error) {
	out := new(DeleteStaticSegmentReply)
	err := grpc.Invoke(ctx, "/rover.segment.v1.Segment/DeleteStaticSegment", in, out, c.cc, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *segmentClient) UpdateStaticSegmentPushIds(ctx context.Context, opts ...grpc.CallOption) (Segment_UpdateStaticSegmentPushIdsClient, error) {
	stream, err := grpc.NewClientStream(ctx, &_Segment_serviceDesc.Streams[0], c.cc, "/rover.segment.v1.Segment/UpdateStaticSegmentPushIds", opts...)
	if err != nil {
		return nil, err
	}
	x := &segmentUpdateStaticSegmentPushIdsClient{stream}
	return x, nil
}

type Segment_UpdateStaticSegmentPushIdsClient interface {
	Send(*PushId) error
	CloseAndRecv() (*UpdateStaticSegmentIdsReply, error)
	grpc.ClientStream
}

type segmentUpdateStaticSegmentPushIdsClient struct {
	grpc.ClientStream
}

func (x *segmentUpdateStaticSegmentPushIdsClient) Send(m *PushId) error {
	return x.ClientStream.SendMsg(m)
}

func (x *segmentUpdateStaticSegmentPushIdsClient) CloseAndRecv() (*UpdateStaticSegmentIdsReply, error) {
	if err := x.ClientStream.CloseSend(); err != nil {
		return nil, err
	}
	m := new(UpdateStaticSegmentIdsReply)
	if err := x.ClientStream.RecvMsg(m); err != nil {
		return nil, err
	}
	return m, nil
}

func (c *segmentClient) GetStaticSegmentPushIds(ctx context.Context, in *GetStaticSegmentPushIdsRequest, opts ...grpc.CallOption) (*GetStaticSegmentPushIdsReply, error) {
	out := new(GetStaticSegmentPushIdsReply)
	err := grpc.Invoke(ctx, "/rover.segment.v1.Segment/GetStaticSegmentPushIds", in, out, c.cc, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

// Server API for Segment service

type SegmentServer interface {
	ListStaticSegments(context.Context, *ListStaticSegmentRequest) (*ListStaticSegmentResponse, error)
	GetStaticSegment(context.Context, *GetStaticSegmentRequest) (*GetStaticSegmentReply, error)
	CreateStaticSegment(context.Context, *CreateStaticSegmentRequest) (*CreateStaticSegmentReply, error)
	DeleteStaticSegment(context.Context, *DeleteStaticSegmentRequest) (*DeleteStaticSegmentReply, error)
	UpdateStaticSegmentPushIds(Segment_UpdateStaticSegmentPushIdsServer) error
	GetStaticSegmentPushIds(context.Context, *GetStaticSegmentPushIdsRequest) (*GetStaticSegmentPushIdsReply, error)
}

func RegisterSegmentServer(s *grpc.Server, srv SegmentServer) {
	s.RegisterService(&_Segment_serviceDesc, srv)
}

func _Segment_ListStaticSegments_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(ListStaticSegmentRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(SegmentServer).ListStaticSegments(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/rover.segment.v1.Segment/ListStaticSegments",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(SegmentServer).ListStaticSegments(ctx, req.(*ListStaticSegmentRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _Segment_GetStaticSegment_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(GetStaticSegmentRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(SegmentServer).GetStaticSegment(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/rover.segment.v1.Segment/GetStaticSegment",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(SegmentServer).GetStaticSegment(ctx, req.(*GetStaticSegmentRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _Segment_CreateStaticSegment_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(CreateStaticSegmentRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(SegmentServer).CreateStaticSegment(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/rover.segment.v1.Segment/CreateStaticSegment",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(SegmentServer).CreateStaticSegment(ctx, req.(*CreateStaticSegmentRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _Segment_DeleteStaticSegment_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(DeleteStaticSegmentRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(SegmentServer).DeleteStaticSegment(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/rover.segment.v1.Segment/DeleteStaticSegment",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(SegmentServer).DeleteStaticSegment(ctx, req.(*DeleteStaticSegmentRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _Segment_UpdateStaticSegmentPushIds_Handler(srv interface{}, stream grpc.ServerStream) error {
	return srv.(SegmentServer).UpdateStaticSegmentPushIds(&segmentUpdateStaticSegmentPushIdsServer{stream})
}

type Segment_UpdateStaticSegmentPushIdsServer interface {
	SendAndClose(*UpdateStaticSegmentIdsReply) error
	Recv() (*PushId, error)
	grpc.ServerStream
}

type segmentUpdateStaticSegmentPushIdsServer struct {
	grpc.ServerStream
}

func (x *segmentUpdateStaticSegmentPushIdsServer) SendAndClose(m *UpdateStaticSegmentIdsReply) error {
	return x.ServerStream.SendMsg(m)
}

func (x *segmentUpdateStaticSegmentPushIdsServer) Recv() (*PushId, error) {
	m := new(PushId)
	if err := x.ServerStream.RecvMsg(m); err != nil {
		return nil, err
	}
	return m, nil
}

func _Segment_GetStaticSegmentPushIds_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(GetStaticSegmentPushIdsRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(SegmentServer).GetStaticSegmentPushIds(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/rover.segment.v1.Segment/GetStaticSegmentPushIds",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(SegmentServer).GetStaticSegmentPushIds(ctx, req.(*GetStaticSegmentPushIdsRequest))
	}
	return interceptor(ctx, in, info, handler)
}

var _Segment_serviceDesc = grpc.ServiceDesc{
	ServiceName: "rover.segment.v1.Segment",
	HandlerType: (*SegmentServer)(nil),
	Methods: []grpc.MethodDesc{
		{
			MethodName: "ListStaticSegments",
			Handler:    _Segment_ListStaticSegments_Handler,
		},
		{
			MethodName: "GetStaticSegment",
			Handler:    _Segment_GetStaticSegment_Handler,
		},
		{
			MethodName: "CreateStaticSegment",
			Handler:    _Segment_CreateStaticSegment_Handler,
		},
		{
			MethodName: "DeleteStaticSegment",
			Handler:    _Segment_DeleteStaticSegment_Handler,
		},
		{
			MethodName: "GetStaticSegmentPushIds",
			Handler:    _Segment_GetStaticSegmentPushIds_Handler,
		},
	},
	Streams: []grpc.StreamDesc{
		{
			StreamName:    "UpdateStaticSegmentPushIds",
			Handler:       _Segment_UpdateStaticSegmentPushIds_Handler,
			ClientStreams: true,
		},
	},
	Metadata: "segment/v1/segment.proto",
}

func init() { proto.RegisterFile("segment/v1/segment.proto", fileDescriptor0) }

var fileDescriptor0 = []byte{
	// 776 bytes of a gzipped FileDescriptorProto
	0x1f, 0x8b, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, 0xff, 0xb4, 0x56, 0xcd, 0x4e, 0xdb, 0x4a,
	0x14, 0x8e, 0x13, 0xf2, 0xe3, 0x93, 0x0b, 0x37, 0x9a, 0xcb, 0x6d, 0x8d, 0x81, 0x12, 0x79, 0xd1,
	0xa6, 0xb4, 0x75, 0x20, 0xac, 0x10, 0xea, 0x22, 0xd0, 0xaa, 0xa2, 0x42, 0x2a, 0x72, 0xa0, 0xaa,
	0xba, 0xb1, 0x9c, 0x78, 0x88, 0x2d, 0x42, 0x6c, 0x3c, 0xe3, 0x88, 0x54, 0xaa, 0xd4, 0x47, 0xe8,
	0xa3, 0x74, 0xd1, 0xbe, 0x4e, 0x9f, 0xa5, 0x9a, 0x19, 0x3b, 0x24, 0xb1, 0x5d, 0xa8, 0x28, 0xab,
	0x78, 0xce, 0x9c, 0x9f, 0xef, 0x1c, 0x7f, 0xe7, 0x8b, 0x41, 0x21, 0xb8, 0x7f, 0x81, 0x87, 0xb4,
	0x39, 0xda, 0x6e, 0x46, 0x8f, 0xba, 0x1f, 0x78, 0xd4, 0x43, 0xb5, 0xc0, 0x1b, 0xe1, 0x40, 0x8f,
	0x8d, 0xa3, 0x6d, 0x75, 0xa3, 0xef, 0x79, 0xfd, 0x01, 0x6e, 0xf2, 0xfb, 0x6e, 0x78, 0xd6, 0xa4,
	0xee, 0x05, 0x26, 0xd4, 0xba, 0xf0, 0x45, 0x88, 0x8a, 0xac, 0x90, 0x3a, 0x2c, 0x13, 0xfb, 0x15,
	0x36, 0xed, 0xa7, 0x04, 0x8b, 0x1d, 0x6a, 0x51, 0xb7, 0xd7, 0x11, 0x99, 0xd0, 0x12, 0xe4, 0x5d,
	0x5b, 0x91, 0xea, 0x52, 0xa3, 0x68, 0xe4, 0x5d, 0x1b, 0xad, 0x03, 0x58, 0xbd, 0x9e, 0x17, 0x0e,
	0xa9, 0xe9, 0xda, 0x4a, 0x9e, 0xdb, 0xe5, 0xc8, 0x72, 0x68, 0xa3, 0x65, 0x28, 0x52, 0x97, 0x0e,
	0xb0, 0x52, 0xa8, 0x4b, 0x0d, 0xd9, 0x10, 0x07, 0x84, 0x60, 0x81, 0xb8, 0x9f, 0xb0, 0xb2, 0x50,
	0x97, 0x1a, 0x05, 0x83, 0x3f, 0xa3, 0x5d, 0x80, 0xd0, 0xb7, 0x2d, 0x8a, 0x6d, 0xd3, 0xa2, 0x4a,
	0xb1, 0x2e, 0x35, 0xaa, 0x2d, 0x55, 0x17, 0xa0, 0xf5, 0x18, 0xb4, 0x7e, 0x12, 0x83, 0x36, 0xe4,
	0xc8, 0xbb, 0x4d, 0x59, 0x68, 0x2f, 0xc0, 0x71, 0x68, 0xe9, 0xe6, 0xd0, 0xc8, 0xbb, 0x4d, 0xb5,
	0x6f, 0x12, 0x28, 0x47, 0x2e, 0xa1, 0x33, 0x4d, 0x1a, 0xf8, 0x32, 0xc4, 0x84, 0xa2, 0x97, 0xf0,
	0x0f, 0x9b, 0x85, 0xd9, 0xf3, 0x86, 0x14, 0x5f, 0x51, 0xde, 0x35, 0xcb, 0x2c, 0x66, 0xcb, 0xc7,
	0x34, 0xda, 0xd6, 0xdb, 0x21, 0x75, 0x0e, 0x84, 0x87, 0x51, 0xb5, 0xae, 0x0f, 0x68, 0x05, 0x2a,
	0x5e, 0x60, 0xe3, 0xc0, 0xec, 0x8e, 0xf9, 0x60, 0x64, 0xa3, 0xcc, 0xcf, 0xfb, 0x63, 0xb4, 0x0a,
	0xb2, 0x6f, 0xf5, 0xb1, 0xc9, 0xa7, 0x50, 0xe0, 0x43, 0xab, 0x30, 0x43, 0x87, 0x4d, 0x62, 0x1d,
	0x80, 0x5f, 0x52, 0xef, 0x1c, 0x0f, 0xf9, 0x8c, 0x64, 0x83, 0xbb, 0x9f, 0x30, 0x83, 0xf6, 0x45,
	0x82, 0x95, 0x14, 0xc8, 0xc4, 0xf7, 0x86, 0x04, 0xa3, 0x3d, 0xa8, 0x44, 0x2f, 0x9d, 0x28, 0x52,
	0xbd, 0xd0, 0xa8, 0xb6, 0x36, 0xf4, 0x79, 0x2e, 0xe8, 0xb3, 0xa1, 0x93, 0x00, 0xf4, 0x18, 0xfe,
	0x1d, 0xe2, 0x2b, 0x6a, 0x4e, 0x95, 0x17, 0xc0, 0x17, 0x99, 0xf9, 0x78, 0x02, 0xc1, 0x81, 0x87,
	0x6f, 0xf0, 0xbd, 0xcc, 0x4c, 0xd0, 0x2b, 0x1f, 0xd3, 0x4b, 0x33, 0xe0, 0xff, 0x64, 0x25, 0x7f,
	0x30, 0x46, 0xbb, 0x50, 0x8e, 0x60, 0x47, 0x25, 0x6e, 0x6c, 0x33, 0xf6, 0xd7, 0x2e, 0x41, 0x3d,
	0xe0, 0x04, 0xb8, 0x8f, 0x06, 0x26, 0x84, 0xcf, 0x4f, 0x11, 0x5e, 0x3b, 0x05, 0x25, 0xb5, 0xe4,
	0x1d, 0x3b, 0x39, 0x07, 0xf5, 0x15, 0x1e, 0xe0, 0xfb, 0xe9, 0x64, 0xfe, 0x55, 0xa8, 0xa0, 0xa4,
	0x16, 0xf3, 0x07, 0x63, 0xed, 0x03, 0xac, 0x9e, 0xf2, 0x75, 0x9c, 0xb9, 0x3b, 0xb4, 0xc9, 0x9d,
	0x5b, 0xfc, 0x21, 0xc1, 0xa3, 0x79, 0x06, 0x1c, 0x87, 0xc4, 0xe1, 0xb9, 0xff, 0x4a, 0x9f, 0xeb,
	0x00, 0x51, 0xb1, 0x29, 0x05, 0x23, 0x71, 0x07, 0xe8, 0x01, 0x94, 0x7a, 0x61, 0x40, 0xbc, 0x20,
	0x92, 0xb0, 0xe8, 0xc4, 0xc2, 0xba, 0x16, 0xed, 0x39, 0xe6, 0x44, 0xc9, 0x8a, 0x86, 0xcc, 0x2d,
	0x6c, 0x89, 0xb5, 0xaf, 0x12, 0xac, 0x65, 0xe2, 0x66, 0x33, 0xd9, 0x81, 0x8a, 0x1f, 0x12, 0xc7,
	0x74, 0xed, 0x78, 0x51, 0x95, 0xe4, 0x50, 0x44, 0x84, 0x51, 0xf6, 0x45, 0x24, 0xda, 0x80, 0x2a,
	0x5f, 0xd0, 0x08, 0x91, 0xe0, 0x18, 0x30, 0xd3, 0x81, 0x40, 0xa5, 0x42, 0xe5, 0xcc, 0x1d, 0xba,
	0xc4, 0xc1, 0x36, 0xc7, 0x5b, 0x31, 0x26, 0x67, 0xed, 0x2d, 0x94, 0x44, 0xbe, 0x29, 0x11, 0x97,
	0xb9, 0x88, 0x6f, 0xc1, 0x02, 0x1d, 0xfb, 0x82, 0xb3, 0x4b, 0xad, 0xb5, 0x2c, 0x1c, 0x27, 0x63,
	0x1f, 0x1b, 0xdc, 0x73, 0x53, 0x03, 0xb8, 0xb6, 0x21, 0x19, 0x8a, 0xc6, 0xbb, 0xf7, 0xaf, 0x8d,
	0x5a, 0x8e, 0x3d, 0xb6, 0x8f, 0x0e, 0xdb, 0x9d, 0x9a, 0xd4, 0xfa, 0x5e, 0x84, 0x72, 0xfc, 0xb7,
	0xe1, 0x01, 0x4a, 0x68, 0x16, 0x41, 0x9b, 0xc9, 0x4a, 0x59, 0x62, 0xac, 0x3e, 0xbb, 0x95, 0xaf,
	0x50, 0x41, 0x2d, 0x87, 0x1c, 0xa8, 0xcd, 0x8f, 0x1f, 0x3d, 0x4d, 0xa6, 0xc8, 0x90, 0x31, 0xf5,
	0xc9, 0x6d, 0x5c, 0x19, 0xf3, 0x73, 0xe8, 0x12, 0xfe, 0x4b, 0xd9, 0x6d, 0xf4, 0x3c, 0x99, 0x21,
	0x5b, 0x75, 0xd4, 0xcd, 0x5b, 0x7a, 0x4f, 0x4a, 0xa6, 0xac, 0x62, 0x5a, 0xc9, 0x6c, 0x79, 0x48,
	0x2b, 0x99, 0xb9, 0xdf, 0x39, 0xe4, 0x82, 0x9a, 0xb2, 0xe1, 0x11, 0xa3, 0x51, 0x26, 0x75, 0xd5,
	0x17, 0xc9, 0x9b, 0xdf, 0x28, 0x85, 0x96, 0x6b, 0x48, 0xe8, 0x73, 0xf2, 0xdf, 0x25, 0xae, 0xb3,
	0x75, 0xf3, 0x6b, 0x99, 0x15, 0x07, 0x55, 0xff, 0x83, 0x08, 0x0e, 0x60, 0x7f, 0xf9, 0x23, 0xba,
	0xfe, 0xac, 0xda, 0x8b, 0x1e, 0xbb, 0x25, 0xfe, 0x1d, 0xb1, 0xf3, 0x2b, 0x00, 0x00, 0xff, 0xff,
	0x6c, 0xa8, 0x52, 0x8f, 0x73, 0x09, 0x00, 0x00,
}
