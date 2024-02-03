import { type BlazeContext } from '@/event/BlazeContext';
import { type RestParam } from './rest';

export type ActionHandler = (
  ctx: BlazeContext
) => Promise<unknown | void> | unknown | void;

export type BeforeHookHandler = (ctx: BlazeContext) => Promise<void> | void;

export type AfterHookHandler = (
  ctx: BlazeContext,
  res: unknown
) => Promise<void> | void;

export interface Action {
  name?: string;
  handler: ActionHandler;
  rest?: RestParam;
  hooks?: {
    before?: BeforeHookHandler | BeforeHookHandler[];
    after?: AfterHookHandler | AfterHookHandler[];
  };
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
