import { Context as HonoCtx, Hono, Next } from 'hono';
import type { Context, Method, RestParam } from '@busyhour/blaze';
import { BlazeEvent } from './event/BlazeEvent';

export function restHandler(router: Hono, rest: RestParam) {
  const restPath = rest?.path;
  const restMethod = rest?.method?.toUpperCase?.() as Method | null;

  // eslint-disable-next-line @typescript-eslint/no-shadow
  async function restHandler(ctx: HonoCtx, next: Next) {
    const context = {
      ctx: BlazeEvent,
      ...ctx,
      next,
    } as Context;

    return rest.handler(context);
  }

  switch (restMethod) {
    case 'POST':
      router.post(restPath, restHandler);
      break;

    case 'GET':
      router.get(restPath, restHandler);
      break;

    case 'PUT':
      router.put(restPath, restHandler);
      break;

    case 'PATCH':
      router.patch(restPath, restHandler);
      break;

    case 'OPTIONS':
      router.options(restPath, restHandler);
      break;

    case 'DELETE':
      router.delete(restPath, restHandler);
      break;

    case 'USE':
      router.use(restPath, restHandler);
      break;

    default:
      router.all(restPath, restHandler);
      break;
  }
}
