import type { BlazeContext } from '../internal';
import type { AnyBlazeActions } from './action';
import type { Random } from './common';
import type { AnyBlazeEvents } from './event';
import type { BlazeActionHandler } from './handler';
import type { BlazeRestRoute, Middleware } from './rest';

export interface BlazeService<
  N extends string = string,
  V extends number = number,
  A extends AnyBlazeActions = AnyBlazeActions,
  E extends AnyBlazeEvents = AnyBlazeEvents,
> {
  name?: N | null;
  rest?: string | null;
  version?: V | null;
  actions?: A | null;
  events?: E | null;
  middlewares?: Middleware[] | null;
  onCreated?: BlazeActionHandler | null;
  onStarted?: BlazeActionHandler | null;
}

export type AnyBlazeService = BlazeService<
  Random,
  Random,
  AnyBlazeActions,
  AnyBlazeEvents
>;

export interface CreateBlazeServiceOption {
  servicePath: string;
  ctx: BlazeContext;
  router: BlazeRestRoute;
  middlewares?: Middleware[] | null;
  service: BlazeService;
}

export interface CreateBlazeService extends CreateBlazeServiceOption {
  sourcePath: string;
}
