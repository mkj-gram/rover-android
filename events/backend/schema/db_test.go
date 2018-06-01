package schema_test

import (
	"context"
	"database/sql"
	"io/ioutil"
	"testing"
	"time"

	_ "github.com/lib/pq"
	"github.com/namsral/flag"
	"github.com/pkg/errors"
	"github.com/roverplatform/rover/events/backend/schema"
	rtesting "github.com/roverplatform/rover/go/testing"
)

var dbDsn = flag.String("test-postgres-dsn", "", "test db dsn")

func init() {
	flag.Parse()
}

func OpenTestDB(t *testing.T) *sql.DB {
	t.Helper()
	var sqlDB, err = sql.Open("postgres", *dbDsn)
	if err != nil {
		t.Fatal(err)
	}
	return sqlDB
}

func timeFrom(t *testing.T, value string) *time.Time {
	ts, err := time.Parse(time.RFC3339, value)
	if err != nil {
		t.Fatal(err)
	}
	return &ts
}

/*
	we need utils to clear db before each test
*/
func Truncate(db *sql.DB, t *testing.T) {
	t.Helper()
	if _, err := db.Exec("TRUNCATE event_schemas RESTART IDENTITY;"); err != nil {
		t.Fatal(err)
	}
}
func ApplyFixture(t *testing.T, db *sql.DB, path string) {
	t.Helper()
	data, err := ioutil.ReadFile(path)
	if err != nil {
		t.Fatal("ioutil.ReadFile:", err)
	}

	t.Log(string(data))
	if _, err := db.Exec(string(data)); err != nil {
		t.Fatal("sql.Exec:", err)
	}
}

func Setup(t *testing.T, fixtures ...string) {
	t.Helper()
	var sqlDb = OpenTestDB(t)
	Truncate(sqlDb, t)
	for _, fixture := range fixtures {
		ApplyFixture(t, sqlDb, fixture)
	}
}

func TestDB_Create(t *testing.T) {
	Setup(t, "./fixtures/create_test.sql")

	var (
		now = timeFrom(t, "2019-01-02T15:04:05Z")
		ctx = context.Background()
	)

	db, err := schema.Open(*dbDsn, schema.WithTimeFunc(func() time.Time { return *now }))
	if err != nil {
		t.Fatal(err)
	}

	type after struct {
		id      int32
		version int32
		exp     *schema.EventSchema
		expErr  error
	}

	var tests = []struct {
		name string

		input schema.EventSchema

		exp error

		after *after
	}{
		{
			name: "already exists",
			input: schema.EventSchema{
				AccountId: 1,
				Namespace: "rover",
				Name:      "block clicked",
			},

			exp: schema.ErrAlreadyExists,
		},

		{
			name: "invalid schema",
			input: schema.EventSchema{
				AccountId: 1,
				Version:   1,
				Namespace: "rover",
				Name:      "block clicked",
				AttributeSchema: schema.AttributeSchema{
					"id": schema.INVALID,
				},
			},

			exp: errors.New("invalid schema"),
		},

		{
			name: "inserts into postgres",
			input: schema.EventSchema{
				AccountId: 1,
				Version:   1,
				Namespace: "taxi",
				Name:      "arrived",
				AttributeSchema: schema.AttributeSchema{
					"id": schema.NUMBER,
					"profile": schema.ComplexType{
						"tags": schema.ARRAY_OF_STRINGS,
					},
				},
			},

			after: &after{
				id:      2,
				version: 1,
				exp: &schema.EventSchema{
					Id:        2,
					Version:   1,
					AccountId: 1,
					Namespace: "taxi",
					Name:      "arrived",
					AttributeSchema: schema.AttributeSchema{
						"id": schema.NUMBER,
						"profile": schema.ComplexType{
							"tags": schema.ARRAY_OF_STRINGS,
						},
					},
					CreatedAt: now,
				},
			},
		},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			var _, gotErr = db.Create(ctx, test.input)
			if diff := rtesting.Diff(nil, nil, test.exp, errors.Cause(gotErr)); diff != nil {
				t.Fatal(rtesting.Difff(diff))
			}

			if test.after != nil {
				var got, gotErr = db.Find(ctx, test.after.id, test.after.version)
				if diff := rtesting.Diff(test.after.exp, got, test.after.expErr, gotErr); diff != nil {
					t.Log(got.AttributeSchema)
					t.Fatal(rtesting.Difff(diff))
				}
			}
		})
	}
}

func TestDB_Find(t *testing.T) {
	Setup(t, "./fixtures/find_test.sql")

	var (
		now = timeFrom(t, "2019-01-02T15:04:05Z")
		ctx = context.Background()
	)

	db, err := schema.Open(*dbDsn, schema.WithTimeFunc(func() time.Time { return *now }))
	if err != nil {
		t.Fatal(err)
	}

	var tests = []struct {
		name string

		id      int32
		version int32

		exp    *schema.EventSchema
		expErr error
	}{
		{
			name:    "not found",
			id:      0,
			version: 0,
			expErr:  schema.ErrNotFound,
		},
		{
			name:    "returns parsed schema",
			id:      1,
			version: 1,
			exp: &schema.EventSchema{
				Id:        1,
				Version:   1,
				AccountId: 1,
				Namespace: "rover",
				Name:      "Location Update",
				AttributeSchema: schema.AttributeSchema{
					"longitude": schema.NUMBER,
					"latitude":  schema.NUMBER,
					"accuracy":  schema.NUMBER,
				},
				CreatedAt: timeFrom(t, "2018-05-18T14:54:32.046Z"),
			},
		},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			var got, gotErr = db.Find(ctx, test.id, test.version)
			if diff := rtesting.Diff(test.exp, got, test.expErr, errors.Cause(gotErr)); diff != nil {
				t.Fatal(rtesting.Difff(diff))
			}
		})
	}
}

func TestDB_UpdateAttributeSchema(t *testing.T) {
	Setup(t, "./fixtures/update_attribute_schema_test.sql")

	var (
		now = timeFrom(t, "2019-01-02T15:04:05Z")
		ctx = context.Background()
	)

	db, err := schema.Open(*dbDsn, schema.WithTimeFunc(func() time.Time { return *now }))
	if err != nil {
		t.Fatal(err)
	}

	type after struct {
		id      int32
		version int32
		exp     *schema.EventSchema
		expErr  error
	}

	var tests = []struct {
		name string

		schema schema.EventSchema
		update schema.AttributeSchema

		exp    *schema.EventSchema
		expErr error

		after *after
	}{
		{
			name: "version conflict",
			schema: schema.EventSchema{
				Id:        1,
				Version:   1,
				AccountId: 1,
				Namespace: "rover",
				Name:      "Location Update",
				AttributeSchema: schema.AttributeSchema{
					"longitude": schema.NUMBER,
					"latitude":  schema.NUMBER,
					"accuracy":  schema.NUMBER,
				},
				CreatedAt: timeFrom(t, "2018-05-18T14:54:32.046Z"),
			},
			update: schema.AttributeSchema{
				"longitude": schema.NUMBER,
				"latitude":  schema.NUMBER,
				"accuracy":  schema.NUMBER,
				"more":      schema.STRING,
			},

			expErr: schema.ErrAlreadyExists,
		},
		{
			name: "preserves id and increments version",
			schema: schema.EventSchema{
				Id:        1,
				Version:   2,
				AccountId: 1,
				Namespace: "rover",
				Name:      "Location Update",
				AttributeSchema: schema.AttributeSchema{
					"longitude": schema.NUMBER,
					"latitude":  schema.NUMBER,
					"accuracy":  schema.NUMBER,
					"cell":      schema.BOOLEAN,
				},
				CreatedAt: timeFrom(t, "2018-05-18T14:54:32.046Z"),
			},

			update: schema.AttributeSchema{
				"longitude": schema.NUMBER,
				"latitude":  schema.NUMBER,
				"accuracy":  schema.NUMBER,
				"cell":      schema.BOOLEAN,
				"another":   schema.NUMBER,
			},

			exp: &schema.EventSchema{
				Id:        1,
				Version:   3,
				AccountId: 1,
				Namespace: "rover",
				Name:      "Location Update",
				AttributeSchema: schema.AttributeSchema{
					"longitude": schema.NUMBER,
					"latitude":  schema.NUMBER,
					"accuracy":  schema.NUMBER,
					"cell":      schema.BOOLEAN,
					"another":   schema.NUMBER,
				},
				CreatedAt: now,
			},
			expErr: nil,

			after: &after{
				id:      1,
				version: 3,
				exp: &schema.EventSchema{
					Id:        1,
					Version:   3,
					AccountId: 1,
					Namespace: "rover",
					Name:      "Location Update",
					AttributeSchema: schema.AttributeSchema{
						"longitude": schema.NUMBER,
						"latitude":  schema.NUMBER,
						"accuracy":  schema.NUMBER,
						"cell":      schema.BOOLEAN,
						"another":   schema.NUMBER,
					},
					CreatedAt: now,
				},
			},
		},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {

			var got, gotErr = db.UpdateAttributeSchema(ctx, test.schema, test.update)

			if diff := rtesting.Diff(test.exp, got, test.expErr, errors.Cause(gotErr)); diff != nil {
				t.Fatal(rtesting.Difff(diff))
			}

			if test.after != nil {
				var got, gotErr = db.Find(ctx, test.after.id, test.after.version)
				if diff := rtesting.Diff(test.after.exp, got, test.after.expErr, gotErr); diff != nil {
					t.Log(got.AttributeSchema)
					t.Fatal(rtesting.Difff(diff))
				}
			}
		})
	}
}
