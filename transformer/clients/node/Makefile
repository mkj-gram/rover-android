DC ?= docker-compose -f docker-compose.yaml -p transformer_client

all: install test down

install: 
	${DC} run --rm client npm install

test:
	${DC} run --rm client npm test

shell:
	${DC} run --rm client bash

down:
	${DC} down

clean:
	${DC} run --rm client rm -rf node_modules
	
.PHONY: install test down shell clean