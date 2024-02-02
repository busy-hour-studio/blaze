import { type Hono } from 'hono';
import { type RouterRoute } from 'hono/types';
import { type Router } from 'hono/router';
import { type ActionHandler, type Actions } from './action';
import { type EventHandler } from './event';

export interface Service {
  name: string;
  prefix?: string;
  version?: number;
  actions: Actions;
  onCreated?: ActionHandler;
  onStarted?: ActionHandler;
  onStopped?(handlers: EventHandler[]): void;
  router?: Router<[never, RouterRoute]>;
}

export interface LoadServiceOption {
  app: Hono;
  servicePath: string;
  ignoreNotFound?: boolean;
}

export interface AssignActionOption {
  service: Service;
  router: Hono;
}
