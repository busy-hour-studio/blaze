import type { BlazeContext } from '../../internal/index.ts';
import type { Random, RecordString, RecordUnknown } from '../common.ts';

export interface BlazeBeforeHookHandler<
  M extends RecordUnknown = RecordUnknown,
  H extends RecordString = RecordString,
  P extends RecordUnknown = RecordUnknown,
  Q extends RecordUnknown = RecordUnknown,
  B extends RecordUnknown = RecordUnknown,
> {
  (ctx: BlazeContext<M, H, P, Q, B>): Promise<void> | void;
}

export type AnyBlazeBeforeHookHandler = BlazeBeforeHookHandler<
  Random,
  Random,
  Random,
  Random,
  Random
>;

export type AcceptedBlazeBeforeHook<
  M extends RecordUnknown = RecordUnknown,
  H extends RecordString = RecordString,
  P extends RecordUnknown = RecordUnknown,
  Q extends RecordUnknown = RecordUnknown,
  B extends RecordUnknown = RecordUnknown,
> =
  | BlazeBeforeHookHandler<M, H, P, Q, B>
  | BlazeBeforeHookHandler<M, H, P, Q, B>[];

export type AnyBlazeBeforeHook = AcceptedBlazeBeforeHook<
  Random,
  Random,
  Random,
  Random,
  Random
>;
