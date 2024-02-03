import { type Hono } from 'hono';
import { type Router } from 'hono/router';
import { type RouterRoute } from 'hono/types';
import { type ActionHandler, type ActionHook, type Actions } from './action';
import { type EventHandler } from './event';

export interface Service {
  name: string;
  prefix?: string;
  version?: number;
  hooks?: ActionHook;
  actions: Actions;
  onCreated?: ActionHandler;
  onStarted?: ActionHandler;
  onStopped?(handlers: EventHandler[]): void;
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
