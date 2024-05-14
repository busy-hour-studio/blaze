import type { ZodObject, ZodRawShape } from 'zod';
import type { Event } from '../types/event';
import type { RecordUnknown } from '../types/helper';

export function createEventValidator<Params extends ZodObject<ZodRawShape>>(
  validator: Params
) {
  return validator;
}

export function createEvent<
  M extends RecordUnknown,
  P extends ZodObject<ZodRawShape>,
>(event: Event<M, P>) {
  return event;
}
