const ServiceBaseError = require('./service_base');
const { CODES } = require('./codes');

class ServiceRequestError extends ServiceBaseError {
  constructor(message) {
    super(CODES.RequestError, message);
  }
}

module.exports = ServiceRequestError;
