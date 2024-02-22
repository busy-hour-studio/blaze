import type { Action, ActionValidator } from '@/types/action';
import type { RecordUnknown } from '@/types/helper';
import type { ZodObject, ZodRawShape } from 'zod';

export function createActionValidator<
  Header extends ZodObject<ZodRawShape> = ZodObject<ZodRawShape>,
  Body extends ZodObject<ZodRawShape> = ZodObject<ZodRawShape>,
  Params extends ZodObject<ZodRawShape> = ZodObject<ZodRawShape>,
>(validator: ActionValidator<Header, Body, Params>) {
  return validator;
}

export function createAction<
  Meta extends RecordUnknown = RecordUnknown,
  Header extends ZodObject<ZodRawShape> = ZodObject<ZodRawShape>,
  Body extends ZodObject<ZodRawShape> = ZodObject<ZodRawShape>,
  Params extends ZodObject<ZodRawShape> = ZodObject<ZodRawShape>,
>(action: Action<Meta, Header, Body, Params>) {
  return action;
}
