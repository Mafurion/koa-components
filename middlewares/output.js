const lodash = require('lodash');

async function output(ctx, next) {
  await next();

  if (!lodash.isUndefined(ctx.state.data)) {
    ctx.body = {
      err_code: 0,
      err_msg: '',
      data: ctx.state.data,
    };
  }
}

module.exports = output;
