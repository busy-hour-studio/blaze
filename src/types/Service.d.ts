declare module '@busyhour/blaze' {
  import BlazeEvent from '@/utils/event/BaseBlazeEvent';

  import { type Router } from 'hono/router';
  import { type RouterRoute } from 'hono/types';
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
    Input = NonNullable<unknown>,
  > = HonoCtx<Env, string, Input> & {
    next: Next;
    ctx: BlazeEvent;
  };

  export type ActionHandler = (
    ctx: BlazeEvent,
    ...values: unknown[]
  ) => Promise<unknown | void> | null | undefined;

  export type RestHandler = (ctx: Context) => Promise<void> | void;

  export type RestParam = {
    handler: RestHandler;
    method: Method | Lowercase<Method>;
    path: string;
  };

  export type EventHandler = {
    name: string;
    handler(...values: unknown[]): ReturnType<ActionHandler>;
  };

  export type Action = {
    name?: string;
    handler?: ActionHandler;
    rest?: RestParam;
  };

  export interface Actions {
    [key: string]: Action;
  }

  export interface Service {
    name: string;
    prefix?: string;
    actions: Actions;
    onCreated?(ctx: BlazeEvent): void;
    onStarted?(ctx: BlazeEvent): void;
    onStopped?(handlers: EventHandler[]): void;
    router?: Router<[never, RouterRoute]>;
  }
}
