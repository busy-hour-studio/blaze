import type { Context as HonoCtx } from 'hono';
import type { ZodSchema } from 'zod';
import type { BlazeContext } from '../internal/index.ts';
import type { Random, RecordString, RecordUnknown } from './common.ts';
import type { OnBlazeActionEventErrorHandler } from './handler.ts';

export interface BlazeValidator<
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

export type AnyBlazeValidator = BlazeValidator<Random, Random, Random, Random>;

export interface BlazeDataValidatorOption<
  M extends RecordUnknown = RecordUnknown,
  H extends RecordString = RecordString,
  P extends RecordUnknown = RecordUnknown,
  Q extends RecordUnknown = RecordUnknown,
  B extends RecordUnknown = RecordUnknown,
> {
  data: Random;
  schema: ZodSchema;
  honoCtx: HonoCtx | null;
  ctx: BlazeContext<M, H, P, Q, B>;
  onError: OnBlazeActionEventErrorHandler<M, H, P, Q, B> | null;
  setter: {
    headers: (headers: H) => void;
    params: (params: P) => void;
    query: (query: Q) => void;
    body: (body: B) => void;
  };
}
