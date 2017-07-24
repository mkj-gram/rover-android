// Code generated by protoc-gen-go.
// source: csv-processor/v1/csv-processor.proto
// DO NOT EDIT!

/*
Package csv_processor is a generated protocol buffer package.

It is generated from these files:
	csv-processor/v1/csv-processor.proto

It has these top-level messages:
	GCSObject
	LoadJob
	SegmentLoadJobConfig
	SegmentLoadJobWithCsvFileConfig
	GetLoadJobRequest
	GetLoadJobReply
	CreateLoadJobRequest
	CreateLoadJobReply
*/
package csv_processor

import proto "github.com/golang/protobuf/proto"
import fmt "fmt"
import math "math"
import google_protobuf "github.com/roverplatform/rover/go/protobuf/ptypes/timestamp"
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

type JobType int32

const (
	JobType_SEGMENT               JobType = 0
	JobType_SEGMENT_WITH_CSV_FILE JobType = 1
)

var JobType_name = map[int32]string{
	0: "SEGMENT",
	1: "SEGMENT_WITH_CSV_FILE",
}
var JobType_value = map[string]int32{
	"SEGMENT":               0,
	"SEGMENT_WITH_CSV_FILE": 1,
}

func (x JobType) String() string {
	return proto.EnumName(JobType_name, int32(x))
}
func (JobType) EnumDescriptor() ([]byte, []int) { return fileDescriptor0, []int{0} }

type JobStatus int32

const (
	JobStatus_UNKNOWN    JobStatus = 0
	JobStatus_ENQUEUED   JobStatus = 1
	JobStatus_PROCESSING JobStatus = 2
	JobStatus_FAILED     JobStatus = 3
	JobStatus_COMPLETED  JobStatus = 4
)

var JobStatus_name = map[int32]string{
	0: "UNKNOWN",
	1: "ENQUEUED",
	2: "PROCESSING",
	3: "FAILED",
	4: "COMPLETED",
}
var JobStatus_value = map[string]int32{
	"UNKNOWN":    0,
	"ENQUEUED":   1,
	"PROCESSING": 2,
	"FAILED":     3,
	"COMPLETED":  4,
}

func (x JobStatus) String() string {
	return proto.EnumName(JobStatus_name, int32(x))
}
func (JobStatus) EnumDescriptor() ([]byte, []int) { return fileDescriptor0, []int{1} }

type GCSObject struct {
	ProjectId string `protobuf:"bytes,1,opt,name=project_id,json=projectId" json:"project_id,omitempty"`
	Bucket    string `protobuf:"bytes,2,opt,name=bucket" json:"bucket,omitempty"`
	FileId    string `protobuf:"bytes,3,opt,name=file_id,json=fileId" json:"file_id,omitempty"`
}

func (m *GCSObject) Reset()                    { *m = GCSObject{} }
func (m *GCSObject) String() string            { return proto.CompactTextString(m) }
func (*GCSObject) ProtoMessage()               {}
func (*GCSObject) Descriptor() ([]byte, []int) { return fileDescriptor0, []int{0} }

func (m *GCSObject) GetProjectId() string {
	if m != nil {
		return m.ProjectId
	}
	return ""
}

func (m *GCSObject) GetBucket() string {
	if m != nil {
		return m.Bucket
	}
	return ""
}

func (m *GCSObject) GetFileId() string {
	if m != nil {
		return m.FileId
	}
	return ""
}

type LoadJob struct {
	Id        int32                      `protobuf:"varint,1,opt,name=id" json:"id,omitempty"`
	AccountId int32                      `protobuf:"varint,2,opt,name=account_id,json=accountId" json:"account_id,omitempty"`
	Type      JobType                    `protobuf:"varint,3,opt,name=type,enum=rover.csv_processor.v1.JobType" json:"type,omitempty"`
	Status    JobStatus                  `protobuf:"varint,4,opt,name=status,enum=rover.csv_processor.v1.JobStatus" json:"status,omitempty"`
	Progress  int32                      `protobuf:"varint,5,opt,name=progress" json:"progress,omitempty"`
	CreatedAt *google_protobuf.Timestamp `protobuf:"bytes,6,opt,name=created_at,json=createdAt" json:"created_at,omitempty"`
	// Optional
	FailedReason string `protobuf:"bytes,7,opt,name=failed_reason,json=failedReason" json:"failed_reason,omitempty"`
}

func (m *LoadJob) Reset()                    { *m = LoadJob{} }
func (m *LoadJob) String() string            { return proto.CompactTextString(m) }
func (*LoadJob) ProtoMessage()               {}
func (*LoadJob) Descriptor() ([]byte, []int) { return fileDescriptor0, []int{1} }

func (m *LoadJob) GetId() int32 {
	if m != nil {
		return m.Id
	}
	return 0
}

func (m *LoadJob) GetAccountId() int32 {
	if m != nil {
		return m.AccountId
	}
	return 0
}

func (m *LoadJob) GetType() JobType {
	if m != nil {
		return m.Type
	}
	return JobType_SEGMENT
}

func (m *LoadJob) GetStatus() JobStatus {
	if m != nil {
		return m.Status
	}
	return JobStatus_UNKNOWN
}

func (m *LoadJob) GetProgress() int32 {
	if m != nil {
		return m.Progress
	}
	return 0
}

func (m *LoadJob) GetCreatedAt() *google_protobuf.Timestamp {
	if m != nil {
		return m.CreatedAt
	}
	return nil
}

func (m *LoadJob) GetFailedReason() string {
	if m != nil {
		return m.FailedReason
	}
	return ""
}

type SegmentLoadJobConfig struct {
	AccountId int32      `protobuf:"varint,1,opt,name=account_id,json=accountId" json:"account_id,omitempty"`
	SegmentId int32      `protobuf:"varint,2,opt,name=segment_id,json=segmentId" json:"segment_id,omitempty"`
	Csv       *GCSObject `protobuf:"bytes,3,opt,name=csv" json:"csv,omitempty"`
}

func (m *SegmentLoadJobConfig) Reset()                    { *m = SegmentLoadJobConfig{} }
func (m *SegmentLoadJobConfig) String() string            { return proto.CompactTextString(m) }
func (*SegmentLoadJobConfig) ProtoMessage()               {}
func (*SegmentLoadJobConfig) Descriptor() ([]byte, []int) { return fileDescriptor0, []int{2} }

func (m *SegmentLoadJobConfig) GetAccountId() int32 {
	if m != nil {
		return m.AccountId
	}
	return 0
}

func (m *SegmentLoadJobConfig) GetSegmentId() int32 {
	if m != nil {
		return m.SegmentId
	}
	return 0
}

func (m *SegmentLoadJobConfig) GetCsv() *GCSObject {
	if m != nil {
		return m.Csv
	}
	return nil
}

type SegmentLoadJobWithCsvFileConfig struct {
	AccountId       int32 `protobuf:"varint,1,opt,name=account_id,json=accountId" json:"account_id,omitempty"`
	StaticSegmentId int32 `protobuf:"varint,2,opt,name=static_segment_id,json=staticSegmentId" json:"static_segment_id,omitempty"`
	CsvFileId       int32 `protobuf:"varint,3,opt,name=csv_file_id,json=csvFileId" json:"csv_file_id,omitempty"`
}

func (m *SegmentLoadJobWithCsvFileConfig) Reset()                    { *m = SegmentLoadJobWithCsvFileConfig{} }
func (m *SegmentLoadJobWithCsvFileConfig) String() string            { return proto.CompactTextString(m) }
func (*SegmentLoadJobWithCsvFileConfig) ProtoMessage()               {}
func (*SegmentLoadJobWithCsvFileConfig) Descriptor() ([]byte, []int) { return fileDescriptor0, []int{3} }

func (m *SegmentLoadJobWithCsvFileConfig) GetAccountId() int32 {
	if m != nil {
		return m.AccountId
	}
	return 0
}

func (m *SegmentLoadJobWithCsvFileConfig) GetStaticSegmentId() int32 {
	if m != nil {
		return m.StaticSegmentId
	}
	return 0
}

func (m *SegmentLoadJobWithCsvFileConfig) GetCsvFileId() int32 {
	if m != nil {
		return m.CsvFileId
	}
	return 0
}

type GetLoadJobRequest struct {
	AuthContext *rover_auth_v1.AuthContext `protobuf:"bytes,1,opt,name=auth_context,json=authContext" json:"auth_context,omitempty"`
	LoadJobId   int32                      `protobuf:"varint,2,opt,name=load_job_id,json=loadJobId" json:"load_job_id,omitempty"`
	//
	// 0 -> static-segments (default)
	// 1 -> static-segments
	// 2 -> load-jobs
	QueueVersion int32 `protobuf:"varint,3,opt,name=queue_version,json=queueVersion" json:"queue_version,omitempty"`
}

func (m *GetLoadJobRequest) Reset()                    { *m = GetLoadJobRequest{} }
func (m *GetLoadJobRequest) String() string            { return proto.CompactTextString(m) }
func (*GetLoadJobRequest) ProtoMessage()               {}
func (*GetLoadJobRequest) Descriptor() ([]byte, []int) { return fileDescriptor0, []int{4} }

func (m *GetLoadJobRequest) GetAuthContext() *rover_auth_v1.AuthContext {
	if m != nil {
		return m.AuthContext
	}
	return nil
}

func (m *GetLoadJobRequest) GetLoadJobId() int32 {
	if m != nil {
		return m.LoadJobId
	}
	return 0
}

func (m *GetLoadJobRequest) GetQueueVersion() int32 {
	if m != nil {
		return m.QueueVersion
	}
	return 0
}

type GetLoadJobReply struct {
	Job *LoadJob `protobuf:"bytes,1,opt,name=job" json:"job,omitempty"`
}

func (m *GetLoadJobReply) Reset()                    { *m = GetLoadJobReply{} }
func (m *GetLoadJobReply) String() string            { return proto.CompactTextString(m) }
func (*GetLoadJobReply) ProtoMessage()               {}
func (*GetLoadJobReply) Descriptor() ([]byte, []int) { return fileDescriptor0, []int{5} }

func (m *GetLoadJobReply) GetJob() *LoadJob {
	if m != nil {
		return m.Job
	}
	return nil
}

type CreateLoadJobRequest struct {
	AuthContext *rover_auth_v1.AuthContext `protobuf:"bytes,1,opt,name=auth_context,json=authContext" json:"auth_context,omitempty"`
	Type        JobType                    `protobuf:"varint,2,opt,name=type,enum=rover.csv_processor.v1.JobType" json:"type,omitempty"`
	// Types that are valid to be assigned to JobConfig:
	//	*CreateLoadJobRequest_SegmentLoadJobConfig
	//	*CreateLoadJobRequest_SegmentLoadJobWithCsvFileConfig
	JobConfig isCreateLoadJobRequest_JobConfig `protobuf_oneof:"job_config"`
}

func (m *CreateLoadJobRequest) Reset()                    { *m = CreateLoadJobRequest{} }
func (m *CreateLoadJobRequest) String() string            { return proto.CompactTextString(m) }
func (*CreateLoadJobRequest) ProtoMessage()               {}
func (*CreateLoadJobRequest) Descriptor() ([]byte, []int) { return fileDescriptor0, []int{6} }

type isCreateLoadJobRequest_JobConfig interface {
	isCreateLoadJobRequest_JobConfig()
}

type CreateLoadJobRequest_SegmentLoadJobConfig struct {
	SegmentLoadJobConfig *SegmentLoadJobConfig `protobuf:"bytes,3,opt,name=segment_load_job_config,json=segmentLoadJobConfig,oneof"`
}
type CreateLoadJobRequest_SegmentLoadJobWithCsvFileConfig struct {
	SegmentLoadJobWithCsvFileConfig *SegmentLoadJobWithCsvFileConfig `protobuf:"bytes,4,opt,name=segment_load_job_with_csv_file_config,json=segmentLoadJobWithCsvFileConfig,oneof"`
}

func (*CreateLoadJobRequest_SegmentLoadJobConfig) isCreateLoadJobRequest_JobConfig()            {}
func (*CreateLoadJobRequest_SegmentLoadJobWithCsvFileConfig) isCreateLoadJobRequest_JobConfig() {}

func (m *CreateLoadJobRequest) GetJobConfig() isCreateLoadJobRequest_JobConfig {
	if m != nil {
		return m.JobConfig
	}
	return nil
}

func (m *CreateLoadJobRequest) GetAuthContext() *rover_auth_v1.AuthContext {
	if m != nil {
		return m.AuthContext
	}
	return nil
}

func (m *CreateLoadJobRequest) GetType() JobType {
	if m != nil {
		return m.Type
	}
	return JobType_SEGMENT
}

func (m *CreateLoadJobRequest) GetSegmentLoadJobConfig() *SegmentLoadJobConfig {
	if x, ok := m.GetJobConfig().(*CreateLoadJobRequest_SegmentLoadJobConfig); ok {
		return x.SegmentLoadJobConfig
	}
	return nil
}

func (m *CreateLoadJobRequest) GetSegmentLoadJobWithCsvFileConfig() *SegmentLoadJobWithCsvFileConfig {
	if x, ok := m.GetJobConfig().(*CreateLoadJobRequest_SegmentLoadJobWithCsvFileConfig); ok {
		return x.SegmentLoadJobWithCsvFileConfig
	}
	return nil
}

// XXX_OneofFuncs is for the internal use of the proto package.
func (*CreateLoadJobRequest) XXX_OneofFuncs() (func(msg proto.Message, b *proto.Buffer) error, func(msg proto.Message, tag, wire int, b *proto.Buffer) (bool, error), func(msg proto.Message) (n int), []interface{}) {
	return _CreateLoadJobRequest_OneofMarshaler, _CreateLoadJobRequest_OneofUnmarshaler, _CreateLoadJobRequest_OneofSizer, []interface{}{
		(*CreateLoadJobRequest_SegmentLoadJobConfig)(nil),
		(*CreateLoadJobRequest_SegmentLoadJobWithCsvFileConfig)(nil),
	}
}

func _CreateLoadJobRequest_OneofMarshaler(msg proto.Message, b *proto.Buffer) error {
	m := msg.(*CreateLoadJobRequest)
	// job_config
	switch x := m.JobConfig.(type) {
	case *CreateLoadJobRequest_SegmentLoadJobConfig:
		b.EncodeVarint(3<<3 | proto.WireBytes)
		if err := b.EncodeMessage(x.SegmentLoadJobConfig); err != nil {
			return err
		}
	case *CreateLoadJobRequest_SegmentLoadJobWithCsvFileConfig:
		b.EncodeVarint(4<<3 | proto.WireBytes)
		if err := b.EncodeMessage(x.SegmentLoadJobWithCsvFileConfig); err != nil {
			return err
		}
	case nil:
	default:
		return fmt.Errorf("CreateLoadJobRequest.JobConfig has unexpected type %T", x)
	}
	return nil
}

func _CreateLoadJobRequest_OneofUnmarshaler(msg proto.Message, tag, wire int, b *proto.Buffer) (bool, error) {
	m := msg.(*CreateLoadJobRequest)
	switch tag {
	case 3: // job_config.segment_load_job_config
		if wire != proto.WireBytes {
			return true, proto.ErrInternalBadWireType
		}
		msg := new(SegmentLoadJobConfig)
		err := b.DecodeMessage(msg)
		m.JobConfig = &CreateLoadJobRequest_SegmentLoadJobConfig{msg}
		return true, err
	case 4: // job_config.segment_load_job_with_csv_file_config
		if wire != proto.WireBytes {
			return true, proto.ErrInternalBadWireType
		}
		msg := new(SegmentLoadJobWithCsvFileConfig)
		err := b.DecodeMessage(msg)
		m.JobConfig = &CreateLoadJobRequest_SegmentLoadJobWithCsvFileConfig{msg}
		return true, err
	default:
		return false, nil
	}
}

func _CreateLoadJobRequest_OneofSizer(msg proto.Message) (n int) {
	m := msg.(*CreateLoadJobRequest)
	// job_config
	switch x := m.JobConfig.(type) {
	case *CreateLoadJobRequest_SegmentLoadJobConfig:
		s := proto.Size(x.SegmentLoadJobConfig)
		n += proto.SizeVarint(3<<3 | proto.WireBytes)
		n += proto.SizeVarint(uint64(s))
		n += s
	case *CreateLoadJobRequest_SegmentLoadJobWithCsvFileConfig:
		s := proto.Size(x.SegmentLoadJobWithCsvFileConfig)
		n += proto.SizeVarint(4<<3 | proto.WireBytes)
		n += proto.SizeVarint(uint64(s))
		n += s
	case nil:
	default:
		panic(fmt.Sprintf("proto: unexpected type %T in oneof", x))
	}
	return n
}

type CreateLoadJobReply struct {
	Job *LoadJob `protobuf:"bytes,1,opt,name=job" json:"job,omitempty"`
}

func (m *CreateLoadJobReply) Reset()                    { *m = CreateLoadJobReply{} }
func (m *CreateLoadJobReply) String() string            { return proto.CompactTextString(m) }
func (*CreateLoadJobReply) ProtoMessage()               {}
func (*CreateLoadJobReply) Descriptor() ([]byte, []int) { return fileDescriptor0, []int{7} }

func (m *CreateLoadJobReply) GetJob() *LoadJob {
	if m != nil {
		return m.Job
	}
	return nil
}

func init() {
	proto.RegisterType((*GCSObject)(nil), "rover.csv_processor.v1.GCSObject")
	proto.RegisterType((*LoadJob)(nil), "rover.csv_processor.v1.LoadJob")
	proto.RegisterType((*SegmentLoadJobConfig)(nil), "rover.csv_processor.v1.SegmentLoadJobConfig")
	proto.RegisterType((*SegmentLoadJobWithCsvFileConfig)(nil), "rover.csv_processor.v1.SegmentLoadJobWithCsvFileConfig")
	proto.RegisterType((*GetLoadJobRequest)(nil), "rover.csv_processor.v1.GetLoadJobRequest")
	proto.RegisterType((*GetLoadJobReply)(nil), "rover.csv_processor.v1.GetLoadJobReply")
	proto.RegisterType((*CreateLoadJobRequest)(nil), "rover.csv_processor.v1.CreateLoadJobRequest")
	proto.RegisterType((*CreateLoadJobReply)(nil), "rover.csv_processor.v1.CreateLoadJobReply")
	proto.RegisterEnum("rover.csv_processor.v1.JobType", JobType_name, JobType_value)
	proto.RegisterEnum("rover.csv_processor.v1.JobStatus", JobStatus_name, JobStatus_value)
}

// Reference imports to suppress errors if they are not otherwise used.
var _ context.Context
var _ grpc.ClientConn

// This is a compile-time assertion to ensure that this generated file
// is compatible with the grpc package it is being compiled against.
const _ = grpc.SupportPackageIsVersion4

// Client API for CsvProcessor service

type CsvProcessorClient interface {
	GetLoadJob(ctx context.Context, in *GetLoadJobRequest, opts ...grpc.CallOption) (*GetLoadJobReply, error)
	CreateLoadJob(ctx context.Context, in *CreateLoadJobRequest, opts ...grpc.CallOption) (*CreateLoadJobReply, error)
}

type csvProcessorClient struct {
	cc *grpc.ClientConn
}

func NewCsvProcessorClient(cc *grpc.ClientConn) CsvProcessorClient {
	return &csvProcessorClient{cc}
}

func (c *csvProcessorClient) GetLoadJob(ctx context.Context, in *GetLoadJobRequest, opts ...grpc.CallOption) (*GetLoadJobReply, error) {
	out := new(GetLoadJobReply)
	err := grpc.Invoke(ctx, "/rover.csv_processor.v1.CsvProcessor/GetLoadJob", in, out, c.cc, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *csvProcessorClient) CreateLoadJob(ctx context.Context, in *CreateLoadJobRequest, opts ...grpc.CallOption) (*CreateLoadJobReply, error) {
	out := new(CreateLoadJobReply)
	err := grpc.Invoke(ctx, "/rover.csv_processor.v1.CsvProcessor/CreateLoadJob", in, out, c.cc, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

// Server API for CsvProcessor service

type CsvProcessorServer interface {
	GetLoadJob(context.Context, *GetLoadJobRequest) (*GetLoadJobReply, error)
	CreateLoadJob(context.Context, *CreateLoadJobRequest) (*CreateLoadJobReply, error)
}

func RegisterCsvProcessorServer(s *grpc.Server, srv CsvProcessorServer) {
	s.RegisterService(&_CsvProcessor_serviceDesc, srv)
}

func _CsvProcessor_GetLoadJob_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(GetLoadJobRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(CsvProcessorServer).GetLoadJob(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/rover.csv_processor.v1.CsvProcessor/GetLoadJob",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(CsvProcessorServer).GetLoadJob(ctx, req.(*GetLoadJobRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _CsvProcessor_CreateLoadJob_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(CreateLoadJobRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(CsvProcessorServer).CreateLoadJob(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/rover.csv_processor.v1.CsvProcessor/CreateLoadJob",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(CsvProcessorServer).CreateLoadJob(ctx, req.(*CreateLoadJobRequest))
	}
	return interceptor(ctx, in, info, handler)
}

var _CsvProcessor_serviceDesc = grpc.ServiceDesc{
	ServiceName: "rover.csv_processor.v1.CsvProcessor",
	HandlerType: (*CsvProcessorServer)(nil),
	Methods: []grpc.MethodDesc{
		{
			MethodName: "GetLoadJob",
			Handler:    _CsvProcessor_GetLoadJob_Handler,
		},
		{
			MethodName: "CreateLoadJob",
			Handler:    _CsvProcessor_CreateLoadJob_Handler,
		},
	},
	Streams:  []grpc.StreamDesc{},
	Metadata: "csv-processor/v1/csv-processor.proto",
}

func init() { proto.RegisterFile("csv-processor/v1/csv-processor.proto", fileDescriptor0) }

var fileDescriptor0 = []byte{
	// 795 bytes of a gzipped FileDescriptorProto
	0x1f, 0x8b, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, 0xff, 0xac, 0x55, 0xdd, 0x6e, 0xdb, 0x36,
	0x14, 0xb6, 0xec, 0xc4, 0xae, 0x8e, 0x9d, 0xd4, 0x25, 0xb2, 0xd6, 0x33, 0xd0, 0x26, 0xd3, 0x36,
	0xac, 0x0b, 0x36, 0x05, 0x4e, 0x2f, 0x86, 0x62, 0xd8, 0x45, 0xaa, 0x28, 0x8e, 0xba, 0xd4, 0x49,
	0x25, 0xa7, 0x01, 0xb6, 0x0b, 0x41, 0x3f, 0xb4, 0xa3, 0x54, 0x31, 0x55, 0x91, 0xd2, 0xe6, 0x47,
	0x28, 0xb6, 0xfb, 0xbd, 0xc0, 0xde, 0x6b, 0xaf, 0x32, 0x90, 0x92, 0xfc, 0x17, 0x3b, 0xf0, 0x86,
	0x5e, 0xd9, 0xfc, 0x78, 0x0e, 0xcf, 0x77, 0xbe, 0xf3, 0x91, 0x82, 0xaf, 0x3c, 0x9a, 0x7e, 0x1f,
	0xc5, 0xc4, 0xc3, 0x94, 0x92, 0xf8, 0x20, 0xed, 0x1c, 0xcc, 0x01, 0x6a, 0x14, 0x13, 0x46, 0xd0,
	0xe3, 0x98, 0xa4, 0x38, 0x56, 0x3d, 0x9a, 0xda, 0xd3, 0xad, 0xb4, 0xd3, 0xde, 0x1d, 0x12, 0x32,
	0x0c, 0xf1, 0x81, 0x88, 0x72, 0x93, 0xc1, 0x01, 0x0b, 0x6e, 0x31, 0x65, 0xce, 0x6d, 0x94, 0x25,
	0xb6, 0x91, 0x93, 0xb0, 0x6b, 0x7e, 0x2a, 0xff, 0xcd, 0x30, 0xe5, 0x57, 0x90, 0xbb, 0x9a, 0x75,
	0xee, 0xde, 0x60, 0x8f, 0xa1, 0xa7, 0x00, 0x51, 0x4c, 0xf8, 0x5f, 0x3b, 0xf0, 0x5b, 0xd2, 0x9e,
	0xf4, 0x5c, 0x36, 0xe5, 0x1c, 0x31, 0x7c, 0xf4, 0x18, 0xaa, 0x6e, 0xe2, 0xbd, 0xc7, 0xac, 0x55,
	0x16, 0x5b, 0xf9, 0x0a, 0x3d, 0x81, 0xda, 0x20, 0x08, 0x31, 0xcf, 0xa9, 0x64, 0x1b, 0x7c, 0x69,
	0xf8, 0xca, 0xdf, 0x65, 0xa8, 0x9d, 0x11, 0xc7, 0x7f, 0x4d, 0x5c, 0xb4, 0x0d, 0xe5, 0xfc, 0xcc,
	0x4d, 0xb3, 0x1c, 0xf8, 0xbc, 0x96, 0xe3, 0x79, 0x24, 0x19, 0x89, 0x5a, 0x65, 0x81, 0xcb, 0x39,
	0x62, 0xf8, 0xe8, 0x05, 0x6c, 0xb0, 0x71, 0x84, 0xc5, 0x81, 0xdb, 0x87, 0xbb, 0xea, 0xf2, 0x9e,
	0xd5, 0xd7, 0xc4, 0xed, 0x8f, 0x23, 0x6c, 0x8a, 0x60, 0xf4, 0x12, 0xaa, 0x94, 0x39, 0x2c, 0xa1,
	0xad, 0x0d, 0x91, 0xf6, 0xc5, 0x3d, 0x69, 0x96, 0x08, 0x34, 0xf3, 0x04, 0xd4, 0x86, 0x07, 0x51,
	0x4c, 0x86, 0x31, 0xa6, 0xb4, 0xb5, 0x29, 0xc8, 0x4c, 0xd6, 0xe8, 0x25, 0x80, 0x17, 0x63, 0x87,
	0x61, 0xdf, 0x76, 0x58, 0xab, 0xba, 0x27, 0x3d, 0xaf, 0x1f, 0xb6, 0xd5, 0x4c, 0x6d, 0xb5, 0x50,
	0x5b, 0xed, 0x17, 0x6a, 0x9b, 0x72, 0x1e, 0x7d, 0xc4, 0xd0, 0x97, 0xb0, 0x35, 0x70, 0x82, 0x10,
	0xfb, 0x76, 0x8c, 0x1d, 0x4a, 0x46, 0xad, 0x9a, 0x10, 0xa8, 0x91, 0x81, 0xa6, 0xc0, 0x94, 0x8f,
	0x12, 0xec, 0x58, 0x78, 0x78, 0x8b, 0x47, 0x2c, 0x57, 0x4b, 0x23, 0xa3, 0x41, 0x30, 0x5c, 0xd0,
	0x48, 0x5a, 0xd4, 0xe8, 0x29, 0x00, 0xcd, 0xd2, 0x66, 0x24, 0xcc, 0x11, 0x21, 0x61, 0xc5, 0xa3,
	0xa9, 0x50, 0xb0, 0xbe, 0x5a, 0x8a, 0xc9, 0xf4, 0x4d, 0x1e, 0xad, 0xfc, 0x29, 0xc1, 0xee, 0x3c,
	0x97, 0xab, 0x80, 0x5d, 0x6b, 0x34, 0x3d, 0x09, 0x42, 0xbc, 0x1e, 0xad, 0x7d, 0x78, 0xc4, 0x45,
	0x0d, 0x3c, 0xfb, 0x0e, 0xbb, 0x87, 0xd9, 0x86, 0x35, 0xe1, 0xf8, 0x0c, 0xea, 0x9c, 0xd1, 0xac,
	0x7d, 0x36, 0x4d, 0xd9, 0xcb, 0xca, 0x19, 0xbe, 0xf2, 0x97, 0x04, 0x8f, 0xba, 0xb8, 0xa0, 0x62,
	0xe2, 0x0f, 0x09, 0xa6, 0x0c, 0xfd, 0x04, 0x0d, 0x6e, 0x61, 0xdb, 0x23, 0x23, 0x86, 0x7f, 0x67,
	0x82, 0x02, 0x1f, 0x49, 0xd6, 0xa2, 0x70, 0x77, 0xda, 0x51, 0x8f, 0x12, 0x76, 0xad, 0x65, 0x11,
	0x66, 0xdd, 0x99, 0x2e, 0x78, 0xd1, 0x90, 0x38, 0xbe, 0x7d, 0x43, 0xdc, 0x19, 0xe1, 0xc2, 0xac,
	0x86, 0xe1, 0xf3, 0xa1, 0x7d, 0x48, 0x70, 0x82, 0xed, 0x14, 0xc7, 0x34, 0x20, 0xa3, 0x9c, 0x56,
	0x43, 0x80, 0xef, 0x32, 0x4c, 0x39, 0x86, 0x87, 0xb3, 0xc4, 0xa2, 0x70, 0x8c, 0x3a, 0x50, 0xb9,
	0x21, 0x6e, 0xce, 0x66, 0xa5, 0x65, 0x8b, 0x14, 0x1e, 0xab, 0xfc, 0x51, 0x81, 0x1d, 0x4d, 0xb8,
	0xe5, 0xd3, 0xb6, 0x58, 0x5c, 0x9f, 0xf2, 0x7f, 0xb9, 0x3e, 0x18, 0x9e, 0x14, 0x13, 0x9b, 0xe8,
	0xe3, 0x89, 0x91, 0xe7, 0x26, 0xfa, 0x6e, 0xd5, 0x39, 0xcb, 0xdc, 0x7b, 0x5a, 0x32, 0x77, 0xe8,
	0x32, 0x57, 0x7f, 0x94, 0xe0, 0xeb, 0x3b, 0x75, 0x7e, 0x0b, 0x78, 0xb3, 0x85, 0x15, 0xf2, 0xaa,
	0x1b, 0xa2, 0xea, 0x0f, 0xeb, 0x55, 0xbd, 0xe3, 0xd3, 0xd3, 0x92, 0xb9, 0x4b, 0xef, 0x0f, 0x79,
	0xd5, 0x00, 0x98, 0x76, 0xa9, 0x74, 0x01, 0x2d, 0x0c, 0xe3, 0xff, 0x8d, 0x75, 0xbf, 0x03, 0xb5,
	0x5c, 0x5a, 0x54, 0x87, 0x9a, 0xa5, 0x77, 0xdf, 0xe8, 0xbd, 0x7e, 0xb3, 0x84, 0x3e, 0x87, 0xcf,
	0xf2, 0x85, 0x7d, 0x65, 0xf4, 0x4f, 0x6d, 0xcd, 0x7a, 0x67, 0x9f, 0x18, 0x67, 0x7a, 0x53, 0xda,
	0x7f, 0x0b, 0xf2, 0xe4, 0x55, 0xe2, 0x49, 0x97, 0xbd, 0x9f, 0x7b, 0xe7, 0x57, 0xbd, 0x66, 0x09,
	0x35, 0xe0, 0x81, 0xde, 0x7b, 0x7b, 0xa9, 0x5f, 0xea, 0xc7, 0x4d, 0x09, 0x6d, 0x03, 0x5c, 0x98,
	0xe7, 0x9a, 0x6e, 0x59, 0x46, 0xaf, 0xdb, 0x2c, 0x23, 0x80, 0xea, 0xc9, 0x91, 0x71, 0xa6, 0x1f,
	0x37, 0x2b, 0x68, 0x0b, 0x64, 0xed, 0xfc, 0xcd, 0xc5, 0x99, 0xde, 0xd7, 0x8f, 0x9b, 0x1b, 0x87,
	0xff, 0x48, 0xd0, 0xd0, 0x68, 0x7a, 0x51, 0xd0, 0x44, 0x2e, 0xc0, 0xd4, 0xb3, 0xe8, 0xdb, 0x95,
	0x4f, 0xc2, 0xe2, 0x85, 0x6b, 0x7f, 0xb3, 0x4e, 0x68, 0x14, 0x8e, 0x95, 0x12, 0x7a, 0x0f, 0x5b,
	0x73, 0x1a, 0xa2, 0x95, 0xa6, 0x59, 0xe6, 0xfb, 0xf6, 0xfe, 0x9a, 0xd1, 0xa2, 0xd8, 0xab, 0xbd,
	0x5f, 0x9e, 0x2d, 0x7e, 0x32, 0x7f, 0x9c, 0x03, 0xdc, 0xaa, 0x78, 0x9f, 0x5f, 0xfc, 0x1b, 0x00,
	0x00, 0xff, 0xff, 0xdc, 0x00, 0xde, 0xa0, 0x5b, 0x07, 0x00, 0x00,
}
