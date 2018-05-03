DC ?= docker-compose -f ../docker/main.docker-compose.yaml

start:
	${DC} up --remove-orphans

stop:
	${DC} down

install:
	${DC} run --rm sdk-api bash -c "npm install"

run:
	${DC} run -p 3100:3100 --rm sdk-api

test:
	${DC} run --rm sdk-api npm test

shell:
	${DC} run --rm sdk-api bash

.PHONY: start stop install run test shell