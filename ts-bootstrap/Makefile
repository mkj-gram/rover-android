DCF ?= docker-compose -f docker-compose.yaml
RUN ?= ${DCF} run --rm -p 6006:6006 ts-bootstrap

help:
	@echo
	@echo "  \033[34mstorybook\033[0m - Compile tsx to js and start storybook on :6006"
	@echo "  \033[34mcompile\033[0m  - Compile tsx to js"
	@echo "  \033[34mstop\033[0m  - Stop all running containers"
	@echo "  \033[34mlint\033[0m  - Run linter"

storybook:
	${RUN} bash -c "npm install && npm run storybook"

compile:
	${RUN} bash -c "npm install && npm run compile"

stop:
	${DCF} stop

lint:
	${RUN} bash -c "npm install && npm run lint"
