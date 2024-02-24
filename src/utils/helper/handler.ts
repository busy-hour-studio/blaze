import { BlazeContext } from '../../event/BlazeContext';
import { Action, ActionCallResult } from '../../types/action';
import { resolvePromise } from '../common';
import { afterActionHookHandler, beforeActionHookHandler } from './hooks';

// Reuseable action handler for Call/Emit/REST
export async function eventHandler(
  action: Action,
  blazeCtx: BlazeContext
): Promise<ActionCallResult<unknown>> {
  if (action?.hooks?.before) {
    const beforeHooksRes = await beforeActionHookHandler({
      blazeCtx,
      hooks: action.hooks.before,
    });

    if (!beforeHooksRes.ok) return beforeHooksRes;
  }

  // eslint-disable-next-line prefer-const
  let [result, err] = await resolvePromise(action.handler(blazeCtx));

  if (err) {
    return {
      error: err as Error,
      ok: false,
    };
  }

  if (action?.hooks?.after) {
    const afterHooksRes = await afterActionHookHandler({
      blazeCtx,
      hooks: action.hooks.after,
      result,
    });

    return afterHooksRes;
  }

  return {
    ok: true,
    result,
  };
}
