DCF ?= docker-compose -f ../../docker/main.docker-compose.yaml
RUN ?= ${DCF} run --rm auth-service

ROVER ?= github.com/roverplatform/rover

test:
	${RUN} ./docker/auth-service/cmd migrate test

run:
	${RUN}

shell:
	${RUN} sh

create_account:
	NAME=$(NAME) PASSWORD=$(PASSWORD) EMAIL=$(EMAIL) ./scripts/create_account.sh

migrate:
	${RUN} ./docker/auth-service/cmd migrate

.PHONY: run test db.console test.db.migrate
