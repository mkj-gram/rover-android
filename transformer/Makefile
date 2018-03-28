DCF ?= docker-compose -f ../docker/main.docker-compose.yaml
RUN ?= ${DCF} run --rm transformer

RUNTEST ?= docker-compose -f test.docker-compose.yaml run --rm transformer

shell:
	${RUN} sh

test:
	${RUNTEST} ./docker/transformer/cmd test

.PHONY: shell test
