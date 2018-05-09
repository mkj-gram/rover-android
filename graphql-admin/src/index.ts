import { GraphQLServer } from 'graphql-yoga'
import OAuthMiddleware from './middleware/'

const typeDefs = `
    type Query {
        description: String
    }`
const resolvers = {
    Query: {
        description: () => `Test working`
    }
}

const server = new GraphQLServer({ typeDefs, resolvers })
server.express.disable('x-powered-by')

const oAuthMiddleware = OAuthMiddleware(
    process.env.AUTH_CLIENT_ID,
    process.env.AUTH_CLIENT_SECRET
)
server.express.use(oAuthMiddleware)

const options = {
    port: process.env.PORT || 80
}
server.start(options, () =>
    console.log('Running GraphQL on port ' + options.port)
)
