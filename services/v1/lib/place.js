'use strict';
const util = require('util');
const internals = {};
const LRU = require('lru-cache');
const radPerDeg = Math.PI / 180.0;

const placeLruOptions = { 
    max: 2430000, // can store up to 2.43 MB
    length: function(n, key) { return n.length * 405 } // return the array length * average object size of a place
};

const placeLruCache = LRU(placeLruOptions);


internals.parsePlace = function(place) {
    if (!util.isNullOrUndefined(place.longitude)) {
        place.longitude = parseFloat(place.longitude);
    }

    if (!util.isNullOrUndefined(place.latitude)) {
        place.latitude = parseFloat(place.latitude);
    }

    return place;
};

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

            const place = internals.parsePlace(result.rows[0]);

            return callback(null, place);

        });
    });
};

internals.findAll = function(account, callback) {
    const server = this;
    const postgres = server.connections.postgres.client;

    postgres.connect((err, client, done) => {
        if (err) {
            callback(err);
        }

        client.query({
            text: 'SELECT  "places".* FROM "places" WHERE "places"."account_id" = $1',
            values: [account.id],
            name: 'find-all-places-by-account-id'
        }, function(err, result) {
            done();

            if (err) {
                return callback(err);
            }

            const places = result.rows;

            for (var i = places.length - 1; i >= 0; i--) {
                internals.parsePlace(places[i]);
            }

            return callback(null, places);

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

            const place = internals.parsePlace(result.rows[0])

            return callback(null, place);

        });
    });
};

internals.closestPlaces = function(account, latitude, longitude, limit = 100, callback) {
    const server = this;

    let cacheKey = `${account.id}-${account.places_updated_at.getTime()}`
    console.log(cacheKey);
    if (!placeLruCache.has(cacheKey)) {
        // find all places
        server.methods.place.findAll(account, (err, places) => {
            if (err) {
                return callback(err);
            }
            placeLruCache.set(cacheKey, places);
            return internals.sortedPlacesByDistance(places, latitude, longitude, limit, callback)
        });
    } else {
        let places = placeLruCache.get(cacheKey);
        
        return internals.sortedPlacesByDistance(places, latitude, longitude, limit, callback);
    }
};

internals.sortedPlacesByDistance = function(places, latitude, longitude, limit, callback) {
    // since built in sort function doesn't cache results we need cache the distance computation
    let distanceCache = {};
    // copy the array we don't want to mutate it
    let placesCopy = places.slice();

    placesCopy.sort(place => {
        if (distanceCache[place.id]) {
            return distanceCache[place.id];
        } else {
            let distance = internals.getDistance(latitude, longitude, place.latitude, place.longitude);
            distanceCache[place.id] = distance;
            return distance;
        }
    });
    
    return callback(null, placesCopy.slice(0, limit));
};


internals.getDistance = function(fromLatitude, fromLongitude, toLatitude, toLongitude) {
    let dlatRad = (toLatitude - fromLatitude) * radPerDeg;
    let dlngRad = (toLongitude - fromLongitude) * radPerDeg;

    let lat1Rad = fromLatitude * radPerDeg;
    let lat2Rad = toLatitude * radPerDeg;

    let lng1Rad = fromLongitude * radPerDeg;
    let lng2Rad = toLongitude * radPerDeg;

    let a = Math.pow(Math.sin(dlatRad / 2.0), 2) + Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.pow(Math.sin(dlngRad / 2.0), 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    let distance =  6371000 * c;

    return distance;
};

module.exports = {
    findById: internals.findById,
    findAll: internals.findAll,
    findByCoordinates: internals.findByCoordinates,
    closestPlaces: internals.closestPlaces
};
