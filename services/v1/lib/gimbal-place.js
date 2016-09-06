'use strict';

const internals = {};


internals.findByAccountIdAndGimbalPlaceId = function(accountId, id, callback) {
	const server = this;
	const postgres = server.plugins.postgres.client;

	postgres.connect((err, client, done) => {
		if (err) {
			return callback(err);
		}

		client.query({
			text: 'SELECT  "gimbal_places".* FROM "gimbal_places" WHERE "gimbal_places"."account_id" = $1 AND "gimbal_places"."id" = $2 LIMIT 1',
			values: [accountId, id],
			name: 'find-gimbal-place-by-account-id-and-gimbal-place-id'
		}, function(err, result) {
			done();

			if (err) {
				return callback(err);
			}

			const gimbalPlace = result.rows[0];

			return callback(null, gimbalPlace);

		});
	});
};

module.exports = {
	findByAccountIdAndGimbalPlaceId: internals.findByAccountIdAndGimbalPlaceId,
};
