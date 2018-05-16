DC ?= docker-compose -f ../docker/main.docker-compose.yaml -f ../docker/content-api/docker-compose.yaml
RUN ?= ${DC} run --rm --service-ports content-api
ARGS ?= spec
test:
	${RUN} bundle exec rspec ${ARGS}

test.db.migrate:
	${RUN} bundle exec rake db:migrate RAILS_ENV=test

run:
	${RUN} bundle exec puma -C config/puma.rb

shell:
	${RUN} bash

.PHONY: run test db.console test.db.migrate
