'use strict';

const CustomerService = require('./lib/customer');
const InboxService = require('./lib/inbox');
const MessageService = require('./lib/message');
const MessageTemplateStatsService = require('./lib/message-template-stats');
const RateLimitService = require('./lib/rate-limit');

module.exports.register = function(server, options, next) {
    server.methods.customer = {};
    server.methods.inbox = {};
    server.methods.message = {};
    server.methods.messageTemplateStats = {};
    server.methods.rateLimit = {};


    server.methods.customer.find = CustomerService.find.bind(server);
    server.methods.customer.findAll = CustomerService.findAll.bind(server);
    server.methods.customer.findByQuery = CustomerService.findByQuery.bind(server);
    server.methods.customer.update = CustomerService.update.bind(server);
    server.methods.customer.updateMany = CustomerService.updateMany.bind(server);
    server.methods.customer.updateByDevice = CustomerService.updateByDevice.bind(server);
    server.methods.customer.create = CustomerService.create.bind(server);
    server.methods.customer.delete = CustomerService.delete.bind(server);
    server.methods.customer.pushDevice = CustomerService.pushDevice.bind(server);
    server.methods.customer.pullDevice = CustomerService.pullDevice.bind(server);
    server.methods.customer.index = CustomerService.index.bind(server);
    server.methods.customer.deleteIndex = CustomerService.deleteIndex.bind(server);




    server.methods.inbox.find = InboxService.find.bind(server);
    server.methods.inbox.addMessage = InboxService.addMessage.bind(server);
    server.methods.inbox.deleteMessage = InboxService.deleteMessage.bind(server);

    server.methods.message.find = MessageService.find.bind(server);
    server.methods.message.findAll = MessageService.findAll.bind(server);
    server.methods.message.update = MessageService.update.bind(server);
    server.methods.message.deleteOne = MessageService.deleteOne.bind(server);
    server.methods.message.bulkInsert = MessageService.bulkInsert.bind(server);

    server.methods.messageTemplateStats.update = MessageTemplateStatsService.update.bind(server);

    
    server.methods.rateLimit.update = RateLimitService.update.bind(server);
    server.methods.rateLimit.withinLimit = RateLimitService.withinLimit.bind(server);
    
    next();
};

module.exports.register.attributes = {
    name: 'v1-services'
};


