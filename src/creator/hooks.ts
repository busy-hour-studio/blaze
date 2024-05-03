import type { RecordString, RecordUnknown } from '../types/helper';
import type { AfterHookHandler, BeforeHookHandler } from '../types/hooks';

export function createAfterHook<
  Meta extends RecordUnknown,
  Body extends RecordUnknown,
  Params extends RecordUnknown,
  Header extends RecordString,
  Result,
>(hook: AfterHookHandler<Meta, Body, Params, Header, Result>) {
  return hook;
}

export function createBeforeHook<
  Meta extends RecordUnknown,
  Body extends RecordUnknown,
  Params extends RecordUnknown,
  Header extends RecordString,
>(hook: BeforeHookHandler<Meta, Body, Params, Header>) {
  return hook;
}
