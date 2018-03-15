#!/bin/bash

set -e

echo "Build GO proto..."
docker run --rm -v $PWD/../../../:/defs protoc:3.2.0-go

echo "Build Node proto..."
docker run --rm -v $PWD/../../../:/defs protoc:3.2.0-node

echo "Build Ruby proto..."
docker run --rm -v $PWD/../../../:/defs protoc:3.2.0-ruby

echo "Building Go Mocks..."
docker run --rm -v $PWD/../../../:/go/src/github.com/roverplatform/rover golang:1.10-alpine sh -c " /go/src/github.com/roverplatform/rover/protos/builds/scripts/gomocks.sh"

echo "Finished.."