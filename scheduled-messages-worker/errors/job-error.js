'use strict';

const util = require('util');

function JobError(message, retryable) {
    Error.captureStackTrace(this, this.constructor);
    this.name = 'JobError: message=' + message + ' retryable=' + retryable;
    this.retryable = typeof retryable  !== 'undefined' ?  retryable  : false;
};

require('util').inherits(JobError, Error);

module.exports = JobError;