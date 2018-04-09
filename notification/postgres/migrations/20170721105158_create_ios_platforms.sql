-- +goose Up
-- SQL in section 'Up' is executed when this migration is applied

CREATE TABLE ios_platforms(
    id                      SERIAL PRIMARY KEY,

    account_id              INTEGER NOT NULL,
    title                   TEXT NOT NULL,
    bundle_id               TEXT NOT NULL,

    certificate_data        TEXT NOT NULL,
    certificate_passphrase  TEXT NOT NULL,
    certificate_filename    TEXT NOT NULL,
    certificate_expires_at  TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    certificate_updated_at  TIMESTAMP WITHOUT TIME ZONE NOT NULL,

    created_at              TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    updated_at              TIMESTAMP WITHOUT TIME ZONE NOT NULL
);

CREATE INDEX ON ios_platforms USING btree (account_id);

-- +goose Down
-- SQL section 'Down' is executed when this migration is rolled back

DROP INDEX IF EXISTS ios_platforms_account_id_idx;
DROP TABLE ios_platforms;
