import type { ZodEffects, ZodObject, ZodRawShape } from 'zod';
import type { Action, ActionValidator } from '../types/action';
import type { RecordUnknown } from '../types/helper';

export function createActionValidator<
  H extends ZodObject<ZodRawShape> | ZodEffects<ZodObject<ZodRawShape>>,
  P extends ZodObject<ZodRawShape> | ZodEffects<ZodObject<ZodRawShape>>,
  Q extends ZodObject<ZodRawShape> | ZodEffects<ZodObject<ZodRawShape>>,
  B extends ZodObject<ZodRawShape> | ZodEffects<ZodObject<ZodRawShape>>,
>(validator: ActionValidator<H, P, Q, B>) {
  return validator;
}

export function createAction<
  R,
  HR,
  M extends RecordUnknown,
  H extends ZodObject<ZodRawShape> | ZodEffects<ZodObject<ZodRawShape>>,
  P extends ZodObject<ZodRawShape> | ZodEffects<ZodObject<ZodRawShape>>,
  Q extends ZodObject<ZodRawShape> | ZodEffects<ZodObject<ZodRawShape>>,
  B extends ZodObject<ZodRawShape> | ZodEffects<ZodObject<ZodRawShape>>,
>(action: Action<R, HR, M, H, P, Q, B>) {
  return action;
}
