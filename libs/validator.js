const Joi = require('joi');
const lodash = require('lodash');
const { BadArgumentError } = require('../errors');

const joiValidate = (obj, schema, options = {}) => {
  const { error, value } = schema.validate(obj, options);
  if (error) {
    let message = '';
    const errorType = lodash.get(error, 'details[0].type', '');
    switch (errorType) {
      case 'any.required':
        message = `[${lodash.get(error, 'details[0].context.label')}]是必须的`;
        break;
      case 'string.base':
        message = `[${lodash.get(error, 'details[0].context.label')}]必须是string`;
        break;
      case 'number.base':
        message = `[${lodash.get(error, 'details[0].context.label')}]必须是number`;
        break;
      case 'string.empty':
        message = `[${lodash.get(error, 'details[0].context.label')}]不允许为空`;
        break;
      case 'string.min':
        message = `[${lodash.get(error, 'details[0].context.label')}]的长度最小为${lodash.get(error, 'details[0].context.limit')}`;
        break;
      case 'string.max':
        message = `[${lodash.get(error, 'details[0].context.label')}]的长度最大为${lodash.get(error, 'details[0].context.limit')}`;
        break;
      case 'any.only':
        message = `[${lodash.get(error, 'details[0].context.label')}]必须为[${lodash.get(error, 'details[0].context.valids', []).join(',')}]之一`;
        break;
      case 'string.uri':
        message = `[${lodash.get(error, 'details[0].context.label')}]必须是一个url`;
        break;
      case 'number.min':
        message = `[${lodash.get(error, 'details[0].context.label')}]的值最小为${lodash.get(error, 'details[0].context.limit')}`;
        break;
      case 'date.base':
        message = `[${lodash.get(error, 'details[0].context.label')}]必须是一个有效的时间`;
        break;
      case 'date.min':
        message = `[${lodash.get(error, 'details[0].context.label')}]的值最小为${lodash.get(error, 'details[0].context.limit')}`;
        break;
      case 'alternatives.types':
        message = `[${lodash.get(error, 'details[0].context.label')}]的值不合法, 必须为[${lodash.get(error, 'details[0].context.types', []).join(',')}]`;
        break;
      case 'array.min':
        message = `[${lodash.get(error, 'details[0].context.label')}]至少需要${lodash.get(error, 'details[0].context.limit')}个元素`;
        break;
      case 'object.base':
        message = `[${lodash.get(error, 'details[0].context.label')}]必须是一个object`;
        break;
      case 'boolean.base':
        message = `[${lodash.get(error, 'details[0].context.label')}]必须是一个bool值`;
        break;
      case 'number.integer':
        message = `[${lodash.get(error, 'details[0].context.label')}]必须是一个整数`;
        break;
      case 'array.base':
        message = `[${lodash.get(error, 'details[0].context.label')}]必须是一个数组`;
        break;
      case 'string.email':
        message = `[${lodash.get(error, 'details[0].context.label')}]必须是一个邮箱`;
        break;
      case 'number.unsafe':
        message = `[${lodash.get(error, 'details[0].context.label')}]过大了`;
        break;
      case 'number.max':
        message = `[${lodash.get(error, 'details[0].context.label')}]最大只能为${lodash.get(error, 'details[0].context.limit')}`;
        break;
      default:
        message = lodash.get(error, 'details[0].message');
        break;
    }
    throw new BadArgumentError(message);
  }
  return value;
};

const validateCtx = (location, schema, {
  convert = true, abortEarly = true, allowUnknown = true, before, after, ...rest } = {},
) => async (ctx, next) => {
  if (before) {
    await before(ctx);
  }
  ctx.state.entries = joiValidate(lodash.get(ctx, location), schema, { convert, abortEarly, allowUnknown, ...rest });

  if (after) {
    await after(ctx, ctx.state.entries);
  }
  await next();
};

const validateBody = (schema, { convert = true, abortEarly = true, mapping, ...rest } = {}) => validateCtx(
  'request.body', schema, { convert, abortEarly, mapping, ...rest });

const validateQuery = (schema, { convert = true, abortEarly = true, mapping, ...rest } = {}) => validateCtx(
  'query', schema, { convert, abortEarly, mapping, ...rest });

module.exports = {
  Joi,
  validateCtx,
  validateBody,
  validateQuery,
};
