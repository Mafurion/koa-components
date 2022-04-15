const router = require('koa-router')();

router.get('/', async (ctx, next) => {
  ctx.state.data = {
    status: 'ok',
    service: ctx.service_name,
  };
  await next();
});

module.exports = router;
