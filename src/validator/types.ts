import type { Context as HonoCtx } from 'hono';
import type { ZodSchema } from 'zod';
import type { BlazeContext } from '../internal';
import type {
  ContextSetter,
  ContextValidator,
} from '../internal/context/types';
import type { RecordString, RecordUnknown } from '../types/common';

export interface DataValidatorOption<
  M extends RecordUnknown = RecordUnknown,
  H extends RecordString = RecordString,
  P extends RecordUnknown = RecordUnknown,
  Q extends RecordUnknown = RecordUnknown,
  B extends RecordUnknown = RecordUnknown,
> {
  ctx: BlazeContext<M, H, P, Q, B>;
  data: H | P | Q | B | NonNullable<unknown> | null;
  schema: ZodSchema;
  honoCtx: HonoCtx | null;
  setter: ContextSetter<H, P, Q, B>;
}

export interface AllDataValidatorOption<
  M extends RecordUnknown = RecordUnknown,
  H extends RecordString = RecordString,
  P extends RecordUnknown = RecordUnknown,
  Q extends RecordUnknown = RecordUnknown,
  B extends RecordUnknown = RecordUnknown,
> {
  ctx: BlazeContext<M, H, P, Q, B>;
  input: {
    headers: H | null;
    params: P | null;
    query: Q | null;
    body: B | null;
  };
  validator: ContextValidator | null;
  honoCtx: HonoCtx | null;
  setter: ContextSetter<H, P, Q, B>;
}
