import type { BlazeContext } from '../event';
import type { Random, RecordString, RecordUnknown } from './helper';

export interface BeforeHookHandler<
  M extends RecordUnknown = RecordUnknown,
  B extends RecordUnknown = RecordUnknown,
  P extends RecordUnknown = RecordUnknown,
  H extends RecordString = RecordString,
> {
  (ctx: BlazeContext<M, B, P, H>): Promise<void> | void;
}

export type AnyBeforeHookHandler = BeforeHookHandler<
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
> {
  (ctx: BlazeContext<M, B, P, H>, res: never): Promise<R> | R;
}

export type AnyAfterHookHandler = AfterHookHandler<
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
> = BeforeHookHandler<M, B, P, H> | BeforeHookHandler<M, B, P, H>[];

export type AnyBeforeHook = AcceptedBeforeHook<Random, Random, Random, Random>;

export type AcceptedAfterHook<
  R = unknown | void,
  M extends RecordUnknown = RecordUnknown,
  B extends RecordUnknown = RecordUnknown,
  P extends RecordUnknown = RecordUnknown,
  H extends RecordString = RecordString,
> = AfterHookHandler<R, M, B, P, H> | AfterHookHandler<R, M, B, P, H>[];

export type AnyAfterHook = AcceptedAfterHook<
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
    Random
  > = AcceptedBeforeHook,
  AH extends AcceptedAfterHook<
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
> {
  result: unknown;
  hooks: AcceptedAfterHook<R, M, B, P, H>;
  blazeCtx: BlazeContext<M, B, P, H>;
}

export interface BeforeHookHandlerOption<
  M extends RecordUnknown = RecordUnknown,
  B extends RecordUnknown = RecordUnknown,
  P extends RecordUnknown = RecordUnknown,
  H extends RecordString = RecordString,
> {
  hooks: AcceptedBeforeHook<M, B, P, H>;
  blazeCtx: BlazeContext<M, B, P, H>;
}
