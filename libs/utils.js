const assert = require('assert');
const lodash = require('lodash');
const bluebird = require('bluebird');

class Utils {
  static getEnv() {
    return process.env.NODE_ENV || 'dev';
  }

  static async delay(ms) {
    assert(lodash.isNumber(ms), 'ms must be number');
    await new Promise(done => setTimeout(done, ms));
  }

  static async parallel(funcList, { concurrency = 5, qps = Infinity } = {}) {
    let results = [];
    const funcGroups = lodash.chunk(funcList, qps);

    for (const group of funcGroups) {
      const endTime = Date.now() + 1000;
      const ret = await bluebird.map(group, f => f(), { concurrency });
      results = lodash.concat(results, ret);

      if (results.length !== funcList.length) {
        await Utils.delay(endTime - Date.now());
      }
    }

    return results;
  }

  static async parallelMap(iterable, func, { concurrency = 5, qps = Infinity } = {}) {
    return Utils.parallel(iterable.map(v => async () => func(v)), { concurrency, qps });
  }

  static randomString(length) {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = length; i > 0; i -= 1) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
  }
}

module.exports = Utils;
