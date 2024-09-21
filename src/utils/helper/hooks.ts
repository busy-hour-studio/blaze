import type {
  AfterHookHandlerOption,
  BeforeHookHandlerOption,
} from '../../types/hooks';
import { toArray } from '../common';

export async function beforeActionHookHandler(
  options: BeforeHookHandlerOption
): Promise<void> {
  const hooks = toArray(options.hooks);

  for (const hook of hooks) {
    await hook(options.blazeCtx);
  }
}

export async function afterActionHookHandler(
  options: AfterHookHandlerOption
): Promise<unknown> {
  const hooks = toArray(options.hooks);

  // eslint-disable-next-line prefer-destructuring
  let result = options.result;

  for (const hook of hooks) {
    result = await hook(options.blazeCtx, result);
  }

  return result;
}
