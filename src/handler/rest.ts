import type { Context as HonoCtx } from 'hono';
import type { BlazeContext } from '../internal/context/index.ts';
import { BlazeError } from '../internal/errors/index.ts';
import type { BlazeRouter } from '../router/index.ts';
import type { Random } from '../types/common.ts';
import type {
  Method,
  RestErrorHandlerOption,
  RestResponseHandlerOption,
  StatusCode,
} from '../types/rest.ts';
import {
  isEmpty,
  isNil,
  mapToObject,
  resolvePromise,
} from '../utils/common.ts';
import { RESPONSE_TYPE } from '../utils/constant/rest/index.ts';

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
    case RESPONSE_TYPE.TEXT:
      return honoCtx.text(...args);

    case RESPONSE_TYPE.HTML:
      return honoCtx.html(...args);

    case RESPONSE_TYPE.BODY:
      return honoCtx.body(...args);

    case RESPONSE_TYPE.JSON:
    case null:
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
