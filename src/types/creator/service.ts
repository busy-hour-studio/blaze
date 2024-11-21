import type { Actions } from '../action';
import type { Events } from '../event';
import type { Service } from '../service';
import type { BlazeActionCreator } from './action';
import type { BlazeEventCreator } from './event';

export interface BlazeServiceCreator {
  /**
   * Create a new service with the given name, actions, events, and etc.
   * @example
   * ```ts
   *  const service = BlazeCreator.service({
   *    name: 'user',
   *    actions: {
   *      find,
   *      create,
   *    },
   *  })
   * ```
   */
  <
    N extends string,
    V extends number,
    A extends Actions,
    E extends Events,
    S extends Service<N, V, A, E>,
  >(
    service: S
  ): Readonly<S>;
  action: BlazeActionCreator;
  event: BlazeEventCreator;
}
