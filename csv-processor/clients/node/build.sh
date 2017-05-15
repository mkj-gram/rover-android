#!/bin/bash

printf "BUILDING.."
# Make sure the directory exists and is clean
mkdir -p lib/csv-processor/v1
rm -rf lib/csv-processor/v1/*

printf "COPYING.."

# this needs to be copied via root

CURRENT_DIR=$PWD

ROOT_DIR=$(git rev-parse --show-toplevel)

cp $ROOT_DIR/apis/csv-processor/v1/csv-processor_pb.js lib/csv-processor/v1/
cp $ROOT_DIR/apis/csv-processor/v1/csv-processor_grpc_pb.js lib/csv-processor/v1/

printf "DONE\n"