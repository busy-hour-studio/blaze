import type { EventHandler } from '@/types/event';
import type { Service } from '@/types/service';
import { Hono } from 'hono';
import { assignAction } from './helper/action';

export function setupAction(service: Service) {
  if (!service.actions)
    return {
      router: null,
      handlers: [] as EventHandler[],
    };

  if (typeof service.actions !== 'object' || Array.isArray(service.actions)) {
    throw new Error('Service actions must be an object');
  }

  const router = new Hono({
    strict: false,
    router: service.router,
  });

  const handlers = assignAction({
    router,
    service,
  });

  return {
    router,
    handlers,
  };
}
