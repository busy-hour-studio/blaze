import type { ZodSchema } from 'zod';
import type { RecordUnknown } from '../types/common';
import type { BlazeEvent } from '../types/event';

export function createEventValidator<Params extends ZodSchema>(
  validator: Params
) {
  return validator;
}

export function createEvent<M extends RecordUnknown, P extends ZodSchema>(
  event: BlazeEvent<M, P>
) {
  return event;
}
