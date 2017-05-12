package authsvc

import (
	"github.com/go-test/deep"
	"github.com/pkg/errors"

	"testing"
)

func Test_validateEmail(t *testing.T) {
	tcases := []struct {
		exp error
		in  string
	}{
		{
			exp: errors.New("email: is invalid"),
			in:  "hello-email.com",
		},
		{
			exp: nil,
			in:  "hello@email.com",
		},
		{
			exp: nil,
			in:  "HELLO@EMaiL.cOM",
		},
	}

	for _, tc := range tcases {
		t.Run("", func(t *testing.T) {
			var (
				exp = tc.exp
				got = validateEmail(tc.in)
			)

			if diff := deep.Equal(exp, got); diff != nil {
				t.Errorf("\nExp: %v\nGot: %v", exp, got)
			}
		})
	}
}

func Test_validatePassword(t *testing.T) {
	tcases := []struct {
		exp error
		in  string
	}{{
		exp: errors.New("password: is too short"),
		in:  "short",
	}, {
		exp: nil,
		in:  "atlst6",
	},
	}

	for _, tc := range tcases {
		t.Run("", func(t *testing.T) {
			var (
				exp = tc.exp
				got = validatePassword(tc.in)
			)

			if diff := deep.Equal(exp, got); diff != nil {
				t.Errorf("\nExp: %v\nGot: %v", exp, got)
			}
		})
	}
}
