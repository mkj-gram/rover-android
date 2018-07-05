DCF ?= docker-compose -f ../../docker/main.docker-compose.yaml
DCFTEST ?= docker-compose -f test.docker-compose.yaml

SERVICE_RUN ?= ${DCF} run --rm analytics-service

help:
	@echo
	@echo "  \033[34mtest\033[0m   - test the service & collector"
	@echo "  \033[34mrun\033[0m    - run the grpc service"
	@echo "  \033[34mshell\033[0m  - open a shell inside the docker container"
	@echo

run:
	 ${SERVICE_RUN}

shell:
	${SERVICE_RUN} ./docker/analytics/service/cmd shell

test:
	${DCFTEST} run --rm service


.PHONY: help run
