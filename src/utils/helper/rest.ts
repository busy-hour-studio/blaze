import { Hono } from 'hono';
import { BlazeError } from '../../errors/BlazeError';
import type { BlazeContext } from '../../event/BlazeContext';
import type {
  Method,
  RestErrorHandlerOption,
  RestParam,
  RestResponseHandlerOption,
  RestRoute,
} from '../../types/rest';

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

export function getStatusCode(ctx: BlazeContext, defaultStatusCode: number) {
  const status = ctx.header.get('status');

  let statusCode = Array.isArray(status) ? +status.at(-1)! : +status;

  if (Number.isNaN(statusCode)) {
    statusCode = defaultStatusCode;
  }

  return statusCode;
}

export function handleRestError(options: RestErrorHandlerOption) {
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
export function handleRestResponse(options: RestResponseHandlerOption) {
  const { ctx, honoCtx, result } = options;
  const status = getStatusCode(ctx, 200);
  const headers = ctx.header.get();

  const respOption = {
    headers,
    status,
  };

  switch (ctx.response.get()) {
    case 'json':
      return honoCtx.json(result, respOption);

    case 'text':
      return honoCtx.text(result as string, respOption);

    case 'html':
      return honoCtx.html(result as string, respOption);

    case 'body':
    default:
      return honoCtx.body(result, respOption);
  }
}
