#!/bin/sh

set -e

TARGET_DIR="./apis/ruby/rover-apis"

if [ ! -d "$TARGET_DIR" ]; then
  mkdir $TARGET_DIR
fi

PROTO_PATH=./protos

FILES="`find $PROTO_PATH -name *.proto`"
echo "Proto Files: "
echo $FILES

protoc -I ${PROTO_PATH} --ruby_out=./$TARGET_DIR --grpc_out=./$TARGET_DIR --plugin=protoc-gen-grpc=/opt/namely/grpc_ruby_plugin $FILES
echo "DONE"
