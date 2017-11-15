#!/bin/bash

set -e

echo "Build GO proto..."
docker run -v $PWD/../../../:/defs protoc:3.2.0-go

echo "Build Node proto..."
docker run -v $PWD/../../../:/defs protoc:3.2.0-node

echo "Build Ruby proto..."
docker run -v $PWD/../../../:/defs protoc:3.2.0-ruby

echo "Finished.."
