import type { Random } from '../../../types/helper.ts';
import type { AcceptedBlazeAfterHook } from './after.ts';
import type { AcceptedBlazeBeforeHook } from './before.ts';

export type * from './after.ts';
export type * from './before.ts';

export interface BlazeActionHook<
  AH extends AcceptedBlazeAfterHook<
    Random,
    Random,
    Random,
    Random,
    Random,
    Random
  > = AcceptedBlazeAfterHook,
  BH extends AcceptedBlazeBeforeHook<
    Random,
    Random,
    Random,
    Random,
    Random
  > = AcceptedBlazeBeforeHook,
> {
  after?: AH | null;
  before?: BH | null;
}
