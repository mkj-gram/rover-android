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
	"github.com/roverplatform/rover/apis/go/protobuf/struct"
	"github.com/roverplatform/rover/events/backend/transformers"

	rtesting "github.com/roverplatform/rover/go/testing"
)

func TestRoot(t *testing.T) {
	t.Parallel()

	var (
		ctx = context.Background()
	)

	testcases := []struct {
		desc string
		req  event.Event

		exp       event.Event
		clientExp func(c *mock.MockAudienceClient, c2 *gmock.MockGeocoderClient, nameMapper func(string) string)
		expErr    error
	}{
		{
			desc: "returns error when input is neither a profile or device event",
			req: event.Event{
				Input: &event.EventInput{
					Type: nil,
				},
			},

			expErr: errors.New("Unrecognized event input type (<nil>) <nil>"),
		},
		{
			desc: "processes device event creating, updating with context, updating location, finding profile",
			req: event.Event{
				Input: &event.EventInput{
					AuthContext: &auth.AuthContext{AccountId: 1},
					Namespace:   "rover",
					Name:        "Location Update",
					Attributes: &structpb.Struct{
						Fields: map[string]*structpb.Value{
							"latitude":  structpb.Number(44),
							"longitude": structpb.Number(-84),
							"accuracy":  structpb.Number(500),
						},
					},
					Type: &event.EventInput_DeviceEventInput{
						DeviceEventInput: &event.DeviceEventInput{
							DeviceId: "ABC123",
							Context: &event.DeviceContext{
								ProfileIdentifier: "stones",

								Attributes: &structpb.Struct{
									Fields: map[string]*structpb.Value{
										"is-listening-to-music": structpb.Bool(true),
										"tags":                  structpb.ListVal("a", "b", "c"),
									},
								},

								AppName:      "Scissor Hands",
								AppNamespace: "nope.Me.Nope",

								DeviceName: "my test device",
							},
						},
					},
				},
			},

			clientExp: func(c *mock.MockAudienceClient, c2 *gmock.MockGeocoderClient, nameMapper func(n string) string) {
				var (
					authCtx = &auth.AuthContext{AccountId: 1}
				)
				call1 := c.EXPECT().GetDevice(gomock.Any(), &audience.GetDeviceRequest{
					AuthContext: authCtx,
					DeviceId:    "ABC123",
				}).Return(nil, status.Error(codes.NotFound, "Not Found"))

				call2 := c.EXPECT().CreateDevice(gomock.Any(), &audience.CreateDeviceRequest{
					AuthContext:       authCtx,
					DeviceId:          "ABC123",
					ProfileIdentifier: "stones",
				}).Return(&audience.CreateDeviceResponse{
					Device: &audience.Device{
						DeviceId:          "ABC123",
						ProfileIdentifier: "stones",
					},
				}, nil).After(call1)

				// TODO determine why gomock is saying the req does not match
				call3 := c.EXPECT().UpdateDevice(gomock.Any(), gomock.Any()).
					Return(&audience.UpdateDeviceResponse{
						Device: &audience.Device{
							DeviceId:          "ABC123",
							ProfileIdentifier: "stones",

							AppName:      "Scissor Hands",
							AppNamespace: "nope.Me.Nope",
							Platform:     audience.Platform_MOBILE,
						},
					}, nil).After(call2)

				call4 := c.EXPECT().UpdateDeviceCustomAttributes(gomock.Any(), &audience.UpdateDeviceCustomAttributesRequest{
					AuthContext: authCtx,
					DeviceId:    "ABC123",
					Attributes: map[string]*audience.Value{
						"is-listening-to-music": audience.BoolVal(true),
						"tags":                  audience.StringArrayVal("a", "b", "c"),
					},
				}).Return(&audience.UpdateDeviceCustomAttributesResponse{}, nil).After(call3)

				call5 := c2.EXPECT().ReverseGeocode(gomock.Any(), &geocoder.ReverseGeocodeRequest{
					Latitude:  44,
					Longitude: -84,
					Accuracy:  500,
				}).Return(&geocoder.ReverseGeocodeResponse{
					Country: "USA",
					State:   "Washington",
					City:    "Seattle",
				}, nil).After(call4)

				call6 := c.EXPECT().UpdateDeviceLocation(gomock.Any(), &audience.UpdateDeviceLocationRequest{
					AuthContext:       authCtx,
					DeviceId:          "ABC123",
					LocationLatitude:  44,
					LocationLongitude: -84,
					LocationAccuracy:  500,
					LocationCountry:   "USA",
					LocationState:     "Washington",
					LocationCity:      "Seattle",
				}).Return(&audience.UpdateDeviceLocationResponse{}, nil).After(call5)

				call7 := c.EXPECT().UpdateDeviceLabelProperty(gomock.Any(), &audience.UpdateDeviceLabelPropertyRequest{
					AuthContext: authCtx,
					DeviceId:    "ABC123",
					Label:       "my test device",
				}).Return(&audience.UpdateDeviceLabelPropertyResponse{}, nil).After(call6)

				c.EXPECT().GetProfile(gomock.Any(), &audience.GetProfileRequest{
					AuthContext: authCtx,
					Identifier:  "stones",
				}).Return(&audience.GetProfileResponse{
					Profile: &audience.Profile{
						AccountId:  authCtx.AccountId,
						Identifier: "stones",
					},
				}, nil).After(call7)
			},

			exp: event.Event{
				Input: &event.EventInput{
					AuthContext: &auth.AuthContext{AccountId: 1},
					Namespace:   "rover",
					Name:        "Location Update",
					Attributes: &structpb.Struct{
						Fields: map[string]*structpb.Value{
							"latitude":  structpb.Number(44),
							"longitude": structpb.Number(-84),
							"accuracy":  structpb.Number(500),
						},
					},
					Type: &event.EventInput_DeviceEventInput{
						DeviceEventInput: &event.DeviceEventInput{
							DeviceId: "ABC123",
							Context: &event.DeviceContext{
								ProfileIdentifier: "stones",

								Attributes: &structpb.Struct{
									Fields: map[string]*structpb.Value{
										"is-listening-to-music": structpb.Bool(true),
										"tags":                  structpb.ListVal("a", "b", "c"),
									},
								},

								AppName:      "Scissor Hands",
								AppNamespace: "nope.Me.Nope",

								DeviceName: "my test device",
							},
						},
					},
				},

				Source: &event.Event_DeviceSource{
					DeviceSource: &event.DeviceSource{
						Device: &audience.Device{
							DeviceId:          "ABC123",
							ProfileIdentifier: "stones",

							AppName:      "Scissor Hands",
							AppNamespace: "nope.Me.Nope",
							Platform:     audience.Platform_MOBILE,

							Attributes: map[string]*audience.Value{
								"is-listening-to-music": audience.BoolVal(true),
								"tags":                  audience.StringArrayVal("a", "b", "c"),
							},

							LocationLatitude:  44,
							LocationLongitude: -84,
							LocationAccuracy:  500,
							LocationCountry:   "USA",
							LocationState:     "Washington",
							LocationCity:      "Seattle",

							Label: "my test device",
						},

						AssociatedProfile: &audience.Profile{
							AccountId:  1,
							Identifier: "stones",
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
				tr      = transformers.Root(aclient, gclient, func(s string) string { return s })
			)

			if tc.clientExp != nil {
				tc.clientExp(aclient, gclient, nil)
			}

			var gotErr = tr.Handle(ctx, &tc.req)
			if diff := rtesting.Diff(tc.exp, tc.req, tc.expErr, gotErr); diff != nil {
				t.Fatalf("\nDiff:\n%v", rtesting.Difff(diff))
			}

			ctrl.Finish()
		})
	}
}
