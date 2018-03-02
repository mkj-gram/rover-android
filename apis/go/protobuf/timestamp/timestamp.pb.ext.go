package timestamp

import "time"

func (timestamp *Timestamp) toTime() time.Time {
	var (
		t   = time.Unix(timestamp.GetSeconds(), int64(timestamp.GetNanos()))
		loc = time.FixedZone("UTC", int(timestamp.GetUtcOffset()))
	)

	return t.In(loc)
}
