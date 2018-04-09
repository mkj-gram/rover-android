-- +goose Up
-- SQL in section 'Up' is executed when this migration is applied

--
-- Name: android_platforms; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE android_platforms (
    id              SERIAL  NOT NULL,
    account_id      INTEGER NOT NULL,
    title           TEXT    NOT NULL,

    push_credentials_server_key TEXT NOT NULL,
    push_credentials_sender_id  TEXT NOT NULL,
    push_credentials_updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,

    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL
);

CREATE INDEX android_platforms_account_id_index ON android_platforms USING btree (account_id);

-- +goose Down
-- SQL section 'Down' is executed when this migration is rolled back

DROP INDEX IF EXISTS android_platforms_account_id_index;
DROP TABLE android_platforms;
