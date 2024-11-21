import {
  validateBody,
  validateHeader,
  validateParams,
  validateQuery,
} from './helper';

export const validationMap = {
  header: {
    validator: validateHeader,
    options: 'headers',
    schema: 'header',
  },
  params: {
    validator: validateParams,
    options: 'params',
    schema: 'params',
  },
  query: {
    validator: validateQuery,
    options: 'query',
    schema: 'query',
  },
  body: {
    validator: validateBody,
    options: 'body',
    schema: 'body',
  },
} as const;
