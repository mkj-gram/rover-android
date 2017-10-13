FROM protoc:3.2.0

RUN set -ex \
    && apk --no-cache --update add --virtual .ruby-builder \
  git \
  gcc \
  g++ \
  openssl \
  make \
    cmake \
  autoconf \
  automake \
  libtool

RUN mkdir -p /usr/local/grpc \
  && git clone https://github.com/grpc/grpc.git /usr/local/grpc

RUN cd /usr/local/grpc \
  && git checkout v1.1.2 \
  && git submodule update --init

RUN cd /usr/local/grpc \
  && make grpc_ruby_plugin

RUN mkdir -p /opt/namely \
  && cp /usr/local/grpc/bins/opt/grpc_ruby_plugin /opt/namely

ENTRYPOINT ["./protos/builds/scripts/ruby.sh"]
