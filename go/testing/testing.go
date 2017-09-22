package testing

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
	"os/exec"
	"reflect"
	"strings"

	"github.com/go-test/deep"
)

func init() {
	deep.MaxDepth = 50
}

func Difff(diff []string) string {
	return strings.Join(diff, "\n")
}

func Diff(exp, got interface{}, expErr, gotErr error) []string {
	diffFn := deepDiff
	if os.Getenv("JSONDIFF") != "" {
		diffFn = jsonDiff
	}
	return diffFn(exp, got, expErr, gotErr)
}

func deepDiff(exp, got interface{}, expErr, gotErr error) []string {
	// if an error case
	if expErr != nil || gotErr != nil {
		return deep.Equal(expErr, gotErr)
	}

	return deep.Equal(exp, got)
}

func jsonDiff(exp, got interface{}, expErr, gotErr error) []string {
	// if an error case
	if expErr != nil || gotErr != nil {
		if !reflect.DeepEqual(expErr, gotErr) {
			return []string{
				fmt.Sprintf("%+v", expErr),
				fmt.Sprintf("%+v", gotErr),
			}
		}

		// error case skip the rest
		return nil
	}

	jsonStr := func(v interface{}) string {
		b, err := json.Marshal(v)
		if err != nil {
			panic(err)
		}

		var out bytes.Buffer
		json.Indent(&out, b, "", "  ")
		return out.String()
	}

	_ = jsonStr

	diffstr, err := diffCmd(jsonStr(exp), jsonStr(got))
	if err != nil {
		panic(err)
	}

	if !reflect.DeepEqual(exp, got) {
		// var diff, err := json.Marsha
		return []string{
			diffstr,
			// jsonStr(exp),
			// jsonStr(got),
		}
	}

	return nil
}

func diffCmd(exp, got string) (string, error) {
	fa, err := ioutil.TempFile("", "exp")
	if err != nil {
		return "", err
	}
	defer fa.Close()

	fb, err := ioutil.TempFile("", "got")
	if err != nil {
		return "", err
	}
	defer fb.Close()

	if _, err := fa.WriteString(exp + "\n"); err != nil {
		return "", err
	}
	if _, err := fb.WriteString(got + "\n"); err != nil {
		return "", err
	}
	fa.Sync()
	fb.Sync()

	cmd := exec.Command("diff", fa.Name(), fb.Name())
	data, err := cmd.Output()
	if err == exec.ErrNotFound {
		return "", err
	}

	return string(data), nil
}
