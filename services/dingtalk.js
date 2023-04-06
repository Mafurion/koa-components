const BaseService = require('../libs/request');
const { DingDingServiceError } = require('../errors');

class DingDingService extends BaseService {
  static getServiceError(err) {
    return new DingDingServiceError(err.response.body.errcode, err.response.body.errmsg);
  }

  async sendMessage(token, message) {
    return this.post({
      path: '/robot/send',
      qs: { access_token: token },
      payload: message,
    });
  }
}

module.exports = DingDingService;
