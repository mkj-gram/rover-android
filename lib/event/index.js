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
    "default": { processor: BaseProcessor, id: 0 },
    "beacon-region enter": { processor: BeaconRegionBaseProcessor, id: 22 },
    "beacon-region exit": { processor: BeaconRegionBaseProcessor, id: 23 },
    "geofence-region enter": { processor: GeofenceRegionBaseProcessor, id: 2 },
    "geofence-region exit": { processor: GeofenceRegionBaseProcessor, id: 3 },
    "location update": { processor: LocationBaseProcessor, id: 62 },
    "app open": { processor: AppBaseProcessor, id: 42 },
    "app close": { processor: AppBaseProcessor, id: 43 },
    "message open": { processor: MessageOpenedProcessor, id: 103 },
    "message added-to-inbox": { processor: MessageBaseProcessor, id: 102 },
    "message deleted": { processor: MessageBaseProcessor, id: 104 },
    "gimbal-place enter": { processor: GimbalPlaceBaseProcessor, id: 82 },
    "gimbal-place exit": { processor: GimbalPlaceBaseProcessor, id: 83 },
    "experience launched": { processor: ExperienceBaseProcessor, id: 162 },
    "experience dismissed": { processor: ExperienceBaseProcessor, id: 163 },
    "experience screen-viewed": { processor: ExperienceScreenViewedProcessor, id: 164 },
    "experience block-clicked": { processor: ExperienceBlockClickedProcessor, id: 166 },
    "xenio-zone enter": { processor: XenioZoneBaseProcessor, id: 200 },
    "xenio-zone exit": { processor: XenioZoneBaseProcessor, id: 201 },
    "xenio-place enter": { processor: XenioPlaceBaseProcessor, id: 202 },
    "xenio-place exit": { processor: XenioPlaceBaseProcessor, id: 203 }
};

EventProcessor.initializeProcessorMap(ProcessorMap);

module.exports = {
    init: function(args) {
        return new EventProcessor.map(args);
    }
};
