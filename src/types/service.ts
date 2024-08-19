import type { Router } from 'hono/router';
import type { RouterRoute } from 'hono/types';
import type { BlazeContext } from '../internal';
import type { BlazeRouter } from '../router';
import type { Action, ActionHandler, Actions } from './action';
import type { Event, EventActionHandler, Events } from './event';
import type { Middleware } from './rest';

export interface Service<
  N extends string = string,
  V extends number = number,
  A extends Actions = Actions,
  E extends Events = Events,
> {
  name?: N | null;
  rest?: string | null;
  tags?: string | string[];
  version?: V | null;
  actions?: A | null;
  events?: E | null;
  middlewares?: Middleware[] | null;
  onCreated?: ActionHandler | null;
  onStarted?: ActionHandler | null;
  onStopped?(handlers: EventActionHandler[]): void;
  router?: Router<[never, RouterRoute]>;
}

export interface LoadServiceOption {
  app: BlazeRouter;
  path: string;
  middlewares?: Middleware[] | null;
}

export interface LoadServicesOption {
  path: string;
  autoStart?: boolean | null;
  middlewares?: Middleware[] | null;
}

export interface CreateServiceOption {
  sourcePath: string;
  servicePath: string;
  blazeCtx: BlazeContext;
  app: BlazeRouter;
  middlewares: Middleware[];
}

export interface ServiceConstructorOption
  extends Omit<CreateServiceOption, 'sourcePath'> {
  service: Service;
}

export interface CreateActionOption {
  action: Action;
  serviceName: string;
  actionAlias: string;
}

export interface CreateEventOption {
  event: Event;
  serviceName: string;
  eventAlias: string;
}
