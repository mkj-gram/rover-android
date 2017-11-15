FROM protoc:3.2.0

RUN mkdir -p /go/src /go/bin \
    && chmod -R 777 /go/bin

ENV GOPATH=/go
ENV PATH=$GOPATH/bin:$PATH

ENV BUILD_PACKAGES="git ca-certificates go"

RUN apk add --update --no-cache $BUILD_PACKAGES \
    && go get -u \
        github.com/golang/protobuf/proto \
        github.com/golang/protobuf/protoc-gen-go \
    && rm -rf $GOPATH/src/* \
    && apk del --purge $BUILD_PACKAGES \
    && rm -rf /var/cache/apk/*

ENTRYPOINT ["./protos/builds/scripts/go.sh"]