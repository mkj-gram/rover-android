package log

import (
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"sync"
)

type LogLevel int

const (
	Discard LogLevel = iota
	Error
	Info
	Debug
)

// Logger represents logging facility
type Interface interface {
	Debugf(msg string, args ...interface{})
	Infof(msg string, args ...interface{})
	Errorf(msg string, args ...interface{})
}

type Log struct {
	mu    sync.Mutex
	level LogLevel

	debug, info, err *log.Logger
}

func NewLog(level LogLevel) *Log {

	l := &Log{
		level: level,
		debug: log.New(ioutil.Discard, "log=debug ", log.Lshortfile),
		info:  log.New(ioutil.Discard, "log=info ", log.Lshortfile),
		err:   log.New(ioutil.Discard, "log=error ", log.Lshortfile),
	}

	l.SetLevel(level)

	return l
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
	l.err.Output(2, fmt.Sprintf(msg, args...))
}

func (l *Log) Infof(msg string, args ...interface{}) {
	l.info.Output(2, fmt.Sprintf(msg, args...))
}

func (l *Log) Debugf(msg string, args ...interface{}) {
	l.debug.Output(2, fmt.Sprintf(msg, args...))
}
