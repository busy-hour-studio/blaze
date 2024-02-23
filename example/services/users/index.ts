import { BlazeCreator } from '../../../src';
import { Logger } from '../../utils/Logger';
import { onCreateUser } from './actions/users.create';
import { onFindUser } from './actions/users.find';
import { onListUser } from './actions/users.list';

const service = BlazeCreator.service({
  name: 'users',
  actions: {
    create: onCreateUser,
    find: onFindUser,
    list: onListUser,
  },
  onStarted() {
    Logger.info(`Users Service started`);
  },
});

export default service;
