'use strict';

const Hoek = require('hoek');
const Boom = require('boom');

const internals = {};


internals.authenticate = function(request, callback) {

    const authorization = request.headers['x-rover-api-key'];
    const postgres = request.server.connections.postgres.client;

    if (!authorization) {
        return callback(false, "Missing credentials");
    }

    postgres.connect((err, client, done) => {
        if (err) {
            done();
            return callback(false, "Could not find credentials");
        }

        // Use a prepared statement to find the account
        client.query({
            text: 'SELECT  "accounts".* FROM "accounts" WHERE "accounts"."token" = $1 LIMIT 1',
            values: [authorization],
            name: 'account-by-token'
        }, function(err, result) {
            done();

            if (err) {
                return callback(false, "Could not find credentials");
            }

            const account = result.rows[0];

            if (account) {
                request.auth = {
                    credentials: {
                        account: account
                    }
                };
                return callback(true);
            } else {
                request.auth = {
                    credentials: {}
                };
                return callback(false);
            }

        });
    });
};

module.exports = {
    authenticate: internals.authenticate
};