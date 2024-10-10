import type { Random } from '../common';
import type { BlazeAcceptedAfterHook } from './after';
import type { BlazeAcceptedBeforeHook } from './before';

export type * from './after';
export type * from './before';

export interface BlazeActionHook<
  AH extends BlazeAcceptedAfterHook<
    Random,
    Random,
    Random,
    Random,
    Random,
    Random
  > = BlazeAcceptedAfterHook,
  BH extends BlazeAcceptedBeforeHook<
    Random,
    Random,
    Random,
    Random,
    Random
  > = BlazeAcceptedBeforeHook,
> {
  after?: AH | null;
  before?: BH | null;
}

export type AnyBlazeActionHook = BlazeActionHook<Random, Random>;
