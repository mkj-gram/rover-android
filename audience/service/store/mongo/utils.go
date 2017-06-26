package mongo

import (
	"encoding/json"
	"io"
	"net/url"
	"strings"

	"gopkg.in/mgo.v2/bson"
)

func ParseDBName(dsn string) (string, error) {
	u, err := url.Parse(dsn)
	if err != nil {
		return "", err
	}

	return strings.TrimLeft(u.Path, "/"), nil
}

func StringToObjectID(str string) (bson.ObjectId, error) {
	if !bson.IsObjectIdHex(str) {
		return "", errInvalidObjectId
	}

	return bson.ObjectIdHex(str), nil
}

type JSONBSONDecoder struct {
	r *json.Decoder
}

func NewJSONBSONDecoder(r io.Reader) *JSONBSONDecoder {
	return &JSONBSONDecoder{
		r: json.NewDecoder(r),
	}
}

// Decode reads BSON aware JSON and decodes it into objects
func (d *JSONBSONDecoder) Decode(doc interface{}) error {
	// a generic object
	var m = map[string]interface{}{}

	// parse out a single JSON object(Because we have no idea about it's boundaries)
	if err := d.r.Decode(&m); err != nil {
		return err
	}

	// now serialize it back to bytes so we can parse it with BSON extensions
	bytes, err := json.Marshal(m)
	if err != nil {
		return err
	}

	// another generic object
	m = map[string]interface{}{}

	// parse with BSON extensions
	if err := bson.UnmarshalJSON(bytes, &m); err != nil {
		return err
	}

	// now take the generic object representation
	// and serialize it back to raw data
	data, err := bson.Marshal(m)
	if err != nil {
		return err
	}

	// fmt.Printf("\n\n\n%s", string(data))

	// now parse the bytes into the object
	return bson.Unmarshal(data, doc)
}
