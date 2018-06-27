package campaigns

import (
	"encoding/base64"
	"fmt"
	"strconv"
	"strings"
	"time"

	"github.com/pkg/errors"
)

var (
	encoding = base64.StdEncoding
)

var CursorDefaults = struct {
	Take    *CursorTake
	Start   *CursorStart
	OrderBy *CursorOrderBy
}{
	Start: nil,
	Take: &CursorTake{
		Kind: CursorTakeFirst,
		Size: 50,
	},
	OrderBy: &CursorOrderBy{
		Field:     CursorOrderById,
		Direction: CursorOrderByASC,
	},
}

const timeFmt = time.RFC3339Nano

const (
	// Take
	CursorTakeFirst = CursorTakes("first")
	CursorTakeLast  = CursorTakes("last")

	// Start
	CursorStartAfter  = CursorStarts("after")
	CursorStartBefore = CursorStarts("before")

	// Field
	CursorOrderById        = CursorOrderByFields("id")
	CursorOrderByUpdatedAt = CursorOrderByFields("updated_at")

	// Order
	CursorOrderByASC  = CursorOrderByDirections("asc")
	CursorOrderByDESC = CursorOrderByDirections("desc")
)

type (
	CursorTakes             string
	CursorStarts            string
	CursorOrderByFields     string
	CursorOrderByDirections string

	Cursor struct {
		Take    *CursorTake
		Start   *CursorStart
		OrderBy *CursorOrderBy
	}

	// First|Last
	CursorTake struct {
		Kind CursorTakes
		Size int32
	}

	// Before|After
	CursorStart struct {
		Kind  CursorStarts
		Token string

		UpdatedAt *time.Time
		Id        int64
	}

	// OrderBy
	CursorOrderBy struct {
		Field     CursorOrderByFields
		Direction CursorOrderByDirections
	}
)

// [updated_at,]id = 2006-01-02T15:04:05Z07:00,6
func (cr *Cursor) Decode() error {
	if cr == nil || cr.Start == nil {
		return nil
	}

	data, err := encoding.DecodeString(cr.Start.Token)
	if err != nil {
		return errors.Wrap(ErrInvalid, "encoding.Decode")
	}

	var (
		parts = strings.Split(string(data), ",")

		parseInt = func(str string, v *int64) error {
			i, err := strconv.ParseInt(str, 10, 32)
			*v = i
			return err
		}
	)

	var orderBy = cr.OrderBy
	if orderBy == nil {
		orderBy = CursorDefaults.OrderBy
	}

	switch orderBy.Field {
	case CursorOrderByUpdatedAt:
		if len(parts) != 2 {
			return errors.Wrap(ErrInvalid, "cursor2")
		}

		if err := parseInt(parts[1], &cr.Start.Id); err != nil {
			return errors.Wrap(ErrInvalid, "parse: id")
		}

		ts, err := time.Parse(timeFmt, parts[0])
		if err != nil {
			return errors.Wrapf(ErrInvalid, "parse: updated_at")
		}

		cr.Start.UpdatedAt = &ts

	default:
		if len(parts) != 1 {
			return errors.Wrap(ErrInvalid, "cursor1")
		}

		if err := parseInt(parts[0], &cr.Start.Id); err != nil {
			return errors.Wrap(ErrInvalid, "parse: id")
		}
	}

	return nil
}

func (cr *Cursor) Encode(in interface{}) string {
	switch v := in.(type) {
	case *Campaign:
		switch cr.OrderBy.Field {
		case CursorOrderByUpdatedAt:
			return EncodeCursor("%s,%d", v.UpdatedAt.Format(timeFmt), v.CampaignId)
		default:
			return EncodeCursor("%d", v.CampaignId)
		}
	default:
		panic(errors.Wrap(ErrInvalid, "Type"))
	}
}

func EncodeCursor(fmts string, args ...interface{}) string {
	return encoding.EncodeToString([]byte(fmt.Sprintf(fmts, args...)))
}
