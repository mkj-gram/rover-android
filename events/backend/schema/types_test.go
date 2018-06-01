package schema_test

import (
	"testing"

	"github.com/roverplatform/rover/events/backend/schema"
	rtesting "github.com/roverplatform/rover/go/testing"
)

func TestComplexType_Diff(t *testing.T) {
	var tests = []struct {
		name    string
		schema1 schema.AttributeSchema
		schema2 schema.AttributeSchema

		exp schema.M
	}{
		{
			name: "empty diff",
			schema1: schema.AttributeSchema{
				"id": schema.STRING,
			},
			schema2: schema.AttributeSchema{
				"id": schema.STRING,
			},

			exp: schema.M{},
		},

		{
			name:    "top level scalar diff",
			schema1: schema.AttributeSchema{},
			schema2: schema.AttributeSchema{
				"id": schema.STRING,
			},

			exp: schema.M{
				"id": schema.Diff{Was: schema.INVALID, Now: schema.STRING},
			},
		},

		{
			name: "nested scalar diff",
			schema1: schema.AttributeSchema{
				"profile": schema.ComplexType{},
			},
			schema2: schema.AttributeSchema{
				"profile": schema.ComplexType{
					"id": schema.STRING,
				},
			},

			exp: schema.M{
				"profile": schema.M{
					"id": schema.Diff{Was: schema.INVALID, Now: schema.STRING},
				},
			},
		},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			var got = test.schema1.Diff(test.schema2)
			if diff := rtesting.Diff(test.exp, got, nil, nil); diff != nil {
				t.Fatal(rtesting.Difff(diff))
			}
		})
	}
}

func TestComplexType_Merge(t *testing.T) {

}

func TestComplexType_IsValid(t *testing.T) {

}

func TestComplexType_Supports(t *testing.T) {

}

func TestArrayType_UnmarshalJSON(t *testing.T) {

}

func TestArrayType_MarshalJSON(t *testing.T) {

}
