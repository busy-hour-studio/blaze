import type { Context as HonoCtx, MiddlewareHandler } from 'hono';
import type { BlazeRouter } from '../../../router/BlazeRouter.ts';
import type { BlazeContext } from '../../internal/index.ts';
import type { BlazeAction } from '../../types/action.ts';
import type { BlazeService } from '../../types/service.ts';

export interface BlazeServiceRestOption {
  service: BlazeService;
  action: Omit<BlazeAction, 'name'>;
  router: BlazeRouter;
  middlewares: MiddlewareHandler[];
}

export interface BlazeRestErrorHandlerOption {
  err: Error | unknown;
  ctx: BlazeContext;
  honoCtx: HonoCtx;
}
export interface BlazeRestResponseHandlerOption {
  ctx: BlazeContext;
  honoCtx: HonoCtx;
  result: unknown;
}
