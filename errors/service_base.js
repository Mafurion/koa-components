const { CODES } = require('./codes');

class ServiceBaseError extends Error {
  constructor(errorCode, message) {
    super(message || 'service error');
    this.errorCode = errorCode || CODES.SERVICE_ERROR;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ServiceBaseError;
