import type { Context as HonoCtx } from 'hono';
import type { ZodObject, ZodRawShape } from 'zod';
import type {
  ContextValidation,
  RecordString,
  RecordUnknown,
  ValidationResult,
} from './helper';

export interface CreateContextOption<
  M extends RecordUnknown = RecordUnknown,
  B extends RecordUnknown = RecordUnknown,
  P extends RecordUnknown = RecordUnknown,
  H extends RecordString = RecordString,
  BV extends ZodObject<ZodRawShape> = ZodObject<ZodRawShape>,
  PV extends ZodObject<ZodRawShape> = ZodObject<ZodRawShape>,
  HV extends ZodObject<ZodRawShape> = ZodObject<ZodRawShape>,
  V extends ContextValidation<BV, PV, HV> = ContextValidation<BV, PV, HV>,
> {
  honoCtx: HonoCtx | null;
  meta: M | null;
  body: B | null;
  params: P | null;
  headers: H | null;
  validator: V | null;
  throwOnValidationError: boolean;
}

export interface ContextConstructorOption<
  M extends RecordUnknown = RecordUnknown,
  B extends RecordUnknown = RecordUnknown,
  P extends RecordUnknown = RecordUnknown,
  H extends RecordString = RecordString,
> extends Omit<
    CreateContextOption<M, B, P, H>,
    'validator' | 'throwOnValidationError'
  > {
  validations: ValidationResult | null;
}
