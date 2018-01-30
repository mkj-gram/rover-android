# GraphQL Gateway

This API gateway service is responsible for composing data from both [Audience
Service](../audience) and the legacy [Content API](../content-api) monolith, and
exposing it as GraphQL.

It is a Node app powered using graphql.js and Express.

It exposes API for several different Rover verticals, including Experiences and
Events.  It is consumed by multiple clients, namely the 2.0 Android and iOS
mobile SDKs.

## Local Development

Ensure a local Docker daemon is working and ready, then:

    $ NO_PROXY=\* make run

You should now be able to visit http://localhost:4000/graphql.  Read on below
for usage instructions.

NB. That bit about `NO_PROXY` is a workaround for what is apparently Docker Compose
bug [#3419](https://github.com/docker/compose/issues/3419).

This will build and run the Gateway.  By default it will use an instance of
Audience Service built and run locally as a dependency by `docker-compose`.
However, by default it will also point to the production instance of the Content
API.  This can be overridden by manually adding the environment variables
`CONTENT_API_SERVICE_SERVICE_HOST` and `CONTENT_API_SERVICE_SERVICE_PORT` in the
`graphql-gateway` section of in `docker/main.docker-compose.yaml`.

## Usage

If using an API Key: Set the consumer's API key as HTTP header
`x-rover-account-token`.

If using an OAuth: Use the standard OAuth convention by setting HTTP header
`authorization` to be an appropriate OAuth authorization object, such as `Bearer
<token here>`.

Then you can make requests to `/graphql` using the standard [GraphQL-over-HTTP
protocol](http://graphql.org/learn/serving-over-http/).  The GraphiQL frontend
is available if you visit it with a web browser, but it is recommended to use a
client such as [GraphQL
Playground](https://github.com/graphcool/graphql-playground).  In either case,
you will need to furnish one of the above authorization headers, however that is
much more easily done with the GraphQL Playground client app.

Use the GraphQL schema data you can inspect from the GraphQL Gateway using those
tools to determine the details of the API's usage.
