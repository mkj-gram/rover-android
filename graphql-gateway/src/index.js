import express from 'express'
import graphqlHTTP from 'express-graphql'
import cors from 'cors'
import dotenv from 'dotenv'
import morgan from 'morgan'

import schema from './schema'

import RoverApis from '@rover/apis'
import Auth from '@rover/auth-client'

import 'babel-polyfill'

dotenv.config()

const authClient = Auth.v1.Client()
const authMiddleware = Auth.v1.Middleware(authClient)

const app = express()

app.set('port', (process.env.PORT || 80))

app.use(authMiddleware)
app.use(morgan('tiny'))

app.get('/healthcheck', (req, res) => {
    return res.status(200).end()
})

app.use('/graphql', cors(), authMiddleware, graphqlHTTP(req => ({
    schema,
    graphiql: true,
    context: { 
        authContext: req.auth && req.auth.context,
        deviceId: req.headers['x-rover-device-id'],
        profileId: req.headers['x-rover-profile-id'],
    }
})))

app.use(function (err, req, res, next) {
  console.error(err)
  res.status(500).send('Something broke!')
})

app.listen(app.get('port'))
console.log('Running a GraphQL API server at port ' + (process.env.PORT || 80))
