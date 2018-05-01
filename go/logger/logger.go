package logger

type Fields map[string]interface{}

type Logger interface {
	Debug(a ...interface{})
	Debugf(format string, a ...interface{})

	Info(a ...interface{})
	Infof(format string, a ...interface{})

	Error(a ...interface{})
	Errorf(format string, a ...interface{})

	Fatal(a ...interface{})
	Fatalf(format string, a ...interface{})

	WithFields(fields Fields) Logger
}
