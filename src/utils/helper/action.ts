import { BlazeEvent } from '@/event/BlazeEvent';
import { BlazeContext } from '@/event/BlazeContext';
import {
  type ActionCallResult,
  type AfterHookHandlerOption,
  type BeforeHookHandlerOption,
  type Action,
} from '@/types/action';
import { type EventHandler } from '@/types/event';
import { type AssignActionOption } from '@/types/service';
import { setupRestHandler } from './handler';
import { resolvePromise } from '../common';

async function handleBeforeActionHook(
  options: BeforeHookHandlerOption
): Promise<ActionCallResult<unknown>> {
  const { blazeCtx, hooks } = options;

  for (const hook of hooks) {
    const [, hookErr] = await resolvePromise(hook(blazeCtx));

    if (hookErr) {
      return {
        error: hookErr as Error,
        ok: false,
        result: null,
      };
    }
  }

  return {
    error: null,
    ok: true,
    result: null,
  };
}

async function handleAfterActionHook(
  options: AfterHookHandlerOption
): Promise<ActionCallResult<unknown>> {
  const { blazeCtx, result, hooks } = options;

  let finalResult: unknown = result;

  for (const hook of hooks) {
    const [hookRes, hookErr] = await resolvePromise(
      hook(blazeCtx, finalResult)
    );

    if (hookErr) {
      return {
        error: hookErr as Error,
        ok: false,
        result: null,
      };
    }

    finalResult = hookRes;
  }

  return {
    error: null,
    ok: true,
    result: finalResult,
  };
}

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
        result: null,
      };
    }

    if (action.hooks?.before) {
      const beforeHooks = Array.isArray(action.hooks.before)
        ? action.hooks.before
        : [action.hooks.before];

      const beforeHooksRes = await handleBeforeActionHook({
        blazeCtx,
        hooks: beforeHooks,
      });

      if (!beforeHooksRes.ok) return beforeHooksRes;
    }

    // eslint-disable-next-line prefer-const
    let [result, err] = await resolvePromise(action.handler(blazeCtx));

    if (err) {
      return {
        error: err as Error,
        ok: false,
        result: null,
      };
    }

    if (action.hooks?.after) {
      const afterHooks = Array.isArray(action.hooks.after)
        ? action.hooks.after
        : [action.hooks.after];

      const afterHooksRes = await handleAfterActionHook({
        blazeCtx,
        hooks: afterHooks,
        result,
      });

      return afterHooksRes;
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
