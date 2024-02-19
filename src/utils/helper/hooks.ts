import type {
  ActionCallResult,
  AfterHookHandlerOption,
  BeforeHookHandlerOption,
} from '@/types/action';
import { resolvePromise, toArray } from '../common';

export async function beforeActionHookHandler(
  options: BeforeHookHandlerOption
): Promise<ActionCallResult<unknown>> {
  const hooks = toArray(options.hooks);

  for (const hook of hooks) {
    const [, hookErr] = await resolvePromise(hook(options.blazeCtx));

    if (hookErr) {
      return {
        error: hookErr as Error,
        ok: false,
      };
    }
  }

  return {
    ok: true,
    result: null,
  };
}

export async function afterActionHookHandler(
  options: AfterHookHandlerOption
): Promise<ActionCallResult<unknown>> {
  const hooks = toArray(options.hooks);

  // eslint-disable-next-line prefer-destructuring
  let result: unknown = options.result;

  for (const hook of hooks) {
    const [hookRes, hookErr] = await resolvePromise(
      hook(options.blazeCtx, result)
    );

    if (hookErr) {
      return {
        error: hookErr as Error,
        ok: false,
      };
    }

    result = hookRes;
  }

  return {
    ok: true,
    result,
  };
}
