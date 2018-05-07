DCF ?= docker-compose -f ../docker/main.docker-compose.yaml
RUN ?= ${DCF} run --rm -p 4001:80 graphql-admin

shell:
	${RUN} bash
run:
	${RUN} bash -c "npm install && npm start"
test:
	${RUN} bash -c "npm install && npm test"
