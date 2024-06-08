import type { Context as HonoContext } from 'hono';
import type { ZodEffects, ZodObject, ZodRawShape } from 'zod';

export type RecordUnknown = Record<string, unknown>;

export type RecordString = Record<string, string>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Random = any;

export interface ContextValidation<
  H extends
    | ZodObject<ZodRawShape>
    | ZodEffects<ZodObject<ZodRawShape>> = ZodObject<ZodRawShape>,
  P extends
    | ZodObject<ZodRawShape>
    | ZodEffects<ZodObject<ZodRawShape>> = ZodObject<ZodRawShape>,
  Q extends
    | ZodObject<ZodRawShape>
    | ZodEffects<ZodObject<ZodRawShape>> = ZodObject<ZodRawShape>,
  B extends
    | ZodObject<ZodRawShape>
    | ZodEffects<ZodObject<ZodRawShape>> = ZodObject<ZodRawShape>,
> {
  header?: H | null;
  params?: P | null;
  query?: Q | null;
  body?: B | null;
}

export interface ValidationResult {
  header: boolean;
  params: boolean;
  query: boolean;
  body: boolean;
}

export interface ContextData<
  H extends RecordString = RecordString,
  P extends RecordUnknown = RecordUnknown,
  Q extends RecordUnknown = RecordUnknown,
  B extends RecordUnknown = RecordUnknown,
> {
  headers: H | null;
  params: P | null;
  query: Q | null;
  body: B | null;
}

export interface DataValidatorOption<
  H extends RecordString = RecordString,
  P extends RecordUnknown = RecordUnknown,
  Q extends RecordUnknown = RecordUnknown,
  B extends RecordUnknown = RecordUnknown,
> {
  data: ContextData<H, P, Q, B>;
  schema: ZodObject<ZodRawShape> | ZodEffects<ZodObject<ZodRawShape>>;
  honoCtx: HonoContext | null;
  throwOnValidationError: boolean;
  validations: ValidationResult;
}
