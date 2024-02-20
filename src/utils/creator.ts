import type { Action } from '@/types/action';
import type { Event } from '@/types/event';
import type { RecordString, RecordUnknown } from '@/types/helper';
import type { Service } from '@/types/service';
import type { ZodObject, ZodRawShape } from 'zod';

export function createAction<
  Meta extends RecordUnknown = RecordUnknown,
  Header extends RecordString = RecordString,
  Body extends ZodObject<ZodRawShape> = ZodObject<ZodRawShape>,
  Params extends ZodObject<ZodRawShape> = ZodObject<ZodRawShape>,
>(action: Action<Meta, Header, Body, Params>) {
  return action as unknown as Action;
}

export function createEvent<
  Meta extends RecordUnknown = RecordUnknown,
  Header extends RecordString = RecordString,
  Params extends ZodObject<ZodRawShape> = ZodObject<ZodRawShape>,
>(event: Event<Meta, Header, Params>) {
  return event as unknown as Event;
}

export function createService(service: Service) {
  return service;
}
