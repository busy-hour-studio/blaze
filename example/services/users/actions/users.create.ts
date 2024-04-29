import {
  Action,
  ActionOpenAPI,
  ActionValidator,
  BlazeError,
} from '../../../../src';
import { Logger } from '../../../utils/Logger';
import { USER_DB } from '../utils/constants';
import { UserSchema, userSchema } from '../utils/schemas';

export const userOpenApi = {
  body: {
    type: 'application/json',
    description: 'Create a new user',
    required: true,
  },
  responses: {
    200: {
      description: 'User created',
    },
    400: {
      description: 'Bad Request',
    },
  },
} satisfies ActionOpenAPI;

export const createUserValidator = {
  body: userSchema,
} satisfies ActionValidator;

export const onCreateUser = {
  // Set the rest route
  rest: 'POST /',
  openapi: userOpenApi,
  validator: createUserValidator,
  throwOnValidationError: true,
  hooks: {
    // Auto log incoming request
    async before(ctx) {
      // Validate request
      //   Use type case since we already know that it's already being validated
      //     if not, it will throw an error, keep in mind we use `throwOnValidationError` option
      const user = (await ctx.request.body()) as UserSchema;

      Logger.info('User Payload', user);

      // Throw error when user already exists
      if (USER_DB.has(user.email)) {
        throw new BlazeError('User already exists', 409);
      }
    },
    async after(ctx, res: UserSchema) {
      // Auto trigger event
      ctx.event('core.users.created', res);

      // Modify response
      //  Emit user password
      const result = {
        name: res.name,
        email: res.email,
      };

      return result;
    },
  },
  async handler(ctx) {
    const user = (await ctx.request.body()) as UserSchema;

    USER_DB.set(user.email, user);

    return user;
  },
} satisfies Action;
