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
  B extends
    | ZodObject<ZodRawShape>
    | ZodEffects<ZodObject<ZodRawShape>> = ZodObject<ZodRawShape>,
  P extends
    | ZodObject<ZodRawShape>
    | ZodEffects<ZodObject<ZodRawShape>> = ZodObject<ZodRawShape>,
  H extends
    | ZodObject<ZodRawShape>
    | ZodEffects<ZodObject<ZodRawShape>> = ZodObject<ZodRawShape>,
  Q extends
    | ZodObject<ZodRawShape>
    | ZodEffects<ZodObject<ZodRawShape>> = ZodObject<ZodRawShape>,
> {
  body?: B | null;
  params?: P | null;
  header?: H | null;
  query?: Q | null;
}

export interface ActionHandler<
  R = unknown | void,
  M extends RecordUnknown = RecordUnknown,
  B extends RecordUnknown = RecordUnknown,
  P extends RecordUnknown = RecordUnknown,
  H extends RecordString = RecordString,
  Q extends RecordUnknown = RecordUnknown,
> {
  (ctx: BlazeContext<M, B, P, H, Q>): Promise<R>;
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
  B extends
    | ZodObject<ZodRawShape>
    | ZodEffects<ZodObject<ZodRawShape>> = ZodObject<ZodRawShape>,
  P extends
    | ZodObject<ZodRawShape>
    | ZodEffects<ZodObject<ZodRawShape>> = ZodObject<ZodRawShape>,
  Q extends
    | ZodObject<ZodRawShape>
    | ZodEffects<ZodObject<ZodRawShape>> = ZodObject<ZodRawShape>,
  AH extends AcceptedAfterHook<
    HR,
    M,
    B['_output'],
    P['_output'],
    H['_output'],
    Q['_output']
  > = AcceptedAfterHook<
    HR,
    M,
    B['_output'],
    P['_output'],
    H['_output'],
    Q['_output']
  >,
  BH extends AcceptedBeforeHook<
    M,
    B['_output'],
    P['_output'],
    H['_output'],
    Q['_output']
  > = AcceptedBeforeHook<
    M,
    B['_output'],
    P['_output'],
    H['_output'],
    Q['_output']
  >,
> {
  openapi?: ActionOpenAPI | null;
  middlewares?: Middleware[] | null;
  validator?: ActionValidator<B, P, H, Q> | null;
  handler: ActionHandler<
    R,
    M,
    B['_output'],
    P['_output'],
    H['_output'],
    Q['_output']
  >;
  meta?: M | null;
  rest?: RestParam | null;
  hooks?: ActionHook<BH, AH> | null;
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

export type AnyValidator = ActionValidator<
  ZodObject<ZodRawShape>,
  ZodObject<ZodRawShape>,
  ZodObject<ZodRawShape>,
  ZodObject<ZodRawShape>
>;

export interface Actions {
  [key: string]: AnyAction;
}
