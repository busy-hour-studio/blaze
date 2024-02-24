import type { BlazeContext } from '@/event/BlazeContext';
import type { Context as HonoCtx } from 'hono';

export async function getReqBody(honoCtx: HonoCtx) {
  const contentType = honoCtx.req.header('Content-Type');

  if (!contentType) return null;

  const formType = ['application/x-www-form-urlencoded', 'multipart/form-data'];

  const isFormLike = formType.some((type) => contentType.startsWith(type));
  const isJson = contentType.startsWith('application/json');
  const isText = contentType.startsWith('text/');
  const isBlob = contentType.startsWith('application/octet-stream');

  if (isFormLike) {
    return honoCtx.req.parseBody({
      all: true,
    });
  }

  if (isJson) {
    return honoCtx.req.json();
  }

  if (isText) {
    return honoCtx.req.text();
  }

  if (isBlob) {
    return honoCtx.req.blob();
  }

  return null;
}

export function getStatusCode(ctx: BlazeContext, defaultStatusCode: number) {
  const status = ctx.header.get('status');

  let statusCode = Array.isArray(status) ? +status.at(-1)! : +status;

  if (Number.isNaN(statusCode)) {
    statusCode = defaultStatusCode;
  }

  return statusCode;
}
