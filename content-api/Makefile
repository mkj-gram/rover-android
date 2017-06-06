DC ?= docker-compose -f ../docker/rover.docker-compose.yaml
RUN ?= ${DC} run --rm -w /rover/content-api

ARGS ?= spec
test:
	${RUN} content-api \
		bundle exec rspec ${ARGS}

test.db.migrate:
	${RUN} content-api \
		bundle exec rake db:migrate RAILS_ENV=test

run:
	${RUN} -p 5000:5000 content-api \
		bundle exec puma -C config/puma.rb

shell:
	${RUN} content-api bash

.PHONY: run test db.console test.db.migrate
