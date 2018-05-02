package logger

import (
	"fmt"
	"io"
	"os"
)

var DefaultWriter = &StdWriter{
	Stdout: os.Stdout,
	Stderr: os.Stderr,
}

type Writer interface {
	WriteEntry(*Entry) error
}

type StdWriter struct {
	Stdout, Stderr io.Writer
}

func (c *StdWriter) WriteEntry(e *Entry) error {
	serialized, err := e.Logger.Formatter.Format(e)
	if err != nil {
		fmt.Fprintf(c.Stderr, "Failed to obtain reader, %v\n", err)
		return err
	}

	if e.Level == ErrorLevel {
		_, err = c.Stderr.Write(serialized)
	} else {
		_, err = c.Stdout.Write(serialized)
	}

	if err != nil {
		fmt.Fprintf(c.Stderr, "Failed to write to log, %v\n", err)
		return err
	}

	return nil
}
