/// <reference path="../../typings/index.d.ts"/>
import { execute, makePromise, GraphQLRequest } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'

const environments: StringMap<string> = {
    production: 'https://api.rover.io/graphql',
    staging: 'https://api.staging.rover.io/graphql',
    development: 'http://' + process.env.HOST + ':4000/graphql'
}

const uri =
    environments[process.env.NODE_ENV] || 'https://api.staging.rover.io/graphql'

export const getToken = (): string | null => {
    const session = JSON.parse(
        localStorage.getItem('ember_simple_auth:session')
    )
    return session ? session.authenticated.token : null
}

const link = new HttpLink({
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${getToken()}`
        // 'x-rover-account-token': 'bf704e5aeb9ac3aefaa5e289154a4832aa87a7a3'
    },
    uri
})

export default (operation: GraphQLRequest) => {
    return makePromise(execute(link, operation))
}
