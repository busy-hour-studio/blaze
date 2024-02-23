import { BlazeCreator } from '../../../../src';
import { Logger } from '../../../utils/Logger';
import { USER_DB } from '../../users/utils/constants';

export const onUserCreated = BlazeCreator.event({
  async handler(ctx) {
    const user = ctx.request.body;

    if (!user) return;

    // Revalidate users data in USER_MAP
    const result = USER_DB.get(user.email);

    if (result) {
      Logger.info('User created', result);
    } else {
      Logger.warn('User not created successfully', user);
    }
  },
});
