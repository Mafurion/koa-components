const ApiBaseError = require('./api_base');
const { CODES, STATUS_CODES } = require('./codes');


class NotFoundError extends ApiBaseError {
  constructor(message) {
    super(STATUS_CODES.NOT_FOUND, CODES.NOT_FOUND, message);
  }
}

module.exports = NotFoundError;
