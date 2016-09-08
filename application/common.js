'use strict';

const ObjectId = require('mongodb').ObjectID;

module.exports.register = function(server, options, next) {
    server.method('getCurrentCustomer', getCurrentCustomer, { bind: server });
    next();
};

module.exports.register.attributes = {
    name: 'application-common',
};


const getCurrentCustomer = function (request, callback) {
    
    const server = this;
    const methods = server.methods;

    const deviceId = request.headers['x-rover-device-id'];

    if (!deviceId) {
        return callback('Device ID missing', null);
    }

    const accountId = request.auth.credentials.account.id;

    if (accountId) {
        methods.customer.findByQuery({ 'account_id': accountId, 'devices._id': deviceId }, (err, customer) => {
            if (err) {
                return callback(err);
            }
            
            return callback(null, customer);
        });
    } else {
        callback('Account ID missing', null);
    }

};