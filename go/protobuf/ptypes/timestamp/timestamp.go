package timestamp

import (
	"database/sql/driver"
	"fmt"
	"time"

	"github.com/golang/protobuf/ptypes"
	"github.com/golang/protobuf/ptypes/timestamp"
)

// Timestamp is an extension of the official timestamp.Timestamp
// that enables DB mapping by implementing database/sql/driver.Valuer
// and database/sql.Scanner interfaces
type Timestamp timestamp.Timestamp

// Time converts Timestamp to time.Time unless there's an error
func Time(ts *Timestamp) (time.Time, error) {
	return ptypes.Timestamp((*timestamp.Timestamp)(ts))
}

// TimestampProto converts time.Time to *Timestamp unless an error
func TimestampProto(t time.Time) (*Timestamp, error) {
	ts, err := ptypes.TimestampProto(t)
	if err != nil {
		return nil, err
	}

	return (*Timestamp)(ts), nil
}

// Value converts Time value into a value that DB undestands
func (ts *Timestamp) Value() (driver.Value, error) {
	if ts == nil {
		return nil, nil
	}

	got, err := Time(ts)
	if err != nil {
		return nil, fmt.Errorf("timestamp: unable value %#v: %v", ts, err)
	}

	return got, nil
}

// Scan scans from DB value
func (ts *Timestamp) Scan(src interface{}) error {
	switch v := src.(type) {
	case time.Time:
		// TODO: is there more efficient way
		t, err := TimestampProto(v)
		if err != nil {
			return fmt.Errorf("timestamp: cannot convert from %T:%[1]q:%v", src, err)
		}
		ts.Seconds = t.Seconds
		ts.Nanos = t.Nanos
		return nil
	case nil:
		return nil
	}

	return fmt.Errorf("timestamp: unsupported value %T:%[1]q", src)
}