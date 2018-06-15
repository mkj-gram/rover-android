package mongodb

import (
	"github.com/pkg/errors"
	"gopkg.in/mgo.v2/bson"
)

const (
	// http://bsonspec.org/spec.html
	boolKind  = 0x08
	nullKind  = 0x0A
	int32Kind = 0x10
	int64Kind = 0x12
)

type boolValue struct {
	*bool
}

func (b *boolValue) Value() interface{} {
	if b == nil || b.bool == nil {
		return nil
	}

	return b.bool
}

func (b boolValue) GetBSON() (interface{}, error) {
	if b.bool == nil {
		return nil, nil
	}
	return b.bool, nil
}

func (b *boolValue) SetBSON(raw bson.Raw) error {
	switch raw.Kind {
	case nullKind:
		// Do nothing default is nil
	case boolKind:
		// 1 == true
		// 0 == false
		var val = raw.Data[0] == 1
		b.bool = &val
	default:
		return errors.Errorf("unsupported kind: %v", raw.Kind)
	}

	return nil
}

type intValue struct {
	*int32
}

func (v *intValue) Value() interface{} {
	if v == nil || v.int32 == nil {
		return nil
	}
	return *v.int32
}

func (v intValue) GetBSON() (interface{}, error) {
	if v.int32 == nil {
		return nil, nil
	}

	return v.int32, nil
}

func (v *intValue) SetBSON(raw bson.Raw) error {
	switch raw.Kind {
	case nullKind:
		v.int32 = nil
	case int32Kind, int64Kind:
		var val int32
		if err := raw.Unmarshal(&val); err != nil {
			return err
		}
		v.int32 = &val
	default:
		return errors.Errorf("unsupported kind: %v", raw.Kind)
	}

	return nil
}
