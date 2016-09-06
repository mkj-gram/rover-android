const Joi = require('joi');

const moment = require('moment');
const util = require('util');

// Processors
const EventProcessor = require('./lib/event-processor');
const BaseProcessor = require('./lib/base-processor');
const BeaconRegionBaseProcessor = require('./lib/beacon-region-base-processor');
const GeofenceRegionBaseProcessor = require('./lib/geofence-region-base-processor');
const LocationBaseProcessor = require('./lib/location-base-processor');

const ProcessorMap = {
    "default": BaseProcessor,
    "beacon-region": {
        "enter": BeaconRegionBaseProcessor,
        "exit": BeaconRegionBaseProcessor
    },
    "geofence-region": {
        "enter": GeofenceRegionBaseProcessor,
        "exit": GeofenceRegionBaseProcessor
    },
    "location": {
        "update": LocationBaseProcessor
    }
};

EventProcessor.initializeProcessorMap(ProcessorMap);

module.exports = {
    init: function(args) {
        return new EventProcessor.map(args);
    }
};
