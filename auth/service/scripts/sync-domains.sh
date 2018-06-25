#/bin/bash

# syncs domains from content-api's accounts table

# export SRC_DSN=postgres://postgres:@localhost:5432/rover-local?sslmode=disable
# export DEST_DSN=postgres://postgres:@localhost:5432/rover-local?sslmode=disable

psql --set src_dsn=$SRC_DSN $DEST_DSN <<EOF
  CREATE EXTENSION IF NOT EXISTS dblink;

  with account_names as (
    select *
      from public.dblink (:'src_dsn', 'select id, subdomain, created_at, updated_at from accounts')
      as accounts(id integer, subdomain text, created_at timestamp, updated_at timestamp)
  )
  update accounts pans
    set
      account_name = ans.subdomain
      ,updated_at = now()
    from account_names ans
    where
      pans.id = ans.id
      and pans.account_name != ans.subdomain
    returning pans.*;
EOF
