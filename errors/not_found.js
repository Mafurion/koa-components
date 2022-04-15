const ApiBaseError = require('./api_base');
const { CODES, STATUS_CODES } = require('./codes');


class NotFoundError extends ApiBaseError {
  constructor(message) {
    super(STATUS_CODES.NotFound, CODES.NotFound, message);
  }
}

module.exports = NotFoundError;
