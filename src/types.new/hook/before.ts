import type { BlazeContext } from '../../internal/context';
import type { Random, RecordString, RecordUnknown } from '../common';

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

export type BlazeAcceptedBeforeHook<
  M extends RecordUnknown = RecordUnknown,
  H extends RecordString = RecordString,
  P extends RecordUnknown = RecordUnknown,
  Q extends RecordUnknown = RecordUnknown,
  B extends RecordUnknown = RecordUnknown,
> =
  | BlazeBeforeHookHandler<M, H, P, Q, B>
  | BlazeBeforeHookHandler<M, H, P, Q, B>[];

export type AnyBeforeHook = BlazeAcceptedBeforeHook<
  Random,
  Random,
  Random,
  Random,
  Random
>;

export interface BlazeBeforeHookHandlerOption<
  M extends RecordUnknown = RecordUnknown,
  B extends RecordUnknown = RecordUnknown,
  P extends RecordUnknown = RecordUnknown,
  H extends RecordString = RecordString,
  Q extends RecordUnknown = RecordUnknown,
> {
  hooks: BlazeAcceptedBeforeHook<M, H, P, Q, B>;
  ctx: BlazeContext<M, H, P, Q, B>;
}
