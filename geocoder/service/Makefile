DCF ?= docker-compose -f ../../docker/main.docker-compose.yaml
RUN ?= ${DCF} run --rm geocoder-service
ROVER ?= github.com/roverplatform/rover

test:
	${RUN} go test ${ROVER}/geocoder/service/...

run:
	${RUN} go run ./geocoder/service/cmd/service/main.go

shell:
	${RUN} sh

.PHONY: run test shell 
