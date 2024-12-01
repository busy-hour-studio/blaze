import type { Context as HonoCtx } from 'hono';
import type { ZodSchema } from 'zod';
import type { RecordString, RecordUnknown } from '../../types/common';

export interface ContextValidator<
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

export interface CreateContextOption<
  M extends RecordUnknown = RecordUnknown,
  H extends RecordString = RecordString,
  P extends RecordUnknown = RecordUnknown,
  Q extends RecordUnknown = RecordUnknown,
  B extends RecordUnknown = RecordUnknown,
  HV extends ZodSchema = ZodSchema,
  PV extends ZodSchema = ZodSchema,
  QV extends ZodSchema = ZodSchema,
  BV extends ZodSchema = ZodSchema,
  V extends ContextValidator<HV, PV, QV, BV> = ContextValidator<HV, PV, QV, BV>,
> {
  honoCtx: HonoCtx | null;
  meta: M | null;
  headers: H | null;
  params: P | null;
  query: Q | null;
  body: B | null;
  validator: V | null;
}

export interface ContextConstructorOption<
  M extends RecordUnknown,
  H extends RecordString,
  P extends RecordUnknown,
  Q extends RecordUnknown,
  B extends RecordUnknown,
  HV extends ZodSchema = ZodSchema,
  PV extends ZodSchema = ZodSchema,
  QV extends ZodSchema = ZodSchema,
  BV extends ZodSchema = ZodSchema,
> extends Omit<
    CreateContextOption<M, H, P, Q, B, HV, PV, QV, BV>,
    'validator'
  > {}

export interface ContextSetter<
  M extends RecordUnknown = RecordUnknown,
  H extends RecordString = RecordString,
  P extends RecordUnknown = RecordUnknown,
  Q extends RecordUnknown = RecordUnknown,
  B extends RecordUnknown = RecordUnknown,
> {
  meta(meta: M): void;
  header(headers: H): void;
  headers(headers: H): void;
  params(params: P): void;
  query(query: Q): void;
  body(body: B): void;
}

export interface ContextRequest<
  H extends RecordString = RecordString,
  P extends RecordUnknown = RecordUnknown,
  Q extends RecordUnknown = RecordUnknown,
  B extends RecordUnknown = RecordUnknown,
> {
  /** @description Alias for `headers` */
  header: H;
  /** @description Get request `headers` */
  headers: H;
  /** @description Get request `query` */
  query: Q;
  /** @description Get request `params` */
  params: P;
  /** @description Get request `body` */
  body(): Promise<B>;
  /** @description Get request `url` */
  url: string | null;
  /** @description Get request `method` */
  method: string | null;
  /** @description Get request `path` */
  path: string | null;
}
