import type { BlazeContext } from '@/event/BlazeContext';
import type { RecordString, RecordUnknown } from './helper';

export interface BeforeHookHandler<
  Meta extends RecordUnknown = RecordUnknown,
  Body extends RecordUnknown = RecordUnknown,
  Params extends RecordUnknown = RecordUnknown,
  Header extends RecordString = RecordString,
> {
  (ctx: BlazeContext<Meta, Body, Params, Header>): Promise<void> | void;
}

export interface AfterHookHandler<
  Meta extends RecordUnknown = RecordUnknown,
  Body extends RecordUnknown = RecordUnknown,
  Params extends RecordUnknown = RecordUnknown,
  Header extends RecordString = RecordString,
> {
  (
    ctx: BlazeContext<Meta, Body, Params, Header>,
    res: unknown
  ): Promise<unknown | void> | unknown | void;
}

export type AcceptedBeforeHook<
  Meta extends RecordUnknown = RecordUnknown,
  Body extends RecordUnknown = RecordUnknown,
  Params extends RecordUnknown = RecordUnknown,
  Header extends RecordString = RecordString,
> =
  | BeforeHookHandler<Meta, Body, Params, Header>
  | BeforeHookHandler<Meta, Body, Params, Header>[];

export type AcceptedAfterHook<
  Meta extends RecordUnknown = RecordUnknown,
  Body extends RecordUnknown = RecordUnknown,
  Params extends RecordUnknown = RecordUnknown,
  Header extends RecordString = RecordString,
> =
  | AfterHookHandler<Meta, Body, Params, Header>
  | AfterHookHandler<Meta, Body, Params, Header>[];

export interface ActionHook<
  Meta extends RecordUnknown = RecordUnknown,
  Body extends RecordUnknown = RecordUnknown,
  Params extends RecordUnknown = RecordUnknown,
  Header extends RecordString = RecordString,
> {
  before?: AcceptedBeforeHook<Meta, Body, Params, Header> | null;
  after?: AcceptedAfterHook<Meta, Body, Params, Header> | null;
}

export interface AfterHookHandlerOption<
  Meta extends RecordUnknown = RecordUnknown,
  Body extends RecordUnknown = RecordUnknown,
  Params extends RecordUnknown = RecordUnknown,
  Header extends RecordString = RecordString,
> {
  result: unknown;
  hooks: AcceptedAfterHook<Meta, Body, Params, Header>;
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
