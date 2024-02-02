import { type Hono, type Context as HonoCtx } from 'hono';
import { type BlazeContext } from '@/event/BlazeContext';
import { type ActionHandler } from './action';

export type Method =
  | 'ALL'
  | 'POST'
  | 'GET'
  | 'PUT'
  | 'PATCH'
  | 'OPTIONS'
  | 'DELETE'
  | 'USE';

export type RestRoute = `${Method} /${string}` | `/${string}`;

export interface RestParamOption {
  method?: Method;
  path: string;
}

export type RestParam = RestParamOption | RestRoute;

export interface RestHandlerOption {
  router: Hono;
  rest: RestParam;
  handler: ActionHandler;
  middlewares: ActionHandler[];
}

export interface RestErrorHandlerOption {
  err: Error | unknown;
  ctx: BlazeContext;
  honoCtx: HonoCtx;
}
