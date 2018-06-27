package db

import (
	"github.com/pkg/errors"
	"github.com/roverplatform/rover/campaigns"
)

type cursor campaigns.Cursor

func newCursor(c *campaigns.Cursor) *cursor {
	var (
		defaults = campaigns.CursorDefaults

		// copy values
		cr = cursor(campaigns.Cursor{
			OrderBy: c.OrderBy,
			Take:    c.Take,
			Start:   c.Start,
		})
	)

	if cr.Take == nil {
		cr.Take = defaults.Take
	}
	if cr.Start == nil {
		cr.Start = defaults.Start
	}
	if cr.OrderBy == nil {
		cr.OrderBy = defaults.OrderBy
	}

	return &cr
}

func (cr *cursor) TakeDirection() string {
	var dir = cr.OrderDirection()

	switch take := cr.Take.Kind; take {
	case campaigns.CursorTakeLast:
		if dir == "asc" {
			return "desc"
		}
		return "asc"
	case campaigns.CursorTakeFirst:
		return dir
	default:
		panic(errors.Wrapf(ErrInvalid, "CursorTake: %v", take))
	}
}

func (cr *cursor) OrderDirection() string {
	switch cr.OrderBy.Direction {
	case campaigns.CursorOrderByASC:
		return "asc"
	case campaigns.CursorOrderByDESC:
		return "desc"
	default:
		panic(errors.Wrapf(ErrInvalid, "OrderByDirection: %v", cr.OrderBy.Direction))
	}
}

func (cr *cursor) Orderby(dir string) string {
	var (
		// alsways order by id
		orderBy = "id " + dir
	)

	switch cr.OrderBy.Field {
	case campaigns.CursorOrderById:
		// noop
	case campaigns.CursorOrderByUpdatedAt:
		orderBy = "updated_at " + dir + ", " + orderBy
	default:
		panic(errors.Wrapf(campaigns.ErrInvalid, "OrderByField: %v", cr.OrderBy.Direction))
	}

	return orderBy
}

func (cr *cursor) Where() string {
	if cr.Start == nil {
		return "true"
	}

	var (
		dir = cr.OrderBy.Direction

		// comparisonOp
		op string
		// sql condition
		where string
	)

	// comparisons
	// before^after | asc^desc  |  op |
	// -------------------------------
	// after        | asc       |  >  |
	// after        | desc      |  <  |
	// before       | asc       |  <  |
	// before       | desc      |  >  |

	switch start := cr.Start.Kind; start {
	case campaigns.CursorStartAfter:
		op = ">"
		if dir == campaigns.CursorOrderByDESC {
			op = "<"
		}
	case campaigns.CursorStartBefore:
		op = "<"
		if dir == campaigns.CursorOrderByDESC {
			op = ">"
		}
	default:
		panic(errors.Wrapf(ErrInvalid, "CursorStart: %v", start))
	}

	if cr.Start.UpdatedAt != nil {
		where = `updated_at ` + op + `:cursor_updated_at or (updated_at = :cursor_updated_at and id ` + op + `:cursor_id)`
	} else {
		where = `id ` + op + ` :cursor_id`
	}

	return where
}

// Bind sets interpolated variables
func (cr *cursor) Bind(args map[string]interface{}) {
	args["cursor_limit_size"] = cr.Take.Size
	if o := cr.Start; o != nil {
		args["cursor_id"] = o.Id
		if o.UpdatedAt != nil {
			args["cursor_updated_at"] = o.UpdatedAt
		}
	}
}

func (cr *cursor) SQL(selectSQL string) string {
	return `
	with
		campaigns_matched as (
			` + selectSQL + `
		),
		campaigns_cursor as (
			with t1 as (
				select *
					from campaigns_matched
					where (` + cr.Where() + `)
					order by ` + cr.Orderby(cr.TakeDirection()) + `
					limit :cursor_limit_size
			)
			select * from t1 order by ` + cr.Orderby(cr.OrderDirection()) + `
	)
`
}
