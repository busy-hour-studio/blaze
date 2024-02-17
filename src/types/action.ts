import { type BlazeContext } from '@/event/BlazeContext';
import { type RestParam } from './rest';

export interface ServiceEventHandler {
  (ctx: BlazeContext): Promise<void> | void;
}

export interface ServiceEvents {
  [key: string]: ServiceEventHandler;
}

export interface ActionHandler {
  (ctx: BlazeContext): Promise<unknown | void> | unknown | void;
}

export interface BeforeHookHandler {
  (ctx: BlazeContext): Promise<void> | void;
}

export interface AfterHookHandler {
  (ctx: BlazeContext, res: unknown): Promise<unknown | void> | unknown | void;
}

export interface ActionHook {
  before?: BeforeHookHandler | BeforeHookHandler[];
  after?: AfterHookHandler | AfterHookHandler[];
}

export interface Action {
  name?: string;
  handler: ActionHandler;
  rest?: RestParam;
  hooks?: ActionHook;
}

export interface AfterHookHandlerOption {
  result: unknown;
  hooks: AfterHookHandler | AfterHookHandler[];
  blazeCtx: BlazeContext;
}

export interface BeforeHookHandlerOption {
  hooks: BeforeHookHandler | BeforeHookHandler[];
  blazeCtx: BlazeContext;
}

export type ActionCallResult<U> =
  | { error: Error; ok: false }
  | { ok: true; result: U };

export interface Actions {
  [key: string]: Action;
}
