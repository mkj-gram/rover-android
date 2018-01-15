DCF ?= docker-compose -f ../../docker/main.docker-compose.yaml
RUN ?= ${DCF} run --rm auth-service

ROVER ?= github.com/roverplatform/rover

test:
	${RUN} go test -tags integration -v ${ROVER}/auth/service/...

run:
	${RUN}

shell:
	${RUN} sh


.PHONY: run test db.console test.db.migrate
