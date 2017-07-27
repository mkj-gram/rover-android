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
