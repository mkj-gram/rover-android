DCF ?= docker-compose -f ../docker/main.docker-compose.yaml
RUN ?= ${DCF} run --rm smw

install:
	${RUN} npm install

configure:
	${RUN} /rover/docker/scripts/wait.sh rabbitmq:5672 -- npm run configure

run:
	${RUN}

start:
	${DCF} up

stop:
	${DCF} stop

clean:
	${DCF} down

simulate:
	${RUN} /rover/docker/scripts/wait.sh rabbitmq:5672 -- npm run simulate

shell:
	${RUN} bash

.PHONY: install configure run
