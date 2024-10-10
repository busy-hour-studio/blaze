import type { BlazeContext } from '../../internal/context';
import type { Random, RecordString, RecordUnknown } from '../common';

export interface BlazeAfterHookHandler<
  R = unknown | void,
  M extends RecordUnknown = RecordUnknown,
  H extends RecordString = RecordString,
  P extends RecordUnknown = RecordUnknown,
  Q extends RecordUnknown = RecordUnknown,
  B extends RecordUnknown = RecordUnknown,
> {
  (ctx: BlazeContext<M, H, P, Q, B>, res: Random): Promise<R>;
}

export type AnyBlazeAfterHookHandler = BlazeAfterHookHandler<
  Random,
  Random,
  Random,
  Random,
  Random,
  Random
>;

export type BlazeAcceptedAfterHook<
  R = unknown | void,
  M extends RecordUnknown = RecordUnknown,
  H extends RecordString = RecordString,
  P extends RecordUnknown = RecordUnknown,
  Q extends RecordUnknown = RecordUnknown,
  B extends RecordUnknown = RecordUnknown,
> =
  | BlazeAfterHookHandler<R, M, H, P, Q, B>
  | BlazeAfterHookHandler<R, M, H, P, Q, B>[];

export type AnyAfterHook = BlazeAcceptedAfterHook<
  Random,
  Random,
  Random,
  Random,
  Random,
  Random
>;

export interface BlazeAfterHookHandlerOption<
  R = unknown | void,
  M extends RecordUnknown = RecordUnknown,
  H extends RecordString = RecordString,
  P extends RecordUnknown = RecordUnknown,
  Q extends RecordUnknown = RecordUnknown,
  B extends RecordUnknown = RecordUnknown,
> {
  result: unknown;
  hooks: BlazeAcceptedAfterHook<R, M, H, P, Q, B>;
  ctx: BlazeContext<M, H, P, Q, B>;
}
