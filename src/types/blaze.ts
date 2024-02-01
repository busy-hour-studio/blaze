import { BaseBlazeEvent } from '@/event/BaseBlazeEvent';

import { type Router } from 'hono/router';
import { type RouterRoute } from 'hono/types';
import { BlazeContext } from '@/event/BlazeContext';
import { Hono } from 'hono';

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

export interface Actions {
  [key: string]: Action;
}

export interface Service {
  name: string;
  prefix?: string;
  actions: Actions;
  onCreated?(ctx: BaseBlazeEvent): void;
  onStarted?(ctx: BaseBlazeEvent): void;
  onStopped?(handlers: EventHandler[]): void;
  router?: Router<[never, RouterRoute]>;
}
