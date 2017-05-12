ENV ?= staging
TAG ?= latest

all: binary image push clean

binary:
	docker-compose up --remove-orphans

image:
	docker build -t gcr.io/rover-${ENV}/authsvc:${TAG} .

push:
	gcloud docker -- push gcr.io/rover-${ENV}/authsvc:${TAG}

clean:
	rm -rf ./.build
