import type { BlazeContext } from '../internal';
import type { Random, RecordString, RecordUnknown } from './helper';

export interface OnActionEventErrorHandler<
  M extends RecordUnknown = RecordUnknown,
  H extends RecordString = RecordString,
  P extends RecordUnknown = RecordUnknown,
  Q extends RecordUnknown = RecordUnknown,
  B extends RecordUnknown = RecordUnknown,
> {
  (ctx: BlazeContext<M, H, P, Q, B>, error: Random): Promise<void>;
}
