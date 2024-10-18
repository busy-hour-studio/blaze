import type { ZodSchema } from 'zod';
import type { Action, ActionValidator } from '../types/action.ts';
import type { RecordUnknown } from '../types/common.ts';

export function createActionValidator<
  H extends ZodSchema,
  P extends ZodSchema,
  Q extends ZodSchema,
  B extends ZodSchema,
>(validator: ActionValidator<H, P, Q, B>) {
  return validator;
}

export function createAction<
  R,
  HR,
  M extends RecordUnknown,
  H extends ZodSchema,
  P extends ZodSchema,
  Q extends ZodSchema,
  B extends ZodSchema,
>(action: Action<R, HR, M, H, P, Q, B>) {
  return action;
}
