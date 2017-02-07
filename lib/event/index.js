const Joi = require('joi');

const moment = require('moment');
const util = require('util');

// Processors
const EventProcessor = require('./lib/event-processor');
const BaseProcessor = require('./lib/base-processor');
const BeaconRegionBaseProcessor = require('./lib/beacon-region-base-processor');
const GeofenceRegionBaseProcessor = require('./lib/geofence-region-base-processor');
const LocationBaseProcessor = require('./lib/location-base-processor');
const AppBaseProcessor = require('./lib/app-base-processor');
const MessageBaseProcessor = require('./lib/message-base-processor');
const GimbalPlaceBaseProcessor = require('./lib/gimbal-place-base-processor');
const ExperienceBaseProcessor = require('./lib/experience-base-processor');
const XenioZoneBaseProcessor = require('./lib/xenio-zone-base-processor');
const XenioPlaceBaseProcessor = require('./lib/xenio-place-base-processor');
// Sub Processors
// This should only perform callbacks and should not modify the state record
const MessageOpenedProcessor = require('./lib/message-sub-processors/message-opened-processor');
const ExperienceBlockClickedProcessor = require('./lib/experience-sub-processors/experience-block-clicked-processor');
const ExperienceScreenViewedProcessor = require('./lib/experience-sub-processors/experience-screen-viewed-processor');

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
    },
    "app": {
        "open": AppBaseProcessor,
        "close": AppBaseProcessor
    },
    "message": {
        "open": MessageOpenedProcessor,
        "added-to-inbox": MessageBaseProcessor,
        "deleted": MessageBaseProcessor
    },
    "gimbal-place": {
        "enter": GimbalPlaceBaseProcessor,
        "exit": GimbalPlaceBaseProcessor
    },
    "experience": {
        "launched": ExperienceBaseProcessor,
        "dismissed": ExperienceBaseProcessor,
        "screen-viewed": ExperienceScreenViewedProcessor,
        "block-clicked": ExperienceBlockClickedProcessor
    },
    "xenio-zone": {
        "enter": XenioZoneBaseProcessor,
        "exit": XenioZoneBaseProcessor
    },
    "xenio-place": {
        "enter": XenioPlaceBaseProcessor,
        "exit": XenioPlaceBaseProcessor
    }
};

EventProcessor.initializeProcessorMap(ProcessorMap);

module.exports = {
    init: function(args) {
        return new EventProcessor.map(args);
    }
};
