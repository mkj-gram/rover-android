dev-deps:
	go get -u github.com/kardianos/govendor
	go get -u github.com/pressly/goose/cmd/goose
	npm install -g grpc-tools
	gem install grpc-tools

protoc:
	protos/build

.PHONY: dev-deps protoc
