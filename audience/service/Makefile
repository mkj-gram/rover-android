DCF ?= docker-compose -f ../../docker/rover.docker-compose.yaml
RUN ?= ${DCF} run --rm ${RPC_PORT} audience-service
MONGO_RUN ?= ${DCF} run --rm mongo

MONGO_DSN ?= 'mongodb://mongo:27017/audience_service_test'

ROVER ?= github.com/roverplatform/rover

test:
	${RUN} go test -tags integration -v ${ROVER}/audience/service/...

run:
	${RUN} go run ./audience/service/cmd/audience-service/main.go --mongo-dsn=$(MONGO_DSN)

shell:
	${RUN} sh

mongo.shell:
	${MONGO_RUN} mongo $(MONGO_DSN)

mongo.sh:
	${MONGO_RUN} bash


.PHONY: run test shell db.shell
