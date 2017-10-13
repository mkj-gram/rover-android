FROM protoc:3.2.0

ENV NODE_VERSION=6.7.0-r1

RUN apk update && apk add nodejs=$NODE_VERSION

RUN apk add --no-cache make

RUN npm install -g grpc-tools

ENTRYPOINT ["./protos/builds/scripts/node.sh"]
