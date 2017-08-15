'use strict';

const InboxService = require('./lib/inbox');
const MessageService = require('./lib/message');
const MessageTemplateStatsService = require('./lib/message-template-stats');
const RateLimitService = require('./lib/rate-limit');
const ProfileService = require('./lib/profile')
const DeviceService = require('./lib/device')

module.exports.register = function(server, options, next) {
    server.methods.customer = {};
    server.methods.inbox = {};
    server.methods.message = {};
    server.methods.messageTemplateStats = {};
    server.methods.rateLimit = {};
    
    server.methods.inbox.updateManyCacheKeys = InboxService.updateManyCacheKeys.bind(server);

    server.methods.message.find = MessageService.find.bind(server);
    server.methods.message.findAll = MessageService.findAll.bind(server);
    server.methods.message.update = MessageService.update.bind(server);
    server.methods.message.deleteOne = MessageService.deleteOne.bind(server);
    server.methods.message.bulkInsert = MessageService.bulkInsert.bind(server);

    server.methods.messageTemplateStats.update = MessageTemplateStatsService.update.bind(server);

    
    server.methods.rateLimit.update = RateLimitService.update.bind(server);
    server.methods.rateLimit.withinLimit = RateLimitService.withinLimit.bind(server);
    
    server.methods.profile = ProfileService(server.connections.audience.client, server.plugins.logger.logger)
    server.methods.device = DeviceService(server.connections.audience.client, server.plugins.logger.logger)
    next();
};

module.exports.register.attributes = {
    name: 'v1-services'
};


