import type { Hono } from 'hono';
import type { Router } from 'hono/router';
import type { RouterRoute } from 'hono/types';
import type { ActionHandler, Actions } from './action';
import type { EventActionHandler, Events } from './event';

export interface Service {
  name: string;
  prefix?: string | null;
  version?: number | null;
  actions?: Actions | null;
  events?: Events | null;
  onCreated?: ActionHandler | null;
  onStarted?: ActionHandler | null;
  onStopped?(handlers: EventActionHandler[]): void;
  router?: Router<[never, RouterRoute]>;
}

export interface LoadServiceOption {
  app: Hono;
  path: string;
}

export interface AssignActionOption {
  service: Service;
  router: Hono;
}
