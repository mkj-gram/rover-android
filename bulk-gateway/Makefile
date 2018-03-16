DCF ?= docker-compose -f ../docker/main.docker-compose.yaml -f docker-compose.yaml
RUN ?= ${DCF} run --rm bulk-gateway

deps:
	${RUN} bash -c "npm install"

test:
	${RUN} bash -c "npm test"

run:
	${DCF} run --rm -p 3100:3100 bulk-gateway bash -c "npm start"

shell:
	${RUN} bash

.PHONY: deps run test shell 
