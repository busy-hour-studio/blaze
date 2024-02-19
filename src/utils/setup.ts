import { BlazeContext } from '@/event/BlazeContext';
import type { Action } from '@/types/action';
import type { Event } from '@/types/event';
import type { LoadServiceOption } from '@/types/service';
import fs from 'node:fs';
import type { ZodObject, ZodRawShape, ZodTypeAny } from 'zod';
import { initializeService } from './helper/setup';

export function createAction<
  Body extends ZodTypeAny,
  Params extends ZodObject<ZodRawShape>,
>(action: Action<Body, Params>) {
  return action as Action;
}

export function createEvent(event: Event) {
  return event;
}

export function initializeServices(options: LoadServiceOption) {
  const { app, path: servicePath } = options;

  if (!fs.existsSync(servicePath)) {
    throw new Error("Service path doesn't exist");
  }

  const blazeCtx = new BlazeContext({
    body: null,
    params: null,
    headers: null,
    honoCtx: null,
  });

  const services = fs.readdirSync(servicePath);
  const pendingServices = services.map(
    initializeService(app, servicePath, blazeCtx)
  );

  pendingServices.forEach((onStarted) => onStarted());
}
