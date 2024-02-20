import type { BlazeContext } from '@/event/BlazeContext';
import type { ZodObject, ZodRawShape, ZodTypeAny } from 'zod';
import type { ActionHook } from './hooks';
import type { RestParam } from './rest';

export interface ActionValidation<
  Body extends ZodTypeAny = ZodTypeAny,
  Params extends ZodObject<ZodRawShape> = ZodObject<ZodRawShape>,
> {
  body?: Body | null;
  params?: Params | null;
}

export interface ActionHandler {
  (ctx: BlazeContext): Promise<unknown | void> | unknown | void;
}

export interface Action {
  validation?: ActionValidation;
  handler: ActionHandler;
  rest?: RestParam | null;
  hooks?: ActionHook | null;
}

export type ActionCallResult<U> =
  | { error: Error; ok: false }
  | { ok: true; result: U };

export interface Actions {
  [key: string]: Action;
}
