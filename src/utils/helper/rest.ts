import { Context as HonoCtx } from 'hono';
import { BlazeError } from '../../errors/BlazeError';
import type { BlazeContext } from '../../internal';
import type { BlazeRouter } from '../../router';
import type { Action } from '../../types/action';
import { Random } from '../../types/helper';
import type {
  Method,
  RestErrorHandlerOption,
  RestParam,
  RestResponseHandlerOption,
  RestRoute,
  StatusCode,
} from '../../types/rest';
import type { Service } from '../../types/service';
import { isEmpty, isNil, mapToObject, resolvePromise } from '../common';
import { REST_METHOD } from '../constant/rest';

export function extractRestPath(restRoute: RestRoute) {
  const restPath = restRoute.split(' ');

  if (restPath.length === 1) {
    return [null, restPath[0]] as const;
  }

  return [restPath[0] as Method, restPath[1]] as const;
}

export function extractRestParams(params: RestParam) {
  if (typeof params === 'string') return extractRestPath(params);

  return [params.method ?? null, params.path] as const;
}

export function getRestMiddlewares(service: Service, action: Action) {
  if (!service.middlewares || !action.rest) return [];

  const [method] = extractRestParams(action.rest);

  const middlewares = service.middlewares.filter(
    ([m]) => m === method || m === REST_METHOD.ALL
  );

  return middlewares.map(([, middleware]) => middleware);
}

export function getRouteHandler(router: BlazeRouter, method: Method | null) {
  if (!method) return router.all;

  return router[method.toLowerCase() as Lowercase<Exclude<Method, 'HEAD'>>];
}

export function getRestResponse(
  options: Omit<RestResponseHandlerOption, 'honoCtx'>
): readonly [
  Random,
  StatusCode | undefined,
  Record<string, string | string[]> | undefined,
] {
  const { status, headers } = options.ctx;

  if (!status) {
    return [options.result, undefined, undefined] as const;
  }

  if (isEmpty(headers)) {
    return [options.result, status as StatusCode, undefined] as const;
  }

  const resHeaders = mapToObject(options.ctx.headers as never);

  return [options.result, status as StatusCode, resHeaders] as const;
}

export function handleRestError(options: RestErrorHandlerOption) {
  const { err, ctx, honoCtx } = options;

  let status = ctx.status ?? 500;

  if (err instanceof BlazeError) {
    status = err.status;
  }

  return honoCtx.json(err as Error, status as StatusCode);
}

export function handleRestResponse(options: RestResponseHandlerOption) {
  const { ctx, honoCtx } = options;
  const args = getRestResponse(options);

  switch (ctx.response) {
    case 'text':
      return honoCtx.text(...args);

    case 'html':
      return honoCtx.html(...args);

    case 'body':
      return honoCtx.body(...args);

    case 'json':
    default:
      return honoCtx.json(...args);
  }
}

export async function handleRest<T>(options: {
  ctx: BlazeContext;
  honoCtx: HonoCtx;
  promise: Promise<T> | T;
}) {
  const { ctx, honoCtx, promise } = options;
  const [restResult, restError] = await resolvePromise(promise);

  if (restError) {
    return handleRestError({
      ctx,
      err: restError,
      honoCtx,
    });
  }

  if (isNil(restResult)) {
    return honoCtx.body(null, 204);
  }

  return handleRestResponse({
    ctx,
    honoCtx,
    result: restResult,
  });
}
