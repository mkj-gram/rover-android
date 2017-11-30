DCF ?= docker-compose -f ../docker/main.docker-compose.yaml
RUN ?= ${DCF} run --rm smw

install:
	${RUN} npm install

configure:
	${RUN} npm run configure

run:
	${RUN} npm start

simulate:
	${RUN} npm run simulate

shell:
	${RUN} bash

.PHONY: install configure run
