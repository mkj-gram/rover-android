#!/bin/bash

# Script migrates data from $SRC_DB_DSN to $DST_DB_DSN 
#
# Assumptions:
#
# - SRC_DB_DSN is supposed to point to content-api DB
# - DST_DB_DSN is supposed to point to auth-service DB
# - Postgres doesn't allow cross-db queries so it's done through dblink extension which needs to be enabled in compose console

set -euo pipefail
set -x

# source DB to migrate from
export SRC_DB_DSN="postgresql://admin:****************@gcp-us-east1-cpu.0.dblayer.com:15472/rover-${DB_ENV}?sslmode=require"

# destination DB to migrate to
export DST_DB_DSN="postgresql://admin:****************@gcp-us-east1-cpu.0.dblayer.com:15472/authsvc_${DB_ENV}?sslmode=require"

export PGOPTIONS='--client-min-messages=warning'

PSQL="psql -X --set ON_ERROR_STOP=on $DST_DB_DSN"

setup () {
  $PSQL -c "CREATE EXTENSION dblink;"
}

link () {
  $PSQL -c "
  CREATE or REPLACE VIEW old_accounts AS
  SELECT *
    FROM public.dblink ('$SRC_DB_DSN', 'SELECT id, title, token, created_at, updated_at from accounts')
    AS old_accounts(id integer, title text, token text, created_at timestamp, updated_at timestamp)
  ;

  CREATE or REPLACE VIEW old_users AS
  SELECT *
    FROM public.dblink ('$SRC_DB_DSN', 'SELECT id, account_id, name, email, password_digest, account_owner, created_at, updated_at from users')
    AS old_users(id integer, account_id integer, name text, email text, password_digest text, account_owner boolean, created_at timestamp, updated_at timestamp)
  ;
  "
}

migrate() {
  $PSQL -c "

  INSERT INTO accounts(id, name, created_at, updated_at)
    SELECT id, COALESCE(title, CONCAT('noname-', id)), created_at, updated_at from old_accounts
  ;

  INSERT INTO users(id, account_id, name, email, password_digest, created_at, updated_at, permission_scopes)
    SELECT
      id, account_id, name, email, password_digest, created_at, updated_at,
      case WHEN account_owner then ARRAY['admin']
           ELSE ARRAY[]::text[]
      END
    FROM old_users
  ;

  INSERT INTO tokens(account_id, key, permission_scopes, created_at, updated_at) 
    SELECT id, token, ARRAY['server', 'sdk'], created_at, updated_at from old_accounts
  ;

  SELECT pg_catalog.setval('accounts_id_seq', (select max(id) from accounts), true)
  ;

  SELECT pg_catalog.setval('users_id_seq', (select max(id) from users), true)
  ;
"
}


# setup # enable it in compose extensions console
link
migrate
