import type { RecordString, RecordUnknown } from '../types/helper';
import type { AfterHookHandler, BeforeHookHandler } from '../types/hooks';

export function createAfterHook<
  R,
  M extends RecordUnknown,
  B extends RecordUnknown,
  P extends RecordUnknown,
  H extends RecordString,
>(hook: AfterHookHandler<R, M, B, P, H>) {
  return hook;
}

export function createBeforeHook<
  M extends RecordUnknown,
  B extends RecordUnknown,
  P extends RecordUnknown,
  H extends RecordString,
>(hook: BeforeHookHandler<M, B, P, H>) {
  return hook;
}
