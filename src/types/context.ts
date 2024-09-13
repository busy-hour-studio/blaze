import type { Context as HonoCtx } from 'hono';
import type { ZodSchema } from 'zod';
import type { BlazeContext } from '../internal';
import type {
  ContextValidation,
  Random,
  RecordString,
  RecordUnknown,
  ValidationResult,
} from './helper';

export interface CreateContextOption<
  M extends RecordUnknown = RecordUnknown,
  H extends RecordString = RecordString,
  P extends RecordUnknown = RecordUnknown,
  Q extends RecordUnknown = RecordUnknown,
  B extends RecordUnknown = RecordUnknown,
  HV extends ZodSchema = ZodSchema,
  PV extends ZodSchema = ZodSchema,
  QV extends ZodSchema = ZodSchema,
  BV extends ZodSchema = ZodSchema,
  V extends ContextValidation<HV, PV, QV, BV> = ContextValidation<
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
  throwOnValidationError: boolean;
}

export interface ContextConstructorOption<
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
    CreateContextOption<M, H, P, Q, B, HV, PV, QV, BV>,
    'validator' | 'throwOnValidationError'
  > {
  validations: ValidationResult | null;
}

export type AnyContext = BlazeContext<Random, Random, Random, Random, Random>;
