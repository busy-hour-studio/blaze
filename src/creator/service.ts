import { Actions } from '../types/action';
import { Events } from '../types/event';
import type { Service } from '../types/service';

export function createService<
  N extends string,
  V extends number,
  A extends Actions,
  E extends Events,
  S extends Service<N, V, A, E>,
>(service: S) {
  return service;
}
