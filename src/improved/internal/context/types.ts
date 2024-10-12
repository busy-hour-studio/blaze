import type { Context as HonoCtx } from 'hono';
import type { ZodSchema } from 'zod';
import type { RecordString, RecordUnknown } from '../../types/common.ts';
import type { OnBlazeActionEventErrorHandler } from '../../types/handler.ts';
import type { BlazeValidator } from '../../types/validator.ts';

export interface CreateBlazeContextOption<
  M extends RecordUnknown = RecordUnknown,
  H extends RecordString = RecordString,
  P extends RecordUnknown = RecordUnknown,
  Q extends RecordUnknown = RecordUnknown,
  B extends RecordUnknown = RecordUnknown,
  HV extends ZodSchema = ZodSchema,
  PV extends ZodSchema = ZodSchema,
  QV extends ZodSchema = ZodSchema,
  BV extends ZodSchema = ZodSchema,
  V extends BlazeValidator<HV, PV, QV, BV> = BlazeValidator<HV, PV, QV, BV>,
> {
  honoCtx: HonoCtx | null;
  meta: M | null;
  headers: H | null;
  params: P | null;
  query: Q | null;
  body: B | null;
  validator: V | null;
  onError: OnBlazeActionEventErrorHandler<M, H, P, Q, B> | null;
}

export interface BlazeContextOption<
  M extends RecordUnknown,
  H extends RecordString,
  P extends RecordUnknown,
  Q extends RecordUnknown,
  B extends RecordUnknown,
  HV extends ZodSchema = ZodSchema,
  PV extends ZodSchema = ZodSchema,
  QV extends ZodSchema = ZodSchema,
  BV extends ZodSchema = ZodSchema,
> extends Omit<
    CreateBlazeContextOption<M, H, P, Q, B, HV, PV, QV, BV>,
    'validator' | 'onError'
  > {}
