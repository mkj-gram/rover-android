import express from 'express'
import graphqlHTTP from 'express-graphql'
import cors from 'cors'
import dotenv from 'dotenv'
import morgan from 'morgan'
import schema from './schema'

import RoverApis from '@rover/apis'
import Auth from '@rover/auth-client'
import EventPipeline from '@rover/events-pipeline-client'
import { authClient } from './grpcClients'

import persistedFragments from './persistedFragments'

import 'babel-polyfill'

dotenv.config()

const state = { isShutdown: false }
const clients = {}
const app = express()

app.set('port', (process.env.PORT || 80))
app.use(morgan('dev', {
    skip: function (req, res) {
        return req.originalUrl === '/healthcheck' 
    }
}))
app.disable('x-powered-by')

// Add the auth middleware to all http calls
const authMiddleware = Auth.v1.Middleware(authClient)
app.use(authMiddleware)

app.get('/healthcheck', (req, res) => {
    if(state.isShutdown) {
        // Signal that we are about to shutdown so stop passing healthchecks
        return res.status(404).end()
    }
    return res.status(200).end()
})



// Kubernetes has requested to shutdown
process.on('SIGTERM', function() {
    
    console.info('Got SIGTERM. Graceful shutdown start', new Date().toISOString())

    if (state.isShutdown === true) {
        // We are already shutting down
        return
    }

    state.isShutdown = true

    // Wait for kubernetes to remove us from the load-balancer
    // Then do a full shutdown
    setTimeout(function() {
        if (clients.pipeline) {
            clients.pipeline.flush()
                .then(_ => clients.pipeline.disconnect())
                .then(_ => console.info("Transformer cleanly shutdown"))
        }
    }, 10000)
    
})


async function main() {

    const pipeline = new EventPipeline.Client({ topic: process.env.EVENTS_PIPELINE_INPUT_TOPIC , kafka: { 'metadata.broker.list': process.env.KAFKA_DSN } })
    try {
        await pipeline.connect()
    } catch (err) {
        // error but continue
        console.error(err)
    }

    clients.pipeline = pipeline

    app.use('/graphql', cors(), authMiddleware, persistedFragments, graphqlHTTP(req => ({
            schema,
            graphiql: true,
            context: {
                headers: req.headers,
                authContext: req.auth && req.auth.context,
                accountToken: req.headers['x-rover-account-token'],
                clients: clients
            },
            formatError: (error) => {
                return {
                    message: error.message,
                    locations: error.locations,
                    stack: error.stack,
                    path: error.path
                }
            }
        })))

    app.use(function (err, req, res, next) {
      console.error(err)
      res.status(500).send('Something broke!')
    })

    app.listen(app.get('port'))
    console.log('Running GraphQL on port ' + app.get('port'))
}


main()