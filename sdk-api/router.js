const concat = require('concat-stream');

const httpMethods = {
    GET: "GET",
    POST: "POST",
    PATCH: "PATCH",
    DELETE: "DELETE"
};

const notFoundError = JSON.stringify({ errors: [ { message:  "I can't find what you are looking for" } ] });
const notFoundLength = Buffer.byteLength(notFoundError);


const RoverApiAuth = require('./auth/rover-api-auth');

const EventsMatcher = new RegExp("^\/v1\/events$");
const InboxLandingPageMatcher = new RegExp("^\/v1\/inbox\/+([a-f0-9]{24})\/+landing-page$", 'i');
const InboxMessageMatcher = new RegExp("^\/v1\/inbox\/+messages\/+([a-f0-9]{24})$");
const InboxMessageMatcher2 = new RegExp("^\/v1\/inbox\/+([a-f0-9]{24})$");
const InboxMatcher = new RegExp("^\/v1\/inbox$", 'i');

const InboxController = require('./controllers/v1/inbox');
const InboxMessagesController = require('./controllers/v1/inbox-message');
const InboxLandingPageController = require('./controllers/v1/inbox-landing-page');
const EventsController = require('./controllers/v1/event');

const unauthenticatedResponse = function(req, res) {
    res.writeHead(401, {
        'Content-Type': 'application/json'
    });
    res.write(JSON.stringify({ errors: [ { message: "Unauthorized" }]}));
    res.end();
};

const notFoundResponse = function(req, res) {
    res.writeHead(404, {
        'Content-Type': 'application/json',
        'Content-Length': notFoundLength
    });
    res.write(notFoundError);
    res.end();
}

const route = function(req, res) {
    const server = this;
    const newrelic = server.plugins.newrelic.client;

    let url = req.url
    let method = req.method;

    res._startTime = Date.now();

    res.on('finish', function() {
        const requestEndTime = Date.now();
        const totalTime = requestEndTime - res._startTime;
        const librato = server.plugins.librato.client;
        librato.measure('request.total', 1, { source: 'sdk-api'});
        librato.measure('request.time', totalTime, { source: 'sdk-api' });
    });

    req.server = server;

    if (method == httpMethods.GET) {
        RoverApiAuth.authenticate(req, (authenticated) => {
            if (!authenticated) {
                return unauthenticatedResponse(req, res);
            }

            let match;
            if (match = url.match(InboxLandingPageMatcher)) {
                req.params = {
                    id: match[1]
                }
                newrelic.setTransactionName("v1/inbox/messages/landing-page");
                return InboxLandingPageController.get(req, res);
            } else if(match = url.match(InboxMessageMatcher)) {
                // GET /v1/inbox/messages/57e4181bc69a2845d977f7c0
                req.params = {
                    id: match[1]
                };
                newrelic.setTransactionName("v1/inbox/messages");
                return InboxMessagesController.get(req, res);
            } else if (match = url.match(InboxMessageMatcher2)) {
                // GET /v1/inbox/57e4181bc69a2845d977f7c0
                req.params = {
                    id: match[1]
                };
                newrelic.setTransactionName("v1/inbox/messages");
                return InboxMessagesController.get(req, res);
            } else if(match = url.match(InboxMatcher)) {
                newrelic.setTransactionName("v1/inbox");
                return InboxController.get(req, res);
            } else {
                return notFoundResponse(req, res);
            }
        });
    } else if(method == httpMethods.POST) {
       
        let match;
        // reverse logic since there is only 1 endpoint for post, slightly optimized
        if(match = url.match(EventsMatcher)) {
            let concatStream = concat({ encoding: 'string' },function(payload) {
                try {
                    req.payload = JSON.parse(payload);
                } catch(err) {
                    console.error(err);
                    res.writeHead(400, {
                    'Content-Type': 'application/json'
                    });
                    res.write(JSON.stringify({ errors: [ { message: "Not valid JSON" } ]}));
                    return res.end();
                }
                RoverApiAuth.authenticate(req, (authenticated) => {
                    if (!authenticated) {
                        return unauthenticatedResponse(req, res);
                    }
                    
                    return EventsController.create(req, res);
                });
            });
            // read data and pipe it to our stream
            req.on('data', function(chunk) { concatStream.write(chunk) }).on('end', function() { concatStream.end()} );
        } else {
            return notFoundResponse(req, res);
        }
        
    } else if(method == httpMethods.PATCH) {
        // Grab the body and parse the json
        let concatStream = concat({ encoding: 'string' },function(payload) {
            try {
                req.payload = JSON.parse(payload);
            } catch (err) {
                console.error(err);
                res.writeHead(400, {
                    'Content-Type': 'application/json'
                });
                res.write(JSON.stringify({ errors: [ { message: "Not valid JSON" } ]}));
                return res.end();
            }
            RoverApiAuth.authenticate(req, (authenticated) => {
                if (!authenticated) {
                    return unauthenticatedResponse(req, res);
                }
                let match;

                if(match = url.match(InboxMessageMatcher)) {
                    // GET /v1/inbox/messages/57e4181bc69a2845d977f7c0
                    req.params = {
                        id: match[1]
                    };
                    newrelic.setTransactionName("v1/inbox/messages");
                    return InboxMessagesController.update(req, res);
                } else if (match = url.match(InboxMessageMatcher2)) {
                    // GET /v1/inbox/57e4181bc69a2845d977f7c0
                    req.params = {
                        id: match[1]
                    };
                    newrelic.setTransactionName("v1/inbox/messages");
                    return InboxMessagesController.update(req, res);
                } else {
                    return notFoundResponse(req, res);
                }
            });
        });

        req.on('data', function(chunk) { concatStream.write(chunk) }).on('end', function() { concatStream.end()} );

    } else if(method == httpMethods.DELETE) { 
        RoverApiAuth.authenticate(req, (authenticated) => {
            if (!authenticated) {
                return unauthenticatedResponse(req, res);
            }

            let match;

            if(match = url.match(InboxMessageMatcher)) {
                // DELETE /v1/inbox/messages/57e4181bc69a2845d977f7c0
                req.params = {
                    id: match[1]
                };
                newrelic.setTransactionName("v1/inbox/messages");
                return InboxMessagesController.destroy(req, res);
            } else if (match = url.match(InboxMessageMatcher2)) {
                // DELETE /v1/inbox/57e4181bc69a2845d977f7c0
                req.params = {
                    id: match[1]
                };
                newrelic.setTransactionName("v1/inbox/messages");
                return InboxMessagesController.destroy(req, res);
            } else {
                return notFoundResponse(req, res);
            }
        });
    } else {
        return notFoundResponse(req, res);
    }
}

module.exports = function(server) {
    return route.bind(server);
};