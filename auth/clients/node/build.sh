#!/bin/bash

printf "BUILDING.."
# Make sure the directory exists and is clean
mkdir -p lib/auth/v1
rm -rf lib/auth/v1/*

printf "COPYING.."

# this needs to be copied via root

CURRENT_DIR=$PWD

ROOT_DIR=$(git rev-parse --show-toplevel)

cp $ROOT_DIR/apis/auth/v1/auth_pb.js lib/auth/v1/
cp $ROOT_DIR/apis/auth/v1/auth_grpc_pb.js lib/auth/v1/

printf "DONE\n"