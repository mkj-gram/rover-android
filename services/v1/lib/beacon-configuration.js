'use strict';

const internals = {};


internals.findById = function(id, callback) {
    const server = this;
    const postgres = server.plugins.postgres.client;

    postgres.connect((err, client, done) => {
        if (err) {
            return callback(err);
        }

        client.query({
            text: 'SELECT  "beacon_configurations".* FROM "beacon_configurations" WHERE "beacon_configurations"."id" = $1 LIMIT 1',
            values: [id],
            name: 'find-beacon-configuration-by-id'
        }, function(err, result) {
            done();

            if (err) {
                return callback(err);
            }

            const beaconConfiguration = result.rows[0];

            return callback(null, beaconConfiguration);

        });
    });
};


internals.findByIBeaconProtocol = function(accountId, uuid, majorNumber, minorNumber, callback) {
    const server = this;
    const postgres = server.plugins.postgres.client;
    const logger = server.plugins.logger.logger;

    logger.debug(`Service: [beaconConfiguration.findByIBeaconProtocol] account_id: ${accountId} uuid: ${uuid} major: ${majorNumber} minor: ${minorNumber}`);

    postgres.connect((err, client, done) => {
        if (err) {
            return callback(err);
        }

        client.query({
            text: 'SELECT  "beacon_configurations".* FROM "beacon_configurations" WHERE "beacon_configurations"."type" IN (\'IBeaconConfiguration\') AND "beacon_configurations"."account_id" = $1 AND "beacon_configurations"."uuid" = $2 AND "beacon_configurations"."major" = $3 AND "beacon_configurations"."minor" = $4 LIMIT 1',
            values: [accountId, uuid, majorNumber, minorNumber],
            name: 'find-beacon-configuration-by-ibeacon-protocol'
        }, function(err, result) {
            done();

            if (err) {
                return callback(err);
            }

            const beaconConfiguration = result.rows[0];

            return callback(null, beaconConfiguration);

        });
    });
};



internals.findByEddystoneNamespaceProtocol = function(accountId, uuid, majorNumber, minorNumber, callback) {
    const server = this;
    const postgres = server.plugins.postgres.client;
    const logger = server.plugins.logger.logger;

    logger.debug(`Service: [beaconConfiguration.findByEddystoneNamespaceProtocol] account_id: ${accountId} `);
    postgres.connect((err, client, done) => {
        if (err) {
            return callback(err);
        }

        client.query({
            text: 'SELECT  "beacon_configurations".* FROM "beacon_configurations" WHERE "beacon_configurations"."type" IN (\'IBeaconConfiguration\') AND "beacon_configurations"."account_id" = $1 AND "beacon_configurations"."uuid" = $2 AND "beacon_configurations"."major" = $3 AND "beacon_configurations"."minor" = $4 LIMIT 1',
            values: [accountId, uuid, majorNumber, minorNumber],
            name: 'find-beacon-configuration-by-ibeacon-protocol'
        }, function(err, result) {
            done();

            if (err) {
                return callback(err);
            }

            const beaconConfiguration = result.rows[0];

            return callback(null, beaconConfiguration);

        });
    });
};

module.exports = {
    findById: internals.findById,
    findByIBeaconProtocol: internals.findByIBeaconProtocol,
    findByEddystoneNamespaceProtocol: internals.findByEddystoneNamespaceProtocol
};
