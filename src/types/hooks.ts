import { BlazeContext } from '@/event/BlazeContext';
import type { Context as HonoCtx } from 'hono';
import type { RecordUnknown } from './helper';

export interface BeforeHookHandler<
  Body extends RecordUnknown = RecordUnknown,
  Params extends RecordUnknown = RecordUnknown,
> {
  (ctx: BlazeContext<RecordUnknown, Body, Params>): Promise<void> | void;
}

export interface AfterHookHandler<
  Body extends RecordUnknown = RecordUnknown,
  Params extends RecordUnknown = RecordUnknown,
> {
  (
    ctx: BlazeContext<RecordUnknown, Body, Params>,
    res: unknown
  ): Promise<unknown | void> | unknown | void;
}

export type AcceptedBeforeHook<
  Body extends RecordUnknown = RecordUnknown,
  Params extends RecordUnknown = RecordUnknown,
> = BeforeHookHandler<Body, Params> | BeforeHookHandler<Body, Params>[];

export type AcceptedAfterHook<
  Body extends RecordUnknown = RecordUnknown,
  Params extends RecordUnknown = RecordUnknown,
> = AfterHookHandler<Body, Params> | AfterHookHandler<Body, Params>[];

export interface ActionHook<
  Body extends RecordUnknown = RecordUnknown,
  Params extends RecordUnknown = RecordUnknown,
> {
  before?: AcceptedBeforeHook<Body, Params>;
  after?: AcceptedBeforeHook<Body, Params>;
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
