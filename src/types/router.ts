import type {
  RouteConfig,
  ZodRequestBody,
} from '@asteasolutions/zod-to-openapi';
import type { Router } from 'hono/router';
import type { MiddlewareHandler, RouterRoute } from 'hono/types';
import type { AnyZodObject } from 'zod';
import type { Method } from './rest';

export interface CreateBlazeOption {
  router?: Router<[never, RouterRoute]>;
}

export interface OpenAPIRequest {
  body?: ZodRequestBody;
  params?: AnyZodObject;
}

export interface BlazeOpenAPIOption
  extends Omit<RouteConfig, 'request' | 'method'> {
  request: OpenAPIRequest;
  method: Method;
  handler: MiddlewareHandler;
}
