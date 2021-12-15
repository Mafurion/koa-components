class ApiBaseError extends Error {
  constructor(statusCode, errorCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiBaseError;
