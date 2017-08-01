'use strict';
const util = require('util');
const moment = require('moment');
const DAYNAMES = new Array("sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday");

const BEACON_TRIGGERED_QUERIES = {};
const GEOFENCE_TRIGGERED_QUERIES = {};
const GIMBAL_PLACE_TRIGGERED_QUERIES = {};
const XENIO_ZONE_TRIGGERED_QUERIES = {};
const XENIO_PLACE_TRIGGERED_QUERIES = {};


DAYNAMES.forEach((dayname) => {
    BEACON_TRIGGERED_QUERIES[dayname] = {
        text: `SELECT "message_templates".* FROM "message_templates" WHERE
                            "message_templates".type IN ('ProximityMessageTemplate')
                            AND "message_templates".published = true
                            AND "message_templates".account_id = $1 
                            AND "message_templates".trigger_event_id = $2 
                            AND $3::int <@ "message_templates".time_schedule 
                            AND $4::int <@ "message_templates".date_schedule 
                            AND schedule_${dayname} = true
                            AND ("message_templates".filter_beacon_configuration_ids = '{}'::int[] OR $5::int[] <@ "message_templates".filter_beacon_configuration_ids)
                            AND ("message_templates".filter_beacon_configuration_tags = '{}'::character varying[] OR $6::character varying[] @> "message_templates".filter_beacon_configuration_tags)
                            AND ("message_templates".filter_place_ids = '{}'::int[] OR $7::int[] <@ "message_templates".filter_place_ids)
                            AND ("message_templates".filter_place_tags = '{}'::character varying[] OR $8::character varying[] @> "message_templates".filter_place_tags)`,
        name: `beacon-triggered-proximity-messages-for-${dayname}`
    }
});


DAYNAMES.forEach((dayname) => {
    GEOFENCE_TRIGGERED_QUERIES[dayname] = {
        text: `SELECT "message_templates".* FROM "message_templates" WHERE
                            "message_templates".type IN ('ProximityMessageTemplate')
                            AND "message_templates".published = true
                            AND "message_templates".account_id = $1 
                            AND "message_templates".trigger_event_id = $2 
                            AND $3::int <@ "message_templates".time_schedule 
                            AND $4::int <@ "message_templates".date_schedule 
                            AND schedule_${dayname} = true
                            AND ("message_templates".filter_place_ids = '{}'::int[] OR $5::int[] <@ "message_templates".filter_place_ids)
                            AND ("message_templates".filter_place_tags = '{}'::character varying[] OR $6::character varying[] @> "message_templates".filter_place_tags)`,
        name: `geofence-triggered-proximity-messages-for-${dayname}`
    }
});


DAYNAMES.forEach((dayname) => {
    GIMBAL_PLACE_TRIGGERED_QUERIES[dayname] = {
        text: `SELECT "message_templates".* FROM "message_templates" WHERE
                            "message_templates".type IN ('ProximityMessageTemplate')
                            AND "message_templates".published = true
                            AND "message_templates".account_id = $1 
                            AND "message_templates".trigger_event_id = $2 
                            AND $3::int <@ "message_templates".time_schedule 
                            AND $4::int <@ "message_templates".date_schedule 
                            AND schedule_${dayname} = true
                            AND ("message_templates".filter_gimbal_place_id = '{}'::int[] OR $5::int[] <@ "message_templates".filter_place_ids)`,
        name: `gimbal-place-triggered-proximity-messages-for-${dayname}`
    }
});

DAYNAMES.forEach((dayname) => {
    XENIO_ZONE_TRIGGERED_QUERIES[dayname] = {
        text: `SELECT "message_templates".* FROM "message_templates" WHERE
                            "message_templates".type IN ('ProximityMessageTemplate')
                            AND "message_templates".published = true
                            AND "message_templates".account_id = $1 
                            AND "message_templates".trigger_event_id = $2 
                            AND $3::int <@ "message_templates".time_schedule 
                            AND $4::int <@ "message_templates".date_schedule 
                            AND schedule_${dayname} = true
                            AND ("message_templates".filter_xenio_zone_ids = '{}'::int[] OR $5::int[] <@ "message_templates".filter_xenio_zone_ids)
                            AND ("message_templates".filter_xenio_zone_tags = '{}'::character varying[] OR $6::character varying[] @> "message_templates".filter_xenio_zone_tags)
                            AND ("message_templates".filter_xenio_place_ids = '{}'::int[] OR $7::int[] <@ "message_templates".filter_xenio_place_ids)
                            AND ("message_templates".filter_xenio_place_tags = '{}'::character varying[] OR $8::character varying[] @> "message_templates".filter_xenio_place_tags)`,
        name: `xenio-zone-triggered-proximity-messages-for-${dayname}`
    }
});

DAYNAMES.forEach((dayname) => {
    XENIO_PLACE_TRIGGERED_QUERIES[dayname] = {
        text: `SELECT "message_templates".* FROM "message_templates" WHERE
                            "message_templates".type IN ('ProximityMessageTemplate')
                            AND "message_templates".published = true
                            AND "message_templates".account_id = $1 
                            AND "message_templates".trigger_event_id = $2 
                            AND $3::int <@ "message_templates".time_schedule 
                            AND $4::int <@ "message_templates".date_schedule 
                            AND schedule_${dayname} = true
                            AND ("message_templates".filter_xenio_place_ids = '{}'::int[] OR $5::int[] <@ "message_templates".filter_xenio_place_ids)
                            AND ("message_templates".filter_xenio_place_tags = '{}'::character varying[] OR $6::character varying[] @> "message_templates".filter_xenio_place_tags)`,
        name: `xenio-place-triggered-proximity-messages-for-${dayname}`
    }
});

const internals = {};

internals.minutesSinceMidnight = function(timestamp) {
    let midnight = moment(timestamp).startOf('day');
    return moment(timestamp).diff(midnight, 'minutes');
};

internals.beginningOfDayAsUnixTimestamp = function(timestamp) {
    return moment(timestamp).startOf('day').unix();
};

internals.getDay = function(timestamp) {
    let day = moment(timestamp).day();
    if (util.isNullOrUndefined(day)) {
        day = moment(Date.now()).day()
    }
    return DAYNAMES[day];
};


internals.beaconTriggered = function(accountId, triggerId, timestamp, beaconConfiguration, place, callback) {
    const server = this;
    const postgres = server.connections.postgres.client;
    const logger = server.plugins.logger.logger;

    logger.debug(util.format("%s %j %j", `Service: [proximityMessage.beaconTriggered] account_id: ${accountId} triggerId: ${triggerId} timestamp: ${moment(timestamp).format()}`, beaconConfiguration, place));

    if (util.isNullOrUndefined(beaconConfiguration)) {
        return callback(null, []);
    }
    
    if (util.isNullOrUndefined(place)) {
        place = {};
    }

    postgres.connect((err, client, done) => {
        if (err) {
            return callback(err);
        }

        var values = [
            accountId, // $1
            triggerId, // $2
            internals.minutesSinceMidnight(timestamp), // $3
            internals.beginningOfDayAsUnixTimestamp(timestamp), // $4
            [beaconConfiguration.id], // $5
            beaconConfiguration.tags || [], // $6
            [place.id], // $7
            place.tags || [] // $8
        ];

        logger.debug(BEACON_TRIGGERED_QUERIES[currentDayName].text, values)

        let currentDayName = internals.getDay(timestamp);
        
        client.query({
            text: BEACON_TRIGGERED_QUERIES[currentDayName].text,
            name: BEACON_TRIGGERED_QUERIES[currentDayName].name,
            values: values
        }, function(err, result) {
            done();

            if (err) {
                return callback(err);
            }

            const messages = result.rows;

            return callback(null, messages);

        });
    });
};

internals.geofenceTriggered = function(accountId, triggerId, timestamp, place, callback) {
    const server = this;
    const postgres = server.connections.postgres.client;
    const logger = server.plugins.logger.logger;

    if (util.isNullOrUndefined(place)) {
        return callback(null, []);
    }

    postgres.connect((err, client, done) => {
        if (err) {
            return callback(err);
        }

        let values = [
            accountId, // $1
            triggerId, // $2
            internals.minutesSinceMidnight(timestamp), // $3
            internals.beginningOfDayAsUnixTimestamp(timestamp), // $4
            [place.id], // $5
            place.tags || [] // $6
        ];

        let currentDayName = internals.getDay(timestamp);

        logger.debug(GEOFENCE_TRIGGERED_QUERIES[currentDayName].text, values)

        client.query({
            text: GEOFENCE_TRIGGERED_QUERIES[currentDayName].text,
            name: GEOFENCE_TRIGGERED_QUERIES[currentDayName].name,
            values: values
        }, function(err, result) {
            done();

            if (err) {
                return callback(err);
            }

            const messages = result.rows;
            return callback(null, messages);

        });
    });
};

internals.gimbalPlaceTriggered = function(accountId, triggerId, timestamp, gimbalPlace, callback) {
    const server = this;
    const postgres = server.connections.postgres.client;
    const logger = server.plugins.logger.logger;

    if (util.isNullOrUndefined(gimbalPlace)) {
        return callback(null, []);
    }

    postgres.connect((err, client, done) => {
        if (err) {
            return callback(err);
        }

        let values = [
            accountId, // $1
            triggerId, // $2
            internals.minutesSinceMidnight(timestamp), // $3
            internals.beginningOfDayAsUnixTimestamp(timestamp), // $4
            [gimbalPlace.id] // $5
        ];

        let currentDayName = internals.getDay(timestamp);
        
        logger.debug(GIMBAL_PLACE_TRIGGERED_QUERIES[currentDayName].text, values)

        client.query({
            text: GIMBAL_PLACE_TRIGGERED_QUERIES[currentDayName].text,
            name: GIMBAL_PLACE_TRIGGERED_QUERIES[currentDayName].name,
            values: values
        }, function(err, result) {
            done();

            if (err) {
                return callback(err);
            }

            const messages = result.rows;

            return callback(null, messages);

        });
    });
};

internals.xenioZoneTriggered = function(accountId, triggerId, timestamp, xenioZone, xenioPlace, callback) {
    const server = this;
    const postgres = server.connections.postgres.client;
    const logger = server.plugins.logger.logger;

    logger.debug(util.format("%s %j %j", `Service: [proximityMessage.xenioZoneTriggered] account_id: ${accountId} triggerId: ${triggerId} timestamp: ${moment(timestamp).format()}`, xenioZone, xenioPlace));

    if (util.isNullOrUndefined(xenioZone)) {
        return callback(null, []);
    }
    
    if (util.isNullOrUndefined(xenioPlace)) {
        xenioPlace = {};
    }

    postgres.connect((err, client, done) => {
        if (err) {
            return callback(err);
        }

        var values = [
            accountId, // $1
            triggerId, // $2
            internals.minutesSinceMidnight(timestamp), // $3
            internals.beginningOfDayAsUnixTimestamp(timestamp), // $4
            [xenioZone.id], // $5
            xenioZone.tags || [], // $6
            [xenioPlace.id], // $7
            xenioPlace.tags || [] // $8
        ];

        let currentDayName = internals.getDay(timestamp);
        
        logger.debug(XENIO_ZONE_TRIGGERED_QUERIES[currentDayName].text, values)

        client.query({
            text: XENIO_ZONE_TRIGGERED_QUERIES[currentDayName].text,
            name: XENIO_ZONE_TRIGGERED_QUERIES[currentDayName].name,
            values: values
        }, function(err, result) {
            done();

            if (err) {
                return callback(err);
            }

            const messages = result.rows;

            return callback(null, messages);

        });
    });
};

internals.xenioPlaceTriggered = function(accountId, triggerId, timestamp, xenioPlace, callback) {
    const server = this;
    const postgres = server.connections.postgres.client;
    const logger = server.plugins.logger.logger;
    
    if (util.isNullOrUndefined(xenioPlace)) {
        return callback(null, []);
    }

    postgres.connect((err, client, done) => {
        if (err) {
            return callback(err);
        }

        let values = [
            accountId, // $1
            triggerId, // $2
            internals.minutesSinceMidnight(timestamp), // $3
            internals.beginningOfDayAsUnixTimestamp(timestamp), // $4
            [xenioPlace.id], // $5
            xenioPlace.tags || [] // $6
        ];

        let currentDayName = internals.getDay(timestamp);

        logger.debug(XENIO_PLACE_TRIGGERED_QUERIES[currentDayName].text, values)

        client.query({
            text: XENIO_PLACE_TRIGGERED_QUERIES[currentDayName].text,
            name: XENIO_PLACE_TRIGGERED_QUERIES[currentDayName].name,
            values: values
        }, function(err, result) {
            done();

            if (err) {
                return callback(err);
            }

            const messages = result.rows;
            return callback(null, messages);

        });
    });
};

module.exports = {
    beaconTriggered: internals.beaconTriggered,
    geofenceTriggered: internals.geofenceTriggered,
    gimbalPlaceTriggered: internals.gimbalPlaceTriggered,
    xenioZoneTriggered: internals.xenioZoneTriggered,
    xenioPlaceTriggered: internals.xenioPlaceTriggered
}