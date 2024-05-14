import type { BlazeContext } from '../event';
import type { Random, RecordString, RecordUnknown } from './helper';

export interface BeforeHookHandler<
  Meta extends RecordUnknown = RecordUnknown,
  Body extends RecordUnknown = RecordUnknown,
  Params extends RecordUnknown = RecordUnknown,
  Header extends RecordString = RecordString,
> {
  (ctx: BlazeContext<Meta, Body, Params, Header>): Promise<void> | void;
}

export type AnyBeforeHookHandler = BeforeHookHandler<
  Random,
  Random,
  Random,
  Random
>;

export interface AfterHookHandler<
  Result = unknown | void,
  Meta extends RecordUnknown = RecordUnknown,
  Body extends RecordUnknown = RecordUnknown,
  Params extends RecordUnknown = RecordUnknown,
  Header extends RecordString = RecordString,
> {
  (
    ctx: BlazeContext<Meta, Body, Params, Header>,
    res: never
  ): Promise<Result> | Result;
}

export type AnyAfterHookHandler = AfterHookHandler<
  Random,
  Random,
  Random,
  Random,
  Random
>;

export type AcceptedBeforeHook<
  Meta extends RecordUnknown = RecordUnknown,
  Body extends RecordUnknown = RecordUnknown,
  Params extends RecordUnknown = RecordUnknown,
  Header extends RecordString = RecordString,
> =
  | BeforeHookHandler<Meta, Body, Params, Header>
  | BeforeHookHandler<Meta, Body, Params, Header>[];

export type AnyBeforeHook = AcceptedBeforeHook<Random, Random, Random, Random>;

export type AcceptedAfterHook<
  Result = unknown | void,
  Meta extends RecordUnknown = RecordUnknown,
  Body extends RecordUnknown = RecordUnknown,
  Params extends RecordUnknown = RecordUnknown,
  Header extends RecordString = RecordString,
> =
  | AfterHookHandler<Result, Meta, Body, Params, Header>
  | AfterHookHandler<Result, Meta, Body, Params, Header>[];

export type AnyAfterHook = AcceptedAfterHook<
  Random,
  Random,
  Random,
  Random,
  Random
>;

export interface ActionHook<
  BeforeHook extends AcceptedBeforeHook<
    Random,
    Random,
    Random,
    Random
  > = AcceptedBeforeHook,
  AfterHook extends AcceptedAfterHook<
    Random,
    Random,
    Random,
    Random,
    Random
  > = AcceptedAfterHook,
> {
  before?: BeforeHook | null;
  after?: AfterHook | null;
}

export type AnyActionHook = ActionHook<Random, Random>;

export interface AfterHookHandlerOption<
  Result = unknown | void,
  Meta extends RecordUnknown = RecordUnknown,
  Body extends RecordUnknown = RecordUnknown,
  Params extends RecordUnknown = RecordUnknown,
  Header extends RecordString = RecordString,
> {
  result: unknown;
  hooks: AcceptedAfterHook<Result, Meta, Body, Params, Header>;
  blazeCtx: BlazeContext<Meta, Body, Params, Header>;
}

export interface BeforeHookHandlerOption<
  Meta extends RecordUnknown = RecordUnknown,
  Body extends RecordUnknown = RecordUnknown,
  Params extends RecordUnknown = RecordUnknown,
  Header extends RecordString = RecordString,
> {
  hooks: AcceptedBeforeHook<Meta, Body, Params, Header>;
  blazeCtx: BlazeContext<Meta, Body, Params, Header>;
}
