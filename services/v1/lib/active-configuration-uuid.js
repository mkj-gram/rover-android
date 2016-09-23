'use strict';

const internals = {};


internals.findByAccountId = function(id, callback) {
    const server = this;
    const postgres = server.connections.postgres.client;

    postgres.connect((err, client, done) => {
        if (err) {
            callback(err);
        }

        client.query({
            text: 'SELECT  "active_configuration_uuids".* FROM "active_configuration_uuids" WHERE "active_configuration_uuids"."type" IN (\'ActiveIBeaconConfigurationUuid\') AND "active_configuration_uuids"."account_id" = $1 LIMIT 1',
            values: [id],
            name: 'find-active-configuration-uuids-by-account-id'
        }, function(err, result) {
            done();

            if (err) {
                return callback(err);
            }

            const activeUUIDS = result.rows[0];

            return callback(null, activeUUIDS);

        });
    });
};


module.exports = {
    findByAccountId: internals.findByAccountId,
};

