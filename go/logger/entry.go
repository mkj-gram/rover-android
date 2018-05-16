package logger

import (
	"fmt"
	"time"
)

var _ Logger = (*Entry)(nil)

type Entry struct {
	Logger *Log

	Data Fields

	// Time for when the log entry was created
	Time time.Time

	Level Level

	Message string
}

func newEntry(l *Log) *Entry {
	return &Entry{
		Logger: l,

		Data: make(Fields),
	}
}

func (entry *Entry) ClearFields() *Entry {
	entry.Data = nil
	return entry
}

func (entry *Entry) Reset() {
	entry.Data = nil
	entry.Message = ""
}

// Creates a new entry with fields
func (entry *Entry) WithFields(fields Fields) Logger {
	data := make(Fields, len(entry.Data)+len(fields))
	for k, v := range entry.Data {
		data[k] = v
	}
	for k, v := range fields {
		data[k] = v
	}

	return &Entry{Logger: entry.Logger, Data: data}
}

func (entry *Entry) Debugf(format string, args ...interface{}) {
	entry.Debug(fmt.Sprintf(format, args...))
}

func (entry *Entry) Infof(format string, args ...interface{}) {
	entry.Info(fmt.Sprintf(format, args...))
}

func (entry *Entry) Errorf(format string, args ...interface{}) {
	entry.Error(fmt.Sprintf(format, args...))
}

func (entry *Entry) Fatalf(format string, args ...interface{}) {
	entry.Fatal(fmt.Sprintf(format, args...))
}

func (entry *Entry) Debug(args ...interface{}) {
	if entry.Logger.level() >= DebugLevel {
		entry.log(DebugLevel, fmt.Sprint(args...))
	}
}

func (entry *Entry) Info(args ...interface{}) {
	if entry.Logger.level() >= InfoLevel {
		entry.log(InfoLevel, fmt.Sprint(args...))
	}
}

func (entry *Entry) Error(args ...interface{}) {
	if entry.Logger.level() >= ErrorLevel {
		entry.log(ErrorLevel, fmt.Sprint(args...))
	}
}

func (entry *Entry) Fatal(args ...interface{}) {
	entry.log(FatalLevel, fmt.Sprint(args...))
}

func (entry *Entry) log(level Level, msg string) {
	entry.Time = time.Now()
	entry.Level = level
	entry.Message = msg

	entry.Logger.Out.WriteEntry(entry)
}
