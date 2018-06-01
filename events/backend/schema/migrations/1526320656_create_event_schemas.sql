-- +goose Up
-- SQL in section 'Up' is executed when this migration is applied
CREATE SEQUENCE event_schemas_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE TABLE event_schemas (
    id         INTEGER NOT NULL DEFAULT nextval('event_schemas_id_seq'),
    version    INTEGER NOT NULL DEFAULT 1,
    account_id INTEGER NOT NULL,
    namespace  TEXT NOT NULL,
    name       TEXT NOT NULL,
    attribute_schema TEXT NOT NULL,
    created_at TIMESTAMP without TIME ZONE NOT NULL,

    UNIQUE (id, account_id, namespace, name, version)
);




ALTER SEQUENCE event_schemas_id_seq OWNED BY event_schemas.id;

CREATE INDEX event_schemas_id_version ON event_schemas(id,version);
CREATE INDEX event_schemas_account_id_namespace_name ON event_schemas(account_id,namespace,name);

-- +goose Down
-- SQL section 'Down' is executed when this migration is rolled back
DROP TABLE event_schemas;
DROP INDEX IF EXISTS event_schemas_id_version;
DROP INDEX IF EXISTS event_schemas_account_id_namespace_name;