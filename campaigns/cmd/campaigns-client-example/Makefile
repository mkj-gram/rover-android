DCF ?= docker-compose -f ../../../docker/main.docker-compose.yaml -f docker-compose.yaml

RUN ?= ${DCF} run --rm campaigns-client

ROVER ?= github.com/roverplatform/rover
ROVER_GOPATH ?= /go/src/${ROVER}

shell:
	${RUN} sh

.PHONY: shell
