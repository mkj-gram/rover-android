DCF ?= docker-compose -f ../docker/main.docker-compose.yaml
# or =redo to rerun last migration goose docs for more
MIGRATION_CMD ?=up
ENV ?= MIGRATION_CMD=${MIGRATION_CMD}
RUN ?= ${DCF} run -e "${ENV}" --rm campaigns-service

ROVER ?= github.com/roverplatform/rover
ROVER_GOPATH ?= /go/src/${ROVER}

test:
	${RUN} go test -tags integration ${ROVER}/campaigns/...

run:
	${RUN}

db.migrate:
	${RUN} go run ./go/postgres-cli/main.go \
		--migration-path=./campaigns/db/migrations/ \
		--migration-cmd=${MIGRATION_CMD}

shell:
	${RUN} sh

db.shell:
	${DCF} run --rm postgres psql 'postgres://postgres:@postgres:5432/campaigns_dev?sslmode=disable'

.PHONY: run test shell
