const Koa = require('koa');
const lodash = require('lodash');
const { loadMiddleWares } = require('../middlewares');

class Application extends Koa {
  createContext(req, res) {
    const context = super.createContext(req, res);
    context.setData = (ret, attachPageInfo = false) => {
      lodash.set(context.state, 'data', ret);
      if (attachPageInfo) {
        lodash.set(context.state, 'data.page', context.state.pagination.pageNum);
        lodash.set(context.state, 'data.pagesize', context.state.pagination.pageSize);
      }
    };
    return context;
  }

  loadMiddleWares({ ...rest }) {
    loadMiddleWares(this, { ...rest });
  }
}

module.exports = Application;
