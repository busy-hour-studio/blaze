import type { ZodEffects, ZodObject, ZodRawShape } from 'zod';
import type { Action, ActionValidator } from '../types/action';
import type { RecordUnknown } from '../types/helper';

export function createActionValidator<
  H extends ZodObject<ZodRawShape> | ZodEffects<ZodObject<ZodRawShape>>,
  B extends ZodObject<ZodRawShape> | ZodEffects<ZodObject<ZodRawShape>>,
  P extends ZodObject<ZodRawShape> | ZodEffects<ZodObject<ZodRawShape>>,
  Q extends ZodObject<ZodRawShape> | ZodEffects<ZodObject<ZodRawShape>>,
>(validator: ActionValidator<H, B, P, Q>) {
  return validator;
}

export function createAction<
  R,
  HR,
  M extends RecordUnknown,
  H extends ZodObject<ZodRawShape>,
  B extends ZodObject<ZodRawShape>,
  P extends ZodObject<ZodRawShape>,
  Q extends ZodObject<ZodRawShape>,
>(action: Action<R, HR, M, H, B, P, Q>) {
  return action;
}
