FROM golang:1.10

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

RUN mkdir -p /go/src/github.com/golang/protobuf && \
	cd /go/src/github.com/golang/protobuf && \
	git clone https://github.com/golang/protobuf . && \
	git checkout 1643683e1b54a9e88ad26d98f81400c8c9d9f4f9 && \
	go install github.com/golang/protobuf/proto && \
	go install github.com/golang/protobuf/protoc-gen-go