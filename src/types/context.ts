import type { Context as HonoCtx } from 'hono';
import type { ZodObject, ZodRawShape, ZodTypeAny } from 'zod';
import type { ActionValidation } from './action';
import type { RecordString, RecordUnknown } from './helper';

export interface CreateContextOption<
  Body extends RecordUnknown = RecordUnknown,
  Params extends RecordUnknown = RecordUnknown,
  Validation extends RecordUnknown = RecordUnknown,
  Headers extends RecordString = RecordString,
> {
  honoCtx: HonoCtx | null;
  body: Body | null;
  params: Params | null;
  headers: Headers | null;
  validation: Validation | null;
  validator:
    | ActionValidation<ZodTypeAny, ZodObject<ZodRawShape>>
    | ZodTypeAny
    | null;
}
