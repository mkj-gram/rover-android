# Rover monorepo

## Layout

`rover` mono-repo has to reside under `$GOPATH/src/github.com/roverplatform`

```
└── github.com
    └── roverplatform
        └── rover
            ├── go
            │   └── apis
            │       └── auth
            │           └── v1
            ├── node-app
            ├── protos
            │   ├── auth
            │   │   └── v1
            │   ├── common
            │   │   └── v1
            │   └── pushy
            │       └── v1
            ├── rails-app
            ├── svc
            │   └── authsvc
            │       ├── cmd
            │       │   └── authsvcd
            │       └── db
            └── vendor
```

1. `vendor` - "global" monorepo dependencies: should be reused by other packages
2. `go/` - shared Go code library
3. `protos/` - all protobuf definitions
4. `rails-app/`, `node-app` - projects
5. `svc/` - implementation of the microservices

## Vendoring

`vendor`ed dependencies are managed with `govendor`. Install with `cd rover/ && make dev-deps` 

### govendor Howto

1. `govendor list` - List and filter dependencies and packages
2. `govendor fetch +outside` - Add new or update vendor folder packages from remote repository
3. for more goto [github](https://github.com/kardianos/govendor) or a [doc](https://devcenter.heroku.com/articles/go-dependencies-via-govendor)

## protobuf 

### Generation

```
cd rover
protoc -I protos/ protos/auth/v1/auth.proto --go_out=plugins=grpc:./go/apis
```