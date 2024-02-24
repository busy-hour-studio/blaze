import type { ZodObject, ZodRawShape } from 'zod';
import type { Event } from '../types/event';
import type { RecordUnknown } from '../types/helper';

export function createEventValidator<
  Params extends ZodObject<ZodRawShape> = ZodObject<ZodRawShape>,
>(validator: Params) {
  return validator;
}

export function createEvent<
  Meta extends RecordUnknown = RecordUnknown,
  Params extends ZodObject<ZodRawShape> = ZodObject<ZodRawShape>,
>(event: Event<Meta, Params>) {
  return event;
}
