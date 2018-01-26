package validations

import (
	"fmt"
	"reflect"

	"github.com/pkg/errors"
)

var (
	ErrRequired = errors.New("is required")
)

type valueError struct {
	name string
	err  []error
}

func (ve valueError) Error() string {
	if len(ve.err) == 0 {
		return ""
	}
	var str = ve.name + ": "
	for i := range ve.err {
		str += ve.err[i].Error()
		if i < len(ve.err)-1 {
			str += ", "
		}
	}

	return str
}

type validationError []error

func (ve validationError) Error() string {
	var str = ""
	for i := range ve {
		if ve[i] == nil {
			continue
		}
		str += ve[i].Error()
		if i < len(ve)-1 {
			str += ". "
		} else {
			str += "."
		}
	}

	return str
}

type ValueValidator struct {
	Name       string
	Value      interface{}
	Validators []func(interface{}) error
}

func (vv *ValueValidator) Validate() error {
	var errs []error
	for _, validate := range vv.Validators {
		if err := validate(vv.Value); err != nil {
			errs = append(errs, err)
		}
	}

	if len(errs) > 0 {
		return valueError{
			name: vv.Name,
			err:  errs,
		}
	}

	return nil
}

func Value(name string, val interface{}, validators ...func(val interface{}) error) *ValueValidator {
	return &ValueValidator{
		Name:       name,
		Value:      val,
		Validators: validators,
	}
}

type ptr struct {
	val interface{}
}

func Pointer(p interface{}) ptr {
	return ptr{p}
}

func IsError(err error) bool {
	if err == ErrRequired {
		return true
	}
	if _, ok := err.(validationError); ok {
		return true
	}

	return false
}

func Require(val interface{}) error {
	switch v := val.(type) {
	case nil:
		return ErrRequired
	case ptr:
		if rv := reflect.ValueOf(v.val); !rv.IsValid() || rv.IsNil() {
			return ErrRequired
		}
	case string:
		if v == "" {
			return ErrRequired
		}
	case int:
		if v == 0 {
			return ErrRequired
		}
	case int32:
		if v == 0 {
			return ErrRequired
		}
	case int64:
		if v == 0 {
			return ErrRequired
		}
	default:
		panic(fmt.Sprintf("unexpected value: %v(%T)", val, val))
	}

	return nil
}

func All(vvs ...*ValueValidator) error {
	var errs []error
	for _, vv := range vvs {
		if err := vv.Validate(); err != nil {
			errs = append(errs, err)
		}
	}

	if len(errs) > 0 {
		return validationError(errs)
	}

	return nil
}
