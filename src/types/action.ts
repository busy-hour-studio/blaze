import type { BlazeContext } from '@/event/BlazeContext';
import type { ZodObject, ZodRawShape } from 'zod';
import type { RecordString, RecordUnknown } from './helper';
import type { ActionHook } from './hooks';
import type { RestParam } from './rest';

export interface ActionValidator<
  Body extends ZodObject<ZodRawShape> = ZodObject<ZodRawShape>,
  Params extends ZodObject<ZodRawShape> = ZodObject<ZodRawShape>,
> {
  body?: Body | null;
  params?: Params | null;
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

export interface Action<
  Meta extends RecordUnknown = RecordUnknown,
  Header extends RecordString = RecordString,
  Body extends ZodObject<ZodRawShape> = ZodObject<ZodRawShape>,
  Params extends ZodObject<ZodRawShape> = ZodObject<ZodRawShape>,
  FinalBody extends RecordUnknown = Body['_output'] & RecordUnknown,
  FinalParams extends RecordUnknown = Params['_output'] & RecordUnknown,
> {
  validator?: ActionValidator<Body, Params> | null;
  handler: ActionHandler<Meta, FinalBody, FinalParams, Header>;
  rest?: RestParam | null;
  hooks?: ActionHook<Meta, FinalBody, FinalParams, Header> | null;
}

export type ActionCallResult<U> =
  | { error: Error; ok: false }
  | { ok: true; result: U };

export interface Actions {
  [key: string]: Action;
}
