import type { BlazeServiceHook } from '@/classes/BlazeServiceHook';
import type { BlazeContext } from '@/event/BlazeContext';
import type { Context as HonoCtx } from 'hono';
import type { RecordUnknown } from './helper';

export interface BeforeHookHandler<
  Meta extends RecordUnknown = RecordUnknown,
  Body extends RecordUnknown = RecordUnknown,
  Params extends RecordUnknown = RecordUnknown,
> {
  (ctx: BlazeContext<Meta, Body, Params>): Promise<void> | void;
}

export interface AfterHookHandler<
  Meta extends RecordUnknown = RecordUnknown,
  Body extends RecordUnknown = RecordUnknown,
  Params extends RecordUnknown = RecordUnknown,
> {
  (
    ctx: BlazeContext<Meta, Body, Params>,
    res: unknown
  ): Promise<unknown | void> | unknown | void;
}

export type AcceptedBeforeHook<
  Meta extends RecordUnknown = RecordUnknown,
  Body extends RecordUnknown = RecordUnknown,
  Params extends RecordUnknown = RecordUnknown,
> =
  | (
      | BeforeHookHandler<Meta, Body, Params>
      | BlazeServiceHook<false, Meta, Body, Params>
    )
  | (
      | BeforeHookHandler<Meta, Body, Params>
      | BlazeServiceHook<false, Meta, Body, Params>
    )[];

export type AcceptedAfterHook<
  Meta extends RecordUnknown = RecordUnknown,
  Body extends RecordUnknown = RecordUnknown,
  Params extends RecordUnknown = RecordUnknown,
> =
  | (
      | AfterHookHandler<Meta, Body, Params>
      | BlazeServiceHook<true, Meta, Body, Params>
    )
  | (
      | AfterHookHandler<Meta, Body, Params>
      | BlazeServiceHook<true, Meta, Body, Params>
    )[];

export interface ActionHook<
  Meta extends RecordUnknown = RecordUnknown,
  Body extends RecordUnknown = RecordUnknown,
  Params extends RecordUnknown = RecordUnknown,
> {
  before?: AcceptedBeforeHook<Meta, Body, Params> | null;
  after?: AcceptedAfterHook<Meta, Body, Params> | null;
}

export interface AfterHookHandlerOption {
  result: unknown;
  hooks: AcceptedAfterHook;
  blazeCtx: BlazeContext;
}

export interface BeforeHookHandlerOption {
  hooks: AcceptedBeforeHook;
  blazeCtx: BlazeContext;
}

export interface AfterHookRestHandlerOption extends AfterHookHandlerOption {
  honoCtx: HonoCtx;
}

export interface BeforeHookRestHandlerOption extends BeforeHookHandlerOption {
  honoCtx: HonoCtx;
}
