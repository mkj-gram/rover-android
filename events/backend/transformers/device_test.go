package transformers_test

import (
	"context"
	"testing"

	"github.com/golang/mock/gomock"
	"github.com/pkg/errors"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	"github.com/roverplatform/rover/apis/go/audience/v1"
	"github.com/roverplatform/rover/apis/go/audience/v1/mock"
	"github.com/roverplatform/rover/apis/go/auth/v1"
	"github.com/roverplatform/rover/apis/go/event/v1"
	"github.com/roverplatform/rover/apis/go/geocoder/v1"
	gmock "github.com/roverplatform/rover/apis/go/geocoder/v1/mock"
	"github.com/roverplatform/rover/apis/go/protobuf"
	"github.com/roverplatform/rover/apis/go/protobuf/struct"
	"github.com/roverplatform/rover/apis/go/protobuf/wrappers"
	"github.com/roverplatform/rover/events/backend/pipeline"
	"github.com/roverplatform/rover/events/backend/transformers"

	rtesting "github.com/roverplatform/rover/go/testing"
)

func TestFindDeviceTransformer(t *testing.T) {
	// Unit testing can be run in parallel
	t.Parallel()

	var (
		ctx = context.Background()
	)

	testcases := []struct {
		desc string
		req  event.Event

		exp       event.Event
		clientExp func(c *mock.MockAudienceClient)
		expErr    error
	}{
		{
			desc: "returns event when GetDevice is not found",

			req: event.Event{
				Input: &event.EventInput{
					AuthContext: &auth.AuthContext{AccountId: 1},
					Type: &event.EventInput_DeviceEventInput{
						DeviceEventInput: &event.DeviceEventInput{
							DeviceId: "hello",
						},
					},
				},

				Source: &event.Event_DeviceSource{
					DeviceSource: &event.DeviceSource{},
				},
			},

			exp: event.Event{
				Input: &event.EventInput{
					AuthContext: &auth.AuthContext{AccountId: 1},
					Type: &event.EventInput_DeviceEventInput{
						DeviceEventInput: &event.DeviceEventInput{
							DeviceId: "hello",
						},
					},
				},

				Source: &event.Event_DeviceSource{
					DeviceSource: &event.DeviceSource{},
				},
			},

			clientExp: func(c *mock.MockAudienceClient) {
				c.EXPECT().GetDevice(gomock.Any(), gomock.Any()).Return(nil, status.Error(codes.NotFound, "GetDevice: NOT_FOUND"))
			},

			expErr: nil,
		},

		{
			desc: "returns retryable error when internal code 13",
			req: event.Event{
				Input: &event.EventInput{
					AuthContext: &auth.AuthContext{AccountId: 1},
					Type: &event.EventInput_DeviceEventInput{
						DeviceEventInput: &event.DeviceEventInput{
							DeviceId: "hello",
						},
					},
				},

				Source: &event.Event_DeviceSource{
					DeviceSource: &event.DeviceSource{},
				},
			},

			exp: event.Event{
				Input: &event.EventInput{
					AuthContext: &auth.AuthContext{AccountId: 1},
					Type: &event.EventInput_DeviceEventInput{
						DeviceEventInput: &event.DeviceEventInput{
							DeviceId: "hello",
						},
					},
				},

				Source: &event.Event_DeviceSource{
					DeviceSource: &event.DeviceSource{},
				},
			},

			clientExp: func(c *mock.MockAudienceClient) {
				c.EXPECT().GetDevice(gomock.Any(), gomock.Any()).Return(nil, status.Error(codes.Internal, "GetDevice: Boom!"))
			},

			expErr: pipeline.NewRetryableError(errors.New("FindDevice: rpc error: code = Internal desc = GetDevice: Boom!")),
		},
		{
			desc: "returns error when error is not retryable",
			req: event.Event{
				Input: &event.EventInput{
					AuthContext: &auth.AuthContext{AccountId: 1},
					Type: &event.EventInput_DeviceEventInput{
						DeviceEventInput: &event.DeviceEventInput{
							DeviceId: "hello",
						},
					},
				},

				Source: &event.Event_DeviceSource{
					DeviceSource: &event.DeviceSource{},
				},
			},

			exp: event.Event{
				Input: &event.EventInput{
					AuthContext: &auth.AuthContext{AccountId: 1},
					Type: &event.EventInput_DeviceEventInput{
						DeviceEventInput: &event.DeviceEventInput{
							DeviceId: "hello",
						},
					},
				},

				Source: &event.Event_DeviceSource{
					DeviceSource: &event.DeviceSource{},
				},
			},

			clientExp: func(c *mock.MockAudienceClient) {
				c.EXPECT().GetDevice(gomock.Any(), gomock.Any()).Return(nil, status.Error(codes.Unauthenticated, "GetDevice: Go Away"))
			},

			expErr: errors.New("FindDevice: rpc error: code = Unauthenticated desc = GetDevice: Go Away"),
		},
		{
			desc: "calls audience GetDevice with the correct device id",

			req: event.Event{
				Input: &event.EventInput{
					AuthContext: &auth.AuthContext{AccountId: 1},
					Type: &event.EventInput_DeviceEventInput{
						DeviceEventInput: &event.DeviceEventInput{
							DeviceId: "82aea58c-25f1-11e8-b467-0ed5f89f718b",
						},
					},
				},

				Source: &event.Event_DeviceSource{
					DeviceSource: &event.DeviceSource{},
				},
			},

			exp: event.Event{
				Input: &event.EventInput{
					AuthContext: &auth.AuthContext{AccountId: 1},
					Type: &event.EventInput_DeviceEventInput{
						DeviceEventInput: &event.DeviceEventInput{
							DeviceId: "82aea58c-25f1-11e8-b467-0ed5f89f718b",
						},
					},
				},

				Source: &event.Event_DeviceSource{
					DeviceSource: &event.DeviceSource{},
				},
			},

			clientExp: func(c *mock.MockAudienceClient) {
				c.EXPECT().GetDevice(gomock.Any(), &audience.GetDeviceRequest{
					AuthContext: &auth.AuthContext{AccountId: 1},
					DeviceId:    "82aea58c-25f1-11e8-b467-0ed5f89f718b",
				}).Return(nil, status.Error(codes.NotFound, "GetDevice: NOT_FOUND"))
			},

			expErr: nil,
		},
		{
			desc: "attaches found device to device source",

			req: event.Event{
				Input: &event.EventInput{
					AuthContext: &auth.AuthContext{AccountId: 1},
					Type: &event.EventInput_DeviceEventInput{
						DeviceEventInput: &event.DeviceEventInput{
							DeviceId: "82aea58c-25f1-11e8-b467-0ed5f89f718b",
						},
					},
				},

				Source: &event.Event_DeviceSource{
					DeviceSource: &event.DeviceSource{},
				},
			},

			exp: event.Event{
				Input: &event.EventInput{
					AuthContext: &auth.AuthContext{AccountId: 1},
					Type: &event.EventInput_DeviceEventInput{
						DeviceEventInput: &event.DeviceEventInput{
							DeviceId: "82aea58c-25f1-11e8-b467-0ed5f89f718b",
						},
					},
				},

				Source: &event.Event_DeviceSource{
					DeviceSource: &event.DeviceSource{
						Device: &audience.Device{
							AccountId: 1,
							DeviceId:  "82aea58c-25f1-11e8-b467-0ed5f89f718b",
							AppName:   "Toilet Paper Hunter",
						},
					},
				},
			},

			clientExp: func(c *mock.MockAudienceClient) {
				c.EXPECT().GetDevice(gomock.Any(), gomock.Any()).Return(&audience.GetDeviceResponse{
					Device: &audience.Device{
						AccountId: 1,
						DeviceId:  "82aea58c-25f1-11e8-b467-0ed5f89f718b",
						AppName:   "Toilet Paper Hunter",
					},
				}, nil)
			},

			expErr: nil,
		},
	}

	for _, tc := range testcases {
		t.Run(tc.desc, func(t *testing.T) {
			var (
				ctrl   = gomock.NewController(t)
				client = mock.NewMockAudienceClient(ctrl)
				tr     = transformers.FindDevice(client)
			)

			tc.clientExp(client)

			var gotErr = tr.Handle(ctx, &tc.req)
			if diff := rtesting.Diff(tc.exp, tc.req, tc.expErr, gotErr); diff != nil {
				t.Fatalf("\nDiff:\n%v", rtesting.Difff(diff))
			}

			ctrl.Finish()
		})
	}
}

func TestCreateDeviceTransformer(t *testing.T) {
	// Unit testing can be run in parallel
	t.Parallel()

	var (
		ctx = context.Background()
	)

	testcases := []struct {
		desc string
		req  event.Event

		exp       event.Event
		clientExp func(c *mock.MockAudienceClient)
		expErr    error
	}{
		{
			desc: "does not attempt to create device if event has a device",

			req: event.Event{
				Input: &event.EventInput{
					AuthContext: &auth.AuthContext{AccountId: 1},
					Type: &event.EventInput_DeviceEventInput{
						DeviceEventInput: &event.DeviceEventInput{
							DeviceId: "hello",
						},
					},
				},

				Source: &event.Event_DeviceSource{
					DeviceSource: &event.DeviceSource{
						Device: &audience.Device{
							DeviceId: "hello",
						},
					},
				},
			},

			clientExp: func(c *mock.MockAudienceClient) {
				c.EXPECT().CreateDevice(gomock.Any(), gomock.Any()).Return(nil, nil).Times(0)
			},

			exp: event.Event{
				Input: &event.EventInput{
					AuthContext: &auth.AuthContext{AccountId: 1},
					Type: &event.EventInput_DeviceEventInput{
						DeviceEventInput: &event.DeviceEventInput{
							DeviceId: "hello",
						},
					},
				},

				Source: &event.Event_DeviceSource{
					DeviceSource: &event.DeviceSource{
						Device: &audience.Device{
							DeviceId: "hello",
						},
					},
				},
			},
		},
		{
			desc: "returns retryable error when status code is 13",

			req: event.Event{
				Input: &event.EventInput{
					AuthContext: &auth.AuthContext{AccountId: 1},
					Type: &event.EventInput_DeviceEventInput{
						DeviceEventInput: &event.DeviceEventInput{
							DeviceId: "hello",
						},
					},
				},

				Source: &event.Event_DeviceSource{
					DeviceSource: &event.DeviceSource{},
				},
			},

			clientExp: func(c *mock.MockAudienceClient) {
				c.EXPECT().CreateDevice(gomock.Any(), gomock.Any()).Return(nil, status.Error(codes.Internal, "Internal Server Error"))
			},

			expErr: pipeline.NewRetryableError(errors.New("CreateDevice: rpc error: code = Internal desc = Internal Server Error")),
		},
		{
			// This means the find transformer did not find the device for some reason we should give it another chance to find it again
			desc: "returns error when status code is already exists",

			req: event.Event{
				Input: &event.EventInput{
					AuthContext: &auth.AuthContext{AccountId: 1},
					Type: &event.EventInput_DeviceEventInput{
						DeviceEventInput: &event.DeviceEventInput{
							DeviceId: "hello",
						},
					},
				},

				Source: &event.Event_DeviceSource{
					DeviceSource: &event.DeviceSource{},
				},
			},

			clientExp: func(c *mock.MockAudienceClient) {
				c.EXPECT().CreateDevice(gomock.Any(), gomock.Any()).Return(nil, status.Error(codes.AlreadyExists, "Device Already Exists"))
			},

			expErr: pipeline.NewRetryableError(errors.New("CreateDevice: rpc error: code = AlreadyExists desc = Device Already Exists")),
		},
		{
			desc: "creates a device with a profile identifier",

			req: event.Event{
				Input: &event.EventInput{
					AuthContext: &auth.AuthContext{AccountId: 1},
					Type: &event.EventInput_DeviceEventInput{
						DeviceEventInput: &event.DeviceEventInput{
							DeviceId: "hello",
							Context: &event.DeviceContext{
								ProfileIdentifier: "fork",
							},
						},
					},
				},

				Source: &event.Event_DeviceSource{
					DeviceSource: &event.DeviceSource{},
				},
			},

			clientExp: func(c *mock.MockAudienceClient) {
				c.EXPECT().CreateDevice(gomock.Any(), &audience.CreateDeviceRequest{
					AuthContext:       &auth.AuthContext{AccountId: 1},
					DeviceId:          "hello",
					ProfileIdentifier: "fork",
				}).Return(&audience.CreateDeviceResponse{
					Device: &audience.Device{
						DeviceId:          "hello",
						ProfileIdentifier: "fork",
					},
				}, nil)
			},

			exp: event.Event{
				Input: &event.EventInput{
					AuthContext: &auth.AuthContext{AccountId: 1},
					Type: &event.EventInput_DeviceEventInput{
						DeviceEventInput: &event.DeviceEventInput{
							DeviceId: "hello",
							Context: &event.DeviceContext{
								ProfileIdentifier: "fork",
							},
						},
					},
				},

				Source: &event.Event_DeviceSource{
					DeviceSource: &event.DeviceSource{
						Device: &audience.Device{
							DeviceId:          "hello",
							ProfileIdentifier: "fork",
						},
					},
				},
			},
		},
	}

	for _, tc := range testcases {
		t.Run(tc.desc, func(t *testing.T) {
			var (
				ctrl   = gomock.NewController(t)
				client = mock.NewMockAudienceClient(ctrl)
				tr     = transformers.CreateDevice(client)
			)

			tc.clientExp(client)

			var gotErr = tr.Handle(ctx, &tc.req)
			if diff := rtesting.Diff(tc.exp, tc.req, tc.expErr, gotErr); diff != nil {
				t.Fatalf("\nDiff:\n%v", rtesting.Difff(diff))
			}

			ctrl.Finish()
		})
	}
}

func TestSetDeviceProfileTransformer(t *testing.T) {
	// Unit testing can be run in parallel
	t.Parallel()

	var (
		ctx = context.Background()
	)

	testcases := []struct {
		desc string
		req  event.Event

		exp       event.Event
		clientExp func(c *mock.MockAudienceClient)
		expErr    error
	}{
		{
			desc: "does not set profile when context is missing",

			req: event.Event{
				Input: &event.EventInput{
					AuthContext: &auth.AuthContext{AccountId: 1},
					Type: &event.EventInput_DeviceEventInput{
						DeviceEventInput: &event.DeviceEventInput{
							DeviceId: "hello",
						},
					},
				},

				Source: &event.Event_DeviceSource{
					DeviceSource: &event.DeviceSource{
						Device: &audience.Device{
							DeviceId: "hello",
						},
					},
				},
			},

			clientExp: func(c *mock.MockAudienceClient) {
				c.EXPECT().SetDeviceProfileIdentifier(gomock.Any(), gomock.Any()).Return(nil, nil).Times(0)
			},

			exp: event.Event{
				Input: &event.EventInput{
					AuthContext: &auth.AuthContext{AccountId: 1},
					Type: &event.EventInput_DeviceEventInput{
						DeviceEventInput: &event.DeviceEventInput{
							DeviceId: "hello",
						},
					},
				},

				Source: &event.Event_DeviceSource{
					DeviceSource: &event.DeviceSource{
						Device: &audience.Device{
							DeviceId: "hello",
						},
					},
				},
			},
		},
		{
			desc: "does not set profile when profile identifier has not changed",

			req: event.Event{
				Input: &event.EventInput{
					AuthContext: &auth.AuthContext{AccountId: 1},
					Type: &event.EventInput_DeviceEventInput{
						DeviceEventInput: &event.DeviceEventInput{
							DeviceId: "hello",
							Context: &event.DeviceContext{
								ProfileIdentifier: "ID",
							},
						},
					},
				},

				Source: &event.Event_DeviceSource{
					DeviceSource: &event.DeviceSource{
						Device: &audience.Device{
							DeviceId:          "hello",
							ProfileIdentifier: "ID",
						},
					},
				},
			},

			clientExp: func(c *mock.MockAudienceClient) {
				c.EXPECT().SetDeviceProfileIdentifier(gomock.Any(), gomock.Any()).Return(nil, nil).Times(0)
			},

			exp: event.Event{
				Input: &event.EventInput{
					AuthContext: &auth.AuthContext{AccountId: 1},
					Type: &event.EventInput_DeviceEventInput{
						DeviceEventInput: &event.DeviceEventInput{
							DeviceId: "hello",
							Context: &event.DeviceContext{
								ProfileIdentifier: "ID",
							},
						},
					},
				},

				Source: &event.Event_DeviceSource{
					DeviceSource: &event.DeviceSource{
						Device: &audience.Device{
							DeviceId:          "hello",
							ProfileIdentifier: "ID",
						},
					},
				},
			},
		},
		{
			desc: "does not set profile when profile identifier has not changed",

			req: event.Event{
				Input: &event.EventInput{
					AuthContext: &auth.AuthContext{AccountId: 1},
					Type: &event.EventInput_DeviceEventInput{
						DeviceEventInput: &event.DeviceEventInput{
							DeviceId: "hello",
							Context: &event.DeviceContext{
								ProfileIdentifier: "ID",
							},
						},
					},
				},

				Source: &event.Event_DeviceSource{
					DeviceSource: &event.DeviceSource{
						Device: &audience.Device{
							DeviceId:          "hello",
							ProfileIdentifier: "ID",
						},
					},
				},
			},

			clientExp: func(c *mock.MockAudienceClient) {
				c.EXPECT().SetDeviceProfileIdentifier(gomock.Any(), gomock.Any()).Return(nil, nil).Times(0)
			},

			exp: event.Event{
				Input: &event.EventInput{
					AuthContext: &auth.AuthContext{AccountId: 1},
					Type: &event.EventInput_DeviceEventInput{
						DeviceEventInput: &event.DeviceEventInput{
							DeviceId: "hello",
							Context: &event.DeviceContext{
								ProfileIdentifier: "ID",
							},
						},
					},
				},

				Source: &event.Event_DeviceSource{
					DeviceSource: &event.DeviceSource{
						Device: &audience.Device{
							DeviceId:          "hello",
							ProfileIdentifier: "ID",
						},
					},
				},
			},
		},
		{
			desc: "returns retryable error when audience responds with Internal Code",

			req: event.Event{
				Input: &event.EventInput{
					AuthContext: &auth.AuthContext{AccountId: 1},
					Type: &event.EventInput_DeviceEventInput{
						DeviceEventInput: &event.DeviceEventInput{
							DeviceId: "hello",
							Context: &event.DeviceContext{
								ProfileIdentifier: "NEW_ID",
							},
						},
					},
				},

				Source: &event.Event_DeviceSource{
					DeviceSource: &event.DeviceSource{
						Device: &audience.Device{
							DeviceId:          "hello",
							ProfileIdentifier: "ID",
						},
					},
				},
			},

			clientExp: func(c *mock.MockAudienceClient) {
				c.EXPECT().SetDeviceProfileIdentifier(gomock.Any(), gomock.Any()).Return(nil, status.Error(codes.Internal, "Boom"))
			},

			exp: event.Event{
				Input: &event.EventInput{
					AuthContext: &auth.AuthContext{AccountId: 1},
					Type: &event.EventInput_DeviceEventInput{
						DeviceEventInput: &event.DeviceEventInput{
							DeviceId: "hello",
							Context: &event.DeviceContext{
								ProfileIdentifier: "NEW_ID",
							},
						},
					},
				},

				Source: &event.Event_DeviceSource{
					DeviceSource: &event.DeviceSource{
						Device: &audience.Device{
							DeviceId:          "hello",
							ProfileIdentifier: "ID",
						},
					},
				},
			},

			expErr: pipeline.NewRetryableError(errors.New("SetDeviceProfile: rpc error: code = Internal desc = Boom")),
		},
		{
			desc: "returns error when audience responds with invalid argument",

			req: event.Event{
				Input: &event.EventInput{
					AuthContext: &auth.AuthContext{AccountId: 1},
					Type: &event.EventInput_DeviceEventInput{
						DeviceEventInput: &event.DeviceEventInput{
							DeviceId: "hello",
							Context: &event.DeviceContext{
								ProfileIdentifier: "NEW_ID",
							},
						},
					},
				},

				Source: &event.Event_DeviceSource{
					DeviceSource: &event.DeviceSource{
						Device: &audience.Device{
							DeviceId:          "hello",
							ProfileIdentifier: "ID",
						},
					},
				},
			},

			clientExp: func(c *mock.MockAudienceClient) {
				c.EXPECT().SetDeviceProfileIdentifier(gomock.Any(), gomock.Any()).Return(nil, status.Error(codes.InvalidArgument, "Go Away"))
			},

			exp: event.Event{
				Input: &event.EventInput{
					AuthContext: &auth.AuthContext{AccountId: 1},
					Type: &event.EventInput_DeviceEventInput{
						DeviceEventInput: &event.DeviceEventInput{
							DeviceId: "hello",
							Context: &event.DeviceContext{
								ProfileIdentifier: "NEW_ID",
							},
						},
					},
				},

				Source: &event.Event_DeviceSource{
					DeviceSource: &event.DeviceSource{
						Device: &audience.Device{
							DeviceId:          "hello",
							ProfileIdentifier: "ID",
						},
					},
				},
			},

			expErr: errors.New("SetDeviceProfile: rpc error: code = InvalidArgument desc = Go Away"),
		},
		{
			desc: "sets the device profile without modifying input",

			req: event.Event{
				Input: &event.EventInput{
					AuthContext: &auth.AuthContext{AccountId: 1},
					Type: &event.EventInput_DeviceEventInput{
						DeviceEventInput: &event.DeviceEventInput{
							DeviceId: "hello",
							Context: &event.DeviceContext{
								ProfileIdentifier: "NEW_ID",
							},
						},
					},
				},

				Source: &event.Event_DeviceSource{
					DeviceSource: &event.DeviceSource{
						Device: &audience.Device{
							DeviceId:          "hello",
							ProfileIdentifier: "ID",
						},
					},
				},
			},

			clientExp: func(c *mock.MockAudienceClient) {
				c.EXPECT().SetDeviceProfileIdentifier(gomock.Any(), &audience.SetDeviceProfileIdentifierRequest{
					AuthContext:       &auth.AuthContext{AccountId: 1},
					DeviceId:          "hello",
					ProfileIdentifier: "NEW_ID",
				}).Return(nil, nil).Times(1)
			},

			exp: event.Event{
				Input: &event.EventInput{
					AuthContext: &auth.AuthContext{AccountId: 1},
					Type: &event.EventInput_DeviceEventInput{
						DeviceEventInput: &event.DeviceEventInput{
							DeviceId: "hello",
							Context: &event.DeviceContext{
								ProfileIdentifier: "NEW_ID",
							},
						},
					},
				},

				Source: &event.Event_DeviceSource{
					DeviceSource: &event.DeviceSource{
						Device: &audience.Device{
							DeviceId:          "hello",
							ProfileIdentifier: "NEW_ID",
						},
					},
				},
			},
		},
	}

	for _, tc := range testcases {
		t.Run(tc.desc, func(t *testing.T) {
			var (
				ctrl   = gomock.NewController(t)
				client = mock.NewMockAudienceClient(ctrl)
				tr     = transformers.SetDeviceProfile(client)
			)

			tc.clientExp(client)

			var gotErr = tr.Handle(ctx, &tc.req)
			if diff := rtesting.Diff(tc.exp, tc.req, tc.expErr, gotErr); diff != nil {
				t.Fatalf("\nDiff:\n%v", rtesting.Difff(diff))
			}

			ctrl.Finish()
		})
	}
}

func TestUpdateDeviceWithContextTransformer(t *testing.T) {
	// Unit testing can be run in parallel
	t.Parallel()

	var (
		ctx = context.Background()
	)

	testcases := []struct {
		desc string
		req  event.Event

		exp       event.Event
		clientExp func(c *mock.MockAudienceClient)
		expErr    error
	}{
		{
			desc: "does not update device when context is missing",

			req: event.Event{
				Input: &event.EventInput{
					AuthContext: &auth.AuthContext{AccountId: 1},
					Type: &event.EventInput_DeviceEventInput{
						DeviceEventInput: &event.DeviceEventInput{
							DeviceId: "hello",
						},
					},
				},

				Source: &event.Event_DeviceSource{
					DeviceSource: &event.DeviceSource{
						Device: &audience.Device{
							DeviceId: "hello",
						},
					},
				},
			},

			clientExp: func(c *mock.MockAudienceClient) {
				c.EXPECT().UpdateDevice(gomock.Any(), gomock.Any()).Return(nil, nil).Times(0)
			},

			exp: event.Event{
				Input: &event.EventInput{
					AuthContext: &auth.AuthContext{AccountId: 1},
					Type: &event.EventInput_DeviceEventInput{
						DeviceEventInput: &event.DeviceEventInput{
							DeviceId: "hello",
						},
					},
				},

				Source: &event.Event_DeviceSource{
					DeviceSource: &event.DeviceSource{
						Device: &audience.Device{
							DeviceId: "hello",
						},
					},
				},
			},
		},

		{
			desc: "updates device",

			req: event.Event{
				Input: &event.EventInput{
					AuthContext: &auth.AuthContext{AccountId: 1},
					Type: &event.EventInput_DeviceEventInput{
						DeviceEventInput: &event.DeviceEventInput{
							DeviceId: "hello",
							Context: &event.DeviceContext{
								ProfileIdentifier:         "abc",
								Attributes:                nil,
								AppBuild:                  "build 33",
								AppName:                   "Kimchi Fried Rice Finder",
								AppNamespace:              "korea.Rice",
								AppVersion:                "55",
								AppBadgeNumber:            &wrappers.Int32Value{Value: 33},
								DeviceManufacturer:        "Apple",
								DeviceModel:               "iPhone 7,2",
								IsLocationServicesEnabled: wrappers.Bool(true),
								LocationAuthorization:     audience.LocationAuthorization_AUTHORIZED_WHEN_IN_USE,
								LocaleLanguage:            "en",
								LocaleRegion:              "ca",
								LocaleScript:              "",
								OperatingSystemName:       "iOS",
								OperatingSystemVersion:    &rover_protobuf.Version{Major: 1, Minor: 2, Revision: 5},
								NotificationAuthorization: audience.NotificationAuthorization_DENIED,
								PushEnvironment:           audience.PushEnvironment_PRODUCTION,
								PushToken:                 "0A6BBB46-2880-11E8-B467-0ED5F89F718B",
								Radio:                     "LTE",
								CarrierName:               "rogers",
								TimeZone:                  "America/Toronto",
								Ip:                        "206.248.180.234",
								IsCellularEnabled:         wrappers.Bool(true),
								IsWifiEnabled:             wrappers.Bool(false),
								ScreenWidth:               720,
								ScreenHeight:              480,
								Frameworks: map[string]*rover_protobuf.Version{
									"io.rover.Rover": {
										Major:    5,
										Minor:    2,
										Revision: 0,
									},
								},
								DeviceName:    "McCafe Phone",
								AdvertisingId: "LNCNIGXXWQ",
							},
						},
					},
				},

				Source: &event.Event_DeviceSource{
					DeviceSource: &event.DeviceSource{
						Device: &audience.Device{
							DeviceId: "hello",
						},
					},
				},
			},

			clientExp: func(c *mock.MockAudienceClient) {
				c.EXPECT().UpdateDevice(gomock.Any(), &audience.UpdateDeviceRequest{
					AuthContext: &auth.AuthContext{AccountId: 1},
					DeviceId:    "hello",

					PushEnvironment:    audience.PushEnvironment_PRODUCTION,
					PushTokenKey:       "0A6BBB46-2880-11E8-B467-0ED5F89F718B",
					AppName:            "Kimchi Fried Rice Finder",
					AppVersion:         "55",
					AppBuild:           "build 33",
					AppNamespace:       "korea.Rice",
					DeviceManufacturer: "Apple",
					OsName:             "iOS",
					OsVersion:          &audience.Version{Major: 1, Minor: 2, Revision: 5},
					DeviceModel:        "iPhone 6",
					DeviceModelRaw:     "iPhone 7,2",
					Frameworks: map[string]*audience.Version{
						"io.rover.Rover": {
							Major:    5,
							Minor:    2,
							Revision: 0,
						},
					},
					LocaleLanguage:              "en",
					LocaleRegion:                "ca",
					LocaleScript:                "",
					IsWifiEnabled:               wrappers.Bool(false),
					IsCellularEnabled:           wrappers.Bool(true),
					ScreenWidth:                 720,
					ScreenHeight:                480,
					CarrierName:                 "rogers",
					Radio:                       "LTE",
					TimeZone:                    "America/Toronto",
					Platform:                    audience.Platform_MOBILE,
					IsLocationMonitoringEnabled: true,
					IsBluetoothEnabled:          nil,
					AdvertisingId:               "LNCNIGXXWQ",
					Ip:                          "206.248.180.234",
					NotificationAuthorization: audience.NotificationAuthorization_DENIED,
				}).Return(&audience.UpdateDeviceResponse{
					Device: &audience.Device{
						DeviceId:           "hello",
						PushEnvironment:    audience.PushEnvironment_PRODUCTION,
						PushTokenKey:       "0A6BBB46-2880-11E8-B467-0ED5F89F718B",
						AppName:            "Kimchi Fried Rice Finder",
						AppVersion:         "55",
						AppBuild:           "build 33",
						AppNamespace:       "korea.Rice",
						DeviceManufacturer: "Apple",
						OsName:             "iOS",
						OsVersion:          &audience.Version{Major: 1, Minor: 2, Revision: 5},
						DeviceModel:        "iPhone 6",
						Frameworks: map[string]*audience.Version{
							"io.rover.Rover": {
								Major:    5,
								Minor:    2,
								Revision: 0,
							},
						},
						LocaleLanguage:              "en",
						LocaleRegion:                "ca",
						LocaleScript:                "",
						IsWifiEnabled:               wrappers.Bool(false),
						IsCellularEnabled:           wrappers.Bool(true),
						ScreenWidth:                 720,
						ScreenHeight:                480,
						CarrierName:                 "rogers",
						Radio:                       "LTE",
						TimeZone:                    "America/Toronto",
						Platform:                    audience.Platform_MOBILE,
						IsLocationMonitoringEnabled: true,
						IsBluetoothEnabled:          nil,
						AdvertisingId:               "LNCNIGXXWQ",
						Ip:                          "206.248.180.234",
						NotificationAuthorization: audience.NotificationAuthorization_DENIED,
					},
				}, nil)
			},

			exp: event.Event{
				Input: &event.EventInput{
					AuthContext: &auth.AuthContext{AccountId: 1},
					Type: &event.EventInput_DeviceEventInput{
						DeviceEventInput: &event.DeviceEventInput{
							DeviceId: "hello",
							Context: &event.DeviceContext{
								ProfileIdentifier:         "abc",
								Attributes:                nil,
								AppBuild:                  "build 33",
								AppName:                   "Kimchi Fried Rice Finder",
								AppNamespace:              "korea.Rice",
								AppVersion:                "55",
								AppBadgeNumber:            &wrappers.Int32Value{Value: 33},
								DeviceManufacturer:        "Apple",
								DeviceModel:               "iPhone 7,2",
								IsLocationServicesEnabled: wrappers.Bool(true),
								LocationAuthorization:     audience.LocationAuthorization_AUTHORIZED_WHEN_IN_USE,
								LocaleLanguage:            "en",
								LocaleRegion:              "ca",
								LocaleScript:              "",
								OperatingSystemName:       "iOS",
								OperatingSystemVersion:    &rover_protobuf.Version{Major: 1, Minor: 2, Revision: 5},
								NotificationAuthorization: audience.NotificationAuthorization_DENIED,
								PushEnvironment:           audience.PushEnvironment_PRODUCTION,
								PushToken:                 "0A6BBB46-2880-11E8-B467-0ED5F89F718B",
								Radio:                     "LTE",
								CarrierName:               "rogers",
								TimeZone:                  "America/Toronto",
								Ip:                        "206.248.180.234",
								IsCellularEnabled:         wrappers.Bool(true),
								IsWifiEnabled:             wrappers.Bool(false),
								ScreenWidth:               720,
								ScreenHeight:              480,
								Frameworks: map[string]*rover_protobuf.Version{
									"io.rover.Rover": {
										Major:    5,
										Minor:    2,
										Revision: 0,
									},
								},
								DeviceName:    "McCafe Phone",
								AdvertisingId: "LNCNIGXXWQ",
							},
						},
					},
				},

				Source: &event.Event_DeviceSource{
					DeviceSource: &event.DeviceSource{
						Device: &audience.Device{
							DeviceId:           "hello",
							PushEnvironment:    audience.PushEnvironment_PRODUCTION,
							PushTokenKey:       "0A6BBB46-2880-11E8-B467-0ED5F89F718B",
							AppName:            "Kimchi Fried Rice Finder",
							AppVersion:         "55",
							AppBuild:           "build 33",
							AppNamespace:       "korea.Rice",
							DeviceManufacturer: "Apple",
							OsName:             "iOS",
							OsVersion:          &audience.Version{Major: 1, Minor: 2, Revision: 5},
							DeviceModel:        "iPhone 6",
							Frameworks: map[string]*audience.Version{
								"io.rover.Rover": {
									Major:    5,
									Minor:    2,
									Revision: 0,
								},
							},
							LocaleLanguage:              "en",
							LocaleRegion:                "ca",
							LocaleScript:                "",
							IsWifiEnabled:               wrappers.Bool(false),
							IsCellularEnabled:           wrappers.Bool(true),
							ScreenWidth:                 720,
							ScreenHeight:                480,
							CarrierName:                 "rogers",
							Radio:                       "LTE",
							TimeZone:                    "America/Toronto",
							Platform:                    audience.Platform_MOBILE,
							IsLocationMonitoringEnabled: true,
							IsBluetoothEnabled:          nil,
							AdvertisingId:               "LNCNIGXXWQ",
							Ip:                          "206.248.180.234",
							NotificationAuthorization: audience.NotificationAuthorization_DENIED,
						},
					},
				},
			},
		},
	}

	for _, tc := range testcases {
		t.Run(tc.desc, func(t *testing.T) {
			var (
				ctrl   = gomock.NewController(t)
				client = mock.NewMockAudienceClient(ctrl)
				m      = map[string]string{
					"iPhone 7,2": "iPhone 6",
				}
				tr = transformers.UpdateDeviceWithContext(client, func(s string) string { return m[s] })
			)

			tc.clientExp(client)

			var gotErr = tr.Handle(ctx, &tc.req)
			if diff := rtesting.Diff(tc.exp, tc.req, tc.expErr, gotErr); diff != nil {
				t.Fatalf("\nDiff:\n%v", rtesting.Difff(diff))
			}

			ctrl.Finish()
		})
	}
}

// Benchmark if reflect.DeepEqual
func BenchmarkUpdateDeviceCustomAttributes(b *testing.B) {

	var (
		ctx = context.Background()
		req = &event.Event{
			Input: &event.EventInput{
				AuthContext: &auth.AuthContext{AccountId: 1},
				Type: &event.EventInput_DeviceEventInput{
					DeviceEventInput: &event.DeviceEventInput{
						DeviceId: "hello",
						Context: &event.DeviceContext{
							Attributes: &structpb.Struct{
								Fields: map[string]*structpb.Value{
									"string": structpb.String("chris"),
									"number": structpb.Number(33),
									"tags":   structpb.ListVal("a", "b", "c"),
								},
							},
						},
					},
				},
			},

			Source: &event.Event_DeviceSource{
				DeviceSource: &event.DeviceSource{
					Device: &audience.Device{
						DeviceId: "hello",
						Attributes: map[string]*audience.Value{
							"string": audience.StringVal("chris"),
							"number": audience.DoubleVal(33),
							"tags":   audience.StringArrayVal("a", "b", "c"),
						},
					},
				},
			},
		}

		handler = transformers.UpdateDeviceCustomAttributes(nil)
	)

	for n := 0; n < b.N; n++ {
		handler.Handle(ctx, req)
	}

}

func TestUpdateDeviceCustomAttributesTransformer(t *testing.T) {
	// Unit testing can be run in parallel
	t.Parallel()

	var (
		ctx = context.Background()
	)

	testcases := []struct {
		desc string
		req  event.Event

		exp       event.Event
		clientExp func(c *mock.MockAudienceClient)
		expErr    error
	}{
		{
			desc: "does not update custom attributes when context is missing",
			req: event.Event{
				Input: &event.EventInput{
					AuthContext: &auth.AuthContext{AccountId: 1},
					Type: &event.EventInput_DeviceEventInput{
						DeviceEventInput: &event.DeviceEventInput{
							DeviceId: "hello",
						},
					},
				},

				Source: &event.Event_DeviceSource{
					DeviceSource: &event.DeviceSource{
						Device: &audience.Device{
							DeviceId: "hello",
						},
					},
				},
			},

			clientExp: func(c *mock.MockAudienceClient) {
				c.EXPECT().UpdateDeviceCustomAttributes(gomock.Any(), gomock.Any()).Return(nil, nil).Times(0)
			},

			exp: event.Event{
				Input: &event.EventInput{
					AuthContext: &auth.AuthContext{AccountId: 1},
					Type: &event.EventInput_DeviceEventInput{
						DeviceEventInput: &event.DeviceEventInput{
							DeviceId: "hello",
						},
					},
				},

				Source: &event.Event_DeviceSource{
					DeviceSource: &event.DeviceSource{
						Device: &audience.Device{
							DeviceId: "hello",
						},
					},
				},
			},
		},

		{
			desc: "does not update custom attributes when attributes are equivalent",
			req: event.Event{
				Input: &event.EventInput{
					AuthContext: &auth.AuthContext{AccountId: 1},
					Type: &event.EventInput_DeviceEventInput{
						DeviceEventInput: &event.DeviceEventInput{
							DeviceId: "hello",
							Context: &event.DeviceContext{
								Attributes: &structpb.Struct{
									Fields: map[string]*structpb.Value{
										"string": structpb.String("chris"),
										"number": structpb.Number(33),
										"tags":   structpb.ListVal("a", "b", "c"),
									},
								},
							},
						},
					},
				},

				Source: &event.Event_DeviceSource{
					DeviceSource: &event.DeviceSource{
						Device: &audience.Device{
							DeviceId: "hello",
							Attributes: map[string]*audience.Value{
								"string": audience.StringVal("chris"),
								"number": audience.DoubleVal(33),
								"tags":   audience.StringArrayVal("a", "b", "c"),
							},
						},
					},
				},
			},

			clientExp: func(c *mock.MockAudienceClient) {
				c.EXPECT().UpdateDeviceCustomAttributes(gomock.Any(), gomock.Any()).Return(nil, nil).Times(0)
			},

			exp: event.Event{
				Input: &event.EventInput{
					AuthContext: &auth.AuthContext{AccountId: 1},
					Type: &event.EventInput_DeviceEventInput{
						DeviceEventInput: &event.DeviceEventInput{
							DeviceId: "hello",
							Context: &event.DeviceContext{
								Attributes: &structpb.Struct{
									Fields: map[string]*structpb.Value{
										"string": structpb.String("chris"),
										"number": structpb.Number(33),
										"tags":   structpb.ListVal("a", "b", "c"),
									},
								},
							},
						},
					},
				},

				Source: &event.Event_DeviceSource{
					DeviceSource: &event.DeviceSource{
						Device: &audience.Device{
							DeviceId: "hello",
							Attributes: map[string]*audience.Value{
								"string": audience.StringVal("chris"),
								"number": audience.DoubleVal(33),
								"tags":   audience.StringArrayVal("a", "b", "c"),
							},
						},
					},
				},
			},
		},
		{
			desc: "updates the device's custom attributes",
			req: event.Event{
				Input: &event.EventInput{
					AuthContext: &auth.AuthContext{AccountId: 1},
					Type: &event.EventInput_DeviceEventInput{
						DeviceEventInput: &event.DeviceEventInput{
							DeviceId: "hello",
							Context: &event.DeviceContext{
								Attributes: &structpb.Struct{
									Fields: map[string]*structpb.Value{
										"string": structpb.String("chris"),
										"number": structpb.Number(33),
										"bool":   structpb.Bool(true),
										"null":   structpb.Null,
										"tags":   structpb.ListVal("a", "b", "c"),
									},
								},
							},
						},
					},
				},

				Source: &event.Event_DeviceSource{
					DeviceSource: &event.DeviceSource{
						Device: &audience.Device{
							DeviceId:   "hello",
							Attributes: nil,
						},
					},
				},
			},

			clientExp: func(c *mock.MockAudienceClient) {
				c.EXPECT().UpdateDeviceCustomAttributes(gomock.Any(), &audience.UpdateDeviceCustomAttributesRequest{
					AuthContext: &auth.AuthContext{AccountId: 1},
					DeviceId:    "hello",
					Attributes: map[string]*audience.Value{
						"string": audience.StringVal("chris"),
						"number": audience.DoubleVal(33),
						"bool":   audience.BoolVal(true),
						"null":   audience.NullVal,
						"tags":   audience.StringArrayVal("a", "b", "c"),
					},
				}).Return(&audience.UpdateDeviceCustomAttributesResponse{}, nil)
			},

			exp: event.Event{
				Input: &event.EventInput{
					AuthContext: &auth.AuthContext{AccountId: 1},
					Type: &event.EventInput_DeviceEventInput{
						DeviceEventInput: &event.DeviceEventInput{
							DeviceId: "hello",
							Context: &event.DeviceContext{
								Attributes: &structpb.Struct{
									Fields: map[string]*structpb.Value{
										"string": structpb.String("chris"),
										"number": structpb.Number(33),
										"bool":   structpb.Bool(true),
										"null":   structpb.Null,
										"tags":   structpb.ListVal("a", "b", "c"),
									},
								},
							},
						},
					},
				},

				Source: &event.Event_DeviceSource{
					DeviceSource: &event.DeviceSource{
						Device: &audience.Device{
							DeviceId: "hello",
							Attributes: map[string]*audience.Value{
								"string": audience.StringVal("chris"),
								"number": audience.DoubleVal(33),
								"bool":   audience.BoolVal(true),
								"null":   audience.NullVal,
								"tags":   audience.StringArrayVal("a", "b", "c"),
							},
						},
					},
				},
			},
		},
	}

	for _, tc := range testcases {
		t.Run(tc.desc, func(t *testing.T) {
			var (
				ctrl   = gomock.NewController(t)
				client = mock.NewMockAudienceClient(ctrl)
				tr     = transformers.UpdateDeviceCustomAttributes(client)
			)

			tc.clientExp(client)

			var gotErr = tr.Handle(ctx, &tc.req)
			if diff := rtesting.Diff(tc.exp, tc.req, tc.expErr, gotErr); diff != nil {
				t.Fatalf("\nDiff:\n%v", rtesting.Difff(diff))
			}

			ctrl.Finish()
		})
	}
}

func TestUpdateDeviceLocation(t *testing.T) {
	// Unit testing can be run in parallel
	t.Parallel()

	var (
		ctx = context.Background()
	)

	testcases := []struct {
		desc string
		req  event.Event

		exp       event.Event
		clientExp func(c *mock.MockAudienceClient, c2 *gmock.MockGeocoderClient)
		expErr    error
	}{
		{
			desc: "skips processing when namespace is not rover",
			req: event.Event{
				Input: &event.EventInput{
					AuthContext: &auth.AuthContext{AccountId: 1},
					Type: &event.EventInput_DeviceEventInput{
						DeviceEventInput: &event.DeviceEventInput{
							DeviceId: "hello",
							Context:  &event.DeviceContext{},
						},
					},

					Namespace: "mcdonalds",
					Name:      "Location Update",
				},

				Source: &event.Event_DeviceSource{
					DeviceSource: &event.DeviceSource{
						Device: &audience.Device{
							DeviceId: "hello",
						},
					},
				},
			},

			clientExp: func(c *mock.MockAudienceClient, c2 *gmock.MockGeocoderClient) {
				c.EXPECT().UpdateDeviceLocation(gomock.Any(), gomock.Any()).Return(nil, nil).Times(0)
				c2.EXPECT().ReverseGeocode(gomock.Any(), gomock.Any()).Return(nil, nil).Times(0)
			},

			exp: event.Event{
				Input: &event.EventInput{
					AuthContext: &auth.AuthContext{AccountId: 1},
					Type: &event.EventInput_DeviceEventInput{
						DeviceEventInput: &event.DeviceEventInput{
							DeviceId: "hello",
							Context:  &event.DeviceContext{},
						},
					},

					Namespace: "mcdonalds",
					Name:      "Location Update",
				},

				Source: &event.Event_DeviceSource{
					DeviceSource: &event.DeviceSource{
						Device: &audience.Device{
							DeviceId: "hello",
						},
					},
				},
			},
		},
		{
			desc: "skips processing when event name is not Location Update",
			req: event.Event{
				Input: &event.EventInput{
					AuthContext: &auth.AuthContext{AccountId: 1},
					Type: &event.EventInput_DeviceEventInput{
						DeviceEventInput: &event.DeviceEventInput{
							DeviceId: "hello",
							Context:  &event.DeviceContext{},
						},
					},

					Namespace: "rover",
					Name:      "Rotated Phone 90 Degrees",
				},

				Source: &event.Event_DeviceSource{
					DeviceSource: &event.DeviceSource{
						Device: &audience.Device{
							DeviceId: "hello",
						},
					},
				},
			},

			clientExp: func(c *mock.MockAudienceClient, c2 *gmock.MockGeocoderClient) {
				c.EXPECT().UpdateDeviceLocation(gomock.Any(), gomock.Any()).Return(nil, nil).Times(0)
				c2.EXPECT().ReverseGeocode(gomock.Any(), gomock.Any()).Return(nil, nil).Times(0)
			},

			exp: event.Event{
				Input: &event.EventInput{
					AuthContext: &auth.AuthContext{AccountId: 1},
					Type: &event.EventInput_DeviceEventInput{
						DeviceEventInput: &event.DeviceEventInput{
							DeviceId: "hello",
							Context:  &event.DeviceContext{},
						},
					},

					Namespace: "rover",
					Name:      "Rotated Phone 90 Degrees",
				},

				Source: &event.Event_DeviceSource{
					DeviceSource: &event.DeviceSource{
						Device: &audience.Device{
							DeviceId: "hello",
						},
					},
				},
			},
		},
		{
			desc: "does not update location when context is missing",
			req: event.Event{
				Input: &event.EventInput{
					AuthContext: &auth.AuthContext{AccountId: 1},
					Type: &event.EventInput_DeviceEventInput{
						DeviceEventInput: &event.DeviceEventInput{
							DeviceId: "hello",
						},
					},

					Namespace: "rover",
					Name:      "Location Update",
				},

				Source: &event.Event_DeviceSource{
					DeviceSource: &event.DeviceSource{
						Device: &audience.Device{
							DeviceId: "hello",
						},
					},
				},
			},

			clientExp: func(c *mock.MockAudienceClient, c2 *gmock.MockGeocoderClient) {
				c.EXPECT().UpdateDeviceLocation(gomock.Any(), gomock.Any()).Return(nil, nil).Times(0)
				c2.EXPECT().ReverseGeocode(gomock.Any(), gomock.Any()).Return(nil, nil).Times(0)
			},

			exp: event.Event{
				Input: &event.EventInput{
					AuthContext: &auth.AuthContext{AccountId: 1},
					Type: &event.EventInput_DeviceEventInput{
						DeviceEventInput: &event.DeviceEventInput{
							DeviceId: "hello",
						},
					},

					Namespace: "rover",
					Name:      "Location Update",
				},

				Source: &event.Event_DeviceSource{
					DeviceSource: &event.DeviceSource{
						Device: &audience.Device{
							DeviceId: "hello",
						},
					},
				},
			},
		},
		{
			desc: "updates location without reverse geocoded properties when geocoder returns error",
			req: event.Event{
				Input: &event.EventInput{
					AuthContext: &auth.AuthContext{AccountId: 1},
					Type: &event.EventInput_DeviceEventInput{
						DeviceEventInput: &event.DeviceEventInput{
							DeviceId: "hello",
							Context:  &event.DeviceContext{},
						},
					},

					Namespace: "rover",
					Name:      "Location Update",
					Attributes: &structpb.Struct{
						Fields: map[string]*structpb.Value{
							"latitude":  structpb.Number(10),
							"longitude": structpb.Number(-33),
							"accuracy":  structpb.Number(50),
						},
					},
				},

				Source: &event.Event_DeviceSource{
					DeviceSource: &event.DeviceSource{
						Device: &audience.Device{
							DeviceId:   "hello",
							Attributes: nil,
						},
					},
				},
			},

			clientExp: func(c *mock.MockAudienceClient, c2 *gmock.MockGeocoderClient) {
				geocodeCall := c2.EXPECT().ReverseGeocode(gomock.Any(), &geocoder.ReverseGeocodeRequest{
					Latitude:  10,
					Longitude: -33,
					Accuracy:  50,
				}).Return(nil, status.Error(codes.InvalidArgument, "Nope"))

				c.EXPECT().UpdateDeviceLocation(gomock.Any(), &audience.UpdateDeviceLocationRequest{
					AuthContext:       &auth.AuthContext{AccountId: 1},
					DeviceId:          "hello",
					LocationLatitude:  10,
					LocationLongitude: -33,
					LocationAccuracy:  50,
				}).After(geocodeCall)
			},

			exp: event.Event{
				Input: &event.EventInput{
					AuthContext: &auth.AuthContext{AccountId: 1},
					Type: &event.EventInput_DeviceEventInput{
						DeviceEventInput: &event.DeviceEventInput{
							DeviceId: "hello",
							Context:  &event.DeviceContext{},
						},
					},

					Namespace: "rover",
					Name:      "Location Update",
					Attributes: &structpb.Struct{
						Fields: map[string]*structpb.Value{
							"latitude":  structpb.Number(10),
							"longitude": structpb.Number(-33),
							"accuracy":  structpb.Number(50),
						},
					},
				},

				Source: &event.Event_DeviceSource{
					DeviceSource: &event.DeviceSource{
						Device: &audience.Device{
							DeviceId:          "hello",
							LocationLatitude:  10,
							LocationLongitude: -33,
							LocationAccuracy:  50,
						},
					},
				},
			},
		},
		{
			desc: "updates device location with reverse gecoded properties",
			req: event.Event{
				Input: &event.EventInput{
					AuthContext: &auth.AuthContext{AccountId: 1},
					Type: &event.EventInput_DeviceEventInput{
						DeviceEventInput: &event.DeviceEventInput{
							DeviceId: "hello",
							Context:  &event.DeviceContext{},
						},
					},

					Namespace: "rover",
					Name:      "Location Update",
					Attributes: &structpb.Struct{
						Fields: map[string]*structpb.Value{
							"latitude":  structpb.Number(43.962168),
							"longitude": structpb.Number(-78.972495),
							"accuracy":  structpb.Number(1337),
						},
					},
				},

				Source: &event.Event_DeviceSource{
					DeviceSource: &event.DeviceSource{
						Device: &audience.Device{
							DeviceId:   "hello",
							Attributes: nil,
						},
					},
				},
			},

			clientExp: func(c *mock.MockAudienceClient, c2 *gmock.MockGeocoderClient) {
				geocodeCall := c2.EXPECT().ReverseGeocode(gomock.Any(), &geocoder.ReverseGeocodeRequest{
					Latitude:  43.962168,
					Longitude: -78.972495,
					Accuracy:  1337,
				}).Return(&geocoder.ReverseGeocodeResponse{
					Country: "Canada",
					State:   "Ontario",
					City:    "Brooklin",
				}, nil)

				c.EXPECT().UpdateDeviceLocation(gomock.Any(), &audience.UpdateDeviceLocationRequest{
					AuthContext:       &auth.AuthContext{AccountId: 1},
					DeviceId:          "hello",
					LocationLatitude:  43.962168,
					LocationLongitude: -78.972495,
					LocationAccuracy:  1337,
					LocationCountry:   "Canada",
					LocationState:     "Ontario",
					LocationCity:      "Brooklin",
				}).After(geocodeCall)
			},

			exp: event.Event{
				Input: &event.EventInput{
					AuthContext: &auth.AuthContext{AccountId: 1},
					Type: &event.EventInput_DeviceEventInput{
						DeviceEventInput: &event.DeviceEventInput{
							DeviceId: "hello",
							Context:  &event.DeviceContext{},
						},
					},

					Namespace: "rover",
					Name:      "Location Update",
					Attributes: &structpb.Struct{
						Fields: map[string]*structpb.Value{
							"latitude":  structpb.Number(43.962168),
							"longitude": structpb.Number(-78.972495),
							"accuracy":  structpb.Number(1337),
						},
					},
				},

				Source: &event.Event_DeviceSource{
					DeviceSource: &event.DeviceSource{
						Device: &audience.Device{
							DeviceId:          "hello",
							LocationLatitude:  43.962168,
							LocationLongitude: -78.972495,
							LocationAccuracy:  1337,
							LocationCountry:   "Canada",
							LocationState:     "Ontario",
							LocationCity:      "Brooklin",
						},
					},
				},
			},
		},
	}

	for _, tc := range testcases {
		t.Run(tc.desc, func(t *testing.T) {
			var (
				ctrl    = gomock.NewController(t)
				aclient = mock.NewMockAudienceClient(ctrl)
				gclient = gmock.NewMockGeocoderClient(ctrl)
				tr      = transformers.UpdateDeviceLocation(aclient, gclient)
			)

			tc.clientExp(aclient, gclient)

			var gotErr = tr.Handle(ctx, &tc.req)
			if diff := rtesting.Diff(tc.exp, tc.req, tc.expErr, gotErr); diff != nil {
				t.Fatalf("\nDiff:\n%v", rtesting.Difff(diff))
			}

			ctrl.Finish()
		})
	}
}

func TestUpdateDeviceName(t *testing.T) {
	// Unit testing can be run in parallel
	t.Parallel()

	var (
		ctx = context.Background()
	)

	testcases := []struct {
		desc string
		req  event.Event

		exp       event.Event
		clientExp func(c *mock.MockAudienceClient)
		expErr    error
	}{
		{
			desc: "does not update device name when context is missing",
			req: event.Event{
				Input: &event.EventInput{
					AuthContext: &auth.AuthContext{AccountId: 1},
					Type: &event.EventInput_DeviceEventInput{
						DeviceEventInput: &event.DeviceEventInput{
							DeviceId: "hello",
						},
					},

					Namespace: "rover",
					Name:      "Device Updated",
				},

				Source: &event.Event_DeviceSource{
					DeviceSource: &event.DeviceSource{
						Device: &audience.Device{
							DeviceId: "hello",
						},
					},
				},
			},

			clientExp: func(c *mock.MockAudienceClient) {
				c.EXPECT().UpdateDeviceLabelProperty(gomock.Any(), gomock.Any()).Return(nil, nil).Times(0)
			},

			exp: event.Event{
				Input: &event.EventInput{
					AuthContext: &auth.AuthContext{AccountId: 1},
					Type: &event.EventInput_DeviceEventInput{
						DeviceEventInput: &event.DeviceEventInput{
							DeviceId: "hello",
						},
					},

					Namespace: "rover",
					Name:      "Device Updated",
				},

				Source: &event.Event_DeviceSource{
					DeviceSource: &event.DeviceSource{
						Device: &audience.Device{
							DeviceId: "hello",
						},
					},
				},
			},
		},
		{
			desc: "does not update device name when its the same",
			req: event.Event{
				Input: &event.EventInput{
					AuthContext: &auth.AuthContext{AccountId: 1},
					Type: &event.EventInput_DeviceEventInput{
						DeviceEventInput: &event.DeviceEventInput{
							DeviceId: "hello",
							Context: &event.DeviceContext{
								DeviceName: "My Label",
							},
						},
					},

					Namespace: "rover",
					Name:      "Device Updated",
				},

				Source: &event.Event_DeviceSource{
					DeviceSource: &event.DeviceSource{
						Device: &audience.Device{
							DeviceId: "hello",
							Label:    "My Label",
						},
					},
				},
			},

			clientExp: func(c *mock.MockAudienceClient) {
				c.EXPECT().UpdateDeviceLabelProperty(gomock.Any(), gomock.Any()).Return(nil, nil).Times(0)
			},

			exp: event.Event{
				Input: &event.EventInput{
					AuthContext: &auth.AuthContext{AccountId: 1},
					Type: &event.EventInput_DeviceEventInput{
						DeviceEventInput: &event.DeviceEventInput{
							DeviceId: "hello",
							Context: &event.DeviceContext{
								DeviceName: "My Label",
							},
						},
					},

					Namespace: "rover",
					Name:      "Device Updated",
				},

				Source: &event.Event_DeviceSource{
					DeviceSource: &event.DeviceSource{
						Device: &audience.Device{
							DeviceId: "hello",
							Label:    "My Label",
						},
					},
				},
			},
		},
		{
			desc: "updates the device name",
			req: event.Event{
				Input: &event.EventInput{
					AuthContext: &auth.AuthContext{AccountId: 1},
					Type: &event.EventInput_DeviceEventInput{
						DeviceEventInput: &event.DeviceEventInput{
							DeviceId: "hello",
							Context: &event.DeviceContext{
								DeviceName: "My New Label",
							},
						},
					},

					Namespace: "rover",
					Name:      "Device Updated",
				},

				Source: &event.Event_DeviceSource{
					DeviceSource: &event.DeviceSource{
						Device: &audience.Device{
							DeviceId: "hello",
							Label:    "My Label",
						},
					},
				},
			},

			clientExp: func(c *mock.MockAudienceClient) {
				c.EXPECT().UpdateDeviceLabelProperty(gomock.Any(), &audience.UpdateDeviceLabelPropertyRequest{
					AuthContext: &auth.AuthContext{AccountId: 1},
					DeviceId:    "hello",
					Label:       "My New Label",
				}).Return(&audience.UpdateDeviceLabelPropertyResponse{}, nil).Times(1)
			},

			exp: event.Event{
				Input: &event.EventInput{
					AuthContext: &auth.AuthContext{AccountId: 1},
					Type: &event.EventInput_DeviceEventInput{
						DeviceEventInput: &event.DeviceEventInput{
							DeviceId: "hello",
							Context: &event.DeviceContext{
								DeviceName: "My New Label",
							},
						},
					},

					Namespace: "rover",
					Name:      "Device Updated",
				},

				Source: &event.Event_DeviceSource{
					DeviceSource: &event.DeviceSource{
						Device: &audience.Device{
							DeviceId: "hello",
							Label:    "My New Label",
						},
					},
				},
			},
		},
	}

	for _, tc := range testcases {
		t.Run(tc.desc, func(t *testing.T) {
			var (
				ctrl   = gomock.NewController(t)
				client = mock.NewMockAudienceClient(ctrl)

				tr = transformers.UpdateDeviceName(client)
			)

			tc.clientExp(client)

			var gotErr = tr.Handle(ctx, &tc.req)
			if diff := rtesting.Diff(tc.exp, tc.req, tc.expErr, gotErr); diff != nil {
				t.Fatalf("\nDiff:\n%v", rtesting.Difff(diff))
			}

			ctrl.Finish()
		})
	}
}
