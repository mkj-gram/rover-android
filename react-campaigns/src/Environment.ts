/// <reference path="../typings/index.d.ts"/>
import { execute, makePromise, GraphQLRequest } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'

const environments: StringMap<string> = {
    production: 'https://api.rover.io/graphql',
    staging: 'https://api.staging.rover.io/graphql',
    development: 'http://localhost:4000/graphql'
}

const uri = environments[process.env.NODE_ENV]

const getToken = (): string | null => {
  const session = JSON.parse(localStorage.getItem('ember_simple_auth:session'))
  return session ? session.authenticate.token : null
}

const link = new HttpLink({
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getToken()}`
  },
  uri
})

export default (operation: GraphQLRequest) => makePromise(execute(link, operation))
  .then(data => console.log(data))
  .catch(error => console.log(error))
