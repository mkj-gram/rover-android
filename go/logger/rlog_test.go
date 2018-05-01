package logger_test

import (
	"bytes"
	"strings"
	"testing"

	"github.com/roverplatform/rover/go/logger"
	"io/ioutil"
)

func Assert(t *testing.T, want string, got string, msg string) {
	if got != want {
		t.Errorf("Diff:(%s)\n%s != %s", msg, want, got)
	}
}

func TestRLog_Debug(t *testing.T) {
	var out bytes.Buffer

	log := logger.RLog{
		Out:       &out,
		Formatter: &logger.TextFormatter{DisableTimestamp: true},
		Level:     logger.DebugLevel,
	}

	// Respects level
	log.Debug("Hello")
	Assert(t, `level="debug" msg="Hello"`, strings.TrimRight(out.String(), "\n"), "Debug should log out when level is DebugLevel")
	out.Reset()

	log.Debugf("(%s)", "Hello")
	Assert(t, `level="debug" msg="(Hello)"`, strings.TrimRight(out.String(), "\n"), "Debug should log out when level is DebugLevel")
	out.Reset()

	log.SetLevel(logger.InfoLevel)
	log.Debug("This should not print")
	Assert(t, "", out.String(), "Debug should not print due to InfoLevel")
	out.Reset()
}

func TestRLog_WithFields(t *testing.T) {
	var out bytes.Buffer

	log := logger.RLog{
		Out:       &out,
		Formatter: &logger.TextFormatter{DisableTimestamp: true},
		Level:     logger.DebugLevel,
	}

	log.WithFields(logger.Fields{"field": 1}).Info("hi")
	Assert(t, `level="info" field="1" msg="hi"`, strings.TrimRight(out.String(), "\n"), "logger should include fields in output")
}

func BenchmarkRLog_Info(b *testing.B) {
	log := logger.RLog{
		Out:       ioutil.Discard,
		Level:     logger.DebugLevel,
		Formatter: &logger.TextFormatter{},
	}

	for i := 0; i < b.N; i++ {
		log.Info("this is a test message")
	}
}
