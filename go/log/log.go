package log

import (
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"sync"
)

const (
	Discard LogLevel = iota
	Error
	Info
	Debug
)

// Logger represents logging facility
type (
	Interface interface {
		Debugf(msg string, args ...interface{})
		Infof(msg string, args ...interface{})
		Errorf(msg string, args ...interface{})
	}

	LogLevel int

	Log struct {
		mu    sync.Mutex
		level LogLevel

		// required when used with souce line location annotation
		// how many call stack levels to skip when logger is wrapped in a helper
		outputLevel int

		debug, info, err *log.Logger
	}

	Option func(*Log)
)

func New(level LogLevel, opts ...Option) *Log {

	l := &Log{
		outputLevel: 2, // when logger used directly
		level:       level,
		debug:       log.New(ioutil.Discard, "log=debug ", log.Lshortfile),
		info:        log.New(ioutil.Discard, "log=info ", log.Lshortfile),
		err:         log.New(ioutil.Discard, "log=error ", log.Lshortfile),
	}

	l.SetLevel(level)

	for i := range opts {
		opts[i](l)
	}

	return l
}

func WithOutputLevel(outputLevel int) Option {
	return func(l *Log) {
		l.outputLevel = outputLevel
	}
}

// NewLog is deprecated used New instead
func NewLog(level LogLevel, opts ...Option) *Log {
	return New(level, opts...)
}

func (l *Log) SetLevel(level LogLevel) {
	l.mu.Lock()
	l.level = level
	l.mu.Unlock()

	switch level {
	case Discard:
		l.err.SetOutput(ioutil.Discard)
		l.info.SetOutput(ioutil.Discard)
		l.debug.SetOutput(ioutil.Discard)
	case Error:
		l.err.SetOutput(os.Stderr)
		l.info.SetOutput(ioutil.Discard)
		l.debug.SetOutput(ioutil.Discard)
	case Info:
		l.err.SetOutput(os.Stderr)
		l.info.SetOutput(os.Stdout)
		l.debug.SetOutput(ioutil.Discard)
	case Debug:
		l.err.SetOutput(os.Stderr)
		l.info.SetOutput(os.Stdout)
		l.debug.SetOutput(os.Stdout)
	}
}

func (l *Log) Errorf(msg string, args ...interface{}) {
	l.err.Output(l.outputLevel, fmt.Sprintf(msg, args...))
}

func (l *Log) Infof(msg string, args ...interface{}) {
	l.info.Output(l.outputLevel, fmt.Sprintf(msg, args...))
}

func (l *Log) Debugf(msg string, args ...interface{}) {
	l.debug.Output(l.outputLevel, fmt.Sprintf(msg, args...))
}
