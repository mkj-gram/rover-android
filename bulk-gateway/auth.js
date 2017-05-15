'use strict';

const util = require('util');
const internals = {};

// TODO: swap this out with the auth service implementation
internals.authenticate = function(request, callback) {

    const authorization = request.headers['x-rover-api-key']
    const postgres = request.server.connections.postgres.client

    if (!authorization) {
        return callback(new Error("Missing credentials"))
    }

  
    postgres.connect((err, client, done) => {
        if (err) {
            done();
            return callback(new Error("Could not find credentials"))
        }

        // Use a prepared statement to find the account
        client.query({
            text: 'SELECT  "accounts".* FROM "accounts" WHERE "accounts"."token" = $1 LIMIT 1',
            values: [ authorization ],
        }, function(err, result) {
            done();

            if (err) {
                return callback(new Error("Could not find credentials"))
            }

            const account = result.rows[0];

            if (!account) {
                return callback(new Error("Could not find credentials"))
            }

            return process.nextTick(function() {
                return callback(null, account) 
            })
        })
    })
};

module.exports = {
    authenticate: internals.authenticate
};