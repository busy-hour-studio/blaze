import {
  Action,
  ActionOpenAPI,
  ActionValidator,
  BlazeError,
} from '../../../../src';
import { validateUserHeader } from '../hooks/users.validate.header';
import { validateUserParam } from '../hooks/users.validate.params';
import { USER_DB } from '../utils/constants';
import {
  UserParamSchema,
  UserSchema,
  userHeaderSchema,
  userParamSchema,
} from '../utils/schemas';

export const getUserValidator = {
  header: userHeaderSchema,
  params: userParamSchema,
} satisfies ActionValidator;

export const getUserOpenApi = {
  responses: {
    200: {
      description: 'Get user with email N',
    },
    400: {
      description: 'Bad Request',
    },
  },
} satisfies ActionOpenAPI;

export const onFindUser = {
  // Set the rest route
  rest: 'GET /:email',
  openapi: getUserOpenApi,
  validator: getUserValidator,
  hooks: {
    // Do validation manually
    //   We re-use the validations from other files
    before: [validateUserHeader, validateUserParam],
    after(ctx, res: UserSchema) {
      const result = {
        name: res.name,
        email: res.email,
      };

      return result;
    },
  },
  async handler(ctx) {
    const { email } = ctx.request.params as UserParamSchema;

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
} satisfies Action;
