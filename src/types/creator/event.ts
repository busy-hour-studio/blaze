import type { ZodSchema } from 'zod';
import type { RecordUnknown } from '../common';
import type { Event } from '../event';

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
