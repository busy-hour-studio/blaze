import type { ZodSchema } from 'zod';
import type { RecordUnknown } from '../types/common.ts';
import type { Event } from '../types/event.ts';

export function createEventValidator<Params extends ZodSchema>(
  validator: Params
) {
  return validator;
}

export function createEvent<M extends RecordUnknown, P extends ZodSchema>(
  event: Event<M, P>
) {
  return event;
}
