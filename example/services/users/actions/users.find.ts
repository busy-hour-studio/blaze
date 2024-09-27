import { BlazeCreator, BlazeError } from '@busy-hour/blaze';
import { validateUserHeader } from '../hooks/users.validate.header';
import { validateUserParam } from '../hooks/users.validate.params';
import { USER_DB } from '../utils/constants';
import {
  UserSchema,
  userHeaderSchema,
  userParamSchema,
} from '../utils/schemas';

export const getUserValidator = BlazeCreator.action.validator({
  header: userHeaderSchema,
  params: userParamSchema,
});

export const getUserOpenApi = BlazeCreator.action.openapi({
  responses: {
    200: {
      description: 'Get user with email N',
    },
    400: {
      description: 'Bad Request',
    },
  },
});

export const onFindUser = BlazeCreator.action({
  // Set the rest route
  rest: 'GET /:email',
  openapi: getUserOpenApi,
  validator: getUserValidator,
  trpc: 'query',
  hooks: {
    // Do validation manually
    //   We re-use the validations from other files
    before: [validateUserHeader, validateUserParam],
    async after(ctx, res: UserSchema) {
      const result = {
        name: res.name,
        email: res.email,
      };

      return result;
    },
  },
  async handler(ctx) {
    const { email } = ctx.request.params;

    const user = USER_DB.get(email);

    if (!user) {
      throw new BlazeError({
        errors: null,
        message: 'User not found!',
        status: 404,
      });
    }

    return user;
  },
});
