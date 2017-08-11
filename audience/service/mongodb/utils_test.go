package mongodb

import (
	"reflect"
	"testing"

	"github.com/pkg/errors"

	mgo "gopkg.in/mgo.v2"
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
		{3, "with % and . and $", "with %25 and %2E and %24", nil},
		{3, "io.rover.Rover", "io%2Erover%2ERover", nil},
		{3, "nothing to encode", "nothing to encode", nil},
		{2, "", "invalid escape %zz", EscapeError("%zz")},
		{2, "io.rover.Rover", "io.rover.Rover", nil},
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

func TestParseURL(t *testing.T) {

	tcases := []struct {
		in     string
		exp    *mgo.DialInfo
		expErr error
	}{
		{
			in: "mongodb://user:pass@hello:1234/dbname?ssl=false",
			exp: &mgo.DialInfo{
				Addrs:    []string{"hello:1234"},
				Database: "dbname",
				Username: "user",
				Password: "pass",
			},
		},

		// { TODO: functions aren't comparable
		// 	in: "mongodb://user:pass@hello:1234/dbname?ssl=require",
		// 	exp: &mgo.DialInfo{
		// 		Addrs:    []string{"hello:1234"},
		// 		Database: "dbname",
		// 		Username: "user",
		// 		Password: "pass",
		// 	},
		// },

		{
			in:     "mongodb://user:pass@hello:1234/dbname?ssl=verify-ca&sslrootcert=/path/to/file",
			expErr: errors.Errorf("readFile: open /path/to/file: no such file or directory"),

			exp: &mgo.DialInfo{
				Addrs:    []string{"hello:1234"},
				Database: "dbname",
				Username: "user",
				Password: "pass",
			},
		},
	}

	for _, tc := range tcases {
		t.Run("", func(t *testing.T) {
			var (
				exp, expErr = tc.exp, tc.expErr
				got, gotErr = ParseURL(tc.in)
			)

			if exp, got := expErr, gotErr; exp != nil || got != nil {
				if !(exp == nil && got == nil) {
					if exp.Error() != got.Error() {
						t.Errorf("\nExp: %q\nGot: %q", exp, got)
					}
					return
				}
				t.Errorf("\nExp: %q\nGot: %q", exp, got)
				return
			}

			if !reflect.DeepEqual(exp, got) {
				t.Errorf("\nExp: %v\nGot: %v", exp, got)
			}
		})
	}
}
