import type { Context as HonoContext } from 'hono';
import type { ZodEffects, ZodObject, ZodRawShape } from 'zod';

export type RecordUnknown = Record<string, unknown>;

export type RecordString = Record<string, string>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Random = any;

export interface ContextValidation<
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

export interface ValidationResult {
  body: boolean;
  params: boolean;
  header: boolean;
  query: boolean;
}

export interface ContextData<
  B extends RecordUnknown = RecordUnknown,
  P extends RecordUnknown = RecordUnknown,
  H extends RecordString = RecordString,
  Q extends RecordUnknown = RecordUnknown,
> {
  body: B | null;
  params: P | null;
  headers: H | null;
  query: Q | null;
}

export interface DataValidatorOption<
  B extends RecordUnknown = RecordUnknown,
  P extends RecordUnknown = RecordUnknown,
  H extends RecordString = RecordString,
  Q extends RecordUnknown = RecordUnknown,
> {
  data: ContextData<B, P, H, Q>;
  schema: ZodObject<ZodRawShape> | ZodEffects<ZodObject<ZodRawShape>>;
  honoCtx: HonoContext | null;
  throwOnValidationError: boolean;
  validations: ValidationResult;
}
