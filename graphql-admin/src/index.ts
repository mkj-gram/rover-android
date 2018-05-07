import { GraphQLServer } from 'graphql-yoga'
import { OAuth2Client } from 'google-auth-library'

const typeDefs = `
    type Query {
        description: String
    }`
const resolvers = {
    Query: {
        description: () => `Test working`
    }
}
const options = {
    port: process.env.PORT || 80
}

const server = new GraphQLServer({ typeDefs, resolvers })
server.express.disable('x-powered-by')

server.start(options, () =>
    console.log('Running GraphQL on port ' + options.port)
)
