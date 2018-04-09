package validations

import (
	"fmt"
	"testing"
)

func TestRequire(t *testing.T) {
	tcases := []struct {
		desc string
		val  interface{}
		exp  error
	}{
		{
			desc: "nil ptr",
			val:  ptr{nil},
			exp:  fmt.Errorf("ptr: is required."),
		},
	}

	for _, tc := range tcases {
		t.Run("", func(t *testing.T) {
			var (
				exp = tc.exp
				got = All(Value("ptr", tc.val, Require))
			)

			if exp.Error() != got.Error() {
				t.Errorf("\nExp: %v\nGot: %v", exp, got)
			}
		})
	}
}
