import { BlazeContext } from '../../internal';
import type { Action } from '../../types/action';
import { afterActionHookHandler, beforeActionHookHandler } from './hooks';

// Reuseable action handler for Call/Emit/REST
export async function eventHandler(
  action: Action,
  blazeCtx: BlazeContext
): Promise<unknown> {
  if (action?.hooks?.before) {
    await beforeActionHookHandler({
      blazeCtx,
      hooks: action.hooks.before,
    });
  }

  const result = await action.handler(blazeCtx);

  if (action?.hooks?.after) {
    const afterHooksRes = await afterActionHookHandler({
      blazeCtx,
      hooks: action.hooks.after,
      result,
    });

    return afterHooksRes;
  }

  return result;
}
