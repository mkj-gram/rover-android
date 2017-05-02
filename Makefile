dev-deps:
	go get -u github.com/kardianos/govendor

protoc:
	protos/build-go
	# protos/build


.PHONY: dev-deps protoc-go
