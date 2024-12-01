import { z, type ZodRawShape } from 'zod';
import type { ContextRequest, ContextSetter } from '../internal/context/types';
import { BlazeValidationError } from '../internal/errors/validation';
import type { RecordString, RecordUnknown } from '../types/common';
import { isEmpty } from '../utils/common';
import { validateInput } from './helper';
import type { AllDataValidatorOption } from './types';

export async function validateAll<
  M extends RecordUnknown,
  H extends RecordString,
  P extends RecordUnknown,
  Q extends RecordUnknown,
  B extends RecordUnknown,
>(options: AllDataValidatorOption<M, H, P, Q, B>) {
  const { ctx, validator, setter } = options;

  if (!validator || isEmpty(validator)) return;

  const keys = Object.keys(validator) as Array<keyof ContextSetter>;
  const schema = z.object(validator as ZodRawShape);
  const input: Record<string, unknown> = {};

  for (const key of keys) {
    const value = ctx.request[key as keyof ContextRequest];

    input[key] = value instanceof Function ? await value() : value;
  }

  const result = await validateInput(input, schema);

  if (!result.success) {
    throw new BlazeValidationError(ctx, result.error);
  }

  for (const key of keys) {
    const value = result.data[key as keyof ContextSetter];

    setter[key](value);
  }
}
