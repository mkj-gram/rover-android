package wrappers

func Bool(val bool) *BoolValue {
	return &BoolValue{Value: val}
}
