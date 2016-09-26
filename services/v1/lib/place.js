'use strict';

const internals = {};


internals.findById = function(id, callback) {

    const server = this;
    const postgres = server.connections.postgres.client;

    postgres.connect((err, client, done) => {
        if (err) {
            callback(err);
        }

        client.query({
            text: 'SELECT  "places".* FROM "places" WHERE "places"."id" = $1 LIMIT 1',
            values: [id],
            name: 'find-place-by-id'
        }, function(err, result) {
            done();

            if (err) {
                return callback(err);
            }

            const place = result.rows[0];

            return callback(null, place);

        });
    });
};

internals.findByCoordinates = function(latitude, longitude, callback) {
    const server = this;
    const postgres = server.connections.postgres.client;

    postgres.connect((err, client, done) => {
        if (err) {
            callback(err);
        }

        client.query({
            text: 'SELECT  "places".* FROM "places" WHERE "places"."latitude" = $1 AND "places"."longitude" = $2 LIMIT 1',
            values: [latitude, longitude],
            name: 'find-place-by-coordinates'
        }, function(err, result) {
            done();

            if (err) {
                return callback(err);
            }

            const place = result.rows[0];

            return callback(null, place);

        });
    });
}


module.exports = {
    findById: internals.findById,
    findByCoordinates: internals.findByCoordinates
};
