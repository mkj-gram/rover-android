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
            text: 'SELECT "xenio_zones".* FROM "xenio_zones" WHERE "xenio_zones"."xenio_id" = $1 AND "xenio_zones"."account_id" = $2 LIMIT 1',
            values: [id, accountId],
            name: 'find-xenio-zone-by-id'
        }, function(err, result) {
            done();

            if (err) {
                return callback(err);
            }

            const xenioZone = result.rows[0];

            return callback(null, xenioZone);

        });
    });
};

module.exports = {
    findById: internals.findById
};
