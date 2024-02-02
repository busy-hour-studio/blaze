import { BlazeError } from '@/errors/BlazeError';
import { BlazeContext } from '@/event/BlazeContext';
import {
  type AfterHookRestHandlerOption,
  type BeforeHookRestHandlerOption,
  type CreateRestHandlerOption,
  type RestErrorHandlerOption,
  type RestHandlerOption,
} from '@/types/rest';
import { type Context as HonoCtx } from 'hono';
import { resolvePromise } from '../common';
import { getStatusCode } from './context';
import { extractRestParams, getRouteHandler } from './rest';

function handleRestError(options: RestErrorHandlerOption) {
  const { err, ctx, honoCtx } = options;

  if (err instanceof BlazeError) {
    return honoCtx.json(err, {
      status: err.status,
    });
  }

  const status = getStatusCode(ctx, 500);

  return honoCtx.json(err, {
    status,
  });
}

async function handleRestBeforeHook(options: BeforeHookRestHandlerOption) {
  const { hooks, honoCtx, blazeCtx } = options;

  for (const hook of hooks) {
    const [, hookErr] = await resolvePromise(hook(blazeCtx));

    if (hookErr) {
      handleRestError({
        ctx: blazeCtx,
        err: hookErr,
        honoCtx,
      });

      return {
        ok: false,
        result: null,
      };
    }
  }

  return {
    ok: true,
    result: null,
  };
}

async function handleRestAfterHook(options: AfterHookRestHandlerOption) {
  const { blazeCtx, honoCtx, hooks, result } = options;

  let finalResult: unknown = result;

  for (const hook of hooks) {
    const [hookRes, hookErr] = await resolvePromise(
      hook(blazeCtx, finalResult)
    );

    if (hookErr) {
      handleRestError({
        ctx: blazeCtx,
        err: hookErr,
        honoCtx,
      });

      return {
        ok: false,
        result: null,
      };
    }

    finalResult = hookRes;
  }

  return {
    ok: true,
    result: finalResult,
  };
}

function createRestHandler(options: CreateRestHandlerOption) {
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

      const { ok: shouldContinue } = await handleRestBeforeHook({
        hooks: beforeHooks,
        blazeCtx,
        honoCtx,
      });

      if (!shouldContinue) return;
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

      const { ok: shouldContinue, result: afterResult } =
        await handleRestAfterHook({
          result,
          hooks: afterHooks,
          blazeCtx,
          honoCtx,
        });

      if (!shouldContinue) return;

      result = afterResult;
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

export function setupRestHandler(options: RestHandlerOption) {
  const [method, path] = extractRestParams(options.rest);
  const apiHandler = createRestHandler({
    handler: options.handler,
    hooks: options.hooks,
  });
  const routeHandler = getRouteHandler(options.router, method);

  routeHandler(path, apiHandler);
}
