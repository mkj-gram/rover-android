#!/bin/sh

set -e

DCS='docker-compose -f ../../docker/main.docker-compose.yaml'

ACCOUNT_ID=$(${DCS} run --rm -T -e NAME=${NAME} -e PASSWORD=${PASSWORD} -e EMAIL=${EMAIL} auth-service ./docker/auth/cmd create_account)

${DCS} run --rm -e ACCOUNT_ID=${ACCOUNT_ID} audience-service ./docker/audience/cmd index
