import { BaseBlazeEvent } from '@/event/BaseBlazeEvent';

import { type Router } from 'hono/router';
import {
  TypedResponse,
  type Input as HonoInput,
  type RouterRoute,
} from 'hono/types';
import { type Env as HonoEnv, type Context as HonoCtx, Next } from 'hono';

export type Method =
  | 'POST'
  | 'GET'
  | 'PUT'
  | 'PATCH'
  | 'OPTIONS'
  | 'DELETE'
  | 'USE';

export type Context<
  Env extends HonoEnv = HonoEnv,
  Input extends HonoInput = NonNullable<unknown>,
> = HonoCtx<Env, string, Input> & {
  next: Next;
  blaze: BaseBlazeEvent;
};

export type ActionHandler = (
  blaze: BaseBlazeEvent,
  ...values: unknown[]
) => Promise<unknown | void> | null | undefined;

export type RestResponse = Response & TypedResponse<never>;

export type RestHandler = (
  ctx: Context
) => RestResponse | Promise<RestResponse>;

export interface RestParam {
  authorization?: RestHandler;
  handler: RestHandler;
  method?: Method;
  path: string;
}

export interface EventHandler {
  name: string;
  handler(...values: unknown[]): ReturnType<ActionHandler>;
}

export interface Action {
  name?: string;
  authorization?: ActionHandler;
  handler?: ActionHandler;
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
