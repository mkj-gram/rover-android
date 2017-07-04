# Rover monorepo

## Layout

Per-project groupping, ie:

```
└── github.com
    └── roverplatform
        └── rover
          ├── Makefile
          ├── README.md
          apis/
          ├── auth
          │   └── v1
          │       ├── auth.pb.go
          │       ├── auth_pb.rb
          │       └── auth_services_pb.rb
          ├── common
          │   └── v1
          │       ├── response.pb.go
          │       └── response_pb.rb
          ├── auth
          │   └── service
          │   └── clients
          │       ├── node
          │       ├── ruby
          │       └── go
          ├── bulk-gateway
          │   └── package.json
          ├── graphql-gateway
          │   └── package.json
          ├── go
          │   ├── context
          │   └── protobuf
          ├── protos
          │   ├── README.md
          │   ├── auth
          │   └── csv-processor
          ├── csv-processor
          └── vendor
```

1. `vendor` - "global" monorepo dependencies: should be reused by other packages
2. `go/` - shared Go libraries
3. `protos/` - all protobuf definitions
4. `rails-app/`, `node-app` - projects
5. `auth/` - auth related services, clients

## Vendoring

Go `vendor`ed dependencies are managed with `govendor`. Install with `cd rover/ && make dev-deps` 

### govendor Howto

1. `govendor list` - List and filter dependencies and packages
2. `govendor fetch +outside` - Add new or update vendor folder packages from remote repository
3. for more goto [github](https://github.com/kardianos/govendor) or a [doc](https://devcenter.heroku.com/articles/go-dependencies-via-govendor)

## protobuf

### Style

Avoid streaming rpc calls as this makes the retry logic on the client side much harder. Stick to a batch approach for reading and writing data

### Generation

```
cd rover
./protos/build
```
