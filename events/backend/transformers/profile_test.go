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

	"github.com/roverplatform/rover/events/backend/pipeline"
	"github.com/roverplatform/rover/events/backend/transformers"
	rtesting "github.com/roverplatform/rover/go/testing"
)

func TestFindProfile(t *testing.T) {
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
			desc: "returns event if device input event does not have a profile identifier",

			req: event.Event{
				Input: &event.EventInput{
					AuthContext: &auth.AuthContext{AccountId: 1},
					Type: &event.EventInput_DeviceEventInput{
						DeviceEventInput: &event.DeviceEventInput{
							DeviceId: "hello",
							Context: &event.DeviceContext{
								ProfileIdentifier: "",
							},
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
							Context: &event.DeviceContext{
								ProfileIdentifier: "",
							},
						},
					},
				},

				Source: &event.Event_DeviceSource{
					DeviceSource: &event.DeviceSource{},
				},
			},

			clientExp: func(c *mock.MockAudienceClient) {
				c.EXPECT().GetProfile(gomock.Any(), gomock.Any()).Return(nil, nil).Times(0)
			},

			expErr: nil,
		},
		{
			desc: "returns event if profile input event does not have a profile identifier",

			req: event.Event{
				Input: &event.EventInput{
					AuthContext: &auth.AuthContext{AccountId: 1},
					Type: &event.EventInput_ProfileEventInput{
						ProfileEventInput: &event.ProfileEventInput{
							ProfileIdentifier: "",
						},
					},
				},

				Source: &event.Event_ProfileSource{
					ProfileSource: &event.ProfileSource{},
				},
			},

			exp: event.Event{
				Input: &event.EventInput{
					AuthContext: &auth.AuthContext{AccountId: 1},
					Type: &event.EventInput_ProfileEventInput{
						ProfileEventInput: &event.ProfileEventInput{
							ProfileIdentifier: "",
						},
					},
				},

				Source: &event.Event_ProfileSource{
					ProfileSource: &event.ProfileSource{},
				},
			},

			clientExp: func(c *mock.MockAudienceClient) {
				c.EXPECT().GetProfile(gomock.Any(), gomock.Any()).Return(nil, nil).Times(0)
			},

			expErr: nil,
		},

		{
			desc: "returns retryable event when audience returns Internal error",

			req: event.Event{
				Input: &event.EventInput{
					AuthContext: &auth.AuthContext{AccountId: 1},
					Type: &event.EventInput_ProfileEventInput{
						ProfileEventInput: &event.ProfileEventInput{
							ProfileIdentifier: "PizzaPizza",
						},
					},
				},

				Source: &event.Event_ProfileSource{
					ProfileSource: &event.ProfileSource{},
				},
			},

			exp: event.Event{
				Input: &event.EventInput{
					AuthContext: &auth.AuthContext{AccountId: 1},
					Type: &event.EventInput_ProfileEventInput{
						ProfileEventInput: &event.ProfileEventInput{
							ProfileIdentifier: "PizzaPizza",
						},
					},
				},

				Source: &event.Event_ProfileSource{
					ProfileSource: &event.ProfileSource{},
				},
			},

			clientExp: func(c *mock.MockAudienceClient) {
				c.EXPECT().GetProfile(gomock.Any(), gomock.Any()).Return(nil, status.Error(codes.Internal, "Nope"))
			},

			expErr: pipeline.NewRetryableError(errors.Wrap(status.Error(codes.Internal, "Nope"), "FindProfile")),
		},

		{
			desc: "skips event if profile was not found",

			req: event.Event{
				Input: &event.EventInput{
					AuthContext: &auth.AuthContext{AccountId: 1},
					Type: &event.EventInput_ProfileEventInput{
						ProfileEventInput: &event.ProfileEventInput{
							ProfileIdentifier: "PizzaPizza",
						},
					},
				},

				Source: &event.Event_ProfileSource{
					ProfileSource: &event.ProfileSource{},
				},
			},

			exp: event.Event{
				Input: &event.EventInput{
					AuthContext: &auth.AuthContext{AccountId: 1},
					Type: &event.EventInput_ProfileEventInput{
						ProfileEventInput: &event.ProfileEventInput{
							ProfileIdentifier: "PizzaPizza",
						},
					},
				},

				Source: &event.Event_ProfileSource{
					ProfileSource: &event.ProfileSource{},
				},
			},

			clientExp: func(c *mock.MockAudienceClient) {
				c.EXPECT().GetProfile(gomock.Any(), gomock.Any()).Return(nil, status.Error(codes.NotFound, "Not Found"))
			},

			expErr: nil,
		},

		{
			desc: "finds and attaches profile for profile input event",

			req: event.Event{
				Input: &event.EventInput{
					AuthContext: &auth.AuthContext{AccountId: 1},
					Type: &event.EventInput_ProfileEventInput{
						ProfileEventInput: &event.ProfileEventInput{
							ProfileIdentifier: "PizzaPizza",
						},
					},
				},

				Source: &event.Event_ProfileSource{
					ProfileSource: &event.ProfileSource{},
				},
			},

			exp: event.Event{
				Input: &event.EventInput{
					AuthContext: &auth.AuthContext{AccountId: 1},
					Type: &event.EventInput_ProfileEventInput{
						ProfileEventInput: &event.ProfileEventInput{
							ProfileIdentifier: "PizzaPizza",
						},
					},
				},

				Source: &event.Event_ProfileSource{
					ProfileSource: &event.ProfileSource{
						Profile: &audience.Profile{
							Identifier: "PizzaPizza",
							AccountId:  1,
						},
					},
				},
			},

			clientExp: func(c *mock.MockAudienceClient) {
				c.EXPECT().GetProfile(gomock.Any(), &audience.GetProfileRequest{
					AuthContext: &auth.AuthContext{AccountId: 1},
					Identifier:  "PizzaPizza",
				}).Return(&audience.GetProfileResponse{
					Profile: &audience.Profile{
						Identifier: "PizzaPizza",
						AccountId:  1,
					},
				}, nil)
			},

			expErr: nil,
		},

		{
			desc: "finds and attaches profile for device input event",

			req: event.Event{
				Input: &event.EventInput{
					AuthContext: &auth.AuthContext{AccountId: 1},
					Type: &event.EventInput_DeviceEventInput{
						DeviceEventInput: &event.DeviceEventInput{
							DeviceId: "happy",
							Context: &event.DeviceContext{
								ProfileIdentifier: "lovely-dayyyyyyyyy",
							},
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
							DeviceId: "happy",
							Context: &event.DeviceContext{
								ProfileIdentifier: "lovely-dayyyyyyyyy",
							},
						},
					},
				},

				Source: &event.Event_DeviceSource{
					DeviceSource: &event.DeviceSource{
						AssociatedProfile: &audience.Profile{
							AccountId:  1,
							Identifier: "lovely-dayyyyyyyyy",
						},
					},
				},
			},

			clientExp: func(c *mock.MockAudienceClient) {
				c.EXPECT().GetProfile(gomock.Any(), &audience.GetProfileRequest{
					AuthContext: &auth.AuthContext{AccountId: 1},
					Identifier:  "lovely-dayyyyyyyyy",
				}).Return(&audience.GetProfileResponse{
					Profile: &audience.Profile{
						Identifier: "lovely-dayyyyyyyyy",
						AccountId:  1,
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
				tr     = transformers.FindProfile(client)
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
