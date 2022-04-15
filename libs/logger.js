const winston = require('winston');
const morgan = require('koa-morgan');

const logger = winston.createLogger({
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.simple(),
    winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`),
  ),
  level: 'debug',
});

const httpLogger = morgan(
  'combined',
  {
    stream: {
      write: str => logger.info(str),
    },
  },
);

module.exports = logger;
module.exports.httpLogger = httpLogger;
