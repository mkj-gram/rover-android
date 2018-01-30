VERSION ?= 3.2.0

all: deps-base deps build

deps-base:
	cd builds && docker build --tag=protoc:${VERSION} -f Dockerfile .

deps:
	cd builds/scripts && bash deps.sh

build:
	cd builds/scripts && bash build.sh


.PHONY: deps-base deps build
