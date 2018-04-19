DCF ?= docker-compose -f ../docker/main.docker-compose.yaml
# or =redo to rerun last migration goose docs for more
MIGRATION_CMD ?=up
ENV ?= MIGRATION_CMD=${MIGRATION_CMD}
RUN ?= ${DCF} run --service-ports -e "${ENV}" --rm notification-service

ROVER ?= github.com/roverplatform/rover
ROVER_GOPATH ?= /go/src/${ROVER}

test:
	${RUN} ./docker/notification-service/cmd test

run:
	${RUN}

db.migrate:
	${RUN} go run ./go/cmd/postgres-cli/main.go \
		--migration-path=/go/src/${ROVER}/notification/postgres/migrations/ \
		--migration-cmd=${MIGRATION_CMD}

shell:
	${RUN} sh

gencert:
	# -subj '/UID=io.rover.uid'
	#  generates invalid: no UID, not universal, expired cert.p12
	openssl req -x509 -subj '/CN=localhost' -newkey rsa:4096 -keyout key.pem -out cert.pem -days -1
	openssl pkcs12 -export -out cert.p12 -inkey ./key.pem -in ./cert.pem

showcert:
	openssl pkcs12 -in ./notification/grpc/testdata/io.rover.Bagel.p12 -passin pass:"" -nodes|openssl x509 -noout -text

db.shell:
	${DCF} run --rm postgres bash -c "psql $${DB_DSN}"

.PHONY: run test shell
