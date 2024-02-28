import { Hono } from 'hono';
import { BlazeError } from '../../errors/BlazeError';
import type {
  Method,
  RestErrorHandlerOption,
  RestParam,
  RestResponseHandlerOption,
  RestRoute,
} from '../../types/rest';
import { mapToObject } from '../common';

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

export function getRouteHandler(router: Hono, method: Method | null) {
  if (!method) return router.all;

  return router[method.toLowerCase() as Lowercase<Method>];
}

export function handleRestError(options: RestErrorHandlerOption) {
  const { err, ctx, honoCtx } = options;

  if (err instanceof BlazeError) {
    return honoCtx.json(err, {
      status: err.status,
    });
  }

  // eslint-disable-next-line prefer-destructuring
  const status = ctx.status ?? 500;

  return honoCtx.json(err, status);
}

export function handleRestResponse(options: RestResponseHandlerOption) {
  const { ctx, honoCtx, result } = options;
  const status = ctx.status ?? undefined;
  let headers: Record<string, string> | undefined;

  if (status) {
    headers = ctx.headers.size > 0 ? mapToObject(ctx.headers) : undefined;
  }

  const args = [result as never, status, headers] as const;

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
