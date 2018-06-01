package schema

import (
	"encoding/json"
	"fmt"
	"regexp"

	"github.com/pkg/errors"
)

type Type interface {
	isType_Kind()
	Supports(other Type) bool
	IsValid() bool
}

type (
	ScalarType      string
	ComplexType     map[string]Type
	ArrayType       struct{ Type ScalarType }
	AttributeSchema = ComplexType
	M               = map[string]interface{}
)

func (ScalarType) isType_Kind()  {}
func (ComplexType) isType_Kind() {}
func (ArrayType) isType_Kind()   {}

func (a AttributeSchema) UnmarshalJSON(b []byte) error {
	var m map[string]interface{}
	if err := json.Unmarshal(b, &m); err != nil {
		return err
	}
	return a.FromMap(m)
}

/*
	Scalar Types
*/

var (
	INVALID   ScalarType = "" // invalid indicates an error with the schema
	STRING    ScalarType = "string"
	NUMBER    ScalarType = "number"
	BOOLEAN   ScalarType = "bool"
	TIMESTAMP ScalarType = "timestamp"
)

func (t ScalarType) IsValid() bool {
	return t != INVALID
}

func IsScalarType(t Type) bool {
	var _, ok = t.(ScalarType)
	return ok
}

func ScalarFromType(t Type) ScalarType {
	return t.(ScalarType)
}

func IsValidScalarType(t ScalarType) bool {
	return t == INVALID ||
		t == STRING ||
		t == NUMBER ||
		t == BOOLEAN ||
		t == TIMESTAMP
}

/*
	Array Types
*/

var (
	ARRAY_OF_STRINGS   = ArrayType{Type: STRING}
	ARRAY_OF_NUMBERS   = ArrayType{Type: NUMBER}
	ARRAY_OF_BOOLEANS  = ArrayType{Type: BOOLEAN}
	ARRAY_OF_TIMESTAMP = ArrayType{Type: TIMESTAMP}
)

func (t ArrayType) IsValid() bool {
	return t.Type != INVALID
}

func IsArrayType(t Type) bool {
	var _, ok = t.(ArrayType)
	return ok
}

var arrayElementMatch, _ = regexp.Compile(`^\"array\[(\w+)\]\"$`)

func (t ArrayType) MarshalJSON() ([]byte, error) {
	return []byte(fmt.Sprintf("\"array[%s]\"", t.Type)), nil
}

func (t *ArrayType) UnmarshalJSON(b []byte) error {
	matches := arrayElementMatch.FindAllStringSubmatch(string(b), 1)
	if matches == nil {
		return errors.Errorf("%q is not an array type", string(b))
	}

	elementType := ScalarType(matches[0][1])
	if !IsValidScalarType(elementType) {
		return errors.Errorf("invalid element type: %q", elementType)
	}

	t.Type = elementType
	return nil
}

/*
	Complex Types
*/

func (c ComplexType) FromMap(m map[string]interface{}) error {
	if c == nil {
		c = make(map[string]Type)
	}

	for name, subtype := range m {
		switch t := subtype.(type) {
		case map[string]interface{}:
			var subComplex = ComplexType{}
			if err := subComplex.FromMap(t); err != nil {
				return err
			}
			c[name] = subComplex
		case string:
			var arr ArrayType
			if err := json.Unmarshal([]byte(fmt.Sprintf("%q", t)), &arr); err == nil {
				c[name] = arr
			} else if ScalarType(t).IsValid() {
				c[name] = ScalarType(t)
			}
		default:
			return errors.New("unknown type")
		}
	}

	return nil
}

func (t ComplexType) IsValid() bool {
	for _, myType := range t {
		if myType.IsValid() == false {
			return false
		}
	}

	return true
}

func IsComplexType(t Type) bool {
	var _, ok = t.(ComplexType)
	return ok
}

/*
	Diff Support
*/

type Diff struct {
	Was Type
	Now Type
}

func (t ComplexType) Diff(other ComplexType) M {

	var changes = M{}
	for name, myType := range t {
		otherType, ok := other[name]

		if !ok {
			changes[name] = Diff{myType, INVALID}
		} else if IsComplexType(myType) {
			changes[name] = myType.(ComplexType).Diff(otherType.(ComplexType))
		} else if IsComplexType(otherType) {
			changes[name] = myType.(ComplexType).Diff(otherType.(ComplexType))
		} else if myType != otherType {
			// this is scalar or array
			var change = Diff{}
			if IsArrayType(myType) {
				change.Was = myType.(ArrayType).Type
			} else {
				change.Was = myType
			}

			if IsArrayType(otherType) {
				change.Now = otherType.(ArrayType).Type
			} else {
				change.Now = otherType
			}

			changes[name] = change
		}
	}

	for name, otherType := range other {
		_, ok := t[name]
		if !ok {
			// we don't have this property
			changes[name] = Diff{INVALID, otherType}
		}
	}

	return changes
}

/*
	Supports
*/
func (t ComplexType) Supports(other Type) bool {
	otherValue, ok := other.(ComplexType)
	if !ok {
		return false
	}

	for name, myType := range t {
		if otherType, ok := otherValue[name]; ok && !myType.Supports(otherType) {
			return false
		}
	}
	return true
}

func (t ArrayType) Supports(other Type) bool {
	otherValue, ok := other.(ArrayType)
	if !ok {
		return false
	}

	return t.Type.Supports(otherValue.Type)
}

func (t ScalarType) Supports(other Type) bool {
	if otherValue, ok := other.(ScalarType); ok {
		return t == otherValue
	}
	return false
}

/*
	Merging Schema
*/

func (t ComplexType) Merge(other ComplexType) ComplexType {
	var merged = ComplexType{}

	// copy the original schema making sure we don't overwrite its values
	for name, t := range t {
		merged[name] = t
	}

	// loop through other grabbing its schema and merging
	for name, otherType := range other {
		myType := t[name]
		if IsComplexType(myType) && IsComplexType(otherType) {
			merged[name] = myType.(ComplexType).Merge(otherType.(ComplexType))
		} else {
			merged[name] = otherType
		}
	}

	return merged
}
