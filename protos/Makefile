VERSION ?= 3.2.0

deps-base:
	cd builds && docker build --tag=protoc:${VERSION} -f Dockerfile .

deps:
	cd builds/scripts && bash deps.sh

build:
	cd builds/scripts && bash build.sh

all: deps-base deps build

.PHONY: deps-base deps build