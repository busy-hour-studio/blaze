import { type ActionHandler } from './action';

export interface EventHandler {
  name: string;
  handler(...values: unknown[]): ReturnType<ActionHandler>;
}
