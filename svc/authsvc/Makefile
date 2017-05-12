TEST_DB_DSN ?= "postgres://postgres:@localhost:5432/authsvc_test"
MIGRATIONS_DIR ?= "./db/migrations/postgres"

all:

up:
	docker-compose up -d --remove-orphans
	docker-compose exec postgres psql -Upostgres -hlocalhost -c "create database authsvc_test"

down:
	docker-compose stop

test:
	TEST_MIGRATIONS=${MIGRATIONS_DIR} go test -v -tags integration ./...

# up:
# 	docker container run --rm --name pgdb -d -p 5432:5432 postgres
# 	sleep 5
# 	docker exec pgdb psql -Upostgres -hlocalhost -c "create database authsvc_test"
#
# down:
# 	docker stop pgdb

