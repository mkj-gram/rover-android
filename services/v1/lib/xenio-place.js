'use strict';

const internals = {};


internals.findById = function(accountId, id, callback) {
    const server = this;
    const postgres = server.connections.postgres.client;

    postgres.connect((err, client, done) => {
        if (err) {
            return callback(err);
        }

        client.query({
            text: 'SELECT "xenio_places".* FROM "xenio_places" WHERE "xenio_places"."xenio_id" = $1 AND "xenio_places"."account_id" = $2 LIMIT 1',
            values: [id, accountId],
            name: 'find-xenio-place-by-id'
        }, function(err, result) {
            done();

            if (err) {
                return callback(err);
            }

            const xenioPlace = result.rows[0];

            return callback(null, xenioPlace);

        });
    });
};

module.exports = {
    findById: internals.findById
};
