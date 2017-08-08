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

app.use('/graphql', cors(), graphqlHTTP(req => ({
    schema,
    graphiql: true,
    context: { 
        accountToken: req.headers['x-rover-account-token'] || req.query.accountToken,
        deviceId: req.headers['x-rover-device-id'],
        profileId: req.headers['x-rover-profile-id']
    }
})))

app.listen(app.get('port'))
console.log('Running a GraphQL API server at localhost:4000/graphql')
