import type { ZodSchema } from 'zod';
import type { BlazeAction } from '../types/action';
import type { RecordUnknown } from '../types/common';
import type { BlazeActionValidator } from '../types/validator';

export function createActionValidator<
  H extends ZodSchema,
  P extends ZodSchema,
  Q extends ZodSchema,
  B extends ZodSchema,
>(validator: BlazeActionValidator<H, P, Q, B>) {
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
>(action: BlazeAction<R, HR, M, H, P, Q, B>) {
  return action;
}
