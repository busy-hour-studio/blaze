import type { BlazeContext } from '@/event/BlazeContext';
import { ZodObject, ZodRawShape, ZodTypeAny } from 'zod';
import type { ActionHandler } from './action';
import { FinalEventType, RecordUnknown } from './helper';

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

export interface EventHandler<
  Meta extends RecordUnknown = RecordUnknown,
  Params extends RecordUnknown = RecordUnknown,
> {
  (ctx: BlazeContext<Meta, Params>): Promise<void> | void;
}

export interface Event<
  Params extends ZodTypeAny | ZodObject<ZodRawShape> = ZodTypeAny,
  EventType extends FinalEventType<Params> = FinalEventType<Params>,
> {
  validation?: Params | null;
  handler: EventHandler<EventType['Meta'], EventType['Params']>;
}

export interface Events {
  [key: string]: Event;
}
