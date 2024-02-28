import { BlazeCreator } from '../../../src';

const list = BlazeCreator.action({
  rest: 'GET /',
  handler(ctx) {
    ctx.response.set('text');

    return '';
  },
});

const service = BlazeCreator.service({
  name: '',
  actions: {
    list,
  },
});

export default service;
