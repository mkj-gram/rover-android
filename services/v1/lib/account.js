'use strict';

const internals = {};


internals.find = function(id, callback) {
    const server = this;
    const postgres = server.plugins.postgres.client;

    postgres.connect((err, client, done) => {
        if (err) {
            callback(err);
        }

        // Use a prepared statement to find the account
        client.query({
            text: 'SELECT  "accounts".id FROM "accounts" WHERE "accounts"."id" = $1 LIMIT 1',
            values: [id],
            name: 'find-account-by-id'
        }, function(err, result) {
            done();

            if (err) {
                callback(err);
            }

            const account = result.rows[0];

            return callback(null, account);

        });
    });
};

internals.incrementCounter = function(id, column, incrementBy, callback) {
    const server = this;
    const postgres = server.plugins.postgres.client;
    const logger = server.plugins.logger.logger;

    logger.debug('Service: [account.incrementCounter] id: ' + id + ' column: ' + column + ' by: ' + incrementBy);

    postgres.connect((err, client, done) => {
        if (err) {
            callback(err);
        }

        // Use a prepared statement to find the account
        client.query({
            text: `UPDATE "accounts" SET "${column}" = COALESCE("${column}", 0) + $1 WHERE "accounts"."id" = $2`,
            values: [incrementBy, id],
            name: `account-increment-counter-${column}-by-id`
        }, function(err, result) {
            done();

            if (err) {
                callback(err);
            }

            const account = result.rows[0];

            return callback(null, account);

        });
    });
};

internals.decrementCounter = function(id, column, decrementBy, callback) {
    const server = this;
    const postgres = server.plugins.postgres.client;
    const logger = server.plugins.logger.logger;

    logger.debug('Service: [account.decrementCounter] id: ' + id + ' column: ' + column + ' by: ' + decrementBy);

    postgres.connect((err, client, done) => {
        if (err) {
            callback(err);
        }

        // Use a prepared statement to find the account
        client.query({
            text: `UPDATE "accounts" SET "${column}" = COALESCE("${column}", 0) - $1 WHERE "accounts"."id" = $2`,
            values: [decrementBy, id],
            name: `account-decrement-counter-${column}-by-id`
        }, function(err, result) {
            done();

            if (err) {
                callback(err);
            }

            const account = result.rows[0];

            return callback(null, account);

        });
    });
};

module.exports = {
    find: internals.find,
    incrementCounter: internals.incrementCounter,
    decrementCounter: internals.decrementCounter
};
