import { graphiqlExpress, graphqlExpress } from 'apollo-server-express'
import { json } from 'body-parser'
import * as cors from 'cors'
import * as express from 'express'
import { makeExecutableSchema } from 'graphql-tools'
import logger from './logger'
import {
    ContextMiddleware,
    HTTPLoggerMiddleware,
    OAuthMiddleware
} from './middleware'
import resolvers from './resolvers'
import typeDefs from './typedefs'

const app: express.Application = express()
const PORT: number = Number(process.env.PORT) || 80
app.disable('x-powered-by')

app.use(cors())
app.use(ContextMiddleware)
app.use(HTTPLoggerMiddleware(logger))
app.use(
    OAuthMiddleware(
        process.env.PROJECT_ID,
        process.env.CLIENT_EMAIL,
        process.env.PRIVATE_KEY,
        process.env.DATABASE_URL
    )
)

const schema = makeExecutableSchema({ typeDefs, resolvers })
app.use('/admin', json(), graphqlExpress({ schema: schema }))
app.get('/graphiql', graphiqlExpress({ endpointURL: '/admin' })) // GraphiQL enabled

app.listen(PORT)
console.log('Running GraphQL on port ' + PORT)
