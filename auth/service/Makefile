DB_DSN ?= "postgres://postgres:@postgres:5432/authsvc_test?sslmode=disable"

DCF ?= docker-compose -f ../../docker/rover.docker-compose.yaml
RUN ?= ${DCF} run --rm auth-service

ROVER ?= github.com/roverplatform/rover

test: test.db.migrate
	${RUN} go test -tags integration -v ${ROVER}/auth/service/... --service.DSN=${DB_DSN}

run:
	${RUN} go run -x -v ./auth/service/cmd/authsvcd/main.go \
		-db-dsn=${DB_DSN}

shell:
	${RUN} sh


.PHONY: run test db.console test.db.migrate
