import type { ZodSchema } from 'zod';
import type { Action, ActionOpenAPI, Actions, ActionValidator } from './action';
import type { Event, Events } from './event';
import type { RecordString, RecordUnknown } from './helper';
import type {
  AcceptedAfterHook,
  AcceptedBeforeHook,
  AfterHookHandler,
  BeforeHookHandler,
} from './hooks';
import type { Service } from './service';

export interface BlazeActionCreator {
  /**
   * Create a reuseable action for services.
   * @example
   * ```ts
   * const action = BlazeCreator.action({
   *   rest: 'POST /',
   *   async handler(ctx) {
   *      const body = await ctx.request.body()
   *   }
   * })
   * ```
   */
  <
    R,
    HR,
    M extends RecordUnknown,
    H extends ZodSchema,
    P extends ZodSchema,
    Q extends ZodSchema,
    B extends ZodSchema,
    AH extends AcceptedAfterHook<
      HR,
      M,
      H['_output'],
      P['_output'],
      Q['_output'],
      B['_output']
    >,
    BH extends AcceptedBeforeHook<
      M,
      H['_output'],
      P['_output'],
      Q['_output'],
      B['_output']
    >,
  >(
    action: Action<R, HR, M, H, P, Q, B, AH, BH>
  ): Action<R, HR, M, H, P, Q, B, AH, BH>;
  /**
   * Create a reuseable validator for actions body, params and headers.
   * @example
   * ```ts
   *  const validator = BlazeCreator.action.validator({
   *    header: z.object({
   *      token: z.string(),
   *    })
   *  })
   * ```
   */
  validator<
    H extends ZodSchema,
    P extends ZodSchema,
    Q extends ZodSchema,
    B extends ZodSchema,
  >(
    validator: ActionValidator<H, P, Q, B>
  ): ActionValidator<H, P, Q, B>;
  /**
   * Create an openai spec for action.
   * @example
   * ```ts
   * const openapi = BlazeCreator.action.openapi({
   *   responses: {
   *     200: {
   *       description: 'Get user with email N',
   *     },
   *     400: {
   *       description: 'Bad Request',
   *     },
   *   },
   * })
   * ```
   */
  openapi(openapi: ActionOpenAPI): ActionOpenAPI;
  hook: {
    /**
     * Create a reuseable after hook for the service.
     * The hook will be called after the action handler called.
     * @example
     * ```ts
     *  const after = BlazeCreator.event.hook.after((ctx, res) => {
     *    const user = {
     *      name: res.name
     *      age: res.age
     *    }
     *
     *    return user
     *  })
     * ```
     */
    after<
      R,
      M extends RecordUnknown,
      H extends RecordString,
      P extends RecordUnknown,
      Q extends RecordUnknown,
      B extends RecordUnknown,
    >(
      hook: AfterHookHandler<R, M, H, P, Q, B>
    ): AfterHookHandler<R, M, H, P, Q, B>;
    /**
     * Create a reuseable before hook for the service.
     * The hook will be called before the action handler called.
     * @example
     * ```ts
     *  const before = BlazeCreator.event.hook.before((ctx) => {
     *    const user = await ctx.request.body()
     *
     *    // Validate no duplicated email
     *  })
     * ```
     */
    before<
      M extends RecordUnknown,
      H extends RecordString,
      P extends RecordUnknown,
      Q extends RecordUnknown,
      B extends RecordUnknown,
    >(
      hook: BeforeHookHandler<M, H, P, Q, B>
    ): BeforeHookHandler<M, H, P, Q, B>;
  };
}

export interface BlazeEventCreator {
  /**
   * Create a reusable event for services.
   * @example
   * ```ts
   *  const event = BlazeCreator.event({
   *    async handler(ctx) {
   *      const user = await ctx.request.body()
   *
   *      Logger.info('User Created:', user)
   *    }
   *  })
   * ```
   */
  <M extends RecordUnknown, P extends ZodSchema>(
    event: Event<M, P>
  ): Event<M, P>;
  /**
   * Create a reuseable validator for events parameters.
   * @example
   * ```ts
   *  const validator = BlazeCreator.event.validator({
   *    name: z.string(),
   *    age: z.number(),
   *  })
   * ```
   */
  validator<Params extends ZodSchema>(validator: Params): Params;
}

export interface BlazeServiceCreator {
  /**
   * Create a new service with the given name, actions, events, and etc.
   * @example
   * ```ts
   *  const service = BlazeCreator.service({
   *    name: 'user',
   *    actions: {
   *      find,
   *      create,
   *    },
   *  })
   * ```
   */
  <
    N extends string,
    V extends number,
    A extends Actions,
    E extends Events,
    S extends Service<N, V, A, E>,
  >(
    service: S
  ): Readonly<S>;
  action: BlazeActionCreator;
  event: BlazeEventCreator;
}
