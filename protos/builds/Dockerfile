FROM alpine:3.4

# Protobuf version
ENV PROTOBUF_VERSION="3.2.0"
ENV PROTOBUF_ZIP=protoc-${PROTOBUF_VERSION}-linux-x86_64.zip
ENV PROTOBUF_UNZIPPED=protoc-${PROTOBUF_VERSION}-linux-x86_64
ENV PROTOBUF_URL=https://github.com/google/protobuf/releases/download/v${PROTOBUF_VERSION}/${PROTOBUF_ZIP}

ENV GLIBC_VERSION="2.23-r3"
ENV ALPINE_GLIBC_URL=https://github.com/sgerrand/alpine-pkg-glibc/releases/download/${GLIBC_VERSION}/
ENV GLIBC_PKG=glibc-${GLIBC_VERSION}.apk
ENV GLIBC_BIN_PKG=glibc-bin-${GLIBC_VERSION}.apk

RUN apk add --update --no-cache -t deps wget ca-certificates \
    && cd /tmp \
    # install glibc
    && wget ${ALPINE_GLIBC_URL}${GLIBC_PKG} \
    && wget ${ALPINE_GLIBC_URL}${GLIBC_BIN_PKG} \
    && apk add --allow-untrusted ${GLIBC_PKG} ${GLIBC_BIN_PKG} \
    && /usr/glibc-compat/sbin/ldconfig /lib /usr/glibc-compat/lib/ \
    && echo 'hosts: files mdns4_minimal [NOTFOUND=return] dns mdns4' >> /etc/nsswitch.conf \
    # install protobuf
    && wget ${PROTOBUF_URL} \
    && unzip ${PROTOBUF_ZIP} \
    && ls -al \
    && mkdir /usr/local/include \
    && mkdir /usr/local/include/google \
    && mv bin/* /usr/local/bin \
    && mv include/* /usr/local/include 

# libstdc++ is required for running protoc binary
RUN apk add --update --no-cache libstdc++

WORKDIR /defs
