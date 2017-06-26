package audience

import (
	"fmt"
	"time"

	"github.com/roverplatform/rover/go/protobuf/ptypes/timestamp"
)

func (v *Value) Value() (interface{}, error) {
	switch k := v.GetValueType().(type) {
	case nil:
		return nil, nil
	case *Value_NullValue:
		return nil, nil
		// TODO: not supported
	case *Value_BooleanValue:
		return k.BooleanValue, nil
	case *Value_IntegerValue:
		return k.IntegerValue, nil
	case *Value_DoubleValue:
		return k.DoubleValue, nil
	case *Value_StringValue:
		return k.StringValue, nil
	case *Value_StringArrayValue:
		if k.StringArrayValue == nil {
			return nil, nil
		}
		return k.StringArrayValue.Values, nil
	case *Value_TimestampValue:
		// TODO: handle errors?
		ts, _ := timestamp.Time(k.TimestampValue)
		return ts, nil
	default:
		return nil, fmt.Errorf("unknown type: %T", k)
	}
}

func (v *Value) Load(lv interface{}) error {
	var err error
	switch vv := lv.(type) {
	case nil:
		v.ValueType = &Value_NullValue{Null_NULL}
	case bool:
		v.ValueType = &Value_BooleanValue{vv}
	case string:
		v.ValueType = &Value_StringValue{vv}
	case int, int32, int64:
		var val int64
		switch vv.(type) {
		case int:
			val = int64(vv.(int))
		case int32:
			val = int64(vv.(int32))
		case int64:
			val = vv.(int64)
		}
		v.ValueType = &Value_IntegerValue{val}
	case float32, float64:
		var val float64
		switch vv.(type) {
		case float32:
			val = float64(vv.(float32))
		case float64:
			val = vv.(float64)
		}
		v.ValueType = &Value_DoubleValue{val}
	case []interface{}: // string array
		var sarr = make([]string, len(vv))
		for i := range vv {
			if s, ok := vv[i].(string); ok {
				sarr[i] = s
			}
		}
		v.ValueType = &Value_StringArrayValue{&Value_StringArray{sarr}}
	case time.Time:
		ts, _ := timestamp.TimestampProto(vv)
		v.ValueType = &Value_TimestampValue{ts}
	default:
		err = fmt.Errorf("unknown type: %T", lv)
	}

	return err
}

func IsStringArray(vu *ValueUpdates) error {
	if vu == nil {
		return fmt.Errorf("nil")
	}

	if len(vu.GetValues()) == 0 {
		return fmt.Errorf("empty")
	}

	typ, err := ValueUpdateToTypeName(vu.GetValues()[0])
	if err != nil {
		return err
	}

	const exp = "array[string]"
	if typ != exp {
		return fmt.Errorf("TypeMismatch")
	}

	return nil
}

// TODO: how to automatically have it generated with protobuf?
func valueToTypeName(v *Value) (string, error) {
	switch typ := v.GetValueType().(type) {
	case *Value_BooleanValue:
		return "bool", nil
	case *Value_IntegerValue:
		return "integer", nil
	case *Value_DoubleValue:
		return "double", nil
	case *Value_StringValue:
		return "string", nil
	case *Value_StringArrayValue:
		return "array[string]", nil
	case *Value_NullValue:
		return NullType, nil
	case *Value_TimestampValue:
		return "timestamp", nil
	default:
		return "", fmt.Errorf("ValueToTypeName: unknown: %T", typ)
	}
}

func ValueUpdateToTypeName(vu *ValueUpdate) (string, error) {
	switch vu.GetUpdateType() {
	case ValueUpdate_SET:
		return valueToTypeName(vu.GetValue())
	case ValueUpdate_ADD, ValueUpdate_REMOVE:
		return "array[string]", nil
	default:
		return "", fmt.Errorf("ValueUpdateToTypeName: unknown: %q", vu.GetUpdateType())
	}
}

// Convenience Wrappers
func BoolVal(val bool) *Value                     { return &Value{&Value_BooleanValue{val}} }
func IntegerVal(val int64) *Value                 { return &Value{&Value_IntegerValue{val}} }
func DoubleVal(val float64) *Value                { return &Value{&Value_DoubleValue{val}} }
func StringVal(val string) *Value                 { return &Value{&Value_StringValue{val}} }
func TimestampVal(val timestamp.Timestamp) *Value { return &Value{&Value_TimestampValue{&val}} }

func StringArrayVal(args ...string) *Value {
	return &Value{&Value_StringArrayValue{&Value_StringArray{args}}}
}

var NullVal = &Value{&Value_NullValue{}}

const NullType = "null"
