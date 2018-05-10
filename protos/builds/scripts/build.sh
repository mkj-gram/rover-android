#!/bin/bash

set -e

echo "Build GO proto..."
docker run --rm -v $PWD/../../../:/rover -w /rover protoc:3.2.0-go /rover/protos/builds/scripts/go.sh

echo "Build Node proto..."
docker run --rm -v $PWD/../../../:/rover -w /rover protoc:3.2.0-node /rover/protos/builds/scripts/node.sh

echo "Build Ruby proto..."
docker run --rm -v $PWD/../../../:/rover -w /rover protoc:3.2.0-ruby /rover/protos/builds/scripts/ruby.sh

echo "Building Go Mocks..."
docker run --rm -v $PWD/../../../:/go/src/github.com/roverplatform/rover golang:1.10-alpine sh -c " /go/src/github.com/roverplatform/rover/protos/builds/scripts/gomocks.sh"

echo "Finished.."