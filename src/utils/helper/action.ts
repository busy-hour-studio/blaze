import { BlazeEvent } from '@/event/BlazeEvent';
import { BlazeContext } from '@/event/BlazeContext';
import {
  type Action,
  type AssignActionOption,
  type EventHandler,
} from '@/types/blaze';
import { setupRestHandler } from './handler';
import { resolvePromise } from '../common';

export function createActionHandler(action: Action) {
  return async function eventHandler(
    body: Record<string, unknown>,
    params: Record<string, unknown>
  ) {
    const middlewares = action.middlewares ?? [];

    const blazeCtx = await BlazeContext.create({
      honoCtx: null,
      body,
      params,
    });

    for (const middleware of middlewares) {
      const [, mwErr] = await resolvePromise(middleware(blazeCtx));

      if (mwErr) {
        return {
          error: mwErr,
          ok: false,
          result: null,
        };
      }
    }

    const [result, err] = await resolvePromise(action.handler(blazeCtx));

    if (err) {
      return {
        error: err,
        ok: false,
        result: null,
      };
    }

    return {
      error: null,
      ok: true,
      result,
    };
  };
}

export function assignAction(options: AssignActionOption) {
  const { service, router } = options;

  const handlers: EventHandler[] = [];

  Object.entries<Action>(service.actions).forEach(([name, action]) => {
    const actionName = `${service.name}.${name}`;

    if (action.rest) {
      setupRestHandler({
        handler: action.handler,
        middlewares: action.middlewares ?? [],
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
