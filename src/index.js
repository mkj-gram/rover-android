import express from 'express'
import bodyParser from 'body-parser'
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express'
import { makeExecutableSchema } from 'graphql-tools'
import uuid from 'node-uuid'
import JSON from 'graphql-type-json'

const typeDefs = `
    scalar JSON

    input EventInput {
        name: String!
        timestamp: String!
        attributes: JSON!
    }

    type Event {
        id: ID!
        name: String!
        timestamp: String!
        attributes: JSON!
    }

    type Query {
        hello: String
    }

    type Mutation {
        trackEvents(events: [EventInput]!): [Event]
    }

    schema {
        query: Query
        mutation: Mutation
    }
`

const resolvers = {
    Query: {
        hello() {
            return "Hello, world!"
        }
    },
    Mutation: {
        trackEvents(_, { events }) {
            return events.map(eventInput => {
                return {
                    id: uuid(),
                    name: eventInput.name,
                    timestamp: eventInput.timestamp,
                    attributes: eventInput.attributes
                }
            })
        }
    },
    JSON
}

const schema = makeExecutableSchema({
    typeDefs,
    resolvers
})

const app = express()

app.use('/graphql', bodyParser.json(), graphqlExpress({
  schema
}))

app.use('/graphiql', graphiqlExpress({
    endpointURL: '/graphql'
}))

app.listen(4000)
console.log('Running a GraphQL API server at localhost:4000/graphql')