import type { Context as HonoCtx } from 'hono';
import type { ZodEffects, ZodObject, ZodRawShape } from 'zod';
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
  HV extends
    | ZodObject<ZodRawShape>
    | ZodEffects<ZodObject<ZodRawShape>> = ZodObject<ZodRawShape>,
  PV extends
    | ZodObject<ZodRawShape>
    | ZodEffects<ZodObject<ZodRawShape>> = ZodObject<ZodRawShape>,
  QV extends
    | ZodObject<ZodRawShape>
    | ZodEffects<ZodObject<ZodRawShape>> = ZodObject<ZodRawShape>,
  BV extends
    | ZodObject<ZodRawShape>
    | ZodEffects<ZodObject<ZodRawShape>> = ZodObject<ZodRawShape>,
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
  HV extends
    | ZodObject<ZodRawShape>
    | ZodEffects<ZodObject<ZodRawShape>> = ZodObject<ZodRawShape>,
  PV extends
    | ZodObject<ZodRawShape>
    | ZodEffects<ZodObject<ZodRawShape>> = ZodObject<ZodRawShape>,
  QV extends
    | ZodObject<ZodRawShape>
    | ZodEffects<ZodObject<ZodRawShape>> = ZodObject<ZodRawShape>,
  BV extends
    | ZodObject<ZodRawShape>
    | ZodEffects<ZodObject<ZodRawShape>> = ZodObject<ZodRawShape>,
> extends Omit<
    CreateContextOption<M, H, P, Q, B, HV, PV, QV, BV>,
    'validator' | 'throwOnValidationError'
  > {
  validations: ValidationResult | null;
}

export type AnyContext = BlazeContext<Random, Random, Random, Random, Random>;
