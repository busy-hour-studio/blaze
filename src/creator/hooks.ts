import type { RecordString, RecordUnknown } from '../types/common';
import type {
  BlazeAfterHookHandler,
  BlazeBeforeHookHandler,
} from '../types/hook';

export function createAfterHook<
  R,
  M extends RecordUnknown,
  H extends RecordString,
  P extends RecordUnknown,
  Q extends RecordUnknown,
  B extends RecordUnknown,
>(hook: BlazeAfterHookHandler<R, M, H, P, Q, B>) {
  return hook;
}

export function createBeforeHook<
  M extends RecordUnknown,
  H extends RecordString,
  P extends RecordUnknown,
  Q extends RecordUnknown,
  B extends RecordUnknown,
>(hook: BlazeBeforeHookHandler<M, H, P, Q, B>) {
  return hook;
}
