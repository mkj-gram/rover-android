package logger

type Level uint32

const (
	// FatalLevel level. Logs and then calls `os.Exit(1)`.
	FatalLevel Level = iota
	// ErrorLevel level. Logs. Used for errors that should definitely be noted.
	ErrorLevel
	// InfoLevel level. General operational entries about what's going on inside the
	// application.
	InfoLevel
	// DebugLevel level. Usually only enabled when debugging. Very verbose logging.
	DebugLevel
)

func LevelFromString(l string) Level {
	switch l {
	case "fatal":
		return FatalLevel
	case "error":
		return ErrorLevel
	case "info":
		return InfoLevel
	case "debug":
		return DebugLevel
	default:
		return InfoLevel
	}
}

func (l Level) String() string {
	switch l {
	case FatalLevel:
		return "fatal"
	case ErrorLevel:
		return "error"
	case InfoLevel:
		return "info"
	case DebugLevel:
		return "debug"
	default:
		return "debug"
	}
}
