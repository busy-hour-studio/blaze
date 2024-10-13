import { BlazeCreator, BlazeError } from '@busy-hour/blaze';
import { USER_DB } from '../utils/constants';
import { UserHeaderSchema } from '../utils/schemas';

export const validateUserParam = BlazeCreator.action.hook.before(
  async (ctx) => {
    // Type cast the header, since we already know that it's already being validated
    const header = ctx.request.headers as UserHeaderSchema;

    // If the header is okay, check if the user are stored or not
    if (!USER_DB.has(header.authorization)) {
      throw new BlazeError({
        errors: null,
        message: 'Unauthorized',
        status: 401,
        get name() {
          return this.message;
        },
      });
    }
  }
);
