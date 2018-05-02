package logger_test

import (
	"bytes"
	"testing"

	"io/ioutil"

	"github.com/roverplatform/rover/go/logger"
)

func Assert(t *testing.T, want string, got string, msg string) {
	t.Helper()
	if got != want {
		t.Errorf("Diff:(%s)\n%s != %s", msg, want, got)
	}
}

func TestLog_Debug(t *testing.T) {
	var out bytes.Buffer

	log := logger.Log{
		Out:       &logger.StdWriter{&out, &out},
		Formatter: &logger.TextFormatter{DisableTimestamp: true},
		Level:     logger.DebugLevel,
	}

	// Respects level
	log.Debug("Hello")
	Assert(t, `level="debug" msg="Hello"`+"\n", out.String(), "Debug should log out when level is DebugLevel")
	out.Reset()

	log.Debugf("(%s)", "Hello")
	Assert(t, `level="debug" msg="(Hello)"`+"\n", out.String(), "Debug should log out when level is DebugLevel")
	out.Reset()

	log.SetLevel(logger.InfoLevel)
	log.Debug("This should not print")
	Assert(t, "", out.String(), "Debug should not print due to InfoLevel")
	out.Reset()
}

func TestLog_WithFields(t *testing.T) {
	var out bytes.Buffer

	log := logger.Log{
		Out:       &logger.StdWriter{&out, &out},
		Formatter: &logger.TextFormatter{DisableTimestamp: true},
		Level:     logger.DebugLevel,
	}

	log.WithFields(logger.Fields{"field": 1}).Info("hi")
	Assert(t, `level="info" field="1" msg="hi"`+"\n", out.String(), "logger should include fields in output")
}

func BenchmarkLog_Info(b *testing.B) {
	log := logger.Log{
		Out:       &logger.StdWriter{ioutil.Discard, ioutil.Discard},
		Level:     logger.DebugLevel,
		Formatter: &logger.TextFormatter{},
	}

	for i := 0; i < b.N; i++ {
		log.Info("this is a test message")
	}
}

func TestLog_Error(t *testing.T) {
	var (
		buf, bufErr bytes.Buffer
	)

	log := logger.Log{
		Out: &logger.StdWriter{
			Stdout: &buf,
			Stderr: &bufErr,
		},
		Formatter: &logger.TextFormatter{DisableTimestamp: true},
		Level:     logger.DebugLevel,
	}

	// Respects level
	log.Errorf("(%s)", "Hello error")
	Assert(t, `level="error" msg="(Hello error)"`+"\n", bufErr.String(), "switches to WriteError")
	bufErr.Reset()

	log.Infof("hello %s", `world`)
	Assert(t, `level="info" msg="hello world"`+"\n", buf.String(), "")
	buf.Reset()
}
