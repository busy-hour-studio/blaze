import type {
  RouteConfig,
  ZodRequestBody,
} from '@asteasolutions/zod-to-openapi';
import type { Router } from 'hono/router';
import type { Env, MiddlewareHandler, RouterRoute } from 'hono/types';
import type { ZodSchema } from 'zod';
import type { RecordUnknown } from './helper';
import type { Method } from './rest';
import type { Middleware } from './service';

export interface CreateBlazeOption {
  router?: Router<[never, RouterRoute]>;
  path?: string | null;
  autoStart?: boolean | null;
  middlewares?: Middleware[];
}

export interface OpenAPIRequest {
  body?: ZodRequestBody;
  params?: ZodSchema;
  headers?: ZodSchema;
  query?: ZodSchema;
}

export interface BlazeOpenAPIOption
  extends Omit<RouteConfig, 'request' | 'method'> {
  request: OpenAPIRequest;
  method: Method;
  handler: MiddlewareHandler;
  middlewares: MiddlewareHandler[];
}

export interface BlazeFetch<E extends Env = Env> {
  (
    request: Request,
    Env?: E['Bindings'] | RecordUnknown,
    executionCtx?: RecordUnknown
  ): Response | Promise<Response>;
}

export interface ServeConfig {
  fetch: BlazeFetch;
  port: number;
  reusePort: boolean;
}
