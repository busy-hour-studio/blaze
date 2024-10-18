import type { Random } from '../common';
import type { AcceptedAfterHook } from './after';
import type { AcceptedBeforeHook } from './before';

export * from './after';
export * from './before';

export interface ActionHook<
  AH extends AcceptedAfterHook<
    Random,
    Random,
    Random,
    Random,
    Random,
    Random
  > = AcceptedAfterHook,
  BH extends AcceptedBeforeHook<
    Random,
    Random,
    Random,
    Random,
    Random
  > = AcceptedBeforeHook,
> {
  after?: AH | null;
  before?: BH | null;
}

export type AnyActionHook = ActionHook<Random, Random>;
