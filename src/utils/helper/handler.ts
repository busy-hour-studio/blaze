import { type Context as HonoCtx } from 'hono';
import { type ActionHandler } from '@/types/action';
import { type RestErrorHandlerOption, RestHandlerOption } from '@/types/rest';
import { BlazeError } from '@/errors/BlazeError';
import { BlazeContext } from '@/event/BlazeContext';
import { extractRestParams, getRouteHandler } from './rest';
import { resolvePromise } from '../common';
import { getStatusCode } from './context';

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

function createRestHandler(
  handler: ActionHandler,
  middlewares: ActionHandler[]
) {
  return async function routeHandler(honoCtx: HonoCtx) {
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

    for (const middleware of middlewares) {
      const [, mwErr] = await resolvePromise(middleware(blazeCtx));

      if (mwErr) {
        return handleRestError({
          ctx: blazeCtx,
          err: mwErr,
          honoCtx,
        });
      }
    }

    const [result, handlerErr] = await resolvePromise(handler(blazeCtx));

    if (handlerErr) {
      return handleRestError({
        ctx: blazeCtx,
        err: handlerErr,
        honoCtx,
      });
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
  const apiHandler = createRestHandler(options.handler, options.middlewares);
  const routeHandler = getRouteHandler(options.router, method);

  routeHandler(path, apiHandler);
}
