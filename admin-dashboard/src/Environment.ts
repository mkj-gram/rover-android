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

function getToken() {
    firebase
        .auth()
        .currentUser.getIdToken()
        .then(token => {
            return token
        })
        .catch(err => {
            return ''
        })
}

const link = new HttpLink({
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${getToken()}`
    },
    uri
})

export default (operation: GraphQLRequest) => {
    return makePromise(execute(link, operation))
}
