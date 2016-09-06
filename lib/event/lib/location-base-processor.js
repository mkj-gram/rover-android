const util = require('util');
const BaseProcessor = require('./base-processor');
const log4js = require('log4js');
const logger = log4js.getLogger('[LocationBaseProcessor]');

const IOS_DEVICE_PLATFORM = 'iOS';

let internals = {};

internals.needsUpdate = function() {

};

internals.ibeaconWildcardRegions = function() {

};

class LocationBaseProcessor extends BaseProcessor {

	constructor(args) {
		super(args);
		
		this._longitude = args.input.longitude;
		this._latitude = args.input.latitude;
		this._accuracy = args.input.accuracy || args.input.radius;
		if (this._device.platform == IOS_DEVICE_PLATFORM) {
			this._regionLimit = 20;
		} else {
			this._regionLimit = 100;
		}
		
	}

	initialize(callback) {
		// use this to check if we need to change geofence regions
		// and update the device
		this._iBeaconWildcardRegions((err, beaconRegions) => {
			if (err) {
				return callback(err);
			}

			this._beaconRegionsMonitoring = beaconRegions;
			
			// TODO
			//  update the devices beacon regions monitoring for
			this._closestGeofenceRegions(this._regionLimit - this._beaconRegionsMonitoring.length, (err, geofenceRegions) => {
				if (err) {
					return callback(err);
				}

				this._geofenceRegionsMonitoring = geofenceRegions;

				return callback(null);
			});
		});
	}
	
	toResponse() {
		let json = super.toResponse();

		if (util.isNullOrUndefined(json.included)) {
			json.included = [];
		}

		if (this._beaconRegionsMonitoring) {
			let beaconRegionsResponse = this._beaconRegionsMonitoring.map((beaconRegion) => {
				return {
					type: 'ibeacon-regions',
					id: beaconRegion.uuid,
					attributes: {
						uuid: beaconRegion.uuid,
						'major-number': null,
						'minor-number': null
					}
				}
			});

			json.included = json.included.concat(beaconRegionsResponse);
		}

		if (this._geofenceRegionsMonitoring) {
			let geofenceRegionsResponse = this._geofenceRegionsMonitoring.map((geofenceRegion) => {
				return {
					type: 'geofence-regions',
					id: `${geofenceRegion.latitude}:${geofenceRegion.longitude}:${geofenceRegion.radius}`,
					attributes: {
						latitude: geofenceRegion.latitude,
						longitude: geofenceRegion.longitude,
						radius: geofenceRegion.radius
					}
				}
			});

			json.included = json.included.concat(geofenceRegionsResponse);
		}

		return json;
	}


	_iBeaconWildcardRegions(callback) {
		if (this._device.platform != IOS_DEVICE_PLATFORM) {
			return callback(null, []);
		}

		let methods = this._server.methods;

		methods.activeConfigurationUUID.findByAccountId(this._account.id, (err, activeUUIDs) => {
			if (err) {
				// don't error out if we can look up
				console.error(err);
				return callback(null, []);
			}

			let uuids = activeUUIDs.configuration_uuids;
			let beaconRegions = uuids.map((uuid) => {
				return { uuid: uuid, 'major-number': null, 'minor-number': null }
			});

			return callback(null, beaconRegions);
		});
	}

	_closestGeofenceRegions(limit = 20, callback) {

		if (util.isNullOrUndefined(this._longitude) || util.isNullOrUndefined(this._latitude)) {
			return callback(null, null);
		}

		const query = {
			size: limit,
			filter: {
				term: {
					account_id: this._account.id
				}
			},
			sort: [
				{
					'_geo_distance': {
						location: {
							lat: this._latitude,
							lon: this._longitude
						},
						order: 'asc',
						unit: 'km',
						distance_type: 'plane'
					}
				}
			]
		}

		let elasticsearch = this._server.plugins.elasticsearch.client;
		elasticsearch.search({ index: 'places', type: 'place', body: query }, (err, response) => {
			if (err) {
				return callback(err);
			}

			let places = response.hits.hits;
			
			let geofenceRegions = places.map((place) => {
				return { latitude: place._source.location.lat, longitude: place._source.location.lon, radius: place._source.radius }
			});

			return callback(null, geofenceRegions);
		});
	}
}

module.exports = LocationBaseProcessor;
