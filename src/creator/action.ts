import type { ZodObject, ZodRawShape } from 'zod';
import type { Action, ActionValidator } from '../types/action';
import type { RecordUnknown } from '../types/helper';

export function createActionValidator<
  H extends ZodObject<ZodRawShape>,
  B extends ZodObject<ZodRawShape>,
  P extends ZodObject<ZodRawShape>,
>(validator: ActionValidator<H, B, P>) {
  return validator;
}

export function createAction<
  R,
  HR,
  M extends RecordUnknown,
  H extends ZodObject<ZodRawShape>,
  B extends ZodObject<ZodRawShape>,
  P extends ZodObject<ZodRawShape>,
>(action: Action<R, HR, M, H, B, P>) {
  return action;
}
