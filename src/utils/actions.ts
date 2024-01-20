import { Action, EventHandler, Service } from '@busyhour/blaze';
import { Hono } from 'hono';
import { BlazeEvent } from './event/BlazeEvent';
import { restHandler } from './handler';

export function setupAction(service: Service) {
  if (
    !service.actions ||
    typeof service.actions !== 'object' ||
    Array.isArray(service.actions)
  ) {
    throw new Error('Service actions must be an object');
  }

  const router = new Hono({
    strict: false,
    router: service.router,
  });

  const handlers: EventHandler[] = [];

  Object.entries<Action>(service.actions).forEach(([name, action]) => {
    const actionName = `${service.name}.${name}`;

    if (!action.rest || !action.handler) {
      throw new Error('Action must have at lesat a rest or handler properties');
    }

    if (action.rest) {
      restHandler(router, action.rest);
    }

    if (action.handler) {
      const eventHandler = (...values: unknown[]) => {
        return action.handler?.(BlazeEvent, ...values);
      };

      BlazeEvent.on(actionName, eventHandler);

      handlers.push({
        name: actionName,
        handler: eventHandler,
      });
    }
  });

  return {
    router,
    handlers,
  };
}
