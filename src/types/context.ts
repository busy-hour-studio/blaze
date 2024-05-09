import type { Context as HonoCtx } from 'hono';
import type { ZodObject, ZodRawShape } from 'zod';
import type {
  ContextValidation,
  RecordString,
  RecordUnknown,
  ValidationResult,
} from './helper';

export interface CreateContextOption<
  Meta extends RecordUnknown = RecordUnknown,
  Body extends RecordUnknown = RecordUnknown,
  Params extends RecordUnknown = RecordUnknown,
  Headers extends RecordString = RecordString,
  BodyValidation extends ZodObject<ZodRawShape> = ZodObject<ZodRawShape>,
  ParamsValidation extends ZodObject<ZodRawShape> = ZodObject<ZodRawShape>,
  HeaderValidation extends ZodObject<ZodRawShape> = ZodObject<ZodRawShape>,
  Validator extends ContextValidation<
    BodyValidation,
    ParamsValidation,
    HeaderValidation
  > = ContextValidation<BodyValidation, ParamsValidation, HeaderValidation>,
> {
  honoCtx: HonoCtx | null;
  meta: Meta | null;
  body: Body | null;
  params: Params | null;
  headers: Headers | null;
  validator: Validator | null;
  throwOnValidationError: boolean;
}

export interface ContextConstructorOption<
  Meta extends RecordUnknown = RecordUnknown,
  Body extends RecordUnknown = RecordUnknown,
  Params extends RecordUnknown = RecordUnknown,
  Headers extends RecordString = RecordString,
> extends Omit<
    CreateContextOption<Meta, Body, Params, Headers>,
    'validator' | 'throwOnValidationError'
  > {
  validations: ValidationResult | null;
}
