/// <reference path="../typings/index.d.ts"/>
import { execute, makePromise, GraphQLRequest } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'

const environments: StringMap<string> = {
    production: 'https://api.rover.io/graphql',
    staging: 'https://api.staging.rover.io/graphql',
    development: 'http://192.168.0.101:4000/graphql'
}

const uri =
    environments[process.env.NODE_ENV] || 'https://api.staging.rover.io/graphql'

const getToken = (): string | null => {
    const session = JSON.parse(
        localStorage.getItem('ember_simple_auth:session')
    )
    return session ? session.authenticated.token : null
}

const link = new HttpLink({
    headers: {
        accept: 'application/json',
        // Authorization: `Bearer ${getToken()}`
        'x-rover-account-token': '3b298738ebe5fa35797c9226450aad86551c2f8b'
    },
    uri
})

export default (operation: GraphQLRequest) => {
    return makePromise(execute(link, operation))
}
