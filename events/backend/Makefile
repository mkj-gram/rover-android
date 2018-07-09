DCF ?= docker-compose -f ../../docker/main.docker-compose.yaml
RUN ?= ${DCF} run --rm events-pipeline

RUNTEST ?= docker-compose -p events_backend -f test.docker-compose.yaml run --rm events-pipeline

run.pipeline:
	${RUN} 

shell:
	${RUN} sh

test:
	${RUNTEST} ./docker/events/pipeline/cmd test

test.shell:
	${RUNTEST} sh

.PHONY: run.pipeline shell test
