import type {
  ResponseConfig,
  RouteConfig,
  ZodRequestBody,
} from '@asteasolutions/zod-to-openapi';
import type { MiddlewareHandler } from 'hono';
import type { ZodSchema } from 'zod';
import type { BlazeRestMethod } from './rest.ts';

export interface OpenAPIBody {
  required?: boolean;
  description?: string;
  type:
    | 'application/json'
    | 'multipart/form-data'
    | 'application/x-www-form-urlencoded';
}

export interface BlazeOpenAPIConfig {
  responses?: Record<number, ResponseConfig> | null;
  body?: OpenAPIBody | null;
}

export interface BlazeOpenAPIRequest {
  body?: ZodRequestBody;
  params?: ZodSchema;
  headers?: ZodSchema;
  query?: ZodSchema;
}

export interface BlazeOpenAPIOption
  extends Omit<RouteConfig, 'request' | 'method'> {
  request: BlazeOpenAPIRequest;
  method: BlazeRestMethod;
  handler: MiddlewareHandler;
  middlewares: MiddlewareHandler[];
}
