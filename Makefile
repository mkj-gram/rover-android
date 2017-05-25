dev-deps:
	go get -u github.com/kardianos/govendor
	npm install -g grpc-tools
	gem install grpc-tools

protoc:
	protos/build

.PHONY: go.dev-deps protoc-go
