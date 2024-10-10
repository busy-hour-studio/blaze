import type { Router } from 'hono/router';
import type { Env, RouterRoute } from 'hono/types';
import type { RecordUnknown } from './common';
import type { Middleware } from './rest';

export interface CreateBlazeOption {
  router?: Router<[never, RouterRoute]>;
  path?: string | null;
  autoStart?: boolean | null;
  middlewares?: Middleware[];
}

export interface BlazeFetch<E extends Env = Env> {
  (
    request: Request,
    Env?: E['Bindings'] | RecordUnknown,
    executionCtx?: RecordUnknown
  ): Response | Promise<Response>;
}

export interface BlazeServeConfig {
  fetch: BlazeFetch;
  port: number;
  reusePort: boolean;
}
