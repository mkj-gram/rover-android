#!/bin/sh

set -e

TARGET_DIR="./apis/go"

if [ ! -d "$TARGET_DIR" ]; then
  mkdir $TARGET_DIR
fi

PROTO_PATH=./protos

GO_MAPS="Mgoogle/protobuf/timestamp.proto=github.com/roverplatform/rover/go/protobuf/ptypes/timestamp\
,Mauth/v1/auth.proto=github.com/roverplatform/rover/apis/go/auth/v1\
,Maudience/v1/audience.proto=github.com/roverplatform/rover/apis/go/audience/v1\
,Mnotification/v1/notification.proto=github.com/roverplatform/rover/apis/go/notification/v1\
,Mprotobuf/predicates.proto=github.com/roverplatform/rover/apis/go/protobuf/predicates\
,Mprotobuf/version.proto=github.com/roverplatform/rover/apis/go/protobuf\
,Mprotobuf/wrappers.proto=github.com/roverplatform/rover/apis/go/protobuf/wrappers\
,Mprotobuf/struct.proto=github.com/roverplatform/rover/apis/go/protobuf/struct\
,Mprotobuf/timestamp.proto=github.com/roverplatform/rover/apis/go/protobuf/timestamp\
"

FILES="`find $PROTO_PATH -name *.proto`"
echo "Proto Files: "
echo $FILES

for proto in $FILES; do
    protoc -I ${PROTO_PATH} --go_out=plugins=grpc,$GO_MAPS:./$TARGET_DIR $proto
done

echo "DONE"
