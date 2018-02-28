package mongodb

import (
	"github.com/pkg/errors"
	"github.com/roverplatform/rover/go/optional"
	"gopkg.in/mgo.v2/bson"
)

const (
	BoolKind = 8
	NullKind = 10
)

type boolValue struct {
	optional.Bool
}

func newBoolValue(val bool) boolValue {
	b := boolValue{optional.NewBool(val)}
	return b
}

func (b boolValue) GetBSON() (interface{}, error) {
	if !b.Present() {
		return nil, nil
	}

	val, _ := b.Get()
	return val, nil
}

func (b *boolValue) SetBSON(raw bson.Raw) error {
	switch raw.Kind {
	case NullKind:
		// Do nothing default is nil
	case BoolKind:
		// 1 == true
		// 0 == false
		b.Set(raw.Data[0] == 1)
	default:
		return errors.Errorf("Unsupported Kind %v", raw.Kind)
	}

	return nil
}
