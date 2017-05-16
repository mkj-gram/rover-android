#!/bin/bash

printf "BUILDING.."
# Make sure the directory exists and is clean
mkdir -p lib/segment/v1
rm -rf lib/segment/v1/*

printf "COPYING.."

# this needs to be copied via root

ROOT_DIR=$(git rev-parse --show-toplevel)

cp $ROOT_DIR/apis/segment/v1/segment_pb.js lib/segment/v1/
cp $ROOT_DIR/apis/segment/v1/segment_grpc_pb.js lib/segment/v1/

printf "DONE\n"