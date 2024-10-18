import type { BlazeContext } from '../../internal/context/index';
import type { Random, RecordString, RecordUnknown } from '../common';

export interface AfterHookHandler<
  R = unknown | void,
  M extends RecordUnknown = RecordUnknown,
  H extends RecordString = RecordString,
  P extends RecordUnknown = RecordUnknown,
  Q extends RecordUnknown = RecordUnknown,
  B extends RecordUnknown = RecordUnknown,
> {
  (ctx: BlazeContext<M, H, P, Q, B>, res: Random): Promise<R>;
}

export type AnyAfterHookHandler = AfterHookHandler<
  Random,
  Random,
  Random,
  Random,
  Random,
  Random
>;

export type AcceptedAfterHook<
  R = unknown | void,
  M extends RecordUnknown = RecordUnknown,
  H extends RecordString = RecordString,
  P extends RecordUnknown = RecordUnknown,
  Q extends RecordUnknown = RecordUnknown,
  B extends RecordUnknown = RecordUnknown,
> = AfterHookHandler<R, M, H, P, Q, B> | AfterHookHandler<R, M, H, P, Q, B>[];

export type AnyAfterHook = AcceptedAfterHook<
  Random,
  Random,
  Random,
  Random,
  Random,
  Random
>;

export interface AfterHookHandlerOption<
  R = unknown | void,
  M extends RecordUnknown = RecordUnknown,
  H extends RecordString = RecordString,
  P extends RecordUnknown = RecordUnknown,
  Q extends RecordUnknown = RecordUnknown,
  B extends RecordUnknown = RecordUnknown,
> {
  result: unknown;
  hooks: AcceptedAfterHook<R, M, H, P, Q, B>;
  ctx: BlazeContext<M, H, P, Q, B>;
}
