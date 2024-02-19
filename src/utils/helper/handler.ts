import { BlazeContext } from '@/event/BlazeContext';
import type { ActionValidation } from '@/types/action';
import type { CreateRestHandlerOption } from '@/types/rest';
import type { Context as HonoCtx } from 'hono';
import type { ZodObject, ZodRawShape, ZodTypeAny } from 'zod';
import { resolvePromise } from '../common';
import { getStatusCode } from './context';
import { handleRestAfterHook, handleRestBeforeHook } from './hooks';
import { handleRestError } from './rest';

export function createRestHandler(options: CreateRestHandlerOption) {
  const { handler, hooks } = options;

  return async function routeHandler(honoCtx: HonoCtx) {
    const [blazeCtx, blazeErr] = await resolvePromise(
      BlazeContext.create({
        honoCtx,
        // NULL => automatically use honoCtx value instead
        body: null,
        params: null,
        headers: null,
        validation: null,
        validator: options.validation as ActionValidation<
          ZodTypeAny,
          ZodObject<ZodRawShape>
        >,
      })
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
        hooks: beforeHooks as never,
        blazeCtx: blazeCtx as never,
        honoCtx,
      });

      if (!beforeHookResult.ok) {
        return handleRestError({
          ctx: blazeCtx as never,
          err: beforeHookResult.error,
          honoCtx,
        });
      }
    }

    // eslint-disable-next-line prefer-const
    let [result, handlerErr] = await resolvePromise(handler(blazeCtx as never));

    if (handlerErr) {
      return handleRestError({
        ctx: blazeCtx as never,
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
        hooks: afterHooks as never,
        blazeCtx: blazeCtx as never,
        honoCtx,
      });

      if (!afterHookResult.ok) {
        return handleRestError({
          ctx: blazeCtx as never,
          err: afterHookResult.error,
          honoCtx,
        });
      }

      result = afterHookResult.result;
    }

    if (!result) {
      return honoCtx.body(null, 204);
    }

    const status = getStatusCode(blazeCtx as never, 200);

    return honoCtx.json(result, {
      status,
    });
  };
}
