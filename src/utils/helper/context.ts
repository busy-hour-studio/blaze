import { Context as HonoCtx } from 'hono';

export async function getReqBody(ctx: HonoCtx) {
  const contentType = ctx.req.header('Content-Type');

  if (!contentType) return null;

  const formType = ['application/x-www-form-urlencoded', 'multipart/form-data'];

  const isFormLike = formType.some((type) => contentType.startsWith(type));
  const isJson = contentType.startsWith('application/json');
  const isText = contentType.startsWith('text/');
  const isBlob = contentType.startsWith('application/octet-stream');

  if (isFormLike) {
    return ctx.req.parseBody({
      all: true,
    });
  }

  if (isJson) {
    return ctx.req.json();
  }

  if (isText) {
    return ctx.req.text();
  }

  if (isBlob) {
    return ctx.req.blob();
  }

  return null;
}
