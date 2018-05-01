package logger

import (
	"bytes"
	"sync"
	"time"
)

const defaultTimestampFormat = time.RFC3339

var formatBufferPool *sync.Pool

func init() {
	formatBufferPool = &sync.Pool{
		New: func() interface{} {
			return new(bytes.Buffer)
		},
	}
}

type Formatter interface {
	Format(entry *Entry) ([]byte, error)
}
