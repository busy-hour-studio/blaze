import type { BlazeContext } from '@/event/BlazeContext';
import type { ZodObject, ZodRawShape, ZodTypeAny } from 'zod';
import type { ActionHandler } from './action';

export interface EventActionHandler {
  name: string;
  handler(...values: unknown[]): ReturnType<ActionHandler>;
}

export interface EventListener {
  (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...values: any[]
  ): Promise<void | unknown> | void | unknown;
}

export type EventName = string;

export interface EventHandler {
  (ctx: BlazeContext): Promise<void> | void;
}

export interface Event<
  Params extends ZodTypeAny | ZodObject<ZodRawShape> = ZodTypeAny,
> {
  validation?: Params | null;
  handler: EventHandler;
}

export interface Events {
  [key: string]: Event;
}
