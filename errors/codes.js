const CODES = {
  ServiceError: 10000,
  BadArgument: 11000,
  NotFound: 12000,
  LogicError: 13000,
  Unauthorized: 14000,
  Forbidden: 15000,
  RequestError: 16000,
  InternalError: 90000,
};

const STATUS_CODES = {
  Ok: 200,
  NotFound: 404,
  BadArgument: 400,
  Unauthorized: 401,
  Forbidden: 403,
  InternalError: 500,
};

module.exports = {
  CODES,
  STATUS_CODES,
};
