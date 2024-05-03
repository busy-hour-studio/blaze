import type { ZodObject, ZodRawShape } from 'zod';
import type { Action, ActionValidator } from '../types/action';
import type { RecordUnknown } from '../types/helper';

export function createActionValidator<
  Header extends ZodObject<ZodRawShape>,
  Body extends ZodObject<ZodRawShape>,
  Params extends ZodObject<ZodRawShape>,
>(validator: ActionValidator<Header, Body, Params>) {
  return validator;
}

export function createAction<
  Result,
  Meta extends RecordUnknown,
  Header extends ZodObject<ZodRawShape>,
  Body extends ZodObject<ZodRawShape>,
  Params extends ZodObject<ZodRawShape>,
>(action: Action<Result, Meta, Header, Body, Params>) {
  return action;
}
