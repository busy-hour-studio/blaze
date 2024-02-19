import type { BlazeServiceAction } from '@/classes/BlazeServiceAction';
import type { BlazeContext } from '@/event/BlazeContext';
import type { ZodObject, ZodRawShape, ZodTypeAny } from 'zod';
import type { FinalActionType, RecordUnknown } from './helper';
import type { ActionHook } from './hooks';
import type { RestParam } from './rest';

export interface ActionHandler<
  Meta extends RecordUnknown = RecordUnknown,
  Body extends RecordUnknown = RecordUnknown,
  Params extends RecordUnknown = RecordUnknown,
> {
  (
    ctx: BlazeContext<Meta, Body, Params>
  ): Promise<unknown | void> | unknown | void;
}

export interface ActionValidation<
  Body extends ZodTypeAny,
  Params extends ZodObject<ZodRawShape>,
> {
  body?: Body | null;
  params?: Params | null;
}

export interface Action<
  Body extends ZodTypeAny = ZodTypeAny,
  Params extends ZodObject<ZodRawShape> = ZodObject<ZodRawShape>,
  ActionType extends FinalActionType<Body, Params> = FinalActionType<
    Body,
    Params
  >,
> {
  validation?: ActionValidation<Body, Params> | null;
  handler: ActionHandler<
    ActionType['Meta'],
    ActionType['Body'],
    ActionType['Params']
  >;
  rest?: RestParam | null;
  hooks?: ActionHook<
    ActionType['Meta'],
    ActionType['Body'],
    ActionType['Params']
  > | null;
}

export type ActionCallResult<U> =
  | { error: Error; ok: false }
  | { ok: true; result: U };

export interface Actions {
  [key: string]: Action | BlazeServiceAction;
}
