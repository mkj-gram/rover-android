/* eslint-disable */
const {
    Environment,
    Network,
    RecordSource,
    Store
} = require('relay-runtime')

const store = new Store(new RecordSource())

const uri = {
    'production': 'https://api.rover.io/graphql',
    'staging': 'https://api.staging.rover.io/graphql',
    'development': 'http://localhost:4000/graphql'
}

const getToken = () => {
    const session = JSON.parse(
        localStorage.getItem('ember_simple_auth:session')
    )
    return session ? session.authenticated.token : null
}

const network = Network.create((operation, variables) => fetch(uri[process.env.NODE_ENV], {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer: ${getToken()}`
        },
        body: JSON.stringify({
            query: operation.text,
            variables
        })
    }).then(response => response.json()))

const environment = new Environment({
    network,
    store
})

export default environment
