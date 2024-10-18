import type { ProcedureType } from '@trpc/server';
import type { ZodSchema } from 'zod';
import type { Action, ActionOpenAPI, ActionValidator } from '../action.ts';
import type { RecordString, RecordUnknown } from '../common.ts';
import type {
  AcceptedAfterHook,
  AcceptedBeforeHook,
  AfterHookHandler,
  BeforeHookHandler,
} from '../hooks/index.ts';

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
    TRPC extends ProcedureType,
  >(
    action: Action<R, HR, M, H, P, Q, B, AH, BH, TRPC>
  ): Action<R, HR, M, H, P, Q, B, AH, BH, TRPC>;
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
