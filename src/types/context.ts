import type { Context as HonoCtx } from 'hono';
import type { ZodObject, ZodRawShape } from 'zod';
import type {
  ContextValidation,
  RecordString,
  RecordUnknown,
  ValidationResult,
} from './helper';

export interface CreateContextOption<
  Body extends RecordUnknown = RecordUnknown,
  Params extends RecordUnknown = RecordUnknown,
  Headers extends RecordString = RecordString,
  BodyValidation extends ZodObject<ZodRawShape> = ZodObject<ZodRawShape>,
  ParamsValidation extends ZodObject<ZodRawShape> = ZodObject<ZodRawShape>,
  Validator extends Partial<
    ContextValidation<BodyValidation, ParamsValidation>
  > = Partial<ContextValidation<BodyValidation, ParamsValidation>>,
> {
  honoCtx: HonoCtx | null;
  body: Body | null;
  params: Params | null;
  headers: Headers | null;
  validator: Validator | null;
  throwOnValidationError: boolean | null | undefined;
}

export interface ContextConstructorOption<
  Body extends RecordUnknown = RecordUnknown,
  Params extends RecordUnknown = RecordUnknown,
  Headers extends RecordString = RecordString,
> extends Omit<
    CreateContextOption<Body, Params, Headers>,
    'validator' | 'throwOnValidationError'
  > {
  validations: ValidationResult | null;
}
