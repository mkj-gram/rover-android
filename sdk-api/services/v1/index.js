'use strict';
const EventService = require('./lib/event');
const InboxService = require('./lib/inbox');
const MessageService = require('./lib/message');
const MessageTemplateService = require('./lib/message-template');
const AccountService = require('./lib/account');
const BeaconConfigurationService = require('./lib/beacon-configuration');
const PlaceService = require('./lib/place');
const ActiveConfigurationUUIDService = require('./lib/active-configuration-uuid');
const ProximityMessageService = require('./lib/proximity-message');
const CustomerSegmentService = require('./lib/customer-segment');
const AnalyticsService = require('./lib/analytics');
const MessageTemplateStatsService = require('./lib/message-template-stats');
const GimbalPlaceService = require('./lib/gimbal-place');
const RateLimitService = require('./lib/rate-limit');
const ExperienceService = require('./lib/experience');
const ExperienceStatsService = require('./lib/experience-stats');
const XenioZoneService = require('./lib/xenio-zone');
const XenioPlaceService = require('./lib/xenio-place');
const StaticSegmentService = require('./lib/static-segments');
const NotificationService = require('./lib/notification');

const ProfileService = require('./lib/profile')
const DeviceService = require('./lib/device')
const GeocoderService = require('./lib/geocoder')

module.exports.register = function(server, options, next) {
    server.methods.customer = {};
    server.methods.inbox = {};
    server.methods.message = {};
    server.methods.messageTemplate = {};
    server.methods.account = {};
    server.methods.beaconConfiguration = {};
    server.methods.place = {};
    server.methods.activeConfigurationUUID = {};
    server.methods.proximityMessage = {};
    server.methods.customerSegment = {};
    server.methods.analytics = {};
    server.methods.messageTemplateStats = {};
    server.methods.gimbalPlace = {};
    server.methods.rateLimit = {};
    server.methods.experience = {};
    server.methods.experienceStats = {};
    server.methods.xenioZone = {};
    server.methods.xenioPlace = {};
    server.methods.staticSegment = {};
    server.methods.notification = {};

    server.methods.inbox.fetch = InboxService.fetch.bind(server);
    server.methods.inbox.find = InboxService.find.bind(server);
    server.methods.inbox.addMessage = InboxService.addMessage.bind(server);
    server.methods.inbox.deleteMessage = InboxService.deleteMessage.bind(server);
    server.methods.inbox.getLastModifiedAt = InboxService.getLastModifiedAt.bind(server)
    server.methods.inbox.updateLastModifiedAt = InboxService.updateLastModifiedAt.bind(server)


    server.methods.message.isV1Id = MessageService.isV1Id.bind(server);
    server.methods.message.serialize = MessageService.serialize.bind(server);
    server.methods.message.find = MessageService.find.bind(server);
    server.methods.message.findAll = MessageService.findAll.bind(server);
    server.methods.message.update = MessageService.update.bind(server);
    server.methods.message.deleteOne = MessageService.deleteOne.bind(server);
    server.methods.message.bulkInsert = MessageService.bulkInsert.bind(server);

    server.methods.messageTemplate.find = MessageTemplateService.find.bind(server);
    server.methods.messageTemplate.findAll = MessageTemplateService.findAll.bind(server);

    server.methods.account.find = AccountService.find.bind(server);
    server.methods.account.incrementCounter = AccountService.incrementCounter.bind(server);
    server.methods.account.decrementCounter = AccountService.decrementCounter.bind(server);

    server.methods.beaconConfiguration.findById = BeaconConfigurationService.findById.bind(server);
    server.methods.beaconConfiguration.findByIBeaconProtocol = BeaconConfigurationService.findByIBeaconProtocol.bind(server);
    server.methods.beaconConfiguration.findByEddystoneNamespaceProtocol = BeaconConfigurationService.findByEddystoneNamespaceProtocol.bind(server);

    server.methods.place.findById = PlaceService.findById.bind(server);
    server.methods.place.findAll = PlaceService.findAll.bind(server);
    server.methods.place.closestPlaces = PlaceService.closestPlaces.bind(server);
    server.methods.place.findByCoordinates = PlaceService.findByCoordinates.bind(server);

    server.methods.activeConfigurationUUID.findByAccountId = ActiveConfigurationUUIDService.findByAccountId.bind(server);

    server.methods.proximityMessage.beaconTriggered = ProximityMessageService.beaconTriggered.bind(server);
    server.methods.proximityMessage.geofenceTriggered = ProximityMessageService.geofenceTriggered.bind(server);
    server.methods.proximityMessage.gimbalPlaceTriggered = ProximityMessageService.gimbalPlaceTriggered.bind(server);
    server.methods.proximityMessage.xenioZoneTriggered = ProximityMessageService.xenioZoneTriggered.bind(server);
    server.methods.proximityMessage.xenioPlaceTriggered = ProximityMessageService.xenioPlaceTriggered.bind(server);

    server.methods.customerSegment.findById = CustomerSegmentService.findById.bind(server);
    
    server.methods.analytics.capture = AnalyticsService.capture.bind(server);

    server.methods.messageTemplateStats.update = MessageTemplateStatsService.update.bind(server);

    server.methods.gimbalPlace.findByAccountIdAndGimbalPlaceId = GimbalPlaceService.findByAccountIdAndGimbalPlaceId.bind(server);

    server.methods.rateLimit.update = RateLimitService.update.bind(server);
    server.methods.rateLimit.withinLimit = RateLimitService.withinLimit.bind(server);
    
    server.methods.experience.find = ExperienceService.find.bind(server);
    server.methods.experience.findVersion = ExperienceService.findVersion.bind(server);

    server.methods.experienceStats.update = ExperienceStatsService.update.bind(server);
    server.methods.experienceStats.incrementCounter = ExperienceStatsService.incrementCounter.bind(server);

    server.methods.xenioZone.findById = XenioZoneService.findById.bind(server);
    server.methods.xenioPlace.findById = XenioPlaceService.findById.bind(server);

    server.methods.staticSegment.withinSegment = StaticSegmentService.withinSegment.bind(server);

    server.methods.notification.serialize = NotificationService.serialize.bind(server);
    server.methods.notification.get = NotificationService.get.bind(server);
    server.methods.notification.setReadStatus = NotificationService.setReadStatus.bind(server);
    server.methods.notification.delete = NotificationService.delete.bind(server);

    server.methods.profile = ProfileService(server.connections.audience.client, server.plugins.logger.logger, server.connections.elasticsearch.queue)
    server.methods.device = DeviceService(server.connections.audience.client, server.plugins.logger.logger)
    server.methods.geocoder = GeocoderService(server.connections.geocoder.client, server.plugins.logger.logger)

    next();
};

module.exports.register.attributes = {
    name: 'v1-services'
};


