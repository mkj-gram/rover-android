DC ?= docker-compose -f ../docker/rover.docker-compose.yaml -f docker-compose.yaml

start:
	${DC} up --remove-orphans

stop:
	${DC} down

run:
	${DC} run --rm --service-ports sdkapi node index.js

shell:
	${DC} run --rm --service-ports sdkapi bash
