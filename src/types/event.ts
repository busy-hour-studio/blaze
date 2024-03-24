import type { ZodObject, ZodRawShape } from 'zod';
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
  Meta extends RecordUnknown = RecordUnknown,
  Params extends RecordUnknown = RecordUnknown,
  Header extends RecordString = RecordString,
> {
  (
    ctx: BlazeContext<Meta, Params, RecordUnknown, Header>
  ): Promise<void> | void;
}

export interface Event<
  Meta extends RecordUnknown = RecordUnknown,
  Params extends ZodObject<ZodRawShape> = ZodObject<ZodRawShape>,
  FinalParams extends RecordUnknown = Params['_output'] & RecordUnknown,
> {
  validator?: Params | null;
  handler: EventHandler<Meta, FinalParams>;
  throwOnValidationError?: boolean | null;
}

export interface Events {
  [key: string]: Event<RecordUnknown, Random>;
}
