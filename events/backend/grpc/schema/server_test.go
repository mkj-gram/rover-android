package schema_test

import (
	"context"
	"testing"
	"time"

	pb "github.com/roverplatform/rover/apis/go/schema/v1"
	schema_grpc "github.com/roverplatform/rover/events/backend/grpc/schema"
	"github.com/roverplatform/rover/events/backend/grpc/schema/mocks"
	"github.com/roverplatform/rover/events/backend/schema"
	"github.com/roverplatform/rover/go/protobuf/ptypes/timestamp"
	rtesting "github.com/roverplatform/rover/go/testing"

	"github.com/golang/mock/gomock"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func TestServer_GetSchema(t *testing.T) {

	var now = time.Now()

	var tests = []struct {
		name       string
		req        *pb.GetSchemaRequest
		clientMock func(m *mocks.MockSchemaStore)
		exp        *pb.GetSchemaResponse
		expErr     error
	}{
		{
			name: "returns 404 not found",
			req: &pb.GetSchemaRequest{
				SchemaId:      1,
				SchemaVersion: 2,
			},
			clientMock: func(m *mocks.MockSchemaStore) {
				m.EXPECT().
					Find(gomock.Any(), int32(1), int32(2)).
					Return(nil, schema.ErrNotFound)
			},

			expErr: status.Error(codes.NotFound, "Not Found"),
		},

		{
			name: "returns flat schema",
			req: &pb.GetSchemaRequest{
				SchemaId:      2,
				SchemaVersion: 5,
			},
			clientMock: func(m *mocks.MockSchemaStore) {
				m.EXPECT().
					Find(gomock.Any(), int32(2), int32(5)).
					Return(&schema.EventSchema{
						Id:        2,
						Version:   5,
						AccountId: 2,
						Namespace: "rover",
						Name:      "Location Update",
						AttributeSchema: schema.AttributeSchema{
							"longitude":     schema.NUMBER,
							"latitude":      schema.NUMBER,
							"accuracy":      schema.NUMBER,
							"country":       schema.STRING,
							"is-background": schema.BOOLEAN,
						},
						CreatedAt: &now,
					}, nil)
			},

			exp: &pb.GetSchemaResponse{
				Schema: &pb.EventSchema{
					Id:        2,
					Version:   5,
					AccountId: 2,
					Namespace: "rover",
					Name:      "Location Update",
					AttributeSchema: &pb.Complex{
						Attributes: map[string]*pb.Type{
							"longitude":     scalarType(pb.Scalar_NUMBER),
							"latitude":      scalarType(pb.Scalar_NUMBER),
							"accuracy":      scalarType(pb.Scalar_NUMBER),
							"country":       scalarType(pb.Scalar_STRING),
							"is-background": scalarType(pb.Scalar_BOOLEAN),
						},
					},
					CreatedAt: timeProto(t, now),
				},
			},
		},

		{
			name: "returns nested schemas",
			req: &pb.GetSchemaRequest{
				SchemaId:      1,
				SchemaVersion: 1,
			},
			clientMock: func(m *mocks.MockSchemaStore) {
				m.EXPECT().
					Find(gomock.Any(), int32(1), int32(1)).
					Return(&schema.EventSchema{
						Id:        1,
						Version:   1,
						AccountId: 1,
						Namespace: "rover",
						Name:      "Location Update",
						AttributeSchema: schema.AttributeSchema{
							"user": schema.ComplexType{
								"id":   schema.STRING,
								"tags": schema.ARRAY_OF_STRINGS,
								"device": schema.ComplexType{
									"id": schema.STRING,
								},
							},
						},
					}, nil)
			},

			exp: &pb.GetSchemaResponse{
				Schema: &pb.EventSchema{
					Id:        1,
					Version:   1,
					AccountId: 1,
					Namespace: "rover",
					Name:      "Location Update",
					AttributeSchema: &pb.Complex{
						Attributes: map[string]*pb.Type{
							"user": {
								Type: &pb.Type_Complex{
									Complex: &pb.Complex{
										Attributes: map[string]*pb.Type{
											"id":   scalarType(pb.Scalar_STRING),
											"tags": arrayType(pb.Scalar_STRING),
											"device": {
												Type: &pb.Type_Complex{
													Complex: &pb.Complex{
														Attributes: map[string]*pb.Type{
															"id": scalarType(pb.Scalar_STRING),
														},
													},
												},
											},
										},
									},
								},
							},
						},
					},
				},
			},
		},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			var (
				ctrl   = gomock.NewController(t)
				db     = mocks.NewMockSchemaStore(ctrl)
				server = schema_grpc.NewServer(db)
				ctx    = context.Background()
			)

			if test.clientMock != nil {
				test.clientMock(db)
			}

			var got, gotErr = server.GetSchema(ctx, test.req)
			if diff := rtesting.Diff(test.exp, got, test.expErr, gotErr); diff != nil {
				t.Fatal(rtesting.Difff(diff))
			}

			ctrl.Finish()
		})
	}
}

func timeProto(t *testing.T, tt time.Time) *timestamp.Timestamp {
	ts, err := timestamp.TimestampProto(tt)
	if err != nil {
		t.Fatal(err)
	}
	return ts
}

func scalarType(t pb.Scalar_Type) *pb.Type {
	return &pb.Type{
		Type: &pb.Type_Scalar{
			Scalar: &pb.Scalar{
				Type: t,
			},
		},
	}
}

func arrayType(t pb.Scalar_Type) *pb.Type {
	return &pb.Type{
		Type: &pb.Type_Array{
			Array: &pb.Array{
				Subtype: &pb.Scalar{
					Type: t,
				},
			},
		},
	}
}
