import type { Actions } from '../types/action.ts';
import type { Events } from '../types/event.ts';
import type { Service } from '../types/service.ts';

export function createService<
  N extends string,
  V extends number,
  A extends Actions,
  E extends Events,
  S extends Service<N, V, A, E>,
>(service: S) {
  return service;
}
