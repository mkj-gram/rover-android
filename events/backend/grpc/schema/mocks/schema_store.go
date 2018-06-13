// Code generated by MockGen. DO NOT EDIT.
// Source: github.com/roverplatform/rover/events/backend/grpc/schema (interfaces: SchemaStore)

// Package mock_schema is a generated GoMock package.
package mocks

import (
	context "context"
	reflect "reflect"

	gomock "github.com/golang/mock/gomock"
	schema "github.com/roverplatform/rover/events/backend/schema"
)

// MockSchemaStore is a mock of SchemaStore interface
type MockSchemaStore struct {
	ctrl     *gomock.Controller
	recorder *MockSchemaStoreMockRecorder
}

// MockSchemaStoreMockRecorder is the mock recorder for MockSchemaStore
type MockSchemaStoreMockRecorder struct {
	mock *MockSchemaStore
}

// NewMockSchemaStore creates a new mock instance
func NewMockSchemaStore(ctrl *gomock.Controller) *MockSchemaStore {
	mock := &MockSchemaStore{ctrl: ctrl}
	mock.recorder = &MockSchemaStoreMockRecorder{mock}
	return mock
}

// EXPECT returns an object that allows the caller to indicate expected use
func (m *MockSchemaStore) EXPECT() *MockSchemaStoreMockRecorder {
	return m.recorder
}

// Find mocks base method
func (m *MockSchemaStore) Find(arg0 context.Context, arg1, arg2 int32) (*schema.EventSchema, error) {
	ret := m.ctrl.Call(m, "Find", arg0, arg1, arg2)
	ret0, _ := ret[0].(*schema.EventSchema)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// Find indicates an expected call of Find
func (mr *MockSchemaStoreMockRecorder) Find(arg0, arg1, arg2 interface{}) *gomock.Call {
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "Find", reflect.TypeOf((*MockSchemaStore)(nil).Find), arg0, arg1, arg2)
}
