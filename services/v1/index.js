'use strict';
const CustomerService = require('./lib/customer');
const EventService = require('./lib/event');
const InboxService = require('./lib/inbox');
const MessageService = require('./lib/message');
const AccountService = require('./lib/account');
const BeaconConfigurationService = require('./lib/beacon-configuration');
const PlaceService = require('./lib/place');
const ActiveConfigurationUUIDService = require('./lib/active-configuration-uuid');
const ProximityMessageService = require('./lib/proximity-message');
const CustomerSegmentService = require('./lib/customer-segment');
const AnalyticsService = require('./lib/analytics');

module.exports.register = function(server, options, next) {

	server.method('customer.find', CustomerService.find, { bind: server });
	server.method('customer.findByQuery', CustomerService.findByQuery, { bind: server });
	server.method('customer.update', CustomerService.update, { bind: server });
	server.method('customer.updateByDevice', CustomerService.updateByDevice, { bind: server });
	server.method('customer.create', CustomerService.create, { bind: server });
	server.method('customer.delete', CustomerService.delete, { bind: server });
	server.method('customer.pushDevice', CustomerService.pushDevice, { bind: server });
	server.method('customer.pullDevice', CustomerService.pullDevice, { bind: server });
	server.method('customer.index', CustomerService.index, { bind: server });
	server.method('customer.deleteIndex', CustomerService.deleteIndex, { bind: server });

	server.method('inbox.find', InboxService.find, { bind: server });
	server.method('inbox.addMessage', InboxService.addMessage, { bind: server });

	server.method('message.find', MessageService.find, { bind: server });
	server.method('message.findAll', MessageService.findAll, { bind: server });
	server.method('message.update', MessageService.update, { bind: server });
	server.method('message.deleteOne', MessageService.deleteOne, { bind: server });
	server.method('message.bulkInsert', MessageService.bulkInsert, { bind: server });

	server.method('account.find', AccountService.find, { bind: server });
	server.method('account.incrementCounter', AccountService.incrementCounter, { bind: server });
	server.method('account.decrementCounter', AccountService.decrementCounter, { bind: server });

	server.method('beaconConfiguration.findById', BeaconConfigurationService.findById, { bind: server });
	server.method('beaconConfiguration.findByIBeaconProtocol', BeaconConfigurationService.findByIBeaconProtocol, { bind: server });
	server.method('beaconConfiguration.findByEddystoneNamespaceProtocol', BeaconConfigurationService.findByEddystoneNamespaceProtocol, { bind: server });

	server.method('place.findById', PlaceService.findById, { bind: server });
	server.method('place.findByCoordinates', PlaceService.findByCoordinates, { bind: server });

	server.method('activeConfigurationUUID.findByAccountId', ActiveConfigurationUUIDService.findByAccountId, { bind: server });

	server.method('proximityMessage.beaconTriggered', ProximityMessageService.beaconTriggered, { bind: server });
	server.method('proximityMessage.geofenceTriggered', ProximityMessageService.geofenceTriggered, { bind: server });

	server.method('customerSegment.findById', CustomerSegmentService.findById, { bind: server });
	
	server.method('analytics.capture', AnalyticsService.capture, { bind: server });
	next();
};

module.exports.register.attributes = {
	name: 'v1-services',
};


