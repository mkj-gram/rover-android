const {
    Environment,
    Network,
    RecordSource,
    Store
} = require('relay-runtime')

const store = new Store(new RecordSource())

const network = Network.create((operation, variables) => fetch('https://api.staging.rover.io/graphql', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
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
