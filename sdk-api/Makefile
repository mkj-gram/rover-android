DC ?= docker-compose -f ../docker/main.docker-compose.yaml

start:
	${DC} up --remove-orphans

stop:
	${DC} down

install:
	${DC} run --rm sdk-api bash -c "npm install"

run:
	${DC} run --service-ports --rm sdk-api

shell:
	${DC} run --rm sdk-api bash