package optional

import (
	"fmt"
)

// Bool is an optional bool
type Bool struct {
	value *bool
}

// NewBool creates a optional.Bool from a bool
func NewBool(v bool) Bool {
	return Bool{&v}
}

// Set sets the bool value
func (b *Bool) Set(v bool) {
	b.value = &v
}

// Grab the value using an unsafe pointer dereference
func (b Bool) Value() bool {
	return *b.value
}

// Get returns the bool value or false if value is not present
func (b Bool) Get() (bool, bool) {
	if !b.Present() {
		return false, false
	}
	return *b.value, true
}

// Remove the current value
func (b Bool) Unset() {
	b.value = nil
}

// Present returns whether or not the value is present
func (b Bool) Present() bool {
	return b.value != nil
}

// OrElse returns the bool value or a default value if the value is not present
func (b Bool) OrElse(v bool) bool {
	if b.Present() {
		return *b.value
	}
	return v
}

func (b Bool) MarshalJSON() ([]byte, error) {
	if v, ok := b.Get(); !ok {
		return []byte("null"), nil
	} else if v == true {
		return []byte("true"), nil
	} else {
		return []byte("false"), nil
	}
}

func (b *Bool) UnmarshalJSON(data []byte) error {
	switch string(data) {
	case "true", "1":
		b.Set(true)
	case "false", "0":
		b.Set(false)
	case "null":
		b.Unset()
	default:
		return fmt.Errorf("unsupported value: %s", string(data))
	}

	return nil
}
