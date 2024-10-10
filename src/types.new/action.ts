import type { ProcedureType } from '@trpc/server';
import type { ZodSchema } from 'zod';
import type { Random, RecordUnknown } from './common';
import type { BlazeActionHandler } from './handler';
import type {
  BlazeAcceptedAfterHook,
  BlazeAcceptedBeforeHook,
  BlazeActionHook,
} from './hook';
import type { BlazeActionOpenAPI } from './openapi';
import type { BlazeRestParam, Middleware } from './rest';

export interface BlazeActionValidator<
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

export interface BlazeAction<
  R = unknown | void,
  HR = unknown | void,
  M extends RecordUnknown = RecordUnknown,
  H extends ZodSchema = ZodSchema,
  P extends ZodSchema = ZodSchema,
  Q extends ZodSchema = ZodSchema,
  B extends ZodSchema = ZodSchema,
  AH extends BlazeAcceptedAfterHook<
    HR,
    M,
    H['_output'],
    P['_output'],
    Q['_output'],
    B['_output']
  > = BlazeAcceptedAfterHook<
    HR,
    M,
    H['_output'],
    P['_output'],
    Q['_output'],
    B['_output']
  >,
  BH extends BlazeAcceptedBeforeHook<
    M,
    H['_output'],
    P['_output'],
    Q['_output'],
    B['_output']
  > = BlazeAcceptedBeforeHook<
    M,
    H['_output'],
    P['_output'],
    Q['_output'],
    B['_output']
  >,
  TRPC extends ProcedureType = ProcedureType,
> {
  openapi?: BlazeActionOpenAPI | null;
  middlewares?: Middleware[] | null;
  validator?: BlazeActionValidator<H, P, Q, B> | null;
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
  throwOnValidationError?: boolean | null;
  trpc?: TRPC | null;
}

export type AnyBlazeAction = BlazeAction<
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

export type AnyBlazeActionValidator = BlazeActionValidator<
  ZodSchema,
  ZodSchema,
  ZodSchema,
  ZodSchema
>;

export type AnyBlazeActions = Record<string, AnyBlazeAction>;

export interface CreateBlazeActionOption {
  action: BlazeAction;
  serviceName: string;
  actionAlias: string;
}
