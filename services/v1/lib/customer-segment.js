'use strict';

const internals = {};


internals.findById = function(id, callback) {
	const server = this;
	const postgres = server.plugins.postgres.client;

	postgres.connect((err, client, done) => {
		if (err) {
			callback(err);
		}
		
		client.query({
			text: 'SELECT  "customer_segments".* FROM "customer_segments" WHERE "customer_segments"."id" = $1 LIMIT 1',
			values: [id],
			name: 'find-customer-segment-by-id'
		}, function(err, result) {
			done();

			if (err) {
				callback(err);
			}

			const customerSegment = result.rows[0];

			return callback(null, customerSegment);

		});
	});
};

module.exports = {
	findById: internals.findById
}