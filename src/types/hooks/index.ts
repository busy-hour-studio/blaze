import type { Random } from '../common.ts';
import type { AcceptedAfterHook } from './after.ts';
import type { AcceptedBeforeHook } from './before.ts';

export * from './after.ts';
export * from './before.ts';

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
