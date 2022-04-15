const ApiBaseError = require('./api_base');
const { CODES, STATUS_CODES } = require('./codes');


class ForbiddenError extends ApiBaseError {
  constructor(message) {
    super(STATUS_CODES.Forbidden, CODES.Forbidden, message);
  }
}

module.exports = ForbiddenError;
