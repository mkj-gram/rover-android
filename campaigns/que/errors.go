package que

import (
	"bytes"
	"fmt"
	"runtime"
)

// Recover tries to handle panics in job execution.
// A stacktrace is stored into Info last_error.
func Recover(recoverer func(err interface{}, stacktrace string)) {
	if r := recover(); r != nil {
		stackBuf := make([]byte, 1024)
		n := runtime.Stack(stackBuf, false)

		buf := &bytes.Buffer{}
		fmt.Fprintf(buf, "%v\n", r)
		fmt.Fprintln(buf, string(stackBuf[:n]))
		fmt.Fprintln(buf, "[...]")
		stacktrace := buf.String()

		recoverer(r, stacktrace)
		// log.Printf("event=panic job_id=%d job_type=%s\n%s", j.ID, j.Type, stacktrace)
		// if err := j.Error(stacktrace); err != nil {
		// 	log.Printf("attempting to save error on job %d: %v", j.ID, err)
		// }
	}
}
