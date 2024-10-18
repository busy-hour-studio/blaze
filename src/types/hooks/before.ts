import type { BlazeContext } from '../../internal/index.ts';
import type { Random, RecordString, RecordUnknown } from '../common.ts';

export interface BeforeHookHandler<
  M extends RecordUnknown = RecordUnknown,
  H extends RecordString = RecordString,
  P extends RecordUnknown = RecordUnknown,
  Q extends RecordUnknown = RecordUnknown,
  B extends RecordUnknown = RecordUnknown,
> {
  (ctx: BlazeContext<M, H, P, Q, B>): Promise<void>;
}

export type AnyBeforeHookHandler = BeforeHookHandler<
  Random,
  Random,
  Random,
  Random,
  Random
>;

export type AcceptedBeforeHook<
  M extends RecordUnknown = RecordUnknown,
  H extends RecordString = RecordString,
  P extends RecordUnknown = RecordUnknown,
  Q extends RecordUnknown = RecordUnknown,
  B extends RecordUnknown = RecordUnknown,
> = BeforeHookHandler<M, H, P, Q, B> | BeforeHookHandler<M, H, P, Q, B>[];

export type AnyBeforeHook = AcceptedBeforeHook<
  Random,
  Random,
  Random,
  Random,
  Random
>;

export interface BeforeHookHandlerOption<
  M extends RecordUnknown = RecordUnknown,
  H extends RecordString = RecordString,
  P extends RecordUnknown = RecordUnknown,
  Q extends RecordUnknown = RecordUnknown,
  B extends RecordUnknown = RecordUnknown,
> {
  hooks: AcceptedBeforeHook<M, H, P, Q, B>;
  ctx: BlazeContext<M, H, P, Q, B>;
}
