import type { ProcedureType } from '@trpc/server';
import type { MiddlewareHandler } from 'hono';
import type { ZodSchema } from 'zod';
import type { BlazeContext } from '../internal/index.ts';
import type { Random, RecordString, RecordUnknown } from './common.ts';
import type { OnBlazeActionEventErrorHandler } from './handler.ts';
import type { AcceptedBlazeAfterHook } from './hooks/after.ts';
import type { AcceptedBlazeBeforeHook } from './hooks/before.ts';
import type { BlazeActionHook } from './hooks/index.ts';
import type { BlazeOpenAPIConfig } from './openapi.ts';
import type { BlazeRestParam } from './rest.ts';
import type { BlazeValidator } from './validator.ts';

export interface BlazeActionHandler<
  R = unknown | void,
  M extends RecordUnknown = RecordUnknown,
  H extends RecordString = RecordString,
  P extends RecordUnknown = RecordUnknown,
  Q extends RecordUnknown = RecordUnknown,
  B extends RecordUnknown = RecordUnknown,
> {
  (ctx: BlazeContext<M, H, P, Q, B>): Promise<R>;
}

export interface BlazeAction<
  R = unknown | void,
  HR = unknown | void,
  M extends RecordUnknown = RecordUnknown,
  H extends ZodSchema = ZodSchema,
  P extends ZodSchema = ZodSchema,
  Q extends ZodSchema = ZodSchema,
  B extends ZodSchema = ZodSchema,
  AH extends AcceptedBlazeAfterHook<
    HR,
    M,
    H['_output'],
    P['_output'],
    Q['_output'],
    B['_output']
  > = AcceptedBlazeAfterHook<
    HR,
    M,
    H['_output'],
    P['_output'],
    Q['_output'],
    B['_output']
  >,
  BH extends AcceptedBlazeBeforeHook<
    M,
    H['_output'],
    P['_output'],
    Q['_output'],
    B['_output']
  > = AcceptedBlazeBeforeHook<
    M,
    H['_output'],
    P['_output'],
    Q['_output'],
    B['_output']
  >,
  TRPC extends ProcedureType = ProcedureType,
> {
  openapi?: BlazeOpenAPIConfig | null;
  middlewares?: MiddlewareHandler[] | null;
  validator?: BlazeValidator<H, P, Q, B> | null;
  handler: BlazeActionHandler<
    R,
    M,
    H['_output'],
    P['_output'],
    Q['_output'],
    B['_output']
  >;
  meta?: M | null;
  rest?: BlazeRestParam | null;
  hooks?: BlazeActionHook<AH, BH> | null;
  onError?: OnBlazeActionEventErrorHandler<
    M,
    H['_output'],
    P['_output'],
    Q['_output'],
    B['_output']
  > | null;
  trpc?: TRPC | null;
}

export type AnyBlazeAction = BlazeAction<
  Random,
  Random,
  Random,
  Random,
  Random,
  Random,
  Random
>;

export interface AnyBlazeActions {
  [key: string]: AnyBlazeAction;
}
