import type { BlazeContext } from '../event';
import type { Random, RecordString, RecordUnknown } from './helper';

export interface BeforeHookHandler<
  M extends RecordUnknown = RecordUnknown,
  B extends RecordUnknown = RecordUnknown,
  P extends RecordUnknown = RecordUnknown,
  H extends RecordString = RecordString,
  Q extends RecordUnknown = RecordUnknown,
> {
  (ctx: BlazeContext<M, B, P, H, Q>): Promise<void> | void;
}

export type AnyBeforeHookHandler = BeforeHookHandler<
  Random,
  Random,
  Random,
  Random,
  Random
>;

export interface AfterHookHandler<
  R = unknown | void,
  M extends RecordUnknown = RecordUnknown,
  B extends RecordUnknown = RecordUnknown,
  P extends RecordUnknown = RecordUnknown,
  H extends RecordString = RecordString,
  Q extends RecordUnknown = RecordUnknown,
> {
  (ctx: BlazeContext<M, B, P, H, Q>, res: never): Promise<R>;
}

export type AnyAfterHookHandler = AfterHookHandler<
  Random,
  Random,
  Random,
  Random,
  Random,
  Random
>;

export type AcceptedBeforeHook<
  M extends RecordUnknown = RecordUnknown,
  B extends RecordUnknown = RecordUnknown,
  P extends RecordUnknown = RecordUnknown,
  H extends RecordString = RecordString,
  Q extends RecordUnknown = RecordUnknown,
> = BeforeHookHandler<M, B, P, H, Q> | BeforeHookHandler<M, B, P, H, Q>[];

export type AnyBeforeHook = AcceptedBeforeHook<
  Random,
  Random,
  Random,
  Random,
  Random
>;

export type AcceptedAfterHook<
  R = unknown | void,
  M extends RecordUnknown = RecordUnknown,
  B extends RecordUnknown = RecordUnknown,
  P extends RecordUnknown = RecordUnknown,
  H extends RecordString = RecordString,
  Q extends RecordUnknown = RecordUnknown,
> = AfterHookHandler<R, M, B, P, H, Q> | AfterHookHandler<R, M, B, P, H, Q>[];

export type AnyAfterHook = AcceptedAfterHook<
  Random,
  Random,
  Random,
  Random,
  Random,
  Random
>;

export interface ActionHook<
  BH extends AcceptedBeforeHook<
    Random,
    Random,
    Random,
    Random,
    Random
  > = AcceptedBeforeHook,
  AH extends AcceptedAfterHook<
    Random,
    Random,
    Random,
    Random,
    Random,
    Random
  > = AcceptedAfterHook,
> {
  before?: BH | null;
  after?: AH | null;
}

export type AnyActionHook = ActionHook<Random, Random>;

export interface AfterHookHandlerOption<
  R = unknown | void,
  M extends RecordUnknown = RecordUnknown,
  B extends RecordUnknown = RecordUnknown,
  P extends RecordUnknown = RecordUnknown,
  H extends RecordString = RecordString,
  Q extends RecordUnknown = RecordUnknown,
> {
  result: unknown;
  hooks: AcceptedAfterHook<R, M, B, P, H, Q>;
  blazeCtx: BlazeContext<M, B, P, H, Q>;
}

export interface BeforeHookHandlerOption<
  M extends RecordUnknown = RecordUnknown,
  B extends RecordUnknown = RecordUnknown,
  P extends RecordUnknown = RecordUnknown,
  H extends RecordString = RecordString,
  Q extends RecordUnknown = RecordUnknown,
> {
  hooks: AcceptedBeforeHook<M, B, P, H, Q>;
  blazeCtx: BlazeContext<M, B, P, H, Q>;
}
