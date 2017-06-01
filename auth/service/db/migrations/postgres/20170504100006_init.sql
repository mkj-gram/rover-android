-- +goose Up
-- SQL in section 'Up' is executed when this migration is applied
CREATE TABLE accounts (
 id         SERIAL PRIMARY KEY
,name       TEXT NOT NULL

,created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL
,updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL
);
-- DISABLED: -- ensure name is case insensitively unique
-- NOTE: currently duplications are allowed
-- CREATE UNIQUE INDEX accounts_name_lower_key ON accounts ((lower(name)));

CREATE TABLE users (
 id         SERIAL PRIMARY KEY
,account_id integer NOT NULL REFERENCES accounts(id)

,name       TEXT NOT NULL
,email      TEXT NOT NULL
,password_digest VARCHAR(60) NOT NULL
,permission_scopes TEXT[] NOT NULL

,created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL
,updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL

,UNIQUE(email)

-- ensure email is lowercased
,CONSTRAINT unique_email_lower_ck CHECK (email = lower(email))
);

CREATE TABLE user_sessions (
 user_id integer NOT NULL REFERENCES users(id)

,key        CHAR(40) NOT NULL

,last_seen_IP VARCHAR(40) NOT NULL

,expires_at TIMESTAMP WITHOUT TIME ZONE NOT NULL

,created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL
,updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL

,UNIQUE(key)
);

CREATE TABLE tokens (
 id         SERIAL PRIMARY KEY
,account_id INTEGER NOT NULL REFERENCES accounts(id)
,key        VARCHAR(40) NOT NULL
,permission_scopes text[] NOT NULL
,created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL
,updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL

,UNIQUE(key)
);

CREATE INDEX on tokens (account_id);

-- +goose Down
-- SQL section 'Down' is executed when this migration is rolled back
--

DROP TABLE
   tokens
  ,user_sessions
  ,users
  ,accounts
;

