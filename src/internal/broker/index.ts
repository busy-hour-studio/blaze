import type { Random } from '../../types/common';
import type { ActionCallRecord, EventCallRecord } from '../../types/external';
import { RESERVED_KEYWORD } from '../../utils/constant/index';
import { BlazeError } from '../errors/index';
import { BlazeEvent } from '../event-emitter/instance';

export class BlazeBroker {
  public hasListener(eventName: string) {
    return BlazeEvent.listenerCount(eventName) > 0;
  }

  private validateEventName(eventName: string) {
    if (this.hasListener(eventName)) return;

    throw new BlazeError({
      status: 500,
      errors: {
        message: `No listener for event ${eventName}`,
      },
      message: 'No listener for event',
    });
  }

  /**
   * @description Call an action through the broker and return the result
   * @param actionName name of the action that will be called
   * @param body data that will be passed to the action
   * @param params data that will be passed to the action
   * @param headers data that will be passed to the action
   * @param query data that will be passed to the action
   */
  public async call<
    T extends keyof ActionCallRecord | (string & NonNullable<unknown>),
    // @ts-expect-error properties-not-defined
    U = ActionCallRecord[T],
    // @ts-expect-error properties-not-defined
    V = U['result'],
  >(actionName: T): Promise<V>;
  public async call<
    T extends keyof ActionCallRecord | (string & NonNullable<unknown>),
    // @ts-expect-error properties-not-defined
    U = ActionCallRecord[T],
    // @ts-expect-error properties-not-defined
    V = U['result'],
    // @ts-expect-error properties-not-defined
  >(actionName: T, body: U['body']): Promise<V>;
  public async call<
    T extends keyof ActionCallRecord | (string & NonNullable<unknown>),
    // @ts-expect-error properties-not-defined
    U = ActionCallRecord[T],
    // @ts-expect-error properties-not-defined
    V = U['result'],
  >(
    actionName: T,
    // @ts-expect-error properties-not-defined
    body: U['body'],
    // @ts-expect-error properties-not-defined
    params: U['params']
  ): Promise<V>;
  public async call<
    T extends keyof ActionCallRecord | (string & NonNullable<unknown>),
    // @ts-expect-error properties-not-defined
    U = ActionCallRecord[T],
    // @ts-expect-error properties-not-defined
    V = U['result'],
  >(
    actionName: T,
    // @ts-expect-error properties-not-defined
    body: U['body'],
    // @ts-expect-error properties-not-defined
    params: U['params'],
    // @ts-expect-error properties-not-defined
    headers: U['headers']
  ): Promise<V>;
  public async call<
    T extends keyof ActionCallRecord | (string & NonNullable<unknown>),
    // @ts-expect-error properties-not-defined
    U = ActionCallRecord[T],
    // @ts-expect-error properties-not-defined
    V = U['result'],
  >(
    actionName: T,
    // @ts-expect-error properties-not-defined
    body: U['body'],
    // @ts-expect-error properties-not-defined
    params: U['params'],
    // @ts-expect-error properties-not-defined
    headers: U['headers'],
    // @ts-expect-error properties-not-defined
    query: U['query']
  ): Promise<V>;
  public async call<
    T extends keyof ActionCallRecord | (string & NonNullable<unknown>),
    // @ts-expect-error properties-not-defined
    U = ActionCallRecord[T],
    // @ts-expect-error properties-not-defined
    V = U['result'],
  >(actionName: T, ...values: Random[]): Promise<V> {
    this.validateEventName(actionName);

    const results = await BlazeEvent.emitAsync<never, V>(actionName, ...values);

    return results[0];
  }

  /**
   * @description Call an action through the broker asynchronously
   * @param actionName name of the action that will be called
   * @param body data that will be passed to the action
   * @param params data that will be passed to the action
   * @param headers data that will be passed to the action
   * @param query data that will be passed to the action
   */
  public emit<
    T extends keyof ActionCallRecord | (string & NonNullable<unknown>),
    // @ts-expect-error properties-not-defined
    U = ActionCallRecord[T],
    // @ts-expect-error properties-not-defined
  >(actionName: T, body: U['body']): boolean;
  public emit<
    T extends keyof ActionCallRecord | (string & NonNullable<unknown>),
    // @ts-expect-error properties-not-defined
    U = ActionCallRecord[T],
    // @ts-expect-error properties-not-defined
  >(actionName: T, body: U['body'], params: U['params']): boolean;
  public emit<
    T extends keyof ActionCallRecord | (string & NonNullable<unknown>),
    // @ts-expect-error properties-not-defined
    U = ActionCallRecord[T],
  >(
    actionName: T,
    // @ts-expect-error properties-not-defined
    body: U['body'],
    // @ts-expect-error properties-not-defined
    params: U['params'],
    // @ts-expect-error properties-not-defined
    headers: U['headers']
  ): boolean;
  public emit<
    T extends keyof ActionCallRecord | (string & NonNullable<unknown>),
  >(actionName: T, ...values: Random[]) {
    return BlazeEvent.emit(actionName, ...values);
  }

  /**
   * @description Call an action through the broker asynchronously
   * @param eventName name of the action that will be called
   * @param body data that will be passed to the evemt
   */
  public event<
    T extends keyof EventCallRecord | (string & NonNullable<unknown>),
  >(eventName: T): boolean;
  public event<
    T extends keyof EventCallRecord | (string & NonNullable<unknown>),
    // @ts-expect-error properties-not-defined
    U = EventCallRecord[T],
    // @ts-expect-error properties-not-defined
  >(eventName: T, body: U['body']): boolean;
  public event<
    T extends keyof EventCallRecord | (string & NonNullable<unknown>),
  >(eventName: T, ...values: Random[]) {
    const $eventName = [RESERVED_KEYWORD.PREFIX.EVENT, eventName].join('.');

    return BlazeEvent.emit($eventName, ...values);
  }
}
