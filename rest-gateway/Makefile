DCF ?= docker-compose -f ../docker/rover.docker-compose.yaml -f docker-compose.yaml
RUN ?= ${DCF} run --rm -p 4000:80 rest-gateway

test:
	${RUN} bash -c "npm install && npm test"

run:
	${RUN} bash -c "npm install && ./node_modules/nodemon/bin/nodemon.js index.js"

shell:
	${RUN} bash

.PHONY: run test shell db.shell
