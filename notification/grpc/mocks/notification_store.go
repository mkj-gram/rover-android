// Code generated by MockGen. DO NOT EDIT.
// Source: github.com/roverplatform/rover/notification/grpc (interfaces: NotificationStore)

// Package mocks is a generated GoMock package.
package mocks

import (
	context "context"
	gomock "github.com/golang/mock/gomock"
	scylla "github.com/roverplatform/rover/notification/scylla"
	reflect "reflect"
)

// MockNotificationStore is a mock of NotificationStore interface
type MockNotificationStore struct {
	ctrl     *gomock.Controller
	recorder *MockNotificationStoreMockRecorder
}

// MockNotificationStoreMockRecorder is the mock recorder for MockNotificationStore
type MockNotificationStoreMockRecorder struct {
	mock *MockNotificationStore
}

// NewMockNotificationStore creates a new mock instance
func NewMockNotificationStore(ctrl *gomock.Controller) *MockNotificationStore {
	mock := &MockNotificationStore{ctrl: ctrl}
	mock.recorder = &MockNotificationStoreMockRecorder{mock}
	return mock
}

// EXPECT returns an object that allows the caller to indicate expected use
func (m *MockNotificationStore) EXPECT() *MockNotificationStoreMockRecorder {
	return m.recorder
}

// List mocks base method
func (m *MockNotificationStore) List(arg0 context.Context, arg1 int32, arg2 string) ([]*scylla.Notification, error) {
	ret := m.ctrl.Call(m, "List", arg0, arg1, arg2)
	ret0, _ := ret[0].([]*scylla.Notification)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// List indicates an expected call of List
func (mr *MockNotificationStoreMockRecorder) List(arg0, arg1, arg2 interface{}) *gomock.Call {
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "List", reflect.TypeOf((*MockNotificationStore)(nil).List), arg0, arg1, arg2)
}
