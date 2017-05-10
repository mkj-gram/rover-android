-- +goose Up
-- SQL in section 'Up' is executed when this migration is applied
CREATE TABLE accounts (
 id         SERIAL PRIMARY KEY
,name       VARCHAR(128) NOT NULL

,created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL
,updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL
);
-- ensure name is case insensitively unique
CREATE UNIQUE INDEX accounts_name_lower_key ON accounts ((lower(name)));

CREATE TABLE users (
 id         SERIAL PRIMARY KEY
,account_id integer NOT NULL REFERENCES accounts(id)

,name       VARCHAR(128) NOT NULL
,email      VARCHAR(128) NOT NULL
,password_digest VARCHAR(60) NOT NULL
,permission_scopes varchar(50)[] NOT NULL

,created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL
,updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL

,UNIQUE(email)

-- ensure email is lowercased
,CONSTRAINT unique_email_lower_ck CHECK (email = lower(email))
);

CREATE TABLE user_sessions (
 user_id integer NOT NULL REFERENCES users(id)

,key        VARCHAR(40) NOT NULL

,last_seen_IP varchar(40) NOT NULL

,expires_at TIMESTAMP WITHOUT TIME ZONE NOT NULL

,created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL
,updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL

,UNIQUE(key)
);

CREATE TABLE tokens (
 id         SERIAL PRIMARY KEY
,account_id integer NOT NULL REFERENCES accounts(id)
,key        VARCHAR(40) NOT NULL
,permission_scopes varchar(50)[] NOT NULL
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

