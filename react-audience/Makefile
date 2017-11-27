DCF ?= docker-compose -f ../docker/main.docker-compose.yaml
RUN ?= ${DCF} run --rm -p 9001:9001 audience-frontend

help:
	@echo
	@echo "  \033[34mclean\033[0m - remove all stopped containers"
	@echo "  \033[34mrelay\033[0m - compile relay queries"
	@echo "  \033[34mrun\033[0m   - start a dev server on :9001 with hot module replacement"
	@echo "  \033[34mshell\033[0m - start a shell in the node.js 9.1.0 container"
	@echo "  \033[34mstop\033[0m  - stop all running containers"
	@echo

clean:
	${DCF} rm -f -v

relay:
	${RUN} bash -c "npm run relay"

run:
	${RUN} bash -c "npm install && npm run schema && npm run relay && npm start"

stop:
	${DCF} stop

shell:
	${RUN} bash
