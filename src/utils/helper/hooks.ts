import type {
  BlazeAfterHookHandlerOption,
  BlazeBeforeHookHandlerOption,
} from '../../types/hook';
import { toArray } from '../common';

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
