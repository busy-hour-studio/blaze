import { BlazeEvent } from '@/event/BlazeEvent';
import { BlazeContext } from '@/event/BlazeContext';
import { Action, EventHandler, Service } from '@/types/blaze';
import { Hono } from 'hono';
import { setupRestHandler } from './handler';

export function createActionHandler(action: Action) {
  return async function eventHandler(
    body: Record<string, unknown>,
    params: Record<string, unknown>
  ) {
    const ctx = await BlazeContext.create({
      honoCtx: null,
      body,
      params,
    });

    return action.handler(ctx);
  };
}

export function assignAction(options: { service: Service; router: Hono }) {
  const { service, router } = options;

  const handlers: EventHandler[] = [];

  Object.entries<Action>(service.actions).forEach(([name, action]) => {
    const actionName = `${service.name}.${name}`;

    if (action.rest) {
      setupRestHandler({
        handler: action.handler,
        rest: action.rest,
        router,
      });
    }

    const eventHandler = createActionHandler(action);

    BlazeEvent.on(actionName, eventHandler);

    handlers.push({
      name: actionName,
      handler: eventHandler,
    });
  });

  return handlers;
}
