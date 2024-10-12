import type { Router } from 'hono/router';
import type { RouterRoute } from 'hono/types';
import type { AnyBlazeActions, BlazeActionHandler } from './action.ts';
import type { Random } from './common.ts';
import type { AnyBlazeEvents } from './event.ts';
import type { ActionEventHandler } from './handler.ts';
import type { Middleware } from './rest.ts';

export interface BlazeService<
  N extends string = string,
  V extends number = number,
  A extends AnyBlazeActions = AnyBlazeActions,
  E extends AnyBlazeEvents = AnyBlazeEvents,
> {
  name?: N | null;
  rest?: string | null;
  tags?: string | string[];
  version?: V | null;
  actions?: A | null;
  events?: E | null;
  middlewares?: Middleware[] | null;
  onCreated?: BlazeActionHandler | null;
  onStarted?: BlazeActionHandler | null;
  onStopped?(handlers: ActionEventHandler[]): void;
  router?: Router<[never, RouterRoute]>;
}

export type AnyBlazeService = BlazeService<
  Random,
  Random,
  AnyBlazeActions,
  AnyBlazeEvents
>;
