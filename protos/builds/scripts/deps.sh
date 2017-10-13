#!/bin/bash

set -e

echo "Build GO proto image..."
docker build --tag=protoc:3.2.0-go -f ../../builds/go.Dockerfile ../../builds/

echo "Build Node proto image..."
docker build --tag=protoc:3.2.0-node -f ../../builds/node.Dockerfile ../../builds/

echo "Build Ruby proto image..."
docker build --tag=protoc:3.2.0-ruby -f ../../builds/ruby.Dockerfile ../../builds/

echo "Finished.."
