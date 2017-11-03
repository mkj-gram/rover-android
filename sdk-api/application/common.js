'use strict';

const ObjectId = require('mongodb').ObjectID;

module.exports.register = function(server, options, next) {
    server.methods.application = {}
    server.methods.application.getCurrentCustomer = getCurrentCustomer.bind(server)
    server.methods.application.getCurrentProfile = getCurrentProfile.bind(server)
    next()
};

module.exports.register.attributes = {
    name: 'application-common',
};

const getCurrentCustomer = function (request, callback) {
    
    const server = this
    const methods = server.methods

    const deviceId = request.headers['x-rover-device-id'].toUpperCase()

    if (!deviceId) {
        return callback('Device ID missing', null)
    }

    const accountId = request.auth.credentials.account.id
    
    if (accountId) {

        methods.customer.findByDeviceId(accountId, deviceId, (err, customer) => {
            if (err) {
                return callback(err)
            }

            return callback(null, customer)
        })

    } else {
        callback('Account ID missing', null);
    }

}

const getCurrentProfile = function(request, callback) {

    const server = this
    const methods = server.methods

    const deviceId = request.headers['x-rover-device-id'].toUpperCase()

    if (deviceId === null || deviceId === undefined) {
        return callback(null, null)
    }

    const accountId = request.auth.credentials.account.id

    if (accountId === null || accountId === undefined) {
        return callback(new Error('Account ID missing'))
    }


    methods.profile.findByDeviceId(accountId, deviceId, function(err, profile) {
        if (err) {
            return callback(err)
        }

        return callback(null, profile)
    })
}

const getCurrentDevice = function(request, callback) {

    const server = this
    const methods = server.methods

    const deviceId = request.headers['x-rover-device-id'].toUpperCase()

    if (deviceId === null || deviceId === undefined) {
        return callback(null, null)
    }

    const accountId = request.auth.credentials.account.id

    if (accountId === null || accountId === undefined) {
        return callback(new Error('Account ID missing'))
    }

    methods.device.findById(accountId, deviceId, function(err, device) {
        if (err) {
            return callback(err)
        }

        return callback(null, device)
    })
}