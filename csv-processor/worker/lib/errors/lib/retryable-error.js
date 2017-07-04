function RetryableError(err) {
    this.message = err.message;
    this.err = err
    this.name = "RetryableError";
    Error.captureStackTrace(this, RetryableError);
}
RetryableError.prototype = Object.create(Error.prototype);
RetryableError.prototype.constructor = RetryableError;


module.exports = RetryableError