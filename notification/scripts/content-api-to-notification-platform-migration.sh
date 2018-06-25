#!/bin/bash

# Script migrates data from $SRC_DSN to $DST_DSN
#
# Assumptions:
#
# - SRC_DSN is supposed to point to content-api PG DB
# - DST_DSN is supposed to point to notification-service PG DB
# - Postgres doesn't allow cross-db queries so it's done through dblink extension which needs to be enabled in compose console

set -uo pipefail

# source DB to migrate from
echo "From: ${SRC_DSN:?is required}"
echo "To: ${DST_DSN:?is required}"

# destination DB to migrate to
# export DST_DSN="postgresql://admin:****************@gcp-us-east1-cpu.0.dblayer.com:15472/authsvc_${DB_ENV}?sslmode=require"

export PGOPTIONS='--client-min-messages=warning'

PSQL="psql -X --set ON_ERROR_STOP=on $DST_DSN"

setup () {
  $PSQL -c "CREATE EXTENSION dblink;"
}

link () {
  $PSQL -c "
  CREATE or REPLACE VIEW src_ios_platforms AS
  SELECT *
    FROM public.dblink ('$SRC_DSN', '
      SELECT
        id,
        account_id,
        title,
        bundle_id,
        apns_certificate,
        apns_passphrase,
        certificate_filename,
        certificate_expires_at,
        created_at,
        updated_at 
      FROM ios_platforms;')
    AS src_ios_platforms(
      id integer,
      account_id integer,
      title text,
      bundle_id text,
      certificate_data text,
      certificate_pass text,
      certificate_filename text,
      certificate_expires_at timestamp,
      created_at timestamp,
      updated_at timestamp
    )
  ;

  CREATE or REPLACE VIEW src_android_platforms AS
  SELECT *
    FROM public.dblink ('$SRC_DSN', '
    SELECT
      id,
      account_id,
      title,
      sender_id,
      coalesce(messaging_token, api_key),
      created_at,
      updated_at
      from android_platforms
    ;')
    AS src_android_platforms(
      id              integer,
      account_id      integer,
      title           text,

      push_credentials_sender_id  TEXT,
      push_credentials_token TEXT,

      created_at TIMESTAMP,
      updated_at TIMESTAMP
    )
  ;
  "
}

migrate() {
  $PSQL -c "


  INSERT INTO ios_platforms(id, account_id, title, bundle_id, certificate_data, certificate_passphrase, certificate_expires_at, certificate_filename, certificate_updated_at, created_at, updated_at)
  SELECT
    id,
    account_id,
    coalesce(title, ''),
    coalesce(bundle_id, ''),
    replace(certificate_data, E'\n', ''),
    coalesce(certificate_pass, ''),
    certificate_expires_at,
    coalesce(certificate_filename,''),
    updated_at,
    created_at,
    updated_at
    FROM src_ios_platforms
    where certificate_data is not null
  ;


  INSERT INTO android_platforms(id, account_id, title, push_credentials_server_key, push_credentials_sender_id, push_credentials_updated_at, created_at, updated_at)
  SELECT id, account_id, coalesce(title, ''), coalesce(push_credentials_token, ''), coalesce(push_credentials_sender_id, ''), updated_at, created_at, updated_at
    FROM src_android_platforms
  ;



  SELECT pg_catalog.setval('ios_platforms_id_seq', (select max(id) from src_ios_platforms), true)
  ;

  SELECT pg_catalog.setval('android_platforms_id_seq', (select max(id) from src_android_platforms), true)
  ;
  "
}


# setup # enable it in compose extensions console
# link
# migrate
