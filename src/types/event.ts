import type { ZodSchema } from 'zod';
import type { BlazeContext } from '../internal/context/index';
import type { ActionHandler } from './action';
import type { Random, RecordString, RecordUnknown } from './common';

export interface EventActionHandler {
  name: string;
  handler(...values: unknown[]): ReturnType<ActionHandler>;
}

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
  P extends ZodSchema = ZodSchema,
> {
  validator?: P | null;
  handler: EventHandler<M, P['_output']>;
}

export type AnyEvent = Event<RecordUnknown, Random>;

export interface Events {
  [key: string]: AnyEvent;
}
