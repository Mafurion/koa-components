const logger = require('./logger');
const lodash = require('lodash');
const { NotificationType } = require('./constant');
const config = require('../configs');
const DingTalkService = require('../services/dingtalk');

class NotificationService {
  constructor() {
    this.configured = false;
    this.type = null;
  }

  configure(dsn, type = NotificationType.DingTalk) {
    if (!this.configured) {
      this.configured = true;
      this.type = type;
      this.dsn = dsn;
    }
  }

  async captureException(error) {
    if (this.configured) {
      if (this.type === NotificationType.DingTalk) {
        const conf = config(process.env.NODE_ENV || 'dev');
        const dingtalk = new DingTalkService(conf.dingtalk.host);
        await dingtalk.sendMessage(this.dsn, {
          msgtype: 'text',
          text: {
            content: `发生了错误:\n${lodash.get(error, 'stack', error)}`,
          },
        });
      } else {
        logger.info('no notification configured');
      }
    } else {
      logger.info('raven do nothing');
    }
  }
}

const service = new NotificationService();

module.exports = service;
