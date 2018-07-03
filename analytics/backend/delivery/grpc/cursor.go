package grpc

import (
	"encoding/base64"
	"errors"
	"fmt"
	"strings"
	"time"
)

type DateCursor struct {
	Date     string
	TimeZone *time.Location
}

func NewDateCursor(date string, loc *time.Location) *DateCursor {
	return &DateCursor{
		Date:     date,
		TimeZone: loc,
	}
}

// FromBase64String decodes a base64 date cursor string into their respected attributes. If an empty string is provided
// it is considered empty and should start from the current time
func (cursor *DateCursor) FromBase64String(d string) error {
	if d == "" {
		cursor.Date = time.Now().In(cursor.TimeZone).Format("2006-01-02")
		return nil
	}

	var data, err = base64.StdEncoding.DecodeString(d)
	if err != nil {
		return err
	}

	var parts = strings.Split(string(data), ":")
	if len(parts) != 2 {
		return errors.New("invalid cursor")
	}

	loc, err := time.LoadLocation(parts[1])
	if err != nil {
		return err
	}

	cursor.Date = parts[0]
	cursor.TimeZone = loc

	return nil
}

// ToBase64String converts the cursors data into a base64 string
func (cursor *DateCursor) ToBase64String() string {
	var data = fmt.Sprintf("%s:%s", cursor.Date, cursor.TimeZone.String())
	return base64.StdEncoding.EncodeToString([]byte(data))
}

// GetTimestamp parses the date cursor into a Time struct preserving the time zone
func (cursor *DateCursor) GetTimestamp() (time.Time, error) {
	var loc = time.UTC
	if cursor.TimeZone != nil {
		loc = cursor.TimeZone
	}
	return time.ParseInLocation("2006-01-02", cursor.Date, loc)
}
