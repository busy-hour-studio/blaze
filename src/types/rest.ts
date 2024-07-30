import type { Context as HonoCtx, MiddlewareHandler } from 'hono';
import type { BlazeContext } from '../internal';
import type { BlazeRouter } from '../router';
import type { Action } from './action';
import type { Service } from './service';

export type Method =
  | 'ALL'
  | 'POST'
  | 'GET'
  | 'PUT'
  | 'PATCH'
  | 'OPTIONS'
  | 'DELETE'
  | 'USE';

export type ExposedMethod = Exclude<Method, 'USE'> | NonNullable<unknown>;

export type Middleware = [ExposedMethod, MiddlewareHandler];

export type ResponseType = 'body' | 'text' | 'json' | 'html';

export type RestRoute = `${Method} /${string}` | `/${string}`;

export interface RestParamOption {
  method?: Method | null;
  path: string;
}

export type RestParam = RestParamOption | RestRoute;

export interface RestHandlerOption {
  service: Service;
  action: Omit<Action, 'name'>;
  router: BlazeRouter;
  middlewares: Middleware[];
}

export interface RestErrorHandlerOption {
  err: Error | unknown;
  ctx: BlazeContext;
  honoCtx: HonoCtx;
}
export interface RestResponseHandlerOption {
  ctx: BlazeContext;
  honoCtx: HonoCtx;
  result: unknown;
}
