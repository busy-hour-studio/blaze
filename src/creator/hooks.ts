import type { RecordString, RecordUnknown } from '@/types/helper';
import type { AfterHookHandler, BeforeHookHandler } from '@/types/hooks';

export function createAfterHook<
  Meta extends RecordUnknown = RecordUnknown,
  Body extends RecordUnknown = RecordUnknown,
  Params extends RecordUnknown = RecordUnknown,
  Header extends RecordString = RecordString,
  Result = unknown,
>(hook: AfterHookHandler<Meta, Body, Params, Header, Result>) {
  return hook;
}

export function createBeforeHook<
  Meta extends RecordUnknown = RecordUnknown,
  Body extends RecordUnknown = RecordUnknown,
  Params extends RecordUnknown = RecordUnknown,
  Header extends RecordString = RecordString,
>(hook: BeforeHookHandler<Meta, Body, Params, Header>) {
  return hook;
}
