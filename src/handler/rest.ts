import type { Context as HonoCtx } from 'hono';
import type { BlazeContext } from '../internal/context/index';
import { BlazeError } from '../internal/errors/index';
import type { BlazeRouter } from '../router/BlazeRouter';
import type { Random } from '../types/common';
import type {
  Method,
  RestErrorHandlerOption,
  RestResponseHandlerOption,
  StatusCode,
} from '../types/rest';
import { isEmpty, isNil, mapToObject } from '../utils/common';
import { RESPONSE_TYPE } from '../utils/constant/rest/index';

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
    default:
      return honoCtx.json(...args);
  }
}

export async function handleRest<T>(options: {
  ctx: BlazeContext;
  honoCtx: HonoCtx;
  promise: Promise<T> | T;
}): Promise<{ resp: Response; ok: boolean }> {
  const { ctx, honoCtx, promise } = options;

  try {
    const result = await promise;

    if (isNil(result)) {
      return { resp: honoCtx.body(null, 204), ok: true };
    }

    return {
      resp: await handleRestResponse({ ctx, honoCtx, result }),
      ok: true,
    };
  } catch (err) {
    return {
      resp: handleRestError({ ctx, err, honoCtx }),
      ok: false,
    };
  }
}
