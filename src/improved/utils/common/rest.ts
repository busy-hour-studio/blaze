import type { Context as HonoCtx } from 'hono';
import qs from 'node:querystring';
import type { RecordUnknown } from '../../types/common.ts';
import {
  FORM_CONTENT_TYPE,
  REST_CONTENT_TYPE,
} from '../constants/rest/index.ts';

export function getReqQuery<T extends RecordUnknown = RecordUnknown>(
  honoCtx: HonoCtx
) {
  const url = new URL(honoCtx.req.url).searchParams;

  return qs.parse(url.toString()) as T;
}

export function getReqBody(honoCtx: HonoCtx) {
  const contentType = honoCtx.req.header('Content-Type');

  if (!contentType) return null;

  const isFormLike = FORM_CONTENT_TYPE.some((type) =>
    contentType.startsWith(type)
  );
  const isJson = contentType.startsWith(REST_CONTENT_TYPE.JSON);
  const isText = contentType.startsWith(REST_CONTENT_TYPE.TEXT);
  const isBlob = contentType.startsWith(REST_CONTENT_TYPE.BODY);

  switch (true) {
    case isFormLike:
      return honoCtx.req.parseBody({
        all: true,
      });

    case isJson:
      return honoCtx.req.json();

    case isText:
      return honoCtx.req.text();

    case isBlob:
      return honoCtx.req.blob();

    default:
      return null;
  }
}
