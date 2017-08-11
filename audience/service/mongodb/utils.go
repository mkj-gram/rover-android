package mongodb

import (
	"encoding/json"
	"io"

	"gopkg.in/mgo.v2/bson"
)

// string of chars that make an invalid mongo key
const InvalidKeyChars = "."

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

func escape(s string, encode string) string {
	var (
		shouldEscape = make(map[byte]bool)
		hexCount     = 0
	)

	shouldEscape['%'] = true
	for i := 0; i < len(encode); i++ {
		shouldEscape[encode[i]] = true
	}

	for i := 0; i < len(s); i++ {
		if _, ok := shouldEscape[s[i]]; ok {
			hexCount++
		}
	}

	if hexCount == 0 {
		return s
	}

	t := make([]byte, len(s)+2*hexCount)
	j := 0
	for i := 0; i < len(s); i++ {
		c := s[i]
		if _, ok := shouldEscape[c]; ok {
			t[j] = '%'
			t[j+1] = "0123456789ABCDEF"[c>>4]
			t[j+2] = "0123456789ABCDEF"[c&15]
			j += 3
			continue
		}
		t[j] = s[i]
		j++
	}
	return string(t)
}

type EscapeError string

func (e EscapeError) Error() string {
	return "invalid escape " + strconv.Quote(string(e))
}

func unescape(s string) (string, error) {
	// Count %, check that they're well-formed.
	n := 0
	for i := 0; i < len(s); {
		switch s[i] {
		case '%':
			n++
			if i+2 >= len(s) || !ishex(s[i+1]) || !ishex(s[i+2]) {
				s = s[i:]
				if len(s) > 3 {
					s = s[:3]
				}
				return "", EscapeError(s)
			}
			i += 3
		default:
			i++
		}
	}

	if n == 0 {
		return s, nil
	}

	t := make([]byte, len(s)-2*n)
	j := 0
	for i := 0; i < len(s); {
		switch s[i] {
		case '%':
			t[j] = unhex(s[i+1])<<4 | unhex(s[i+2])
			j++
			i += 3
		default:
			t[j] = s[i]
			j++
			i++
		}
	}
	return string(t), nil
}

func ishex(c byte) bool {
	switch {
	case '0' <= c && c <= '9':
		return true
	case 'a' <= c && c <= 'f':
		return true
	case 'A' <= c && c <= 'F':
		return true
	}
	return false
}

func unhex(c byte) byte {
	switch {
	case '0' <= c && c <= '9':
		return c - '0'
	case 'a' <= c && c <= 'f':
		return c - 'a' + 10
	case 'A' <= c && c <= 'F':
		return c - 'A' + 10
	}
	return 0
}
