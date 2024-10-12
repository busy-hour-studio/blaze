import type { BlazeContext } from '../../internal/index.ts';
import type { Random, RecordString, RecordUnknown } from '../common.ts';

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

export type AcceptedBlazeAfterHook<
  R = unknown | void,
  M extends RecordUnknown = RecordUnknown,
  H extends RecordString = RecordString,
  P extends RecordUnknown = RecordUnknown,
  Q extends RecordUnknown = RecordUnknown,
  B extends RecordUnknown = RecordUnknown,
> =
  | BlazeAfterHookHandler<R, M, H, P, Q, B>
  | BlazeAfterHookHandler<R, M, H, P, Q, B>[];

export type AnyBlazeAfterHook = AcceptedBlazeAfterHook<
  Random,
  Random,
  Random,
  Random,
  Random,
  Random
>;
