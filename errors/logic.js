const ApiBaseError = require('./api_base');
const { CODES, STATUS_CODES } = require('./codes');


class LogicError extends ApiBaseError {
  constructor(message) {
    super(STATUS_CODES.InternalError, CODES.LogicError, message);
  }
}

module.exports = LogicError;
