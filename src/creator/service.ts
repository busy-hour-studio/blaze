import { AnyBlazeActions } from '../types/action';
import { AnyBlazeEvents } from '../types/event';
import type { BlazeService } from '../types/service';

export function createService<
  N extends string,
  V extends number,
  A extends AnyBlazeActions,
  E extends AnyBlazeEvents,
  S extends BlazeService<N, V, A, E>,
>(service: S) {
  return service;
}
