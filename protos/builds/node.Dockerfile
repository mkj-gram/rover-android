FROM node:6.14.2

ENV PROTOC_ZIP=protoc-3.2.0-linux-x86_64.zip

RUN apt-get update && \
	apt-get install unzip

WORKDIR /

RUN mkdir /protoc && \
	curl -OL https://github.com/google/protobuf/releases/download/v3.2.0/$PROTOC_ZIP && \
	unzip -o $PROTOC_ZIP -d /protoc && \
	cp /protoc/bin/protoc /usr/local/bin && \
	cp -r /protoc/include/* /usr/local/include && \
	rm -f $PROTOC_ZIP && \
	rm -rf /protoc

RUN npm install -g grpc-tools
