import type { Context as HonoContext } from 'hono';
import type { ZodSchema } from 'zod';
import type { BlazeContext } from '../internal';

export type RecordUnknown = Record<string, unknown>;

export type RecordString = Record<string, string>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Random = any;

export interface ContextValidation<
  H extends ZodSchema = ZodSchema,
  P extends ZodSchema = ZodSchema,
  Q extends ZodSchema = ZodSchema,
  B extends ZodSchema = ZodSchema,
> {
  header?: H | null;
  params?: P | null;
  query?: Q | null;
  body?: B | null;
}

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
  honoCtx: HonoContext | null;
  setter: {
    headers(headers: H): void;
    params(params: P): void;
    query(query: Q): void;
    body(body: B): void;
  };
}
