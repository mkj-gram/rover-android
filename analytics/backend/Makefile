DCF ?= docker-compose -f ../../docker/main.docker-compose.yaml

COLLECTOR_RUN ?= ${DCF} run --rm analytics-collector
SERVICE_RUN ?= ${DCF} run --rm analytics-service

help:
	@echo
	@echo "  \033[34mcollector.run\033[0m - run the collector"
	@echo "  \033[34mcollector.shell\033[0m - create a shell in the collector context"
	@echo "  \033[34mcollector.test\033[0m - test the collector"
	@echo "  \033[34mservice.run\033[0m - run the service"
	@echo "  \033[34mservice.shell\033[0m - create a shell in the service context"
	@echo "  \033[34mservice.test\033[0m - test the service"
	@echo

collector.run:
	${COLLECTOR_RUN}

collector.shell:
	${COLLECTOR_RUN} sh

collector.test:
	${COLLECTOR_RUN} ./docker/analytics/cmd test_collector

service.run:
	${SERVICE_RUN}

service.shell:
	${SERVICE_RUN} sh

service.test:
	${SERVICE_RUN} ./docker/analytics/cmd test_service

.PHONY: help collector.run collector.shell collector.test service.run service.shell service.test
