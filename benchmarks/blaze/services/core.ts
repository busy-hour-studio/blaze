import { BlazeCreator } from '../../../src';

const list = BlazeCreator.action({
  rest: 'GET /',
  async handler(ctx) {
    ctx.response = 'text';

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
