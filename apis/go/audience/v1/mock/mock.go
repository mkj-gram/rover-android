// Code generated by MockGen. DO NOT EDIT.
// Source: github.com/roverplatform/rover/apis/go/audience/v1 (interfaces: AudienceClient)

// Package mock is a generated GoMock package.
package mock

import (
	context "context"
	gomock "github.com/golang/mock/gomock"
	v1 "github.com/roverplatform/rover/apis/go/audience/v1"
	grpc "google.golang.org/grpc"
	reflect "reflect"
)

// MockAudienceClient is a mock of AudienceClient interface
type MockAudienceClient struct {
	ctrl     *gomock.Controller
	recorder *MockAudienceClientMockRecorder
}

// MockAudienceClientMockRecorder is the mock recorder for MockAudienceClient
type MockAudienceClientMockRecorder struct {
	mock *MockAudienceClient
}

// NewMockAudienceClient creates a new mock instance
func NewMockAudienceClient(ctrl *gomock.Controller) *MockAudienceClient {
	mock := &MockAudienceClient{ctrl: ctrl}
	mock.recorder = &MockAudienceClientMockRecorder{mock}
	return mock
}

// EXPECT returns an object that allows the caller to indicate expected use
func (m *MockAudienceClient) EXPECT() *MockAudienceClientMockRecorder {
	return m.recorder
}

// CreateDevice mocks base method
func (m *MockAudienceClient) CreateDevice(arg0 context.Context, arg1 *v1.CreateDeviceRequest, arg2 ...grpc.CallOption) (*v1.CreateDeviceResponse, error) {
	varargs := []interface{}{arg0, arg1}
	for _, a := range arg2 {
		varargs = append(varargs, a)
	}
	ret := m.ctrl.Call(m, "CreateDevice", varargs...)
	ret0, _ := ret[0].(*v1.CreateDeviceResponse)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// CreateDevice indicates an expected call of CreateDevice
func (mr *MockAudienceClientMockRecorder) CreateDevice(arg0, arg1 interface{}, arg2 ...interface{}) *gomock.Call {
	varargs := append([]interface{}{arg0, arg1}, arg2...)
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "CreateDevice", reflect.TypeOf((*MockAudienceClient)(nil).CreateDevice), varargs...)
}

// CreateDynamicSegment mocks base method
func (m *MockAudienceClient) CreateDynamicSegment(arg0 context.Context, arg1 *v1.CreateDynamicSegmentRequest, arg2 ...grpc.CallOption) (*v1.CreateDynamicSegmentResponse, error) {
	varargs := []interface{}{arg0, arg1}
	for _, a := range arg2 {
		varargs = append(varargs, a)
	}
	ret := m.ctrl.Call(m, "CreateDynamicSegment", varargs...)
	ret0, _ := ret[0].(*v1.CreateDynamicSegmentResponse)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// CreateDynamicSegment indicates an expected call of CreateDynamicSegment
func (mr *MockAudienceClientMockRecorder) CreateDynamicSegment(arg0, arg1 interface{}, arg2 ...interface{}) *gomock.Call {
	varargs := append([]interface{}{arg0, arg1}, arg2...)
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "CreateDynamicSegment", reflect.TypeOf((*MockAudienceClient)(nil).CreateDynamicSegment), varargs...)
}

// CreateProfile mocks base method
func (m *MockAudienceClient) CreateProfile(arg0 context.Context, arg1 *v1.CreateProfileRequest, arg2 ...grpc.CallOption) (*v1.CreateProfileResponse, error) {
	varargs := []interface{}{arg0, arg1}
	for _, a := range arg2 {
		varargs = append(varargs, a)
	}
	ret := m.ctrl.Call(m, "CreateProfile", varargs...)
	ret0, _ := ret[0].(*v1.CreateProfileResponse)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// CreateProfile indicates an expected call of CreateProfile
func (mr *MockAudienceClientMockRecorder) CreateProfile(arg0, arg1 interface{}, arg2 ...interface{}) *gomock.Call {
	varargs := append([]interface{}{arg0, arg1}, arg2...)
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "CreateProfile", reflect.TypeOf((*MockAudienceClient)(nil).CreateProfile), varargs...)
}

// DeleteDevice mocks base method
func (m *MockAudienceClient) DeleteDevice(arg0 context.Context, arg1 *v1.DeleteDeviceRequest, arg2 ...grpc.CallOption) (*v1.DeleteDeviceResponse, error) {
	varargs := []interface{}{arg0, arg1}
	for _, a := range arg2 {
		varargs = append(varargs, a)
	}
	ret := m.ctrl.Call(m, "DeleteDevice", varargs...)
	ret0, _ := ret[0].(*v1.DeleteDeviceResponse)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// DeleteDevice indicates an expected call of DeleteDevice
func (mr *MockAudienceClientMockRecorder) DeleteDevice(arg0, arg1 interface{}, arg2 ...interface{}) *gomock.Call {
	varargs := append([]interface{}{arg0, arg1}, arg2...)
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "DeleteDevice", reflect.TypeOf((*MockAudienceClient)(nil).DeleteDevice), varargs...)
}

// DeleteProfile mocks base method
func (m *MockAudienceClient) DeleteProfile(arg0 context.Context, arg1 *v1.DeleteProfileRequest, arg2 ...grpc.CallOption) (*v1.DeleteProfileResponse, error) {
	varargs := []interface{}{arg0, arg1}
	for _, a := range arg2 {
		varargs = append(varargs, a)
	}
	ret := m.ctrl.Call(m, "DeleteProfile", varargs...)
	ret0, _ := ret[0].(*v1.DeleteProfileResponse)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// DeleteProfile indicates an expected call of DeleteProfile
func (mr *MockAudienceClientMockRecorder) DeleteProfile(arg0, arg1 interface{}, arg2 ...interface{}) *gomock.Call {
	varargs := append([]interface{}{arg0, arg1}, arg2...)
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "DeleteProfile", reflect.TypeOf((*MockAudienceClient)(nil).DeleteProfile), varargs...)
}

// DeviceIsInDynamicSegment mocks base method
func (m *MockAudienceClient) DeviceIsInDynamicSegment(arg0 context.Context, arg1 *v1.DeviceIsInDynamicSegmentRequest, arg2 ...grpc.CallOption) (*v1.DeviceIsInDynamicSegmentResponse, error) {
	varargs := []interface{}{arg0, arg1}
	for _, a := range arg2 {
		varargs = append(varargs, a)
	}
	ret := m.ctrl.Call(m, "DeviceIsInDynamicSegment", varargs...)
	ret0, _ := ret[0].(*v1.DeviceIsInDynamicSegmentResponse)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// DeviceIsInDynamicSegment indicates an expected call of DeviceIsInDynamicSegment
func (mr *MockAudienceClientMockRecorder) DeviceIsInDynamicSegment(arg0, arg1 interface{}, arg2 ...interface{}) *gomock.Call {
	varargs := append([]interface{}{arg0, arg1}, arg2...)
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "DeviceIsInDynamicSegment", reflect.TypeOf((*MockAudienceClient)(nil).DeviceIsInDynamicSegment), varargs...)
}

// GetDevice mocks base method
func (m *MockAudienceClient) GetDevice(arg0 context.Context, arg1 *v1.GetDeviceRequest, arg2 ...grpc.CallOption) (*v1.GetDeviceResponse, error) {
	varargs := []interface{}{arg0, arg1}
	for _, a := range arg2 {
		varargs = append(varargs, a)
	}
	ret := m.ctrl.Call(m, "GetDevice", varargs...)
	ret0, _ := ret[0].(*v1.GetDeviceResponse)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// GetDevice indicates an expected call of GetDevice
func (mr *MockAudienceClientMockRecorder) GetDevice(arg0, arg1 interface{}, arg2 ...interface{}) *gomock.Call {
	varargs := append([]interface{}{arg0, arg1}, arg2...)
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "GetDevice", reflect.TypeOf((*MockAudienceClient)(nil).GetDevice), varargs...)
}

// GetDeviceByPushToken mocks base method
func (m *MockAudienceClient) GetDeviceByPushToken(arg0 context.Context, arg1 *v1.GetDeviceByPushTokenRequest, arg2 ...grpc.CallOption) (*v1.GetDeviceByPushTokenResponse, error) {
	varargs := []interface{}{arg0, arg1}
	for _, a := range arg2 {
		varargs = append(varargs, a)
	}
	ret := m.ctrl.Call(m, "GetDeviceByPushToken", varargs...)
	ret0, _ := ret[0].(*v1.GetDeviceByPushTokenResponse)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// GetDeviceByPushToken indicates an expected call of GetDeviceByPushToken
func (mr *MockAudienceClientMockRecorder) GetDeviceByPushToken(arg0, arg1 interface{}, arg2 ...interface{}) *gomock.Call {
	varargs := append([]interface{}{arg0, arg1}, arg2...)
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "GetDeviceByPushToken", reflect.TypeOf((*MockAudienceClient)(nil).GetDeviceByPushToken), varargs...)
}

// GetDeviceSchema mocks base method
func (m *MockAudienceClient) GetDeviceSchema(arg0 context.Context, arg1 *v1.GetDeviceSchemaRequest, arg2 ...grpc.CallOption) (*v1.GetDeviceSchemaResponse, error) {
	varargs := []interface{}{arg0, arg1}
	for _, a := range arg2 {
		varargs = append(varargs, a)
	}
	ret := m.ctrl.Call(m, "GetDeviceSchema", varargs...)
	ret0, _ := ret[0].(*v1.GetDeviceSchemaResponse)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// GetDeviceSchema indicates an expected call of GetDeviceSchema
func (mr *MockAudienceClientMockRecorder) GetDeviceSchema(arg0, arg1 interface{}, arg2 ...interface{}) *gomock.Call {
	varargs := append([]interface{}{arg0, arg1}, arg2...)
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "GetDeviceSchema", reflect.TypeOf((*MockAudienceClient)(nil).GetDeviceSchema), varargs...)
}

// GetDevicesTotalCount mocks base method
func (m *MockAudienceClient) GetDevicesTotalCount(arg0 context.Context, arg1 *v1.GetDevicesTotalCountRequest, arg2 ...grpc.CallOption) (*v1.GetDevicesTotalCountResponse, error) {
	varargs := []interface{}{arg0, arg1}
	for _, a := range arg2 {
		varargs = append(varargs, a)
	}
	ret := m.ctrl.Call(m, "GetDevicesTotalCount", varargs...)
	ret0, _ := ret[0].(*v1.GetDevicesTotalCountResponse)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// GetDevicesTotalCount indicates an expected call of GetDevicesTotalCount
func (mr *MockAudienceClientMockRecorder) GetDevicesTotalCount(arg0, arg1 interface{}, arg2 ...interface{}) *gomock.Call {
	varargs := append([]interface{}{arg0, arg1}, arg2...)
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "GetDevicesTotalCount", reflect.TypeOf((*MockAudienceClient)(nil).GetDevicesTotalCount), varargs...)
}

// GetDynamicSegmentById mocks base method
func (m *MockAudienceClient) GetDynamicSegmentById(arg0 context.Context, arg1 *v1.GetDynamicSegmentByIdRequest, arg2 ...grpc.CallOption) (*v1.GetDynamicSegmentByIdResponse, error) {
	varargs := []interface{}{arg0, arg1}
	for _, a := range arg2 {
		varargs = append(varargs, a)
	}
	ret := m.ctrl.Call(m, "GetDynamicSegmentById", varargs...)
	ret0, _ := ret[0].(*v1.GetDynamicSegmentByIdResponse)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// GetDynamicSegmentById indicates an expected call of GetDynamicSegmentById
func (mr *MockAudienceClientMockRecorder) GetDynamicSegmentById(arg0, arg1 interface{}, arg2 ...interface{}) *gomock.Call {
	varargs := append([]interface{}{arg0, arg1}, arg2...)
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "GetDynamicSegmentById", reflect.TypeOf((*MockAudienceClient)(nil).GetDynamicSegmentById), varargs...)
}

// GetFieldSuggestion mocks base method
func (m *MockAudienceClient) GetFieldSuggestion(arg0 context.Context, arg1 *v1.GetFieldSuggestionRequest, arg2 ...grpc.CallOption) (*v1.GetFieldSuggestionResponse, error) {
	varargs := []interface{}{arg0, arg1}
	for _, a := range arg2 {
		varargs = append(varargs, a)
	}
	ret := m.ctrl.Call(m, "GetFieldSuggestion", varargs...)
	ret0, _ := ret[0].(*v1.GetFieldSuggestionResponse)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// GetFieldSuggestion indicates an expected call of GetFieldSuggestion
func (mr *MockAudienceClientMockRecorder) GetFieldSuggestion(arg0, arg1 interface{}, arg2 ...interface{}) *gomock.Call {
	varargs := append([]interface{}{arg0, arg1}, arg2...)
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "GetFieldSuggestion", reflect.TypeOf((*MockAudienceClient)(nil).GetFieldSuggestion), varargs...)
}

// GetProfile mocks base method
func (m *MockAudienceClient) GetProfile(arg0 context.Context, arg1 *v1.GetProfileRequest, arg2 ...grpc.CallOption) (*v1.GetProfileResponse, error) {
	varargs := []interface{}{arg0, arg1}
	for _, a := range arg2 {
		varargs = append(varargs, a)
	}
	ret := m.ctrl.Call(m, "GetProfile", varargs...)
	ret0, _ := ret[0].(*v1.GetProfileResponse)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// GetProfile indicates an expected call of GetProfile
func (mr *MockAudienceClientMockRecorder) GetProfile(arg0, arg1 interface{}, arg2 ...interface{}) *gomock.Call {
	varargs := append([]interface{}{arg0, arg1}, arg2...)
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "GetProfile", reflect.TypeOf((*MockAudienceClient)(nil).GetProfile), varargs...)
}

// GetProfileByDeviceId mocks base method
func (m *MockAudienceClient) GetProfileByDeviceId(arg0 context.Context, arg1 *v1.GetProfileByDeviceIdRequest, arg2 ...grpc.CallOption) (*v1.GetProfileByDeviceIdResponse, error) {
	varargs := []interface{}{arg0, arg1}
	for _, a := range arg2 {
		varargs = append(varargs, a)
	}
	ret := m.ctrl.Call(m, "GetProfileByDeviceId", varargs...)
	ret0, _ := ret[0].(*v1.GetProfileByDeviceIdResponse)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// GetProfileByDeviceId indicates an expected call of GetProfileByDeviceId
func (mr *MockAudienceClientMockRecorder) GetProfileByDeviceId(arg0, arg1 interface{}, arg2 ...interface{}) *gomock.Call {
	varargs := append([]interface{}{arg0, arg1}, arg2...)
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "GetProfileByDeviceId", reflect.TypeOf((*MockAudienceClient)(nil).GetProfileByDeviceId), varargs...)
}

// GetProfileByIdentifier mocks base method
func (m *MockAudienceClient) GetProfileByIdentifier(arg0 context.Context, arg1 *v1.GetProfileByIdentifierRequest, arg2 ...grpc.CallOption) (*v1.GetProfileByIdentifierResponse, error) {
	varargs := []interface{}{arg0, arg1}
	for _, a := range arg2 {
		varargs = append(varargs, a)
	}
	ret := m.ctrl.Call(m, "GetProfileByIdentifier", varargs...)
	ret0, _ := ret[0].(*v1.GetProfileByIdentifierResponse)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// GetProfileByIdentifier indicates an expected call of GetProfileByIdentifier
func (mr *MockAudienceClientMockRecorder) GetProfileByIdentifier(arg0, arg1 interface{}, arg2 ...interface{}) *gomock.Call {
	varargs := append([]interface{}{arg0, arg1}, arg2...)
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "GetProfileByIdentifier", reflect.TypeOf((*MockAudienceClient)(nil).GetProfileByIdentifier), varargs...)
}

// GetProfileSchema mocks base method
func (m *MockAudienceClient) GetProfileSchema(arg0 context.Context, arg1 *v1.GetProfileSchemaRequest, arg2 ...grpc.CallOption) (*v1.GetProfileSchemaResponse, error) {
	varargs := []interface{}{arg0, arg1}
	for _, a := range arg2 {
		varargs = append(varargs, a)
	}
	ret := m.ctrl.Call(m, "GetProfileSchema", varargs...)
	ret0, _ := ret[0].(*v1.GetProfileSchemaResponse)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// GetProfileSchema indicates an expected call of GetProfileSchema
func (mr *MockAudienceClientMockRecorder) GetProfileSchema(arg0, arg1 interface{}, arg2 ...interface{}) *gomock.Call {
	varargs := append([]interface{}{arg0, arg1}, arg2...)
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "GetProfileSchema", reflect.TypeOf((*MockAudienceClient)(nil).GetProfileSchema), varargs...)
}

// GetProfilesTotalCount mocks base method
func (m *MockAudienceClient) GetProfilesTotalCount(arg0 context.Context, arg1 *v1.GetProfilesTotalCountRequest, arg2 ...grpc.CallOption) (*v1.GetProfilesTotalCountResponse, error) {
	varargs := []interface{}{arg0, arg1}
	for _, a := range arg2 {
		varargs = append(varargs, a)
	}
	ret := m.ctrl.Call(m, "GetProfilesTotalCount", varargs...)
	ret0, _ := ret[0].(*v1.GetProfilesTotalCountResponse)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// GetProfilesTotalCount indicates an expected call of GetProfilesTotalCount
func (mr *MockAudienceClientMockRecorder) GetProfilesTotalCount(arg0, arg1 interface{}, arg2 ...interface{}) *gomock.Call {
	varargs := append([]interface{}{arg0, arg1}, arg2...)
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "GetProfilesTotalCount", reflect.TypeOf((*MockAudienceClient)(nil).GetProfilesTotalCount), varargs...)
}

// IsInDynamicSegment mocks base method
func (m *MockAudienceClient) IsInDynamicSegment(arg0 context.Context, arg1 *v1.IsInDynamicSegmentRequest, arg2 ...grpc.CallOption) (*v1.IsInDynamicSegmentResponse, error) {
	varargs := []interface{}{arg0, arg1}
	for _, a := range arg2 {
		varargs = append(varargs, a)
	}
	ret := m.ctrl.Call(m, "IsInDynamicSegment", varargs...)
	ret0, _ := ret[0].(*v1.IsInDynamicSegmentResponse)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// IsInDynamicSegment indicates an expected call of IsInDynamicSegment
func (mr *MockAudienceClientMockRecorder) IsInDynamicSegment(arg0, arg1 interface{}, arg2 ...interface{}) *gomock.Call {
	varargs := append([]interface{}{arg0, arg1}, arg2...)
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "IsInDynamicSegment", reflect.TypeOf((*MockAudienceClient)(nil).IsInDynamicSegment), varargs...)
}

// ListDevicesByProfileIdentifier mocks base method
func (m *MockAudienceClient) ListDevicesByProfileIdentifier(arg0 context.Context, arg1 *v1.ListDevicesByProfileIdentifierRequest, arg2 ...grpc.CallOption) (*v1.ListDevicesByProfileIdentifierResponse, error) {
	varargs := []interface{}{arg0, arg1}
	for _, a := range arg2 {
		varargs = append(varargs, a)
	}
	ret := m.ctrl.Call(m, "ListDevicesByProfileIdentifier", varargs...)
	ret0, _ := ret[0].(*v1.ListDevicesByProfileIdentifierResponse)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// ListDevicesByProfileIdentifier indicates an expected call of ListDevicesByProfileIdentifier
func (mr *MockAudienceClientMockRecorder) ListDevicesByProfileIdentifier(arg0, arg1 interface{}, arg2 ...interface{}) *gomock.Call {
	varargs := append([]interface{}{arg0, arg1}, arg2...)
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "ListDevicesByProfileIdentifier", reflect.TypeOf((*MockAudienceClient)(nil).ListDevicesByProfileIdentifier), varargs...)
}

// ListDynamicSegments mocks base method
func (m *MockAudienceClient) ListDynamicSegments(arg0 context.Context, arg1 *v1.ListDynamicSegmentsRequest, arg2 ...grpc.CallOption) (*v1.ListDynamicSegmentsResponse, error) {
	varargs := []interface{}{arg0, arg1}
	for _, a := range arg2 {
		varargs = append(varargs, a)
	}
	ret := m.ctrl.Call(m, "ListDynamicSegments", varargs...)
	ret0, _ := ret[0].(*v1.ListDynamicSegmentsResponse)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// ListDynamicSegments indicates an expected call of ListDynamicSegments
func (mr *MockAudienceClientMockRecorder) ListDynamicSegments(arg0, arg1 interface{}, arg2 ...interface{}) *gomock.Call {
	varargs := append([]interface{}{arg0, arg1}, arg2...)
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "ListDynamicSegments", reflect.TypeOf((*MockAudienceClient)(nil).ListDynamicSegments), varargs...)
}

// ListProfilesByIdentifiers mocks base method
func (m *MockAudienceClient) ListProfilesByIdentifiers(arg0 context.Context, arg1 *v1.ListProfilesByIdentifiersRequest, arg2 ...grpc.CallOption) (*v1.ListProfilesByIdentifiersResponse, error) {
	varargs := []interface{}{arg0, arg1}
	for _, a := range arg2 {
		varargs = append(varargs, a)
	}
	ret := m.ctrl.Call(m, "ListProfilesByIdentifiers", varargs...)
	ret0, _ := ret[0].(*v1.ListProfilesByIdentifiersResponse)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// ListProfilesByIdentifiers indicates an expected call of ListProfilesByIdentifiers
func (mr *MockAudienceClientMockRecorder) ListProfilesByIdentifiers(arg0, arg1 interface{}, arg2 ...interface{}) *gomock.Call {
	varargs := append([]interface{}{arg0, arg1}, arg2...)
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "ListProfilesByIdentifiers", reflect.TypeOf((*MockAudienceClient)(nil).ListProfilesByIdentifiers), varargs...)
}

// Query mocks base method
func (m *MockAudienceClient) Query(arg0 context.Context, arg1 *v1.QueryRequest, arg2 ...grpc.CallOption) (*v1.QueryResponse, error) {
	varargs := []interface{}{arg0, arg1}
	for _, a := range arg2 {
		varargs = append(varargs, a)
	}
	ret := m.ctrl.Call(m, "Query", varargs...)
	ret0, _ := ret[0].(*v1.QueryResponse)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// Query indicates an expected call of Query
func (mr *MockAudienceClientMockRecorder) Query(arg0, arg1 interface{}, arg2 ...interface{}) *gomock.Call {
	varargs := append([]interface{}{arg0, arg1}, arg2...)
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "Query", reflect.TypeOf((*MockAudienceClient)(nil).Query), varargs...)
}

// SetDeviceProfileIdentifier mocks base method
func (m *MockAudienceClient) SetDeviceProfileIdentifier(arg0 context.Context, arg1 *v1.SetDeviceProfileIdentifierRequest, arg2 ...grpc.CallOption) (*v1.SetDeviceProfileIdentifierResponse, error) {
	varargs := []interface{}{arg0, arg1}
	for _, a := range arg2 {
		varargs = append(varargs, a)
	}
	ret := m.ctrl.Call(m, "SetDeviceProfileIdentifier", varargs...)
	ret0, _ := ret[0].(*v1.SetDeviceProfileIdentifierResponse)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// SetDeviceProfileIdentifier indicates an expected call of SetDeviceProfileIdentifier
func (mr *MockAudienceClientMockRecorder) SetDeviceProfileIdentifier(arg0, arg1 interface{}, arg2 ...interface{}) *gomock.Call {
	varargs := append([]interface{}{arg0, arg1}, arg2...)
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "SetDeviceProfileIdentifier", reflect.TypeOf((*MockAudienceClient)(nil).SetDeviceProfileIdentifier), varargs...)
}

// UpdateDevice mocks base method
func (m *MockAudienceClient) UpdateDevice(arg0 context.Context, arg1 *v1.UpdateDeviceRequest, arg2 ...grpc.CallOption) (*v1.UpdateDeviceResponse, error) {
	varargs := []interface{}{arg0, arg1}
	for _, a := range arg2 {
		varargs = append(varargs, a)
	}
	ret := m.ctrl.Call(m, "UpdateDevice", varargs...)
	ret0, _ := ret[0].(*v1.UpdateDeviceResponse)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// UpdateDevice indicates an expected call of UpdateDevice
func (mr *MockAudienceClientMockRecorder) UpdateDevice(arg0, arg1 interface{}, arg2 ...interface{}) *gomock.Call {
	varargs := append([]interface{}{arg0, arg1}, arg2...)
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "UpdateDevice", reflect.TypeOf((*MockAudienceClient)(nil).UpdateDevice), varargs...)
}

// UpdateDeviceCustomAttributes mocks base method
func (m *MockAudienceClient) UpdateDeviceCustomAttributes(arg0 context.Context, arg1 *v1.UpdateDeviceCustomAttributesRequest, arg2 ...grpc.CallOption) (*v1.UpdateDeviceCustomAttributesResponse, error) {
	varargs := []interface{}{arg0, arg1}
	for _, a := range arg2 {
		varargs = append(varargs, a)
	}
	ret := m.ctrl.Call(m, "UpdateDeviceCustomAttributes", varargs...)
	ret0, _ := ret[0].(*v1.UpdateDeviceCustomAttributesResponse)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// UpdateDeviceCustomAttributes indicates an expected call of UpdateDeviceCustomAttributes
func (mr *MockAudienceClientMockRecorder) UpdateDeviceCustomAttributes(arg0, arg1 interface{}, arg2 ...interface{}) *gomock.Call {
	varargs := append([]interface{}{arg0, arg1}, arg2...)
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "UpdateDeviceCustomAttributes", reflect.TypeOf((*MockAudienceClient)(nil).UpdateDeviceCustomAttributes), varargs...)
}

// UpdateDeviceGeofenceMonitoring mocks base method
func (m *MockAudienceClient) UpdateDeviceGeofenceMonitoring(arg0 context.Context, arg1 *v1.UpdateDeviceGeofenceMonitoringRequest, arg2 ...grpc.CallOption) (*v1.UpdateDeviceGeofenceMonitoringResponse, error) {
	varargs := []interface{}{arg0, arg1}
	for _, a := range arg2 {
		varargs = append(varargs, a)
	}
	ret := m.ctrl.Call(m, "UpdateDeviceGeofenceMonitoring", varargs...)
	ret0, _ := ret[0].(*v1.UpdateDeviceGeofenceMonitoringResponse)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// UpdateDeviceGeofenceMonitoring indicates an expected call of UpdateDeviceGeofenceMonitoring
func (mr *MockAudienceClientMockRecorder) UpdateDeviceGeofenceMonitoring(arg0, arg1 interface{}, arg2 ...interface{}) *gomock.Call {
	varargs := append([]interface{}{arg0, arg1}, arg2...)
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "UpdateDeviceGeofenceMonitoring", reflect.TypeOf((*MockAudienceClient)(nil).UpdateDeviceGeofenceMonitoring), varargs...)
}

// UpdateDeviceIBeaconMonitoring mocks base method
func (m *MockAudienceClient) UpdateDeviceIBeaconMonitoring(arg0 context.Context, arg1 *v1.UpdateDeviceIBeaconMonitoringRequest, arg2 ...grpc.CallOption) (*v1.UpdateDeviceIBeaconMonitoringResponse, error) {
	varargs := []interface{}{arg0, arg1}
	for _, a := range arg2 {
		varargs = append(varargs, a)
	}
	ret := m.ctrl.Call(m, "UpdateDeviceIBeaconMonitoring", varargs...)
	ret0, _ := ret[0].(*v1.UpdateDeviceIBeaconMonitoringResponse)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// UpdateDeviceIBeaconMonitoring indicates an expected call of UpdateDeviceIBeaconMonitoring
func (mr *MockAudienceClientMockRecorder) UpdateDeviceIBeaconMonitoring(arg0, arg1 interface{}, arg2 ...interface{}) *gomock.Call {
	varargs := append([]interface{}{arg0, arg1}, arg2...)
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "UpdateDeviceIBeaconMonitoring", reflect.TypeOf((*MockAudienceClient)(nil).UpdateDeviceIBeaconMonitoring), varargs...)
}

// UpdateDeviceLabelProperty mocks base method
func (m *MockAudienceClient) UpdateDeviceLabelProperty(arg0 context.Context, arg1 *v1.UpdateDeviceLabelPropertyRequest, arg2 ...grpc.CallOption) (*v1.UpdateDeviceLabelPropertyResponse, error) {
	varargs := []interface{}{arg0, arg1}
	for _, a := range arg2 {
		varargs = append(varargs, a)
	}
	ret := m.ctrl.Call(m, "UpdateDeviceLabelProperty", varargs...)
	ret0, _ := ret[0].(*v1.UpdateDeviceLabelPropertyResponse)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// UpdateDeviceLabelProperty indicates an expected call of UpdateDeviceLabelProperty
func (mr *MockAudienceClientMockRecorder) UpdateDeviceLabelProperty(arg0, arg1 interface{}, arg2 ...interface{}) *gomock.Call {
	varargs := append([]interface{}{arg0, arg1}, arg2...)
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "UpdateDeviceLabelProperty", reflect.TypeOf((*MockAudienceClient)(nil).UpdateDeviceLabelProperty), varargs...)
}

// UpdateDeviceLocation mocks base method
func (m *MockAudienceClient) UpdateDeviceLocation(arg0 context.Context, arg1 *v1.UpdateDeviceLocationRequest, arg2 ...grpc.CallOption) (*v1.UpdateDeviceLocationResponse, error) {
	varargs := []interface{}{arg0, arg1}
	for _, a := range arg2 {
		varargs = append(varargs, a)
	}
	ret := m.ctrl.Call(m, "UpdateDeviceLocation", varargs...)
	ret0, _ := ret[0].(*v1.UpdateDeviceLocationResponse)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// UpdateDeviceLocation indicates an expected call of UpdateDeviceLocation
func (mr *MockAudienceClientMockRecorder) UpdateDeviceLocation(arg0, arg1 interface{}, arg2 ...interface{}) *gomock.Call {
	varargs := append([]interface{}{arg0, arg1}, arg2...)
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "UpdateDeviceLocation", reflect.TypeOf((*MockAudienceClient)(nil).UpdateDeviceLocation), varargs...)
}

// UpdateDevicePushToken mocks base method
func (m *MockAudienceClient) UpdateDevicePushToken(arg0 context.Context, arg1 *v1.UpdateDevicePushTokenRequest, arg2 ...grpc.CallOption) (*v1.UpdateDevicePushTokenResponse, error) {
	varargs := []interface{}{arg0, arg1}
	for _, a := range arg2 {
		varargs = append(varargs, a)
	}
	ret := m.ctrl.Call(m, "UpdateDevicePushToken", varargs...)
	ret0, _ := ret[0].(*v1.UpdateDevicePushTokenResponse)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// UpdateDevicePushToken indicates an expected call of UpdateDevicePushToken
func (mr *MockAudienceClientMockRecorder) UpdateDevicePushToken(arg0, arg1 interface{}, arg2 ...interface{}) *gomock.Call {
	varargs := append([]interface{}{arg0, arg1}, arg2...)
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "UpdateDevicePushToken", reflect.TypeOf((*MockAudienceClient)(nil).UpdateDevicePushToken), varargs...)
}

// UpdateDeviceTestProperty mocks base method
func (m *MockAudienceClient) UpdateDeviceTestProperty(arg0 context.Context, arg1 *v1.UpdateDeviceTestPropertyRequest, arg2 ...grpc.CallOption) (*v1.UpdateDeviceTestPropertyResponse, error) {
	varargs := []interface{}{arg0, arg1}
	for _, a := range arg2 {
		varargs = append(varargs, a)
	}
	ret := m.ctrl.Call(m, "UpdateDeviceTestProperty", varargs...)
	ret0, _ := ret[0].(*v1.UpdateDeviceTestPropertyResponse)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// UpdateDeviceTestProperty indicates an expected call of UpdateDeviceTestProperty
func (mr *MockAudienceClientMockRecorder) UpdateDeviceTestProperty(arg0, arg1 interface{}, arg2 ...interface{}) *gomock.Call {
	varargs := append([]interface{}{arg0, arg1}, arg2...)
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "UpdateDeviceTestProperty", reflect.TypeOf((*MockAudienceClient)(nil).UpdateDeviceTestProperty), varargs...)
}

// UpdateDeviceUnregisterPushToken mocks base method
func (m *MockAudienceClient) UpdateDeviceUnregisterPushToken(arg0 context.Context, arg1 *v1.UpdateDeviceUnregisterPushTokenRequest, arg2 ...grpc.CallOption) (*v1.UpdateDeviceUnregisterPushTokenResponse, error) {
	varargs := []interface{}{arg0, arg1}
	for _, a := range arg2 {
		varargs = append(varargs, a)
	}
	ret := m.ctrl.Call(m, "UpdateDeviceUnregisterPushToken", varargs...)
	ret0, _ := ret[0].(*v1.UpdateDeviceUnregisterPushTokenResponse)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// UpdateDeviceUnregisterPushToken indicates an expected call of UpdateDeviceUnregisterPushToken
func (mr *MockAudienceClientMockRecorder) UpdateDeviceUnregisterPushToken(arg0, arg1 interface{}, arg2 ...interface{}) *gomock.Call {
	varargs := append([]interface{}{arg0, arg1}, arg2...)
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "UpdateDeviceUnregisterPushToken", reflect.TypeOf((*MockAudienceClient)(nil).UpdateDeviceUnregisterPushToken), varargs...)
}

// UpdateDynamicSegmentArchiveStatus mocks base method
func (m *MockAudienceClient) UpdateDynamicSegmentArchiveStatus(arg0 context.Context, arg1 *v1.UpdateDynamicSegmentArchiveStatusRequest, arg2 ...grpc.CallOption) (*v1.UpdateDynamicSegmentArchiveStatusResponse, error) {
	varargs := []interface{}{arg0, arg1}
	for _, a := range arg2 {
		varargs = append(varargs, a)
	}
	ret := m.ctrl.Call(m, "UpdateDynamicSegmentArchiveStatus", varargs...)
	ret0, _ := ret[0].(*v1.UpdateDynamicSegmentArchiveStatusResponse)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// UpdateDynamicSegmentArchiveStatus indicates an expected call of UpdateDynamicSegmentArchiveStatus
func (mr *MockAudienceClientMockRecorder) UpdateDynamicSegmentArchiveStatus(arg0, arg1 interface{}, arg2 ...interface{}) *gomock.Call {
	varargs := append([]interface{}{arg0, arg1}, arg2...)
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "UpdateDynamicSegmentArchiveStatus", reflect.TypeOf((*MockAudienceClient)(nil).UpdateDynamicSegmentArchiveStatus), varargs...)
}

// UpdateDynamicSegmentPredicates mocks base method
func (m *MockAudienceClient) UpdateDynamicSegmentPredicates(arg0 context.Context, arg1 *v1.UpdateDynamicSegmentPredicatesRequest, arg2 ...grpc.CallOption) (*v1.UpdateDynamicSegmentPredicatesResponse, error) {
	varargs := []interface{}{arg0, arg1}
	for _, a := range arg2 {
		varargs = append(varargs, a)
	}
	ret := m.ctrl.Call(m, "UpdateDynamicSegmentPredicates", varargs...)
	ret0, _ := ret[0].(*v1.UpdateDynamicSegmentPredicatesResponse)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// UpdateDynamicSegmentPredicates indicates an expected call of UpdateDynamicSegmentPredicates
func (mr *MockAudienceClientMockRecorder) UpdateDynamicSegmentPredicates(arg0, arg1 interface{}, arg2 ...interface{}) *gomock.Call {
	varargs := append([]interface{}{arg0, arg1}, arg2...)
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "UpdateDynamicSegmentPredicates", reflect.TypeOf((*MockAudienceClient)(nil).UpdateDynamicSegmentPredicates), varargs...)
}

// UpdateDynamicSegmentTitle mocks base method
func (m *MockAudienceClient) UpdateDynamicSegmentTitle(arg0 context.Context, arg1 *v1.UpdateDynamicSegmentTitleRequest, arg2 ...grpc.CallOption) (*v1.UpdateDynamicSegmentTitleResponse, error) {
	varargs := []interface{}{arg0, arg1}
	for _, a := range arg2 {
		varargs = append(varargs, a)
	}
	ret := m.ctrl.Call(m, "UpdateDynamicSegmentTitle", varargs...)
	ret0, _ := ret[0].(*v1.UpdateDynamicSegmentTitleResponse)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// UpdateDynamicSegmentTitle indicates an expected call of UpdateDynamicSegmentTitle
func (mr *MockAudienceClientMockRecorder) UpdateDynamicSegmentTitle(arg0, arg1 interface{}, arg2 ...interface{}) *gomock.Call {
	varargs := append([]interface{}{arg0, arg1}, arg2...)
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "UpdateDynamicSegmentTitle", reflect.TypeOf((*MockAudienceClient)(nil).UpdateDynamicSegmentTitle), varargs...)
}

// UpdateProfile mocks base method
func (m *MockAudienceClient) UpdateProfile(arg0 context.Context, arg1 *v1.UpdateProfileRequest, arg2 ...grpc.CallOption) (*v1.UpdateProfileResponse, error) {
	varargs := []interface{}{arg0, arg1}
	for _, a := range arg2 {
		varargs = append(varargs, a)
	}
	ret := m.ctrl.Call(m, "UpdateProfile", varargs...)
	ret0, _ := ret[0].(*v1.UpdateProfileResponse)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// UpdateProfile indicates an expected call of UpdateProfile
func (mr *MockAudienceClientMockRecorder) UpdateProfile(arg0, arg1 interface{}, arg2 ...interface{}) *gomock.Call {
	varargs := append([]interface{}{arg0, arg1}, arg2...)
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "UpdateProfile", reflect.TypeOf((*MockAudienceClient)(nil).UpdateProfile), varargs...)
}
