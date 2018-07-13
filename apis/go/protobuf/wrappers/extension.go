package wrappers

func Bool(val bool) *BoolValue {
	return &BoolValue{Value: val}
}

func Int32(val int32) *Int32Value {
	return &Int32Value{Value: val}
}
