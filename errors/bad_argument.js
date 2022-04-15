const ApiBaseError = require('./api_base');
const { CODES, STATUS_CODES } = require('./codes');


class BadArgumentError extends ApiBaseError {
  constructor(message) {
    super(STATUS_CODES.BadArgument, CODES.BadArgument, message);
  }
}

module.exports = BadArgumentError;
