package tracker_test

import (
	"testing"

	"context"

	"github.com/golang/mock/gomock"
	"github.com/pkg/errors"
	"github.com/roverplatform/rover/apis/go/auth/v1"
	"github.com/roverplatform/rover/apis/go/event/v1"
	"github.com/roverplatform/rover/apis/go/protobuf/struct"
	"github.com/roverplatform/rover/events/backend/pipeline"
	"github.com/roverplatform/rover/events/backend/schema"
	"github.com/roverplatform/rover/events/backend/tracker"
	"github.com/roverplatform/rover/events/backend/tracker/mocks"
	rtesting "github.com/roverplatform/rover/go/testing"
)

func TestNewTracker(t *testing.T) {
	var tests = []struct {
		name   string
		req    *event.Event
		mock   func(repository *mocks.MockSchemaRepository)
		exp    *event.Event
		expErr error
	}{
		{
			name: "creates schema",
			req: &event.Event{
				AuthContext: &auth.AuthContext{AccountId: 1},
				Namespace:   "namespace",
				Name:        "Bagel Eaten",
				Attributes: &structpb.Struct{
					Fields: map[string]*structpb.Value{
						"number-field": structpb.Number(1),
						"bool-field":   structpb.Bool(true),
						"string-field": structpb.String("hi"),
					},
				},
			},

			mock: func(repository *mocks.MockSchemaRepository) {
				//ctx, accountId, namespace, name
				repository.EXPECT().
					FindLastByEvent(gomock.Any(), int32(1), "namespace", "Bagel Eaten").
					Return(nil, nil)

				repository.EXPECT().
					Create(gomock.Any(), schema.EventSchema{
						AccountId: 1,
						Version:   1,
						Namespace: "namespace",
						Name:      "Bagel Eaten",
						AttributeSchema: schema.AttributeSchema{
							"number-field": schema.NUMBER,
							"bool-field":   schema.BOOLEAN,
							"string-field": schema.STRING,
						},
					}).Return(&schema.EventSchema{
					Id:        1,
					Version:   1,
					AccountId: 1,
					Namespace: "namespace",
					Name:      "Bagel Eaten",
					AttributeSchema: schema.AttributeSchema{
						"number-field": schema.NUMBER,
						"bool-field":   schema.BOOLEAN,
						"string-field": schema.STRING,
					},
				}, nil)
			},

			exp: &event.Event{
				AuthContext: &auth.AuthContext{AccountId: 1},
				Namespace:   "namespace",
				Name:        "Bagel Eaten",
				Attributes: &structpb.Struct{
					Fields: map[string]*structpb.Value{
						"number-field": structpb.Number(1),
						"bool-field":   structpb.Bool(true),
						"string-field": structpb.String("hi"),
					},
				},

				SchemaIdentifier: &event.Event_SchemaIdentifier{
					Id:      1,
					Version: 1,
				},
			},
		},

		{
			name: "returns error when current schema does not support input",
			req: &event.Event{
				AuthContext: &auth.AuthContext{AccountId: 1},
				Namespace:   "namespace",
				Name:        "Bagel Eaten",
				Attributes: &structpb.Struct{
					Fields: map[string]*structpb.Value{
						"boom": structpb.Number(44),
					},
				},
			},

			mock: func(repository *mocks.MockSchemaRepository) {
				repository.EXPECT().
					FindLastByEvent(gomock.Any(), int32(1), "namespace", "Bagel Eaten").
					Return(&schema.EventSchema{
						Id:        1,
						Version:   1,
						AccountId: 1,
						Namespace: "namespace",
						Name:      "Bagel Eaten",
						AttributeSchema: schema.AttributeSchema{
							"boom": schema.BOOLEAN,
						},
					}, nil)
			},

			expErr: errors.New("current schema does not support input"),
			exp: &event.Event{
				AuthContext: &auth.AuthContext{AccountId: 1},
				Namespace:   "namespace",
				Name:        "Bagel Eaten",
				Attributes: &structpb.Struct{
					Fields: map[string]*structpb.Value{
						"boom": structpb.Number(44),
					},
				},
			},
		},

		{
			name: "updates the schema",
			req: &event.Event{
				AuthContext: &auth.AuthContext{AccountId: 1},
				Namespace:   "rover",
				Name:        "coffee slurped",
				Attributes: &structpb.Struct{
					Fields: map[string]*structpb.Value{
						"tags":      structpb.ListVal("a", "b", "c"),
						"new-field": structpb.Number(44),
					},
				},
			},

			mock: func(repository *mocks.MockSchemaRepository) {
				repository.EXPECT().
					FindLastByEvent(gomock.Any(), int32(1), "rover", "coffee slurped").
					Return(&schema.EventSchema{
						Id:        1,
						Version:   1,
						AccountId: 1,
						Namespace: "rover",
						Name:      "coffee slurped",
						AttributeSchema: schema.AttributeSchema{
							"tags": schema.ARRAY_OF_STRINGS,
						},
					}, nil)

				repository.EXPECT().
					UpdateAttributeSchema(gomock.Any(), schema.EventSchema{
						Id:        1,
						Version:   1,
						AccountId: 1,
						Namespace: "rover",
						Name:      "coffee slurped",
						AttributeSchema: schema.AttributeSchema{
							"tags": schema.ARRAY_OF_STRINGS,
						},
					}, map[string]schema.Type{

						"tags":      schema.ARRAY_OF_STRINGS,
						"new-field": schema.NUMBER,
					}).Return(&schema.EventSchema{
					Id:        1,
					Version:   2,
					AccountId: 1,
					Namespace: "rover",
					Name:      "coffee slurped",
					AttributeSchema: schema.AttributeSchema{
						"new-field": schema.NUMBER,
						"tags":      schema.ARRAY_OF_STRINGS,
					},
				}, nil)
			},

			exp: &event.Event{
				AuthContext: &auth.AuthContext{AccountId: 1},
				Namespace:   "rover",
				Name:        "coffee slurped",
				Attributes: &structpb.Struct{
					Fields: map[string]*structpb.Value{
						"tags":      structpb.ListVal("a", "b", "c"),
						"new-field": structpb.Number(44),
					},
				},

				SchemaIdentifier: &event.Event_SchemaIdentifier{
					Id:      1,
					Version: 2,
				},
			},
		},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			var (
				ctrl = gomock.NewController(t)
				repo = mocks.NewMockSchemaRepository(ctrl)
				ctx  = pipeline.NewContext(context.Background())
			)

			if test.mock != nil {
				test.mock(repo)
			}

			var gotErr = errors.Cause(tracker.NewTracker(repo).Handle(ctx, test.req))
			if diff := rtesting.Diff(test.exp, test.req, test.expErr, gotErr); diff != nil {
				t.Fatal(rtesting.Difff(diff))
			}
		})
	}
}

func TestSupports(t *testing.T) {
	type exp struct {
		match   bool
		updates bool
	}
	var tests = []struct {
		name    string
		schema1 schema.AttributeSchema
		schema2 schema.AttributeSchema

		exp exp
	}{
		{
			name: "top level scalar types are incompatible",
			schema1: schema.AttributeSchema{
				"field": schema.STRING,
			},
			schema2: schema.AttributeSchema{
				"field": schema.NUMBER,
			},

			exp: exp{
				match:   false,
				updates: false,
			},
		},

		{
			name: "nested scalar types are incompatible",
			schema1: schema.AttributeSchema{
				"parent": schema.ComplexType{
					"field": schema.STRING,
				},
			},
			schema2: schema.AttributeSchema{
				"parent": schema.ComplexType{
					"field": schema.NUMBER,
				},
			},

			exp: exp{
				match:   false,
				updates: false,
			},
		},

		{
			name: "deeply nested scalar types are incompatible",
			schema1: schema.AttributeSchema{
				"parent1": schema.ComplexType{
					"parent2": schema.ComplexType{
						"parent3": schema.ComplexType{
							"field": schema.STRING,
						},
					},
				},
			},
			schema2: schema.AttributeSchema{
				"parent1": schema.ComplexType{
					"parent2": schema.ComplexType{
						"parent3": schema.ComplexType{
							"field": schema.NUMBER,
						},
					},
				},
			},

			exp: exp{
				match:   false,
				updates: false,
			},
		},

		{
			name: "schema matches and does not require updates",
			schema1: schema.AttributeSchema{
				"field": schema.STRING,
			},
			schema2: schema.AttributeSchema{
				"field": schema.STRING,
			},

			exp: exp{
				match:   true,
				updates: false,
			},
		},

		{
			name:    "schema requires updates on top level scalar",
			schema1: schema.AttributeSchema{},
			schema2: schema.AttributeSchema{
				"field": schema.STRING,
			},

			exp: exp{
				match:   true,
				updates: true,
			},
		},

		{
			name: "schema requires updates on nested scalar",
			schema1: schema.AttributeSchema{
				"parent": schema.ComplexType{},
			},
			schema2: schema.AttributeSchema{
				"parent": schema.ComplexType{
					"field": schema.STRING,
				},
			},

			exp: exp{
				match:   true,
				updates: true,
			},
		},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			var gotMatch, gotUpdates = tracker.Supports(test.schema1, test.schema2)

			if test.exp.match != gotMatch {
				t.Errorf("Expected match to be %t but got %t", test.exp.match, gotMatch)
			}

			if test.exp.updates != gotUpdates {
				t.Errorf("Expected updates to be %t but got %t", test.exp.match, gotUpdates)
			}
		})
	}
}
