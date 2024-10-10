import type { BlazeContext } from '../internal/context';
import type { Random, RecordString, RecordUnknown } from './common';

export interface BlazeActionHandler<
  R = unknown | void,
  M extends RecordUnknown = RecordUnknown,
  H extends RecordString = RecordString,
  P extends RecordUnknown = RecordUnknown,
  Q extends RecordUnknown = RecordUnknown,
  B extends RecordUnknown = RecordUnknown,
> {
  (ctx: BlazeContext<M, H, P, Q, B>): Promise<R>;
}

export interface BlazeEventHandler<
  M extends RecordUnknown = RecordUnknown,
  P extends RecordUnknown = RecordUnknown,
> {
  (ctx: BlazeContext<M, Random, Random, Random, P>): Promise<void>;
}

export interface BlazeEventListener {
  (...values: Random[]): Promise<void | unknown> | void | unknown;
}

export interface BlazeValidationErrorHandler<
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  M extends RecordUnknown = RecordUnknown,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  H extends RecordString = RecordString,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  P extends RecordUnknown = RecordUnknown,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Q extends RecordUnknown = RecordUnknown,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  B extends RecordUnknown = RecordUnknown,
> {
  (error: Random): Promise<void>;
}
