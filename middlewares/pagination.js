
const parsePagination = (query, defaultSize = 30, defaultNum = 1) => {
  const pageSize = parseInt(query.page_size || query.pagesize || query.pageSize, 10) || defaultSize;
  const pageNum = parseInt(query.page_num || query.pagenum || query.page || query.pageNum, 10) || defaultNum;

  return {
    skip: Math.max(0, pageNum - 1) * pageSize,
    limit: pageSize,
    pageSize,
    pageNum,
  };
};

function genPagination(defaultSize = 30, defaultNum = 1) {
  return async (ctx, next) => {
    if (ctx.method === 'GET') {
      ctx.state.pagination = parsePagination(ctx.query, defaultSize, defaultNum);
    }

    await next();
  };
}

module.exports = genPagination;
