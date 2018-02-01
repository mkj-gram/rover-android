-- +goose Up
-- SQL in section 'Up' is executed when this migration is applied

-- see https://www.postgresql.org/docs/9.1/static/pgtrgm.html
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX ON campaigns USING gin (name gin_trgm_ops);


-- +goose Down
-- SQL section 'Down' is executed when this migration is rolled back
--

DROP index campaigns_name_idx;
