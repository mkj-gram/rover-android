# GRPC Retryify

### Installation

Add `@rover-common/grpc-retryify` to your `package.json` file. Make sure you specify the relative path within the mono repo as the moduled is not published to npm

### Usage

```javascript
const retryify = require('@rover-common/grpc-retryify')

// A generic grpc client
// Can also use rover's generated grpc clients
const client = new grpcClient()

// Mutates the original client
retryify(client)


// Example call which will automatically be retried if an error occurs
client.createProfile({ name: "Hello" }, function(err, response) { ... })


// Passing options. See Options for more details
// Retries at most 20 times with a max delay of 60 seconds
client.createProfile({ name: "Bacon" }, { retry: { retries: 20, maxTimeout: 60 * 10000 } }, function(err, response) { ... })



// Option to override the retry function
// return true if the error is retryable
function onRetry(err) {
    if (err && err.message === 'Not Found') {
        return true
    }

    return false
}

client.createProfile({ name: "Billy" }, { retry: { on: onRetry }}, function(err, response) { ... })
```

### Options

| option     | type     | description                                                                      |
|------------|----------|----------------------------------------------------------------------------------|
| retries    | int      | number of times the function should be retried                                   |
| factor     | int      | factor used to calculate exponential backoff                                     |
| minTimeout | int      | minimum timeout in milliseconds (ie first timeout used in backoff)               |
| maxTimeout | int      | maximum timeout in milliseconds                                                  |
| on         | function | override default retry checking function. Return true if the error is retryable  |
