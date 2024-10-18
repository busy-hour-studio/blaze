import type { ResponseConfig } from '@asteasolutions/zod-to-openapi';
import type { ProcedureType } from '@trpc/server';
import type { MiddlewareHandler } from 'hono';
import type { ZodSchema } from 'zod';
import type { BlazeContext } from '../internal/context/index.ts';
import type { Random, RecordString, RecordUnknown } from './common.ts';
import { onRestErrorHandler } from './handler.ts';
import type {
  AcceptedAfterHook,
  AcceptedBeforeHook,
  ActionHook,
} from './hooks/index.ts';
import type { RestParam } from './rest.ts';

export interface ActionValidator<
  H extends ZodSchema = ZodSchema,
  P extends ZodSchema = ZodSchema,
  Q extends ZodSchema = ZodSchema,
  B extends ZodSchema = ZodSchema,
> {
  header?: H | null;
  params?: P | null;
  query?: Q | null;
  body?: B | null;
}

export interface ActionHandler<
  R = unknown | void,
  M extends RecordUnknown = RecordUnknown,
  H extends RecordString = RecordString,
  P extends RecordUnknown = RecordUnknown,
  Q extends RecordUnknown = RecordUnknown,
  B extends RecordUnknown = RecordUnknown,
> {
  (ctx: BlazeContext<M, H, P, Q, B>): Promise<R>;
}

export interface OpenAPIBody {
  required?: boolean;
  description?: string;
  type:
    | 'application/json'
    | 'multipart/form-data'
    | 'application/x-www-form-urlencoded';
}

export interface ActionOpenAPI {
  responses?: Record<number, ResponseConfig> | null;
  body?: OpenAPIBody | null;
}

export interface Action<
  R = unknown | void,
  HR = unknown | void,
  M extends RecordUnknown = RecordUnknown,
  H extends ZodSchema = ZodSchema,
  P extends ZodSchema = ZodSchema,
  Q extends ZodSchema = ZodSchema,
  B extends ZodSchema = ZodSchema,
  AH extends AcceptedAfterHook<
    HR,
    M,
    H['_output'],
    P['_output'],
    Q['_output'],
    B['_output']
  > = AcceptedAfterHook<
    HR,
    M,
    H['_output'],
    P['_output'],
    Q['_output'],
    B['_output']
  >,
  BH extends AcceptedBeforeHook<
    M,
    H['_output'],
    P['_output'],
    Q['_output'],
    B['_output']
  > = AcceptedBeforeHook<
    M,
    H['_output'],
    P['_output'],
    Q['_output'],
    B['_output']
  >,
  TRPC extends ProcedureType = ProcedureType,
> {
  openapi?: ActionOpenAPI | null;
  /**
   * Define a middleware that need to be executed before action handlers
   */
  middlewares?: MiddlewareHandler[] | null;
  /**
   * Define a middleware that need to be executed after all the middlewares + action handlers
   */
  afterMiddlewares?: MiddlewareHandler[] | null;
  validator?: ActionValidator<H, P, Q, B> | null;
  handler: ActionHandler<
    R,
    M,
    H['_output'],
    P['_output'],
    Q['_output'],
    B['_output']
  >;
  meta?: M | null;
  rest?: RestParam | null;
  hooks?: ActionHook<AH, BH> | null;
  onRestError?: onRestErrorHandler<
    M,
    H['_output'],
    P['_output'],
    Q['_output'],
    B['_output']
  > | null;
  trpc?: TRPC | null;
}

export type ActionCallResult<U> =
  | { error: Error; ok: false }
  | { ok: true; result: U };

export type AnyAction = Action<
  Random,
  Random,
  Random,
  Random,
  Random,
  Random,
  Random,
  Random,
  Random,
  Random
>;

export type AnyValidator = ActionValidator<Random, Random, Random, Random>;

export interface Actions {
  [key: string]: AnyAction;
}
