RUN=docker run -v `pwd`:/app -w /app node:7.10.1-alpine

all: install test

install:
	${RUN} npm install

test: 
	${RUN} npm test

.PHONY: all install test