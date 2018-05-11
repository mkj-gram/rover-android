DCF ?= docker-compose -f ../../docker/main.docker-compose.yaml
RUN ?= ${DCF} run --rm audience-service
MONGO_RUN ?= ${DCF} run --rm mongo

MONGO_TEST_DSN ?= 'mongodb://mongo:27017/audience_service_test'
MONGO_DSN ?= 'mongodb://mongo:27017/audience_service_dev'
MONGO_SRC_DSN ?= 'mongodb://source_data:27018/audience_service_production' 

ROVER ?= github.com/roverplatform/rover

help:
	@echo
	@echo "  \033[34mclean\033[0m - remove all stopped containers"
	@echo "  \033[34mdb.seed\033[0m - seed db (ie. make BACKUP_DIR=/path/to/backup ACCOUNT_ID={INT} DEVICES={INT} db.seed"
	@echo "  \033[34mdb.reset\033[0m - clear all elastic and mongo data"
	@echo "  \033[34mdb.reset-one\033[0m - clear elastic and mongo data for one account (ie. make ACCOUNT_ID={INT} db.reset-one"
	@echo "  \033[34mrun\033[0m   - start audience-service"
	@echo "  \033[34mshell\033[0m - start a shell in the golang-1.9 container"
	@echo "  \033[34mstop\033[0m  - stop all running containers"
	@echo "  \033[34mtest\033[0m  - run integration tests"
	@echo "  \033[34mmongo_test.shell\033[0m  - start mongo shell using test db"
	@echo "  \033[34mmongo.sh\033[0m  - start mongo shell"
	@echo "  \033[34mindex\033[0m  - create and/or populate index (ie. make ACCOUNT_ID={INT} index)"

clean: 
	${DCF} rm

db.seed:
	BACKUP_DIR=$(BACKUP_DIR) ACCOUNT_ID=$(ACCOUNT_ID) DEVICES=$(DEVICES) SRC_MONGO=${MONGO_SRC_DSN} RCVR_MONGO=${MONGO_DSN} ./scripts/cmd seed_run

db.reset:
	${RUN} ./docker/audience/cmd mongo_clear elastic_clear_index

db.reset-one:
	ACCOUNT_ID=$(ACCOUNT_ID) MONGO_DSN=${MONGO_DSN} ./scripts/cmd reset_run

run:
	${RUN}

shell:
	${RUN} sh

stop:
	${DCF} stop

test:
	${RUN} go test -tags integration ${ROVER}/audience/service/...

mongo_test.shell:
	${MONGO_RUN} mongo ${MONGO_TEST_DSN}

mongo.sh:
	${MONGO_RUN} mongo ${MONGO_DSN}

index:
	${DCF} run --rm -e ACCOUNT_ID=$(ACCOUNT_ID) audience-service ./docker/audience/cmd index


.PHONY: run test shell db.shell
