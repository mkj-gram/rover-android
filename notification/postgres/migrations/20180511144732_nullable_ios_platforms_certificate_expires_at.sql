-- +goose Up
-- SQL in section 'Up' is executed when this migration is applied

ALTER TABLE ios_platforms alter certificate_expires_at DROP NOT NULL;

-- +goose Down
-- SQL section 'Down' is executed when this migration is rolled back

ALTER TABLE ios_platforms alter certificate_expires_at SET NOT NULL;
