DCF ?= docker-compose -f ../docker/main.docker-compose.yaml
RUN ?= ${DCF} run --rm -p 9000:9000 admin-dashboard

help:
	@echo
	@echo "  \033[34mclean\033[0m - remove all stopped containers"
	@echo "  \033[34mrun\033[0m   - start a dev server on :9000 with hot module replacement"
	@echo "  \033[34mshell\033[0m - start a shell in the node.js 7.10.0 container"
	@echo "  \033[34mstop\033[0m  - stop all running containers"
	@echo

clean:
	${DCF} rm -f -v

run:
	${RUN}

stop:
	${DCF} stop

shell:
	${RUN} bash
