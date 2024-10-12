import type { HandlerInterface } from 'hono/types';
import type { BlazeRouter } from '../../../router/BlazeRouter.ts';
import { BlazeError } from '../../internal/errors/index.ts';
import type { Random } from '../../types/common.ts';
import type {
  BlazeRestParam,
  BlazeRestRoute,
  ExposedBlazeRestMethod,
  StatusCode,
} from '../../types/rest.ts';
import { isEmpty, mapToObject } from '../../utils/common/index.ts';
import { RESPONSE_TYPE } from '../../utils/constants/rest/index.ts';
import type {
  BlazeRestErrorHandlerOption,
  BlazeRestResponseHandlerOption,
} from './types.ts';

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

export function getRouteHandler(
  router: BlazeRouter,
  method: ExposedBlazeRestMethod | null
) {
  if (!method) return router.all;

  return router[method.toLowerCase() as keyof BlazeRouter] as HandlerInterface;
}

export function getRestResponse(
  options: Omit<BlazeRestResponseHandlerOption, 'honoCtx'>
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

export function handleRestResponse(options: BlazeRestResponseHandlerOption) {
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
