import type { ActionHandler } from './action';

export interface EventHandler {
  name: string;
  handler(...values: unknown[]): ReturnType<ActionHandler>;
}

export interface EventListener {
  (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...values: any[]
  ): Promise<void | unknown> | void | unknown;
}

export type EventName = string;
