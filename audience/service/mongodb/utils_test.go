package mongodb

import (
	"reflect"
	"testing"

	"gopkg.in/mgo.v2/bson"
)

func TestStringToObjectId(t *testing.T) {

	tcases := []struct {
		name string

		in string

		exp    bson.ObjectId
		expErr error
	}{
		{"blank", "", "", errInvalidObjectId},
		{"invalid", "zzz", "", errInvalidObjectId},
		{"invalid", "z123456789ABCDEF01234567", "", errInvalidObjectId},
		{"valid", "0123456789ABCDEF01234567", bson.ObjectIdHex("0123456789ABCDEF01234567"), nil},
	}

	for _, tc := range tcases {
		t.Run("", func(t *testing.T) {
			var (
				exp, expErr = tc.exp, tc.expErr
				got, gotErr = StringToObjectID(tc.in)
			)

			if exp, got := expErr, gotErr; expErr != nil || gotErr != nil {
				if !reflect.DeepEqual(exp, got) {
					t.Errorf("\nExp: %v\nGot: %v", exp, got)
				}
				return
			}

			if !reflect.DeepEqual(exp, got) {
				t.Errorf("\nExp: %v\nGot: %v", exp, got)
			}
		})
	}

}

func Test_EscapeUnescape(t *testing.T) {
	tcases := []struct {
		// 3 - encode + decode
		// 2 - decode only
		// 1 - encode only
		// 0 - skip
		mode int
		in   string

		exp    string
		expErr error
	}{
		{3, "+ ", "+ ", nil},
		{3, "with % and .", "with %25 and %2E", nil},
		{3, "nothing to encode", "nothing to encode", nil},
		{2, "", "invalid escape %zz", EscapeError("%zz")},
		{2, "\x001", "%001", nil},
	}

	for _, tc := range tcases {
		if tc.mode&1 > 0 {
			t.Run("escape/"+tc.in, func(t *testing.T) {
				var (
					exp = tc.exp
					got = escape(tc.in, "$.")
				)

				if !reflect.DeepEqual(exp, got) {
					t.Errorf("\nExp: %v\nGot: %v", exp, got)
				}
			})
		}

		if tc.mode&2 > 0 {
			t.Run("unescape/"+tc.exp, func(t *testing.T) {
				var (
					exp, expErr = tc.in, tc.expErr
					got, gotErr = unescape(tc.exp)
				)

				if exp, got := expErr, gotErr; expErr != nil || gotErr != nil {
					if !reflect.DeepEqual(exp, got) {
						t.Errorf("\nExp: %v\nGot: %v", exp, got)
					}
					return
				}

				if !reflect.DeepEqual(exp, got) {
					t.Errorf("\nExp: %v\nGot: %v", exp, got)
				}
			})
		}
	}
}
