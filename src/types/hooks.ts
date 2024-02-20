import { BlazeContext } from '@/event/BlazeContext';

export interface BeforeHookHandler {
  (ctx: BlazeContext): Promise<void> | void;
}

export interface AfterHookHandler {
  (ctx: BlazeContext, res: unknown): Promise<unknown | void> | unknown | void;
}

export type AcceptedBeforeHook = BeforeHookHandler | BeforeHookHandler[];

export type AcceptedAfterHook = AfterHookHandler | AfterHookHandler[];

export interface ActionHook {
  before?: AcceptedBeforeHook | null;
  after?: AcceptedBeforeHook | null;
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
