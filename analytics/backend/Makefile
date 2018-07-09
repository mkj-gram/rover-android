DCF ?= docker-compose -f ../../docker/main.docker-compose.yaml
DCFTEST ?= docker-compose -f test.docker-compose.yaml

SERVICE_RUN ?= ${DCF} run --rm analytics-service
COLLECTOR_RUN ?= ${DCF} run --rm analytics-collector

help:
	@echo
	@echo "  \033[34mtest\033[0m   - test the service & collector"
	@echo "  \033[34mrun\033[0m    - run the grpc service"
	@echo "  \033[34mshell\033[0m  - open a shell inside the docker container"
	@echo
	@echo "  \033[34mtest.collector\033[0m   - test the collector"
	@echo "  \033[34mrun.collector\033[0m    - run analytics collector server"
	@echo

run:
	 ${SERVICE_RUN}

run.collector:
	${COLLECTOR_RUN}

shell:
	${SERVICE_RUN} ./docker/analytics/service/cmd shell

shell.collector:
	${COLLECTOR_RUN} ./docker/analytics/collector/cmd shell

test:
	${DCFTEST} run --rm service

test.collector:
	${DCFTEST} run --rm collector


.PHONY: help run
