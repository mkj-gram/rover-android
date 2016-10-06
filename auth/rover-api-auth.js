'use strict';

const util = require('util');
const LRU = require("lru-cache");
const cacheOptions = {
    max: 500,
    length: function(n, key) {
        return 1;
    },
    maxAge: 60000
}

var accountCache = LRU(options);

const internals = {};


internals.authenticate = function(request, callback) {

    const authorization = request.headers['x-rover-api-key'];
    const postgres = request.server.connections.postgres.client;

    if (!authorization) {
        return callback(false, "Missing credentials");
    }

    let cachedAccount = accountCache.get(authorization);

    if (util.isNullOrUndefined(cachedAccount)) {
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
                    accountCache.set(authorization, account);
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
    } else {
        request.auth = {
            credentials: {
                account: cachedAccount
            }
        };
        return callback(true);
    }
};

module.exports = {
    authenticate: internals.authenticate
};