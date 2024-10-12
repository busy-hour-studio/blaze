import type { BlazeContext } from '../../internal/index.ts';
import type { BlazeAction } from '../../types/action.ts';
import { toArray } from '../../utils/common/index.ts';
import type {
  BlazeAfterHookHandlerOption,
  BlazeBeforeHookHandlerOption,
} from './types.ts';

export async function beforeActionHookHandler(
  options: BlazeBeforeHookHandlerOption
): Promise<void> {
  const hooks = toArray(options.hooks);

  for (const hook of hooks) {
    await hook(options.ctx);
  }
}

export async function afterActionHookHandler(
  options: BlazeAfterHookHandlerOption
): Promise<unknown> {
  const hooks = toArray(options.hooks);

  // eslint-disable-next-line prefer-destructuring
  let result = options.result;

  for (const hook of hooks) {
    result = await hook(options.ctx, result);
  }

  return result;
}

// Reuseable action handler for Call/Emit/REST
export async function eventHandler(
  action: BlazeAction,
  ctx: BlazeContext
): Promise<unknown> {
  if (action?.hooks?.before) {
    await beforeActionHookHandler({
      ctx,
      hooks: action.hooks.before,
    });
  }

  const result = await action.handler(ctx);

  if (action?.hooks?.after) {
    const afterHooksRes = await afterActionHookHandler({
      ctx,
      hooks: action.hooks.after,
      result,
    });

    return afterHooksRes;
  }

  return result;
}
