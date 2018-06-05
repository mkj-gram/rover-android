package schema

import (
	"context"
	"database/sql"
	"encoding/json"
	"time"

	"github.com/lib/pq"
	"github.com/pkg/errors"
)

type EventSchema struct {
	Id        int64  `json:"id"`
	Version   int64  `json:"version"`
	AccountId int32  `json:"account_id"`
	Namespace string `json:"namespace"`
	Name      string `json:"name"`

	AttributeSchema AttributeSchema `json:"attribute_schema"`

	CreatedAt *time.Time `json:"created_at"`
}

type DB struct {
	sql *sql.DB

	now func() time.Time
}

func (db *DB) Ping() error {
	return db.sql.Ping()
}

func schemaFromRow(row *sql.Row) (*EventSchema, error) {
	var schema EventSchema

	var attributeJson []byte

	if err := row.Scan(
		&schema.Id,
		&schema.Version,
		&schema.AccountId,
		&schema.Namespace,
		&schema.Name,
		&attributeJson,
		&schema.CreatedAt,
	); err != nil {
		if err == sql.ErrNoRows {
			return nil, ErrNotFound
		}
		return nil, errors.Wrap(err, "sql.Scan")
	}

	schema.AttributeSchema = make(map[string]Type)

	if err := json.Unmarshal(attributeJson, &schema.AttributeSchema); err != nil {
		return nil, errors.Wrap(err, "json.Unmarshal")
	}
	return &schema, nil
}

func (db *DB) FindLast(ctx context.Context, id int32) (*EventSchema, error) {
	row := db.sql.QueryRowContext(ctx, `
		SELECT * FROM event_schemas
		WHERE id = $1
		ORDER BY version DESC
		LIMIT 1`, id)
	return schemaFromRow(row)
}
func (db *DB) FindFirst(ctx context.Context, id int32) (*EventSchema, error) {
	row := db.sql.QueryRowContext(ctx, `
		SELECT * FROM event_schemas 
		WHERE id = $1 
		ORDER BY version ASC
		LIMIT 1`, id)
	return schemaFromRow(row)
}

func (db *DB) Find(ctx context.Context, id int32, version int32) (*EventSchema, error) {
	row := db.sql.QueryRowContext(ctx, `
		SELECT * FROM event_schemas 
		WHERE id = $1 AND version = $2 
		LIMIT 1`, id, version)
	return schemaFromRow(row)
}

func (db *DB) FindLastByEvent(ctx context.Context, accountId int32, namespace string, name string) (*EventSchema, error) {
	row := db.sql.QueryRowContext(ctx, `
		SELECT * FROM event_schemas
		WHERE account_id = $1 AND namespace = $2 AND name = $3
		ORDER BY version DESC
		LIMIT 1`, accountId, namespace, name)

	return schemaFromRow(row)
}

func (db *DB) Create(ctx context.Context, schema EventSchema) (*EventSchema, error) {
	if schema.Version <= 0 {
		schema.Version = 1
	}

	if !schema.AttributeSchema.IsValid() {
		return nil, errors.New("invalid schema")
	}

	var now = db.now()

	var attributeSchemaJson, err = json.Marshal(schema.AttributeSchema)
	if err != nil {
		return nil, errors.Wrap(err, "json.Marshal")
	}

	// Schema is specifying the ID
	if schema.Id != 0 {
		_, err := db.sql.ExecContext(ctx, `
				INSERT INTO event_schemas(id,version,account_id,namespace,name,attribute_schema,created_at)
				VALUES($1,$2,$3,$4,$5,$6,$7)`,
			schema.Id,
			schema.Version,
			schema.AccountId,
			schema.Namespace,
			schema.Name,
			attributeSchemaJson,
			now)

		if err != nil {
			if pqErr, ok := err.(*pq.Error); ok && pqErr.Code == "23505" {
				err = ErrAlreadyExists
			}
			return nil, errors.Wrap(err, "db.Exec")
		}

		schema.CreatedAt = &now
		return &schema, nil
	}

	// Schema is not specifying the id
	res := db.sql.QueryRowContext(ctx, `
		INSERT INTO event_schemas(version,account_id,namespace,name,attribute_schema,created_at)
		VALUES($1,$2,$3,$4,$5,$6)
		RETURNING id`,
		schema.Version,
		schema.AccountId,
		schema.Namespace,
		schema.Name,
		attributeSchemaJson,
		now,
	)

	var id int64

	if err := res.Scan(&id); err != nil {
		if pqErr, ok := err.(*pq.Error); ok && pqErr.Code == "23505" {
			err = ErrAlreadyExists
		}
		return nil, errors.Wrap(err, "db.Exec")
	}

	schema.Id = id
	schema.CreatedAt = &now

	return &schema, nil
}

func (db *DB) UpdateAttributeSchema(ctx context.Context, schema EventSchema, newAttributeSchema map[string]Type) (*EventSchema, error) {

	schema.CreatedAt = nil
	schema.Version = schema.Version + 1
	schema.AttributeSchema = newAttributeSchema

	if newSchema, err := db.Create(ctx, schema); err != nil {
		return nil, errors.Wrap(err, "db.Create")
	} else {
		return newSchema, nil
	}
}
