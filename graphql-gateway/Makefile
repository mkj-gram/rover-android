DCF ?= docker-compose -f ../docker/main.docker-compose.yaml
RUN ?= ${DCF} run --rm -p 4000:80 graphql-gateway

help:
	@echo
	@echo "  \033[34mclean\033[0m - remove all stopped containers"
	@echo "  \033[34mrun\033[0m   - start a dev server on :4000"
	@echo "  \033[34mshell\033[0m - start a shell in the node.js 7.5.0 container"
	@echo "  \033[34mstop\033[0m  - stop all running containers"
	@echo "  \033[34mtest\033[0m  - run Jest test suite"
	@echo

clean:
	${DCF} rm

run:
	${RUN} bash -c "npm install && npm start"

shell:
	${RUN} bash

stop:
	${DCF} stop

test:
	${RUN} bash -c "npm install && npm test"
