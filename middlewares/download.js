const { XlsxFileHelper } = require('../libs/file_helper');

/**
 * 文件导出
 * @param itemMap
 * @param filename
 * @param maxCount
 * @returns {Function}
 */
function exportFile({ itemMap, filename, maxCount = 1000 } = {}) {
  return async (ctx, next) => {
    if (ctx.state.entries.download) {
      ctx.state.pagination.skip = 0;
      ctx.state.pagination.limit = maxCount;
      await next();
      ctx.set('Content-disposition',
        `attachment;filename=${encodeURI(`${(filename || 'file')}.xlsx`)}`);
      const helper = new XlsxFileHelper();
      ctx.body = helper.dump(ctx.state.data.items, itemMap);
      delete ctx.state.data;
    } else {
      await next();
    }
  };
}

module.exports = exportFile;
