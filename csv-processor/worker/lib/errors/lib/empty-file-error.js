function EmptyFileError(message) {
    this.message = message;
    this.name = "EmptyFileError";
    Error.captureStackTrace(this, EmptyFileError);
}
EmptyFileError.prototype = Object.create(Error.prototype);
EmptyFileError.prototype.constructor = EmptyFileError;


module.exports = EmptyFileError