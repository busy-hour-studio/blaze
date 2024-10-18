import { BlazeCreator, z } from '@busy-hour/blaze';
import { Logger } from '../../../utils/Logger';
import { USER_DB } from '../../users/utils/constants';

export const onUserCreated = BlazeCreator.event({
  validator: z.object({
    name: z.string().openapi({ example: 'John Doe' }),
    email: z.string().email().openapi({ example: 'john@doe.com' }),
  }),
  async handler(ctx) {
    const user = await ctx.request.body();

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
