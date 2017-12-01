RUN ?= gcloud --account=${ACCOUNT} --project=${PROJECT} docker

all: build push

build:
	${RUN} -- build -t gcr.io/${PROJECT}/tmux:latest ./

push:
	${RUN} -- push gcr.io/${PROJECT}/tmux:latest
