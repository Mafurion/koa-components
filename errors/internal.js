const ServiceBaseError = require('./service_base');
const { CODES, STATUS_CODES } = require('./codes');


class InternalError extends ServiceBaseError {
  constructor(message) {
    super(STATUS_CODES.InternalError, CODES.InternalError, message);
  }
}

module.exports = InternalError;
