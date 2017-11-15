#!/bin/sh

set -e

TARGET_DIR="./apis/node"

if [ ! -d "$TARGET_DIR" ]; then
  mkdir $TARGET_DIR
fi

PROTO_PATH=./protos

FILES="`find $PROTO_PATH -name *.proto`"
echo "Proto Files: "
echo $FILES

protoc -I ${PROTO_PATH} --js_out=import_style=commonjs,binary:./$TARGET_DIR --grpc_out=./$TARGET_DIR --plugin=protoc-gen-grpc=`which grpc_tools_node_protoc_plugin` $FILES

echo "DONE"
