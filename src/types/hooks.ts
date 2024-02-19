import { BlazeContext } from '@/event/BlazeContext';
import type { Context as HonoCtx } from 'hono';
import type { RecordUnknown } from './helper';

export interface BeforeHookHandler<
  Meta extends RecordUnknown = RecordUnknown,
  Body extends RecordUnknown = RecordUnknown,
  Params extends RecordUnknown = RecordUnknown,
  Validation extends RecordUnknown = RecordUnknown,
> {
  (ctx: BlazeContext<Meta, Body, Params, Validation>): Promise<void> | void;
}

export interface AfterHookHandler<
  Meta extends RecordUnknown = RecordUnknown,
  Body extends RecordUnknown = RecordUnknown,
  Params extends RecordUnknown = RecordUnknown,
  Validation extends RecordUnknown = RecordUnknown,
> {
  (
    ctx: BlazeContext<Meta, Body, Params, Validation>,
    res: unknown
  ): Promise<unknown | void> | unknown | void;
}

export type AcceptedBeforeHook<
  Meta extends RecordUnknown = RecordUnknown,
  Body extends RecordUnknown = RecordUnknown,
  Params extends RecordUnknown = RecordUnknown,
  Validation extends RecordUnknown = RecordUnknown,
> =
  | BeforeHookHandler<Meta, Body, Params, Validation>
  | BeforeHookHandler<Meta, Body, Params, Validation>[];

export type AcceptedAfterHook<
  Meta extends RecordUnknown = RecordUnknown,
  Body extends RecordUnknown = RecordUnknown,
  Params extends RecordUnknown = RecordUnknown,
  Validation extends RecordUnknown = RecordUnknown,
> =
  | AfterHookHandler<Meta, Body, Params, Validation>
  | AfterHookHandler<Meta, Body, Params, Validation>[];

export interface ActionHook<
  Meta extends RecordUnknown = RecordUnknown,
  Body extends RecordUnknown = RecordUnknown,
  Params extends RecordUnknown = RecordUnknown,
  Validation extends RecordUnknown = RecordUnknown,
> {
  before?: AcceptedBeforeHook<Meta, Body, Params, Validation> | null;
  after?: AcceptedBeforeHook<Meta, Body, Params, Validation> | null;
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
