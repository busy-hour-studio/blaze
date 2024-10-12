import type { BlazeContext } from '../internal/context/index.ts';
import type { BlazeActionHandler } from './action.ts';
import type { Random, RecordString, RecordUnknown } from './common.ts';

export interface OnBlazeActionEventErrorHandler<
  M extends RecordUnknown = RecordUnknown,
  H extends RecordString = RecordString,
  P extends RecordUnknown = RecordUnknown,
  Q extends RecordUnknown = RecordUnknown,
  B extends RecordUnknown = RecordUnknown,
> {
  (ctx: BlazeContext<M, H, P, Q, B>, error: Random): Promise<void>;
}

export interface ActionEventHandler {
  name: string;
  handler(...values: unknown[]): ReturnType<BlazeActionHandler>;
}
