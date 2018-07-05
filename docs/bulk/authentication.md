---
title: Authentication
layout: guide
permalink: /bulk/authentication/
secondary_navigation: bulk
---

# Authentication

The Rover Bulk API endpoints use your server token to authenticate requests. You can obtain your server token from the Rover [Settings app](https://app.rover.io/settings).

---

The server token must be passed as an HTTP header with all requests.

```
"x-rover-api-key": "ROVER_SERVER_KEY"
```
