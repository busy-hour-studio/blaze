import { type Context as HonoCtx } from 'hono';
import type { ActionHandler, RestHandlerOption } from '@/types/blaze';
import { BlazeContext } from '@/event/BlazeContext';
import { extractRestParams, getRouteHandler } from './rest';
import { resolvePromise } from '../common';
import { getStatusCode } from './context';

function createRestHandler(handler: ActionHandler) {
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

    const [result, handlerErr] = await resolvePromise(handler(blazeCtx));

    if (handlerErr) {
      const status = getStatusCode(blazeCtx, 500);

      return honoCtx.json(handlerErr, {
        status,
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
  const apiHandler = createRestHandler(options.handler);
  const routeHandler = getRouteHandler(options.router, method);

  routeHandler(path, apiHandler);
}
