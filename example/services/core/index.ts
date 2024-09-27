import { BlazeCreator } from '@busy-hour/blaze';
import { Logger } from '../../utils/Logger';
import { onUserCreated } from './events/users.created';

// Create a core service
//  We used to act as a main service
//    will trigger other service if needed
const service = BlazeCreator.service({
  name: 'core',
  events: {
    'users.created': onUserCreated,
  },
  async onStarted() {
    Logger.info(`Core Service started`);
  },
});

export default service;
