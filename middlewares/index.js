const bodyparser = require('koa-bodyparser');
const { BadArgumentError } = require('../errors');
const errorHandler = require('./error_handle');
const output = require('./output');
const logger = require('../libs/logger');
const genPagination = require('./pagination');


function loadMiddleWares(
  app,
  {
    useErrorHandler = true,
    useOutput = true,
    useHttpLogger = true,
    useBodyParser = true,
    usePaginationParser = true,
    bodyParserOptions = {
      enableTypes: ['json', 'form', 'text'],
      onerror: (err) => {
        throw new BadArgumentError(err.message);
      },
    },
    serviceName = null,
  } = {}) {
  if (useErrorHandler) {
    app.use(errorHandler);
    logger.info('load errorHandler');
  }
  if (useOutput) {
    app.use(output);
    logger.info('load output');
  }
  if (useHttpLogger) {
    app.use(logger.httpLogger);
    logger.info('load httpLogger');
  }
  if (useBodyParser) {
    app.use(bodyparser(bodyParserOptions));
    logger.info('load bodyparser');
  }
  if (usePaginationParser) {
    app.use(genPagination());
    logger.info('load paginationParser');
  }
  if (serviceName) {
    app.use(async (ctx, next) => {
      ctx.service_name = serviceName;
      await next();
    });
  }
}

module.exports = {
  loadMiddleWares,
};
