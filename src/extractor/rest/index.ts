import type { Context as HonoCtx } from 'hono';
import qs from 'node:querystring';
import type { RecordUnknown } from '../../types/common';
import type { Method, RestParam, RestRoute } from '../../types/rest';
import {
  FORM_CONTENT_TYPE,
  REST_CONTENT_TYPE,
} from '../../utils/constant/rest/index';

export async function getReqBody(honoCtx: HonoCtx) {
  const contentType = honoCtx.req.header('Content-Type');
  if (!contentType) return null;

  if (FORM_CONTENT_TYPE.some((type) => contentType.startsWith(type))) {
    return honoCtx.req.parseBody({ all: true });
  }

  if (contentType.startsWith(REST_CONTENT_TYPE.JSON)) {
    return honoCtx.req.json();
  }

  if (contentType.startsWith(REST_CONTENT_TYPE.TEXT)) {
    return honoCtx.req.text();
  }

  if (contentType.startsWith(REST_CONTENT_TYPE.BODY)) {
    return honoCtx.req.blob();
  }

  return null;
}

export function getReqQuery<T extends RecordUnknown = RecordUnknown>(
  honoCtx: HonoCtx
) {
  const searchParams = new URLSearchParams(honoCtx.req.url.split('?')[1] || '');

  return qs.parse(searchParams.toString()) as T;
}

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
