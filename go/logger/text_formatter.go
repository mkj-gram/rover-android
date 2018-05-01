package logger

import (
	"bytes"
	"fmt"
)

type stringer interface {
	String() string
}

type TextFormatter struct {
	TimestampFormat string

	DisableTimestamp bool
}

func (f *TextFormatter) Format(entry *Entry) ([]byte, error) {

	keys := make([]string, 0, len(entry.Data))
	for k := range entry.Data {
		keys = append(keys, k)
	}

	var b = formatBufferPool.Get().(*bytes.Buffer)
	defer formatBufferPool.Put(b)

	if b == nil {
		b = &bytes.Buffer{}
	}

	b.Reset()

	timestampFormat := f.TimestampFormat
	if timestampFormat == "" {
		timestampFormat = defaultTimestampFormat
	}

	if !f.DisableTimestamp {
		f.appendKeyValue(b, "time", entry.Time.Format(timestampFormat))
	}

	f.appendKeyValue(b, "level", entry.Level.String())

	for _, key := range keys {
		f.appendKeyValue(b, key, entry.Data[key])
	}

	if entry.Message != "" {
		f.appendKeyValue(b, "msg", entry.Message)
	}

	b.WriteByte('\n')
	return b.Bytes(), nil
}

func (f *TextFormatter) appendKeyValue(b *bytes.Buffer, key string, value interface{}) {
	if b.Len() > 0 {
		b.WriteByte(' ')
	}

	b.WriteString(key)
	b.WriteByte('=')
	f.appendValue(b, value)
}

func (f *TextFormatter) appendValue(b *bytes.Buffer, value interface{}) {

	var stringVal string

	switch v := value.(type) {
	case stringer:
		stringVal = v.String()
	case string:
		stringVal = v
	default:
		stringVal = fmt.Sprint(v)
	}

	b.WriteString(fmt.Sprintf("%q", stringVal))
}
