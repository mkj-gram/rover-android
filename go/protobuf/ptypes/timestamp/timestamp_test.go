package timestamp_test

import (
	"database/sql"
	"database/sql/driver"
	"fmt"
	"reflect"
	"testing"
	"time"

	"github.com/roverplatform/rover/go/protobuf/ptypes/timestamp"
)

var (
	// ensure timestamp.Timestamp implements corresponding intefaces
	_ driver.Valuer = (*timestamp.Timestamp)(nil)
	_ sql.Scanner   = (*timestamp.Timestamp)(nil)
)

func ts(seconds int64, nanos int32) *timestamp.Timestamp {
	var ts timestamp.Timestamp
	ts.Nanos = nanos
	ts.Seconds = seconds
	return &ts
}

func Test_Time(t *testing.T) {
	tcases := []struct {
		exp    time.Time
		expErr error
		in     *timestamp.Timestamp
	}{
		{
			exp: time.Unix(12345, 0).UTC(),
			in:  ts(12345, 0),
		},
		{
			expErr: fmt.Errorf("timestamp: nanos:-1 : nanos not in range [0, 1e9)"),
			in:     ts(0, -1),
		},
	}

	for _, tc := range tcases {
		t.Run("", func(t *testing.T) {
			var (
				exp         = tc.exp
				got, gotErr = timestamp.Time(tc.in)
			)

			if gotErr != nil || tc.expErr != nil {
				if !reflect.DeepEqual(tc.expErr, gotErr) {
					t.Errorf("Error:\nExp: %v\nGot: %v", tc.expErr, gotErr)
				}
				return
			}

			if !reflect.DeepEqual(exp, got) {
				t.Errorf("\nExp: %v\nGot: %v", exp, got)
			}
		})
	}
}

func Test_TimestampProto(t *testing.T) {
	tcases := []struct {
		expErr error

		exp *timestamp.Timestamp
		in  time.Time
	}{
		{
			in:  time.Unix(12345, 0).UTC(),
			exp: ts(12345, 0),
		},
		{
			expErr: fmt.Errorf("timestamp: seconds:-62135596810  before 0001-01-01"),
			in:     time.Unix(-62135596810, 0).UTC(),
		},
	}

	for _, tc := range tcases {
		t.Run("", func(t *testing.T) {
			var (
				exp, expErr = tc.exp, tc.expErr
				got, gotErr = timestamp.TimestampProto(tc.in)
			)

			if gotErr != nil || expErr != nil {
				if !reflect.DeepEqual(expErr, gotErr) {
					t.Errorf("Error:\nExp: %v\nGot: %v", expErr, gotErr)
				}
				return
			}

			if !reflect.DeepEqual(exp, got) {
				t.Errorf("\nExp: %v\nGot: %v", exp, got)
			}
		})
	}
}

func Test_Scan(t *testing.T) {
	tcases := []struct {
		expErr error

		exp *timestamp.Timestamp
		in  interface{}
	}{
		{
			in:  time.Unix(12345, 0).UTC(),
			exp: ts(12345, 0),
		},
		{
			expErr: fmt.Errorf(`timestamp: cannot convert from time.Time:"0000-12-31 23:59:50 +0000 UTC":timestamp: seconds:-62135596810  before 0001-01-01`),
			in:     time.Unix(-62135596810, 0).UTC(),
		}, { // from nil
			in:  nil,
			exp: &timestamp.Timestamp{},
		}, {
			// from unsupported value
			in:     "unsupported source",
			expErr: fmt.Errorf(`timestamp: unsupported value string:"unsupported source"`),
		},
	}

	for _, tc := range tcases {
		t.Run("", func(t *testing.T) {
			var ts = new(timestamp.Timestamp)

			var (
				exp, expErr = tc.exp, tc.expErr
				got, gotErr = ts, ts.Scan(tc.in)
			)

			if gotErr != nil || expErr != nil {
				if !reflect.DeepEqual(expErr, gotErr) {
					t.Errorf("Error:\nExp: %v\nGot: %v", expErr, gotErr)
				}
				return
			}

			if !reflect.DeepEqual(exp, got) {
				t.Errorf("\nExp: %v\nGot: %v", exp, got)
			}
		})
	}
}

func Test_Value(t *testing.T) {
	tcases := []struct {
		expErr error

		in  *timestamp.Timestamp
		exp driver.Value
	}{
		{
			exp: time.Unix(12345, 0).UTC(),
			in:  ts(12345, 0),
		}, {
			// from nil
			in:  nil,
			exp: nil,
		},
		{
			expErr: fmt.Errorf(`timestamp: unable value &timestamp.Timestamp{Timestamp:timestamp.Timestamp{Seconds:0, Nanos:-1}}: timestamp: nanos:-1 : nanos not in range [0, 1e9)`),
			in:     ts(0, -1),
		},
	}

	for _, tc := range tcases {
		t.Run("", func(t *testing.T) {
			var (
				exp, expErr = tc.exp, tc.expErr
				got, gotErr = tc.in.Value()
			)

			if gotErr != nil || expErr != nil {
				if !reflect.DeepEqual(expErr, gotErr) {
					t.Errorf("Error:\nExp: %v\nGot: %v", expErr, gotErr)
				}
				return
			}

			if !reflect.DeepEqual(exp, got) {
				t.Errorf("\nExp: %v\nGot: %v", exp, got)
			}
		})
	}
}
