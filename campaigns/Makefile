DCF ?= docker-compose -f ../docker/main.docker-compose.yaml
# or =redo to rerun last migration goose docs for more
ENV ?= MIGRATION_CMD=up
RUN ?= ${DCF} run -e "${ENV}" --rm campaigns-service 

ROVER ?= github.com/roverplatform/rover

test:
	${RUN} go test -tags integration -v ${ROVER}/campaigns/...

run:
	${RUN}

shell:
	${RUN} sh

.PHONY: run test shell
