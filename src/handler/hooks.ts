import type { RecordString, RecordUnknown } from '../types/common';
import type {
  AfterHookHandlerOption,
  BeforeHookHandlerOption,
} from '../types/hooks/index';
import { toArray } from '../utils/common';

export async function beforeActionHookHandler<
  M extends RecordUnknown = RecordUnknown,
  H extends RecordString = RecordString,
  P extends RecordUnknown = RecordUnknown,
  Q extends RecordUnknown = RecordUnknown,
  B extends RecordUnknown = RecordUnknown,
>(options: BeforeHookHandlerOption<M, H, P, Q, B>): Promise<void> {
  const hooks = toArray(options.hooks);

  for (const hook of hooks) {
    await hook(options.ctx);
  }
}

export async function afterActionHookHandler<
  R = unknown | void,
  M extends RecordUnknown = RecordUnknown,
  H extends RecordString = RecordString,
  P extends RecordUnknown = RecordUnknown,
  B extends RecordUnknown = RecordUnknown,
  Q extends RecordUnknown = RecordUnknown,
>(options: AfterHookHandlerOption<R, M, H, P, Q, B>): Promise<unknown> {
  const hooks = toArray(options.hooks);

  // eslint-disable-next-line prefer-destructuring
  let result = options.result;

  for (const hook of hooks) {
    result = await hook(options.ctx, result);
  }

  return result;
}
