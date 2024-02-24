import type { Router } from 'hono/router';
import type { RouterRoute } from 'hono/types';
import type { BlazeContext } from '../event/BlazeContext';
import type { Blaze } from '../router';
import type { Action, ActionHandler, Actions } from './action';
import type { Event, EventActionHandler, Events } from './event';

export interface Service {
  name: string;
  version?: number | null;
  actions?: Actions | null;
  events?: Events | null;
  onCreated?: ActionHandler | null;
  onStarted?: ActionHandler | null;
  onStopped?(handlers: EventActionHandler[]): void;
  router?: Router<[never, RouterRoute]>;
}

export interface LoadServiceOption {
  app: Blaze;
  path: string;
}

export interface CreateServiceOption {
  sourcePath: string;
  servicePath: string;
  blazeCtx: BlazeContext;
  app: Blaze;
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
