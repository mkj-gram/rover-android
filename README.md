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
          ├── grapql-gateway
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

## Git Workflow

The following convention is used when building in the monorepo
1. `master` is always buildable and deployable
2. `staging` is used as a developing branch of features

When creating new features you'll create a branch off of staging. Once your build has been tested and reviewed by your peers you will then be able to merge your branch into staging. Staging is then merged by the admins into master which will trigger production builds on release day.

## Vendoring

Go `vendor`ed dependencies are managed with `govendor`. Install with `cd rover/ && make dev-deps` 

### govendor Howto

1. `govendor list` - List and filter dependencies and packages
2. `govendor fetch +outside` - Add new or update vendor folder packages from remote repository
3. for more goto [github](https://github.com/kardianos/govendor) or a [doc](https://devcenter.heroku.com/articles/go-dependencies-via-govendor)

## protobuf

### Generation

```
cd rover
./protos/build
```
