package structpb

import "fmt"

var Null = &Value{
	Kind: &Value_NullValue{
		NullValue: NullValue_NULL_VALUE,
	},
}

func Number(v float64) *Value {
	return &Value{
		Kind: &Value_NumberValue{
			NumberValue: v,
		},
	}
}

func String(v string) *Value {
	return &Value{
		Kind: &Value_StringValue{
			StringValue: v,
		},
	}
}

func Bool(v bool) *Value {
	return &Value{
		Kind: &Value_BoolValue{
			BoolValue: v,
		},
	}
}

func Val(v interface{}) *Value {

	// Does not currently support struct values
	switch t := v.(type) {
	case int:
		return Number(float64(t))
	case int32:
		return Number(float64(t))
	case int64:
		return Number(float64(t))
	case string:
		return String(t)
	case bool:
		return Bool(t)
	default:
		panic(fmt.Sprintf("unknown value type(%T): %v", v, v))
	}

}

func ListVal(v ...interface{}) *Value {

	var values []*Value

	for i := range v {
		values = append(values, Val(v[i]))
	}

	return &Value{
		Kind: &Value_ListValue{
			ListValue: &ListValue{
				Values: values,
			},
		},
	}
}
