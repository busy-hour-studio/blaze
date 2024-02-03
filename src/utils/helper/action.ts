import { BlazeContext } from '@/event/BlazeContext';
import { BlazeEvent } from '@/event/BlazeEvent';
import { type Action, type ActionCallResult } from '@/types/action';
import { type EventHandler } from '@/types/event';
import { type AssignActionOption } from '@/types/service';
import { getServiceName, resolvePromise } from '../common';
import { setupRestHandler } from '../rest';
import { handleAfterActionHook, handleBeforeActionHook } from './hooks';

export function createActionHandler(action: Action) {
  return async function eventHandler(
    body: Record<string, unknown>,
    params: Record<string, unknown>
  ): Promise<ActionCallResult<unknown>> {
    const options = {
      honoCtx: null,
      body,
      params,
    };

    const [blazeCtx, blazeErr] = await resolvePromise(
      BlazeContext.create(options)
    );

    if (!blazeCtx || blazeErr) {
      return {
        error: blazeErr as Error,
        ok: false,
      };
    }

    if (action.hooks?.before) {
      const beforeHooksRes = await handleBeforeActionHook({
        blazeCtx,
        hooks: action.hooks.before,
      });

      if (!beforeHooksRes.ok) return beforeHooksRes;
    }

    // eslint-disable-next-line prefer-const
    let [result, err] = await resolvePromise(action.handler(blazeCtx));

    if (err) {
      return {
        error: err as Error,
        ok: false,
      };
    }

    if (action.hooks?.after) {
      const afterHooksRes = await handleAfterActionHook({
        blazeCtx,
        hooks: action.hooks.after,
        result,
      });

      return afterHooksRes;
    }

    return {
      ok: true,
      result,
    };
  };
}

export function assignAction(options: AssignActionOption) {
  const { service, router } = options;

  const handlers: EventHandler[] = [];

  Object.entries<Action>(service.actions).forEach(([actionAlias, action]) => {
    const serviceName = getServiceName(service);
    const actionName = [serviceName, actionAlias].join('.');

    if (action.rest) {
      setupRestHandler({
        handler: action.handler,
        hooks: action.hooks,
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
