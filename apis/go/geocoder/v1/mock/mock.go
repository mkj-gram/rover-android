// Code generated by MockGen. DO NOT EDIT.
// Source: github.com/roverplatform/rover/apis/go/geocoder/v1 (interfaces: GeocoderClient)

// Package mock is a generated GoMock package.
package mock

import (
	context "context"
	gomock "github.com/golang/mock/gomock"
	v1 "github.com/roverplatform/rover/apis/go/geocoder/v1"
	grpc "google.golang.org/grpc"
	reflect "reflect"
)

// MockGeocoderClient is a mock of GeocoderClient interface
type MockGeocoderClient struct {
	ctrl     *gomock.Controller
	recorder *MockGeocoderClientMockRecorder
}

// MockGeocoderClientMockRecorder is the mock recorder for MockGeocoderClient
type MockGeocoderClientMockRecorder struct {
	mock *MockGeocoderClient
}

// NewMockGeocoderClient creates a new mock instance
func NewMockGeocoderClient(ctrl *gomock.Controller) *MockGeocoderClient {
	mock := &MockGeocoderClient{ctrl: ctrl}
	mock.recorder = &MockGeocoderClientMockRecorder{mock}
	return mock
}

// EXPECT returns an object that allows the caller to indicate expected use
func (m *MockGeocoderClient) EXPECT() *MockGeocoderClientMockRecorder {
	return m.recorder
}

// ReverseGeocode mocks base method
func (m *MockGeocoderClient) ReverseGeocode(arg0 context.Context, arg1 *v1.ReverseGeocodeRequest, arg2 ...grpc.CallOption) (*v1.ReverseGeocodeResponse, error) {
	varargs := []interface{}{arg0, arg1}
	for _, a := range arg2 {
		varargs = append(varargs, a)
	}
	ret := m.ctrl.Call(m, "ReverseGeocode", varargs...)
	ret0, _ := ret[0].(*v1.ReverseGeocodeResponse)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// ReverseGeocode indicates an expected call of ReverseGeocode
func (mr *MockGeocoderClientMockRecorder) ReverseGeocode(arg0, arg1 interface{}, arg2 ...interface{}) *gomock.Call {
	varargs := append([]interface{}{arg0, arg1}, arg2...)
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "ReverseGeocode", reflect.TypeOf((*MockGeocoderClient)(nil).ReverseGeocode), varargs...)
}
