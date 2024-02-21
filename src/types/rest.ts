import type { BlazeContext } from '@/event/BlazeContext';
import type { Blaze } from '@/router';
import type { Context as HonoCtx } from 'hono';
import type { Action } from './action';

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
  method?: Method | null;
  path: string;
}

export type RestParam = RestParamOption | RestRoute;

export interface RestHandlerOption {
  action: Omit<Action, 'name'>;
  router: Blaze;
}

export interface RestErrorHandlerOption {
  err: Error | unknown;
  ctx: BlazeContext;
  honoCtx: HonoCtx;
}
