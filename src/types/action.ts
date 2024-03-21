import type { ResponseConfig } from '@asteasolutions/zod-to-openapi';
import type { ZodObject, ZodRawShape } from 'zod';
import type { BlazeContext } from '../event';
import type { Random, RecordString, RecordUnknown } from './helper';
import type { ActionHook } from './hooks';
import type { RestParam } from './rest';

export interface ActionValidator<
  Body extends ZodObject<ZodRawShape> = ZodObject<ZodRawShape>,
  Params extends ZodObject<ZodRawShape> = ZodObject<ZodRawShape>,
  Header extends ZodObject<ZodRawShape> = ZodObject<ZodRawShape>,
> {
  body?: Body | null;
  params?: Params | null;
  header?: Header | null;
}

export interface ActionHandler<
  Meta extends RecordUnknown = RecordUnknown,
  Body extends RecordUnknown = RecordUnknown,
  Params extends RecordUnknown = RecordUnknown,
  Header extends RecordString = RecordString,
> {
  (
    ctx: BlazeContext<Meta, Body, Params, Header>
  ): Promise<unknown | void> | unknown | void;
}

export interface OpenAPIBody {
  required?: boolean;
  description?: string;
  type:
    | 'application/json'
    | 'multipart/form-data'
    | 'application/x-www-form-urlencoded';
}

export interface ActionOpenAPI {
  responses?: Record<number, ResponseConfig> | null;
  body?: OpenAPIBody | null;
}

export interface Action<
  Meta extends RecordUnknown = RecordUnknown,
  Header extends ZodObject<ZodRawShape> = ZodObject<ZodRawShape>,
  Body extends ZodObject<ZodRawShape> = ZodObject<ZodRawShape>,
  Params extends ZodObject<ZodRawShape> = ZodObject<ZodRawShape>,
  FinalHeader extends RecordString = Header['_output'] & RecordString,
  FinalBody extends RecordUnknown = Body['_output'] & RecordUnknown,
  FinalParams extends RecordUnknown = Params['_output'] & RecordUnknown,
> {
  openapi?: ActionOpenAPI | null;
  validator?: ActionValidator<Body, Params, Header> | null;
  handler: ActionHandler<Meta, FinalBody, FinalParams, FinalHeader>;
  rest?: RestParam | null;
  hooks?: ActionHook<Meta, FinalBody, FinalParams, FinalHeader, never> | null;
  throwOnValidationError?: boolean | null;
}

export type ActionCallResult<U> =
  | { error: Error; ok: false }
  | { ok: true; result: U };

export interface Actions {
  [key: string]: Action<RecordUnknown, Random, Random, Random>;
}
