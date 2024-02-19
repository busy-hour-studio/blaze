import type { Action } from '@/types/action';
import type { Method, RestHandlerOption } from '@/types/rest';
import type { Context as HonoCtx } from 'hono';
import type { MiddlewareHandlerInterface } from 'hono/types';
import { createContext } from '../common';
import { getStatusCode } from '../helper/context';
import { eventHandler } from '../helper/handler';
import {
  extractRestParams,
  getRouteHandler,
  handleRestError,
} from '../helper/rest';

export class BlazeServiceRest {
  public readonly path: string;
  public readonly method: Method | null;
  private action: Action;
  private routeHandler: MiddlewareHandlerInterface;

  constructor(options: RestHandlerOption) {
    const { router, rest } = options;

    const [method, path] = extractRestParams(rest);
    const routeHandler = getRouteHandler(router, method);

    this.path = path;
    this.method = method;
    this.action = options;
    this.routeHandler = routeHandler;
    this.routeHandler(path, this.restHandler.bind(this));
  }

  private async restHandler(honoCtx: HonoCtx) {
    const contextRes = await createContext({
      honoCtx,
      // NULL => automatically use honoCtx value instead
      body: null,
      headers: null,
      params: null,
    });

    if (!contextRes.ok) {
      return honoCtx.json(contextRes.error, {
        status: 500,
      });
    }

    const { result: blazeCtx } = contextRes;

    const restResult = await eventHandler(this.action, blazeCtx);

    if (!restResult.ok) {
      return handleRestError({
        ctx: blazeCtx,
        err: restResult.error,
        honoCtx,
      });
    }

    const { result } = restResult;

    if (!result) {
      return honoCtx.body(null, 204);
    }

    const status = getStatusCode(blazeCtx, 200);

    return honoCtx.json(result, {
      status,
    });
  }
}
