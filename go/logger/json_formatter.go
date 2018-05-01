package logger

import (
	"encoding/json"
	"fmt"
)

type JsonFormatter struct {
	TimestampFormat string

	DisableTimestamp bool
}

func (f *JsonFormatter) Format(entry *Entry) ([]byte, error) {

	data := make(Fields, len(entry.Data)+3)
	for k, v := range entry.Data {
		switch v := v.(type) {
		case error:
			data[k] = v.Error()
		default:
			data[k] = v
		}
	}

	timestampFormat := f.TimestampFormat
	if timestampFormat == "" {
		timestampFormat = defaultTimestampFormat
	}

	if !f.DisableTimestamp {
		data["time"] = entry.Time.Format(timestampFormat)
	}
	data["msg"] = entry.Message
	data["level"] = entry.Level.String()

	serialized, err := json.Marshal(data)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal fields to JSON, %v", err)
	}

	return append(serialized, '\n'), nil
}
