# HealthCheck Server

Adds a simple api for readiness & liveliness healthchecks from Kubernetes

### Setup

```javascript

var HealthChecker = require("@rover-common/healthcheck-server")

var HealthCheckServer = new HealthChecker(8080)

HealthCheckServer.on('readiness', function() {
  // Determine if you are ready here
  return true
})


HealthCheckServer.on('liveliness', function() {
  // Determine if you are alive here
  return true
})


HealthCheckServer.start()


// If you want to handle graceful shutdown

process.on('SIGTERM', function () {
  HealthCheckServer.close()
});

```