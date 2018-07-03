import { execute, GraphQLRequest, makePromise } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import firebase from 'firebase/app'
import 'firebase/auth'
import { StringMap } from '../typings'

const environments: StringMap<string> = {
    production: 'https://api.rover.io/admin',
    staging: 'https://api.staging.rover.io/admin',
    development: 'http://' + process.env.HOST + ':4001/admin'
}

const uri =
    environments[process.env.NODE_ENV] || 'https://api.staging.rover.io/admin'

export default (token: string, operation: GraphQLRequest) => {
    return makePromise(
        execute(
            new HttpLink({
                headers: {
                    accept: 'application/json',
                    Authorization: `Bearer ${token}`
                },
                uri
            }),
            operation
        )
    )
}
