package db

import (
	"reflect"
	"testing"
	"time"

	"github.com/roverplatform/rover/campaigns"
)

var timePtr = func(t time.Time) *time.Time { return &t }

func TestCursor(t *testing.T) {
	type cursor = campaigns.Cursor
	tcases := []struct {
		desc string
		req  *cursor
		exp  string
	}{
		{
			desc: "first: 2",
			req: &cursor{
				Take: &campaigns.CursorTake{
					Kind: campaigns.CursorTakeFirst,
					Size: 10,
				},
			},
			exp: `
	with
		campaigns_matched as (
			select 'TODO'
		),
		campaigns_cursor as (
			with t1 as (
				select *
					from campaigns_matched
					where (true)
					order by id asc
					limit :cursor_limit_size
			)
			select * from t1 order by id asc
	)
`,
		},

		{
			desc: "last: 2",
			req: &cursor{
				Take: &campaigns.CursorTake{
					Kind: campaigns.CursorTakeLast,
					Size: 10,
				},
			},
			exp: `
	with
		campaigns_matched as (
			select 'TODO'
		),
		campaigns_cursor as (
			with t1 as (
				select *
					from campaigns_matched
					where (true)
					order by id desc
					limit :cursor_limit_size
			)
			select * from t1 order by id asc
	)
`,
		},

		{
			desc: "last: 2, before: [updated_at:timestamp, id:1], orderBy: {field: upadted_at, direction: desc}",
			req: &cursor{
				Take: &campaigns.CursorTake{
					Kind: campaigns.CursorTakeLast,
					Size: 10,
				},
				Start: &campaigns.CursorStart{
					Kind:      campaigns.CursorStartBefore,
					UpdatedAt: timePtr(time.Now()),
				},
				OrderBy: &campaigns.CursorOrderBy{
					Direction: campaigns.CursorOrderByDESC,
					Field:     campaigns.CursorOrderByUpdatedAt,
				},
			},
			exp: `
	with
		campaigns_matched as (
			select 'TODO'
		),
		campaigns_cursor as (
			with t1 as (
				select *
					from campaigns_matched
					where (updated_at >:cursor_updated_at or (updated_at = :cursor_updated_at and id >:cursor_id))
					order by updated_at asc, id asc
					limit :cursor_limit_size
			)
			select * from t1 order by updated_at desc, id desc
	)
`,
		},
	}

	for _, tc := range tcases {
		t.Run(tc.desc, func(t *testing.T) {
			var (
				cr = newCursor(tc.req)

				exp = tc.exp
				got = cr.SQL("select 'TODO'")
			)

			if !reflect.DeepEqual(exp, got) {
				t.Errorf("\nExp: %v\nGot: %v", exp, got)
			}
		})
	}
}
