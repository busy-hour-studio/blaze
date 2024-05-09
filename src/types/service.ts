import type { Router } from 'hono/router';
import type { RouterRoute } from 'hono/types';
import type { BlazeContext } from '../event';
import type { BlazeRouter } from '../router';
import type { Action, ActionHandler, Actions } from './action';
import type { Event, EventActionHandler, Events } from './event';

export interface Service<
  N extends string = string,
  A extends Actions = Actions,
  E extends Events = Events,
> {
  name?: N | null;
  version?: number | null;
  actions?: A | null;
  events?: E | null;
  onCreated?: ActionHandler | null;
  onStarted?: ActionHandler | null;
  onStopped?(handlers: EventActionHandler[]): void;
  router?: Router<[never, RouterRoute]>;
}

export interface LoadServiceOption {
  app: BlazeRouter;
  path: string;
}

export interface LoadServicesOption {
  path: string;
  autoStart?: boolean | null;
}

export interface CreateServiceOption {
  sourcePath: string;
  servicePath: string;
  blazeCtx: BlazeContext;
  app: BlazeRouter;
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
