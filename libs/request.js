const lodash = require('lodash');
const rp = require('request-promise');
const { RequestError } = require('../errors');
const logger = require('../libs/logger');


class BaseService {
  constructor(domain) {
    this.domain = domain;
  }

  get baseUri() {
    return lodash.startsWith(this.domain, 'http') ? this.domain : `http://${this.domain}`;
  }

  async doRequest({ method = 'GET', path, qs, body, timeout, headers, form, fullResponse = false, json = true }) {
    const options = {
      method,
      uri: this.getFullPath(path),
      qs,
      timeout: timeout || 20000,
      json,
      headers,
    };
    if (body) {
      options.body = body;
    }
    if (form) {
      options.form = form;
    }
    if (fullResponse) {
      options.resolveWithFullResponse = true;
    }
    try {
      logger.info(`start to request method: ${options.method} uri: ${options.uri} qs: ${JSON.stringify(options.qs)}, body: ${JSON.stringify(options.body)}`);
      const resp = await rp({ ...options });
      logger.info(`finish request method: ${options.method} uri: ${options.uri}`);
      return resp;
    } catch (e) {
      logger.error(`request error: ${e.stack} url: ${options.uri} qs: ${JSON.stringify(options.qs)}, body: ${JSON.stringify(options.body)}`);
      if (this.constructor.getServiceError) {
        throw this.constructor.getServiceError(e);
      } else {
        throw new RequestError(`service request error: url: ${options.uri} method: ${options.method} message: ${e.message}`);
      }
    }
  }

  async get({ path, qs, timeout, ...rest }) {
    return this.doRequest({ method: 'GET', path, qs, timeout, ...rest });
  }

  async post({ path, payload, timeout, ...rest }) {
    return this.doRequest({ method: 'POST', path, payload, timeout, ...rest });
  }

  async put({ path, payload, timeout, ...rest }) {
    return this.doRequest({ method: 'PUT', path, payload, timeout, ...rest });
  }

  async del({ path, payload, ...rest }) {
    return this.doRequest({ method: 'DELETE', path, payload, ...rest });
  }

  getFullPath(path = '') {
    path = lodash.startsWith(path, '/') ? path : `/${path}`;
    return `${this.baseUri}${path}`;
  }
}

module.exports = BaseService;
