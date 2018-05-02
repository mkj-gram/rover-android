package logger

import (
	"fmt"
	"io"
	"os"
	"sync"
	"sync/atomic"
)

var (
	_ Logger = (*Log)(nil)
)

type Log struct {
	Out Writer

	Formatter Formatter
	Level     Level

	entryPool sync.Pool
}

// New creates a default logger that outputs to stdout in JSON format using InfoLevel
func New() *Log {
	return &Log{
		Out: DefaultWriter,

		Formatter: &JsonFormatter{},
		Level:     InfoLevel,
	}
}

func (l *Log) SetFormatter(formatter Formatter) {
	l.Formatter = formatter
}

func (l *Log) SetOutput(out Writer) {
	l.Out = out
}

// SetLevel set a new level for the logger
func (l *Log) SetLevel(level Level) {
	atomic.StoreUint32((*uint32)(&l.Level), uint32(level))
}

// WithFields generates a new logger with stored fields later to be used by the formatter in output
func (l *Log) WithFields(fields Fields) Logger {
	entry := l.newEntry()
	defer l.releaseEntry(entry)
	return entry.WithFields(fields)
}

func (l *Log) Debugf(format string, args ...interface{}) {
	l.Debug(fmt.Sprintf(format, args...))
}

func (l *Log) Infof(format string, args ...interface{}) {
	l.Info(fmt.Sprintf(format, args...))
}

func (l *Log) Errorf(format string, args ...interface{}) {
	l.Error(fmt.Sprintf(format, args...))
}

func (l *Log) Fatalf(format string, args ...interface{}) {
	l.Fatal(fmt.Sprintf(format, args...))
}

func (l *Log) Debug(args ...interface{}) {
	if l.level() >= DebugLevel {
		entry := l.newEntry()
		entry.Debug(args...)
		l.releaseEntry(entry)
	}
}

func (l *Log) Info(args ...interface{}) {
	if l.level() >= InfoLevel {
		entry := l.newEntry()
		entry.Info(args...)
		l.releaseEntry(entry)
	}
}

func (l *Log) Error(args ...interface{}) {
	if l.level() >= ErrorLevel {
		entry := l.newEntry()
		entry.Error(args...)
		l.releaseEntry(entry)
	}
}

func (l *Log) Fatal(args ...interface{}) {
	entry := l.newEntry()
	entry.Fatal(args...)
	l.releaseEntry(entry)

	os.Exit(1)
}

// newEntry either picks from the pool of previous entries to re-use or generates a new one
func (l *Log) newEntry() *Entry {
	entry, ok := l.entryPool.Get().(*Entry)
	if ok {
		return entry.ClearFields()
	}

	return newEntry(l)
}

// releaseEntry place the entry back into the pool for it to be re-used later
func (l *Log) releaseEntry(entry *Entry) {
	l.entryPool.Put(entry)
}

// level atomically get the current level of the logger
func (l *Log) level() Level {
	return Level(atomic.LoadUint32((*uint32)(&l.Level)))
}
