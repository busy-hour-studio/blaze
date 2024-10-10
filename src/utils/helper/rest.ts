import type { HandlerInterface } from 'hono/types';
import type { StatusCode } from 'hono/utils/http-status';
import { BlazeError } from '../../internal/error';
import type { BlazeRouter } from '../../router';
import type { BlazeAction } from '../../types/action';
import type { Random } from '../../types/common';
import type {
  BlazeRestErrorHandlerOption,
  BlazeRestParam,
  BlazeRestRoute,
  BlazeRestSuccessHandlerOption,
  ExposedBlazeRestMethod,
} from '../../types/rest';
import type { BlazeService } from '../../types/service';
import { isEmpty, mapToObject } from '../common';
import { REST_METHOD } from '../constant/rest';

export function extractRestPath(restRoute: BlazeRestRoute) {
  const restPath = restRoute.split(' ');

  if (restPath.length === 1) {
    return [null, restPath[0]] as const;
  }

  return [restPath[0] as ExposedBlazeRestMethod, restPath[1]] as const;
}

export function extractRestParams(params: BlazeRestParam) {
  if (typeof params === 'string') return extractRestPath(params);

  return [params.method ?? null, params.path] as const;
}

export function getRestMiddlewares(service: BlazeService, action: BlazeAction) {
  if (!service.middlewares || !action.rest) return [];

  const [method] = extractRestParams(action.rest);

  const middlewares = service.middlewares.filter(
    ([m]) => m === method || m === REST_METHOD.ALL
  );

  return middlewares.map(([, middleware]) => middleware);
}

export function getRouteHandler(
  router: BlazeRouter,
  method: ExposedBlazeRestMethod | null
) {
  if (!method) return router.all;

  return router[method.toLowerCase() as keyof BlazeRouter] as HandlerInterface;
}

export function getRestResponse(
  options: Omit<BlazeRestSuccessHandlerOption, 'honoCtx'>
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
    return [options.result, status, undefined] as const;
  }

  const resHeaders = mapToObject(options.ctx.headers as never);

  return [options.result, status, resHeaders] as const;
}

export function handleRestError(options: BlazeRestErrorHandlerOption) {
  const { err, ctx, honoCtx } = options;

  let status = ctx.status ?? 500;

  if (err instanceof BlazeError) {
    status = err.status as StatusCode;
  }

  return honoCtx.json(err as Error, status);
}

export function handleRestResponse(options: BlazeRestSuccessHandlerOption) {
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
