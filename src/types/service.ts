import type { Router } from 'hono/router';
import type { MiddlewareHandler, RouterRoute } from 'hono/types';
import type { BlazeContext } from '../internal/context/index.ts';
import type { BlazeRouter } from '../router/BlazeRouter.ts';
import type { Action, ActionHandler, Actions } from './action.ts';
import type { Random } from './common.ts';
import type { Event, EventActionHandler, Events } from './event.ts';
import type { ExposedMethod } from './rest.ts';

export type Middleware = [ExposedMethod, MiddlewareHandler];

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

export type AnyService = Service<Random, Random, Actions, Events>;

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

export interface ImportServiceOption {
  services: Service[];
  autoStart?: boolean | null;
  middlewares?: Middleware[] | null;
}

export interface CreateServiceOption {
  sourcePath: string;
  servicePath: string;
  ctx: BlazeContext;
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
