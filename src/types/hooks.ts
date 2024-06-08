import type { BlazeContext } from '../event';
import type { Random, RecordString, RecordUnknown } from './helper';

export interface BeforeHookHandler<
  M extends RecordUnknown = RecordUnknown,
  H extends RecordString = RecordString,
  P extends RecordUnknown = RecordUnknown,
  Q extends RecordUnknown = RecordUnknown,
  B extends RecordUnknown = RecordUnknown,
> {
  (ctx: BlazeContext<M, H, P, Q, B>): Promise<void> | void;
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
  H extends RecordString = RecordString,
  P extends RecordUnknown = RecordUnknown,
  Q extends RecordUnknown = RecordUnknown,
  B extends RecordUnknown = RecordUnknown,
> {
  (ctx: BlazeContext<M, H, P, Q, B>, res: never): Promise<R>;
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
  H extends RecordString = RecordString,
  P extends RecordUnknown = RecordUnknown,
  Q extends RecordUnknown = RecordUnknown,
  B extends RecordUnknown = RecordUnknown,
> = BeforeHookHandler<M, H, P, Q, B> | BeforeHookHandler<M, H, P, Q, B>[];

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
  H extends RecordString = RecordString,
  P extends RecordUnknown = RecordUnknown,
  Q extends RecordUnknown = RecordUnknown,
  B extends RecordUnknown = RecordUnknown,
> = AfterHookHandler<R, M, H, P, Q, B> | AfterHookHandler<R, M, H, P, Q, B>[];

export type AnyAfterHook = AcceptedAfterHook<
  Random,
  Random,
  Random,
  Random,
  Random,
  Random
>;

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

export interface AfterHookHandlerOption<
  R = unknown | void,
  M extends RecordUnknown = RecordUnknown,
  H extends RecordString = RecordString,
  P extends RecordUnknown = RecordUnknown,
  Q extends RecordUnknown = RecordUnknown,
  B extends RecordUnknown = RecordUnknown,
> {
  result: unknown;
  hooks: AcceptedAfterHook<R, M, H, P, Q, B>;
  blazeCtx: BlazeContext<M, H, P, Q, B>;
}

export interface BeforeHookHandlerOption<
  M extends RecordUnknown = RecordUnknown,
  B extends RecordUnknown = RecordUnknown,
  P extends RecordUnknown = RecordUnknown,
  H extends RecordString = RecordString,
  Q extends RecordUnknown = RecordUnknown,
> {
  hooks: AcceptedBeforeHook<M, H, P, Q, B>;
  blazeCtx: BlazeContext<M, H, P, Q, B>;
}
