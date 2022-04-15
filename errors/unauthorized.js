const ApiBaseError = require('./api_base');
const { CODES, STATUS_CODES } = require('./codes');


class UnauthorizedError extends ApiBaseError {
  constructor(message) {
    super(STATUS_CODES.Unauthorized, CODES.Unauthorized, message);
  }
}

module.exports = UnauthorizedError;
