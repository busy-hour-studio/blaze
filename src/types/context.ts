import type { Context as HonoCtx } from 'hono';
import type { ZodEffects, ZodObject, ZodRawShape } from 'zod';
import type { BlazeContext } from '../event';
import type {
  ContextValidation,
  Random,
  RecordString,
  RecordUnknown,
  ValidationResult,
} from './helper';

export interface CreateContextOption<
  M extends RecordUnknown = RecordUnknown,
  B extends RecordUnknown = RecordUnknown,
  P extends RecordUnknown = RecordUnknown,
  H extends RecordString = RecordString,
  Q extends RecordUnknown = RecordUnknown,
  BV extends
    | ZodObject<ZodRawShape>
    | ZodEffects<ZodObject<ZodRawShape>> = ZodObject<ZodRawShape>,
  PV extends
    | ZodObject<ZodRawShape>
    | ZodEffects<ZodObject<ZodRawShape>> = ZodObject<ZodRawShape>,
  HV extends
    | ZodObject<ZodRawShape>
    | ZodEffects<ZodObject<ZodRawShape>> = ZodObject<ZodRawShape>,
  QV extends
    | ZodObject<ZodRawShape>
    | ZodEffects<ZodObject<ZodRawShape>> = ZodObject<ZodRawShape>,
  V extends ContextValidation<BV, PV, HV, QV> = ContextValidation<
    BV,
    PV,
    HV,
    QV
  >,
> {
  honoCtx: HonoCtx | null;
  meta: M | null;
  body: B | null;
  params: P | null;
  headers: H | null;
  query: Q | null;
  validator: V | null;
  throwOnValidationError: boolean;
}

export interface ContextConstructorOption<
  M extends RecordUnknown = RecordUnknown,
  B extends RecordUnknown = RecordUnknown,
  P extends RecordUnknown = RecordUnknown,
  H extends RecordString = RecordString,
  Q extends RecordUnknown = RecordUnknown,
> extends Omit<
    CreateContextOption<M, B, P, H, Q>,
    'validator' | 'throwOnValidationError'
  > {
  validations: ValidationResult | null;
}

export type AnyContext = BlazeContext<Random, Random, Random, Random, Random>;
