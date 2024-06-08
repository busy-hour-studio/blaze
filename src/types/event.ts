import type { ZodEffects, ZodObject, ZodRawShape } from 'zod';
import type { BlazeContext } from '../event';
import type { ActionHandler } from './action';
import type { Random, RecordString, RecordUnknown } from './helper';

export interface EventActionHandler {
  name: string;
  handler(...values: unknown[]): ReturnType<ActionHandler>;
}

export interface EventListener {
  (...values: Random[]): Promise<void | unknown> | void | unknown;
}

export type EventName = string;

export interface EventHandler<
  M extends RecordUnknown = RecordUnknown,
  P extends RecordUnknown = RecordUnknown,
> {
  (
    ctx: BlazeContext<M, RecordString, RecordUnknown, RecordUnknown, P>
  ): Promise<void>;
}

export interface Event<
  M extends RecordUnknown = RecordUnknown,
  P extends
    | ZodObject<ZodRawShape>
    | ZodEffects<ZodObject<ZodRawShape>> = ZodObject<ZodRawShape>,
> {
  validator?: P | null;
  handler: EventHandler<M, P['_output']>;
  throwOnValidationError?: boolean | null;
}

export type AnyEvent = Event<RecordUnknown, Random>;

export interface Events {
  [key: string]: AnyEvent;
}
