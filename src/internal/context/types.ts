import type { Context as HonoCtx } from 'hono';
import type { ZodSchema } from 'zod';
import type { RecordString, RecordUnknown } from '../../types/common';
import type { BlazeValidationErrorHandler } from '../../types/handler';
import type { BlazeContextValidation } from '../../types/validator';

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
  V extends BlazeContextValidation<HV, PV, QV, BV> = BlazeContextValidation<
    HV,
    PV,
    QV,
    BV
  >,
> {
  honoCtx: HonoCtx | null;
  meta: M | null;
  headers: H | null;
  params: P | null;
  query: Q | null;
  body: B | null;
  validator: V | null;
  onValidationError: BlazeValidationErrorHandler<
    M,
    // @ts-expect-error type doesnt match
    H['_output'],
    P['_output'],
    Q['_output'],
    B['_output']
  > | null;
}

export interface BlazeContextConstructorOption<
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
    'validator' | 'onValidationError'
  > {}
