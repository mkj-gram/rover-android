#!/bin/bash

if [ "$NODE_ENV" = "production" ]; then
    eval "$(get-graphql-schema https://api.rover.io/graphql > ./src/relay/schema.graphql)"
elif [ "$NODE_ENV" = "staging" ]; then
    eval "$(get-graphql-schema https://api.staging.rover.io/graphql > ./src/relay/schema.graphql)"
elif [ "$NODE_ENV" = "development" ]; then
    eval "$(get-graphql-schema http://localhost:4000/graphql > ./src/relay/schema.graphql)"
else
    echo "Error: Not a valid NODE_ENV"
fi
