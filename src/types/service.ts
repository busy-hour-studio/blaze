import type { Router } from 'hono/router';
import type { RouterRoute } from 'hono/types';
import type { BlazeContext } from '../internal';
import type { BlazeRouter } from '../router/BlazeRouter';
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
  tags?: string | string[];
  version?: V | null;
  actions?: A | null;
  events?: E | null;
  middlewares?: Middleware[] | null;
  onCreated?: BlazeActionHandler | null;
  onStarted?: BlazeActionHandler | null;
  router?: Router<[never, RouterRoute]>;
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

export interface LoadServiceOption {
  app: BlazeRouter;
  path: string;
  middlewares?: Middleware[] | null;
}

export interface ImportServiceOption {
  services: BlazeService[];
  autoStart?: boolean | null;
  middlewares?: Middleware[] | null;
}

export interface LoadServicesOption {
  path: string;
  autoStart?: boolean | null;
  middlewares?: Middleware[] | null;
}
