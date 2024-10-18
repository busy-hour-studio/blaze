import type { BlazeContext } from '../internal';
import type { Random, RecordString, RecordUnknown } from './helper';

export interface onRestErrorHandler<
  M extends RecordUnknown,
  H extends RecordString,
  P extends RecordUnknown,
  Q extends RecordUnknown,
  B extends RecordUnknown,
> {
  (ctx: BlazeContext<M, H, P, Q, B>, error: Random): Promise<Random>;
}
