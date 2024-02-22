import type { ZodObject, ZodRawShape } from 'zod';

export type RecordUnknown = Record<string, unknown>;

export type RecordString = Record<string, string>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Random = any;

export interface ContextValidation<
  Body extends ZodObject<ZodRawShape> = ZodObject<ZodRawShape>,
  Params extends ZodObject<ZodRawShape> = ZodObject<ZodRawShape>,
  Header extends ZodObject<ZodRawShape> = ZodObject<ZodRawShape>,
> {
  body?: Body | null;
  params?: Params | null;
  header?: Header | null;
}

export interface ValidationResult {
  body: boolean;
  params: boolean;
  header: boolean;
}
