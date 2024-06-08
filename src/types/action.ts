import type { ResponseConfig } from '@asteasolutions/zod-to-openapi';
import type { ZodEffects, ZodObject, ZodRawShape } from 'zod';
import type { BlazeContext } from '../event';
import type { Random, RecordString, RecordUnknown } from './helper';
import type {
  AcceptedAfterHook,
  AcceptedBeforeHook,
  ActionHook,
} from './hooks';
import type { Middleware, RestParam } from './rest';

export interface ActionValidator<
  H extends
    | ZodObject<ZodRawShape>
    | ZodEffects<ZodObject<ZodRawShape>> = ZodObject<ZodRawShape>,
  P extends
    | ZodObject<ZodRawShape>
    | ZodEffects<ZodObject<ZodRawShape>> = ZodObject<ZodRawShape>,
  Q extends
    | ZodObject<ZodRawShape>
    | ZodEffects<ZodObject<ZodRawShape>> = ZodObject<ZodRawShape>,
  B extends
    | ZodObject<ZodRawShape>
    | ZodEffects<ZodObject<ZodRawShape>> = ZodObject<ZodRawShape>,
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
  H extends
    | ZodObject<ZodRawShape>
    | ZodEffects<ZodObject<ZodRawShape>> = ZodObject<ZodRawShape>,
  P extends
    | ZodObject<ZodRawShape>
    | ZodEffects<ZodObject<ZodRawShape>> = ZodObject<ZodRawShape>,
  Q extends
    | ZodObject<ZodRawShape>
    | ZodEffects<ZodObject<ZodRawShape>> = ZodObject<ZodRawShape>,
  B extends
    | ZodObject<ZodRawShape>
    | ZodEffects<ZodObject<ZodRawShape>> = ZodObject<ZodRawShape>,
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
> {
  openapi?: ActionOpenAPI | null;
  middlewares?: Middleware[] | null;
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
  throwOnValidationError?: boolean | null;
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
  Random
>;

export type AnyValidator = ActionValidator<Random, Random, Random, Random>;

export interface Actions {
  [key: string]: AnyAction;
}
