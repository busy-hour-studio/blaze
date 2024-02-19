import type { BlazeContext } from '@/event/BlazeContext';
import type { ZodObject, ZodRawShape, ZodTypeAny } from 'zod';
import type { RecordUnknown } from './helper';
import type { ActionHook } from './hooks';
import type { RestParam } from './rest';

export interface ActionHandler<
  Body extends RecordUnknown = RecordUnknown,
  Params extends RecordUnknown = RecordUnknown,
> {
  (
    ctx: BlazeContext<RecordUnknown, Body, Params>
  ): Promise<unknown | void> | unknown | void;
}

export interface Action<
  Body extends ZodTypeAny = ZodTypeAny,
  Params extends ZodObject<ZodRawShape> = ZodObject<ZodRawShape>,
  FinalParams extends RecordUnknown = Params['_output'] & RecordUnknown,
  FinalBody extends RecordUnknown = Body['_output'] & RecordUnknown,
> {
  request?: {
    body?: Body;
    params?: Params;
  };
  handler: ActionHandler<FinalBody, FinalParams>;
  rest?: RestParam;
  hooks?: ActionHook<FinalBody, FinalParams>;
}

export type ActionCallResult<U> =
  | { error: Error; ok: false }
  | { ok: true; result: U };

export interface Actions {
  [key: string]: Action;
}
