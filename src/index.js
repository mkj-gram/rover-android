import express from 'express'
import graphqlHTTP from 'express-graphql'
import cors from 'cors'
import dotenv from 'dotenv'
import morgan from 'morgan'

import schema from './schema'

dotenv.config()


const app = express()

app.set('port', (process.env.PORT || 80))

app.use(morgan('tiny'))

app.use('/graphql', cors(), graphqlHTTP({
    schema,
    graphiql: true,
    formatError: error => ({
    	message: error.message,
		locations: error.locations,
		stack: error.stack
    })
}))

app.listen(app.get('port'))
console.log('Running a GraphQL API server at localhost:4000/graphql')
