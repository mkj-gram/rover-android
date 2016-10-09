'use strict';

const util = require('util');
const TimedCache = require('../lib/timed-cache');

const accountCache = new TimedCache();

const internals = {};


internals.authenticate = function(request, callback) {

    const authorization = request.headers['x-rover-api-key'];
    const postgres = request.server.connections.postgres.client;

    if (!authorization) {
        return callback(false, "Missing credentials");
    }

    let cachedAccount = accountCache.get(authorization);

    if (util.isNullOrUndefined(cachedAccount)) {
        console.log("Not Cached");
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
                    accountCache.set(authorization, account, 60000);
                    request.auth = {
                        credentials: {
                            account: account
                        }
                    };

                    process.nextTick(function() {
                        return callback(true);
                    });
                    return;
                } else {
                    request.auth = {
                        credentials: {}
                    };
                    process.nextTick(function() {
                        return callback(false);
                    });
                    return;
                }

            });
        });
    } else {
        request.auth = {
            credentials: {
                account: cachedAccount
            }
        };
        process.nextTick(function() {
            return callback(true);
        });
        return;
    }
};

module.exports = {
    authenticate: internals.authenticate
};