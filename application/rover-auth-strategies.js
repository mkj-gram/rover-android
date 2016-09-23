'use strict';

const validateToken = (request, token, callback) => {

    const postgres = request.server.plugins.postgres.client;

    postgres.connect((err, client, done) => {
        if (err) {
            callback(err, false);
        }

        // Use a prepared statement to find the account
        client.query({
            text: 'SELECT  "accounts".* FROM "accounts" WHERE "accounts"."token" = $1 LIMIT 1',
            values: [token],
            name: 'account-by-token'
        }, function(err, result) {
            done();

            if (err) {
                callback(err, false);
            }

            const account = result.rows[0];

            if (account) {
                return callback(null, true, { account: account });
            } else {
                return callback(null, false);
            }

        });
    });

};

const validateDeviceId = (request, deviceId, callback) => {
    const mongo = request.server.connections.mongodb.client;


    callback(null, false);

};

module.exports.register = function(server, connectionOptions, next) {

    server.auth.strategy('rover-token', 'rover-api-auth', {
        validateFunc: validateToken
    });

    server.auth.default('rover-token');
    next();
};

module.exports.register.attributes = {
    name: 'rover-auth-strategies'
};