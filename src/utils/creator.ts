import type { Action } from '@/types/action';
import type { Event } from '@/types/event';
import type { Service } from '@/types/service';
import type { ZodObject, ZodRawShape, ZodTypeAny } from 'zod';

export function createAction<
  Body extends ZodTypeAny,
  Params extends ZodObject<ZodRawShape>,
>(action: Action<Body, Params>) {
  return action as unknown as Action;
}

export function createEvent<
  Params extends ZodTypeAny | ZodObject<ZodRawShape> = ZodTypeAny,
>(event: Event<Params>) {
  return event as unknown as Event;
}

export function createService(service: Service) {
  return service;
}
