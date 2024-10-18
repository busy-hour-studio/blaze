import type { RecordString, RecordUnknown } from '../types/common.ts';
import type {
  AfterHookHandler,
  BeforeHookHandler,
} from '../types/hooks/index.ts';

export function createAfterHook<
  R,
  M extends RecordUnknown,
  H extends RecordString,
  P extends RecordUnknown,
  Q extends RecordUnknown,
  B extends RecordUnknown,
>(hook: AfterHookHandler<R, M, H, P, Q, B>) {
  return hook;
}

export function createBeforeHook<
  M extends RecordUnknown,
  H extends RecordString,
  P extends RecordUnknown,
  Q extends RecordUnknown,
  B extends RecordUnknown,
>(hook: BeforeHookHandler<M, H, P, Q, B>) {
  return hook;
}
