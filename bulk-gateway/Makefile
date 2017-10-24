DCF ?= docker-compose -f ../docker/rover.docker-compose.yaml -f docker-compose.yaml
RUN ?= ${DCF} run --rm -p 3100:3100 bulk-gateway

deps:
	${RUN} bash -c "npm install"

test:
	${RUN} bash -c "npm test"

run:
	${RUN} bash -c "npm start"

clean_run:
	${RUN} bash -c "rm -rf node_modules/@rover && npm install && npm start"

shell:
	${RUN} bash

.PHONY: run test shell db.shell
