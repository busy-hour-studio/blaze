import { type ActionHandler } from './action';

export interface EventHandler {
  name: string;
  handler(...values: unknown[]): ReturnType<ActionHandler>;
}

export type EventListener = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...values: any[]
) => Promise<void | unknown> | void | unknown;

export type EventName = string | symbol | (string | symbol)[];

export type EventArgs = {
  body?: Record<string, unknown> | null;
  params?: Record<string, unknown> | null;
  headers?: Record<string, string> | null;
};
