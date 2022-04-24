const { ApiBaseError, ServiceBaseError, CODES } = require('../errors');
const logger = require('../libs/logger');

const env = process.env.NODE_ENV || 'dev';

async function errorHandler(ctx, next) {
  try {
    await next();
  } catch (err) {
    console.log(err);
    if (err instanceof ApiBaseError) {
      ctx.body = {
        err_code: err.errorCode,
        err_msg: err.message,
      };
      ctx.status = err.statusCode;
    } else {
      ctx.status = 500;
      ctx.body = {
        err_code: err instanceof ServiceBaseError ? err.errorCode : CODES.INTERNAL_ERROR,
        err_msg: env === 'dev' ? err.stack : err.message,
      };
    }

    logger.error(err);
  }
}

module.exports = errorHandler;
