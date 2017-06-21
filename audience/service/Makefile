DCF ?= docker-compose -f ../../docker/rover.docker-compose.yaml
RUN ?= ${DCF} run --rm audience-service

ROVER ?= github.com/roverplatform/rover

test:
	${RUN} go test -tags integration -v ${ROVER}/audience/service/...

run:
	${RUN} go run -x -v ./audience/service/cmd/audience-service/main.go

shell:
	${RUN} sh


.PHONY: run test db.console test.db.migrate
