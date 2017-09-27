package mongodb_test

import (
	"io"
	"os"
	"strings"
	"testing"
	"time"

	"gopkg.in/mgo.v2/bson"

	"github.com/go-test/deep"
	"github.com/roverplatform/rover/audience/service/mongodb"
)

func TestProfile_UnmarshalBSON(t *testing.T) {

	f, err := os.Open("../testdata/profile-00.bson.json")
	if err != nil {
		t.Fatal("open:", err)
	}

	var (
		dec = mongodb.NewJSONBSONDecoder(f)

		utcTs, _ = time.Parse(time.RFC3339Nano, "2016-08-22T19:05:53.102Z")
		ts       = utcTs.In(time.Local)

		got mongodb.Profile

		exp = mongodb.Profile{
			Id:         bson.ObjectIdHex("00000000000000000000aaa2"),
			AccountId:  1,
			Identifier: "78e19dbf-8c0b-47a5-b28f-4f1650feccf6",

			CreatedAt: &ts,
			UpdatedAt: &ts,

			Attributes: map[string]interface{}{
				"array":     []interface{}{"hello", "world"},
				"bool":      true,
				"double":    3.1415,
				"integer":   int64(1),
				"string":    "hello",
				"timestamp": ts,
			},
		}
	)

	if gotErr := dec.Decode(&got); gotErr != nil && gotErr != io.EOF {
		t.Fatal("decode:", gotErr)
		return
	}

	// if !reflect.DeepEqual(exp, got) {
	// 	t.Errorf("\nExp:\n%-#v\nGot:\n%-#v\n", exp, got)
	// }

	if diff := deep.Equal(exp, got); diff != nil {
		t.Fatal("\nDiff:", strings.Join(diff, "\n"))
	}
}

func TestProfile_MarshalBSON(t *testing.T) {

}
