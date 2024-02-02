import { type BlazeContext } from '@/event/BlazeContext';
import { type RestParam } from './rest';

export type ActionHandler = (
  ctx: BlazeContext
) => Promise<unknown | void> | unknown | void;

export interface Action {
  name?: string;
  middlewares?: ActionHandler[];
  handler: ActionHandler;
  rest?: RestParam;
}

export type ActionCallResult<U> =
  | { error: Error; ok: false; result: null }
  | { error: null; ok: true; result: U };

export interface Actions {
  [key: string]: Action;
}
