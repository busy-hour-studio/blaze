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
  M extends RecordUnknown = RecordUnknown,
  H extends RecordString = RecordString,
  P extends RecordUnknown = RecordUnknown,
  Q extends RecordUnknown = RecordUnknown,
  B extends RecordUnknown = RecordUnknown,
> {
  (ctx: BlazeContext<M, H, P, Q, B>): Promise<void>;
}
