# Auth - the auth service

implements auth/v1/auth.proto service

## Running tests

1. `make up`: starts postgres container with docker-compose
2. `make test` runs tests inside the container

## Cleaning up

1. `make down` stops the postres container

## Generate auth token(s) and account id
make NAME=${STRING} PASSWORD=${STRING} EMAIL=${STRING} create_account