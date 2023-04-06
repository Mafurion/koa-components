const { ApiBaseError, ServiceBaseError, CODES: { CODES: ErrorCodes } } = require('../errors');
const logger = require('../libs/logger');
const notification = require('../libs/notification');

const env = process.env.NODE_ENV || 'dev';

async function errorHandler(ctx, next) {
  try {
    await next();
  } catch (err) {
    if (err instanceof ApiBaseError) {
      ctx.body = {
        err_code: err.errorCode,
        err_msg: err.message,
      };
      ctx.status = err.statusCode;
    } else {
      console.log(err);
      ctx.status = 500;
      ctx.body = {
        err_code: err instanceof ServiceBaseError ? err.errorCode : ErrorCodes.InternalError,
        err_msg: env === 'dev' ? err.stack : 'internal error',
      };
      await notification.captureException(err);
    }

    logger.error(err);
  }
}

module.exports = errorHandler;
