import type { BlazeContext } from '../internal/context/index.ts';
import type { Action } from '../types/action.ts';
import { afterActionHookHandler, beforeActionHookHandler } from './hooks.ts';

// Reuseable action handler for Call/Emit/REST
export async function eventHandler(
  action: Action,
  ctx: BlazeContext
): Promise<unknown> {
  if (action?.hooks?.before) {
    await beforeActionHookHandler({
      ctx,
      hooks: action.hooks.before,
    });
  }

  const result = await action.handler(ctx);

  if (action?.hooks?.after) {
    const afterHooksRes = await afterActionHookHandler({
      ctx,
      hooks: action.hooks.after,
      result,
    });

    return afterHooksRes;
  }

  return result;
}
