import type { BlazeContext } from '../../internal/index.ts';
import type { RecordString, RecordUnknown } from '../../types/common.ts';
import type { AcceptedBlazeAfterHook } from '../../types/hooks/after.ts';
import type { AcceptedBlazeBeforeHook } from '../../types/hooks/before.ts';

export interface BlazeAfterHookHandlerOption<
  R = unknown | void,
  M extends RecordUnknown = RecordUnknown,
  H extends RecordString = RecordString,
  P extends RecordUnknown = RecordUnknown,
  Q extends RecordUnknown = RecordUnknown,
  B extends RecordUnknown = RecordUnknown,
> {
  result: unknown;
  hooks: AcceptedBlazeAfterHook<R, M, H, P, Q, B>;
  ctx: BlazeContext<M, H, P, Q, B>;
}

export interface BlazeBeforeHookHandlerOption<
  M extends RecordUnknown = RecordUnknown,
  B extends RecordUnknown = RecordUnknown,
  P extends RecordUnknown = RecordUnknown,
  H extends RecordString = RecordString,
  Q extends RecordUnknown = RecordUnknown,
> {
  hooks: AcceptedBlazeBeforeHook<M, H, P, Q, B>;
  ctx: BlazeContext<M, H, P, Q, B>;
}
