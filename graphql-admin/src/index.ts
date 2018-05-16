import * as express from 'express'
import { json } from 'body-parser'
import { makeExecutableSchema } from 'graphql-tools'
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express'

import OAuthMiddleware from './middleware'
import typeDefs from './typedefs'
import resolvers from './resolvers'

const app: express.Application = express()
const PORT: number = Number(process.env.PORT) || 80
app.disable('x-powered-by')

const oAuthMiddleware = OAuthMiddleware(
    process.env.AUTH_CLIENT_ID,
    process.env.AUTH_CLIENT_SECRET
)
app.use(oAuthMiddleware)

const schema = makeExecutableSchema({ typeDefs, resolvers })
app.use('/graphql', json(), graphqlExpress({ schema: schema }))
app.get('/graphiql', graphiqlExpress({ endpointURL: '/graphql' })) // GraphiQL enabled

app.listen(PORT)
console.log('Running GraphQL on port ' + PORT)
