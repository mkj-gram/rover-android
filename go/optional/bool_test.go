package optional_test

import (
	"encoding/json"
	"testing"

	"github.com/pkg/errors"
	"github.com/roverplatform/rover/go/optional"
	rtesting "github.com/roverplatform/rover/go/testing"
)

func TestBool_MarshalJSON(t *testing.T) {

	tcases := []struct {
		desc      string
		value     optional.Bool
		expect    string
		expectErr error
	}{
		{
			desc:   "serializes to null when value isn't set",
			value:  optional.Bool{},
			expect: "null",
		},
		{
			desc:   "serializes false to false",
			value:  optional.NewBool(false),
			expect: "false",
		},
		{
			desc:   "serializes true to true",
			value:  optional.NewBool(true),
			expect: "true",
		},
	}

	for _, tc := range tcases {
		t.Run(tc.desc, func(t *testing.T) {
			var got, gotErr = json.Marshal(tc.value)

			if diff := rtesting.Diff(tc.expect, string(got), tc.expectErr, gotErr); diff != nil {
				t.Errorf("Diff:\n%v", rtesting.Difff(diff))
			}
		})
	}

}

func TestBool_UnmarshalJSON(t *testing.T) {

	tcases := []struct {
		desc      string
		value     string
		expect    optional.Bool
		expectErr error
	}{
		{
			desc:   "serializes to null when value isn't set",
			value:  "null",
			expect: optional.Bool{},
		},
		{
			desc:   "serializes false to false",
			value:  "false",
			expect: optional.NewBool(false),
		},
		{
			desc:   "serializes true to true",
			value:  "true",
			expect: optional.NewBool(true),
		},
		{
			desc:   "serializes 0 to false",
			value:  "0",
			expect: optional.NewBool(false),
		},
		{
			desc:   "serializes 1 to true",
			value:  "1",
			expect: optional.NewBool(true),
		},
		{
			desc:      "errors when value is not supported",
			value:     `"hellllo"`,
			expectErr: errors.New(`unsupported value: "hellllo"`),
		},
	}

	for _, tc := range tcases {
		t.Run(tc.desc, func(t *testing.T) {
			var got optional.Bool
			var gotErr = json.Unmarshal([]byte(tc.value), &got)

			if diff := rtesting.Diff(tc.expect, got, tc.expectErr, gotErr); diff != nil {
				t.Errorf("Diff:\n%v", rtesting.Difff(diff))
			}
		})
	}

}
