TEST_DSN ?= "postgres://postgres:@localhost:5432/authsvc_test"

test:
	@echo TEST_DSN=$(TEST_DSN)
	@TEST_DSN=$(TEST_DSN) go test -tags integration .
	@TEST_DSN=$(TEST_DSN) go test -tags integration ./db/...

test.db.dump:
	pgdb pg_dump -Upostgres authsvc_test --schema-only --clean --if-exists > svc/authsvc/db/schema/postgres/schema.sql

.PHONY: test.db.dump
