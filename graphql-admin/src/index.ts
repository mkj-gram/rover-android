import { graphiqlExpress, graphqlExpress } from 'apollo-server-express';
import { json } from 'body-parser';
import * as express from 'express';
import { makeExecutableSchema } from 'graphql-tools';
import { ContextMiddleware, HTTPLoggerMiddleware, OAuthMiddleware } from './middleware';
import logger from './logger';
import typeDefs from './typedefs'
import resolvers from './resolvers'

const app: express.Application = express()
const PORT: number = Number(process.env.PORT) || 80
app.disable('x-powered-by')

app.use(ContextMiddleware)
app.use(HTTPLoggerMiddleware(logger))
app.use(
    OAuthMiddleware(process.env.AUTH_CLIENT_ID, process.env.AUTH_CLIENT_SECRET)
)

const schema = makeExecutableSchema({ typeDefs, resolvers })
app.use('/graphql', json(), graphqlExpress({ schema: schema }))
app.get('/graphiql', graphiqlExpress({ endpointURL: '/graphql' })) // GraphiQL enabled

app.listen(PORT)
console.log('Running GraphQL on port ' + PORT)
