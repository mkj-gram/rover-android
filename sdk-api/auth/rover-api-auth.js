'use strict';


const util = require('util');
const TimedCache = require('../lib/timed-cache');

const RoverApis = require("@rover/apis");
const RoverAuth = require("@rover/auth-client");
const RoverAuthClient = RoverAuth.v1.Client()

const accountCache = new TimedCache();

const internals = {};


internals.authenticate = function(request, callback) {

    const authorization = request.headers['x-rover-api-key'];
    const postgres = request.server.connections.postgres.client;

    if (!authorization) {
        return callback(false, "Missing credentials");
    }

    // Check to see if this account is in the cache
    
    let cachedAccount = accountCache.get(authorization);

    if (util.isNullOrUndefined(cachedAccount)) {
        const authRequest = new RoverApis.auth.v1.Models.AuthenticateRequest();
        authRequest.setKey(authorization);

        // Ask the Auth Service to authenticate the token
        RoverAuthClient.authenticateToken(authRequest, function(err, AuthContext) {
            if (err) {
                console.log(err)
                return callback(false, "Could not find credentials");
            }
            
            const accountId = AuthContext.getAccountId();

            postgres.connect((err, client, done) => {
                if (err) {
                    done();
                    return callback(false, "Could not find credentials");
                }

                // Use a prepared statement to find the account
                client.query({
                    text: 'SELECT  "accounts".* FROM "accounts" WHERE "accounts"."id" = $1 LIMIT 1',
                    values: [accountId],
                    name: 'account-by-id'
                }, function(err, result) {
                    done();

                    if (err) {
                        return callback(false, "Could not find account");
                    }

                    const account = result.rows[0];

                    if (account) {
                        accountCache.set(authorization, { scopes: AuthContext.getPermissionScopesList(), account: account }, 5000);
                        request.auth = {
                            context: { 
                                scopes: AuthContext.getPermissionScopesList() 
                            },
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
                            context: { 
                                scopes: [] 
                            },
                            credentials: {}
                        };
                        
                        return process.nextTick(function() {
                            return callback(false);
                        });
                        
                    }

                });
            });
        })
    } else {
        // Token was previously authorized and is cached
        request.auth = {
            context: {
                scopes: cachedAccount.scopes
            },
            credentials: {
                account: cachedAccount.account
            }
        }

        return process.nextTick(function() {
            return callback(true)
        })
    }
};

module.exports = {
    authenticate: internals.authenticate
};