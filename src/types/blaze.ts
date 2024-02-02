import { type Router } from 'hono/router';
import { type RouterRoute } from 'hono/types';
import { type BlazeContext } from '@/event/BlazeContext';
import { type Hono, type Context as HonoCtx } from 'hono';

export type Method =
  | 'ALL'
  | 'POST'
  | 'GET'
  | 'PUT'
  | 'PATCH'
  | 'OPTIONS'
  | 'DELETE'
  | 'USE';

export type ActionHandler = (
  ctx: BlazeContext
) => Promise<unknown | void> | unknown | void;

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

export interface EventHandler {
  name: string;
  handler(...values: unknown[]): ReturnType<ActionHandler>;
}

export interface Action {
  name?: string;
  middlewares?: ActionHandler[];
  handler: ActionHandler;
  rest?: RestParam;
}

export type ActionCallResult<U> =
  | { error: Error; ok: false; result: null }
  | { error: null; ok: true; result: U };

export interface Actions {
  [key: string]: Action;
}

export interface Service {
  name: string;
  prefix?: string;
  actions: Actions;
  onCreated?: ActionHandler;
  onStarted?: ActionHandler;
  onStopped?(handlers: EventHandler[]): void;
  router?: Router<[never, RouterRoute]>;
}

export interface LoadServiceOption {
  app: Hono;
  servicePath: string;
  ignoreNotFound?: boolean;
}

export interface AssignActionOption {
  service: Service;
  router: Hono;
}

export interface RestErrorHandlerOption {
  err: Error | unknown;
  ctx: BlazeContext;
  honoCtx: HonoCtx;
}
