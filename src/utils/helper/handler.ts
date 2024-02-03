import { BlazeContext } from '@/event/BlazeContext';
import { type CreateRestHandlerOption } from '@/types/rest';
import { type Context as HonoCtx } from 'hono';
import { resolvePromise } from '../common';
import { getStatusCode } from './context';
import { handleRestAfterHook, handleRestBeforeHook } from './hooks';
import { handleRestError } from './rest';

export function createRestHandler(options: CreateRestHandlerOption) {
  const { handler, hooks } = options;

  return async function routeHandler(honoCtx: HonoCtx) {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const options = {
      honoCtx,
      // NULL => automatically use honoCtx value instead
      body: null,
      params: null,
    };

    const [blazeCtx, blazeErr] = await resolvePromise(
      BlazeContext.create(options)
    );

    if (!blazeCtx || blazeErr) {
      return honoCtx.json(blazeErr, {
        status: 500,
      });
    }

    if (hooks?.before) {
      const beforeHooks = Array.isArray(hooks.before)
        ? hooks.before
        : [hooks.before];

      const beforeHookResult = await handleRestBeforeHook({
        hooks: beforeHooks,
        blazeCtx,
        honoCtx,
      });

      if (!beforeHookResult.ok) {
        return handleRestError({
          ctx: blazeCtx,
          err: beforeHookResult.error,
          honoCtx,
        });
      }
    }

    // eslint-disable-next-line prefer-const
    let [result, handlerErr] = await resolvePromise(handler(blazeCtx));

    if (handlerErr) {
      return handleRestError({
        ctx: blazeCtx,
        err: handlerErr,
        honoCtx,
      });
    }

    if (hooks?.after) {
      const afterHooks = Array.isArray(hooks.after)
        ? hooks.after
        : [hooks.after];

      const afterHookResult = await handleRestAfterHook({
        result,
        hooks: afterHooks,
        blazeCtx,
        honoCtx,
      });

      if (!afterHookResult.ok) {
        return handleRestError({
          ctx: blazeCtx,
          err: afterHookResult.error,
          honoCtx,
        });
      }

      result = afterHookResult.result;
    }

    if (!result) {
      return honoCtx.body(null, 204);
    }

    const status = getStatusCode(blazeCtx, 200);

    return honoCtx.json(result, {
      status,
    });
  };
}
