/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable import/no-cycle */
import { BlazeEvent } from '.';
import { BlazeError } from '../errors/BlazeError';
import type { ActionCallRecord, EventCallRecord } from '../types/common';
import type { EventName } from '../types/event';
import type { Random } from '../types/helper';
import { RESERVED_KEYWORD } from '../utils/constant';

export class BlazeBroker {
  public hasListener(eventName: EventName) {
    return BlazeEvent.listenerCount(eventName) > 0;
  }

  private validateEventName(eventName: EventName) {
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
    // @ts-expect-error
    U = ActionCallRecord[T],
    // @ts-expect-error
    V = U['result'],
  >(actionName: T): Promise<V>;
  public async call<
    T extends keyof ActionCallRecord | (string & NonNullable<unknown>),
    // @ts-expect-error
    U = ActionCallRecord[T],
    // @ts-expect-error
    V = U['result'],
    // @ts-expect-error
  >(actionName: T, body: U['body']): Promise<V>;
  public async call<
    T extends keyof ActionCallRecord | (string & NonNullable<unknown>),
    // @ts-expect-error
    U = ActionCallRecord[T],
    // @ts-expect-error
    V = U['result'],
  >(
    actionName: T,
    // @ts-expect-error
    body: U['body'],
    // @ts-expect-error
    params: U['params']
  ): Promise<V>;
  public async call<
    T extends keyof ActionCallRecord | (string & NonNullable<unknown>),
    // @ts-expect-error
    U = ActionCallRecord[T],
    // @ts-expect-error
    V = U['result'],
  >(
    actionName: T,
    // @ts-expect-error
    body: U['body'],
    // @ts-expect-error
    params: U['params'],
    // @ts-expect-error
    headers: U['headers']
  ): Promise<V>;
  public async call<
    T extends keyof ActionCallRecord | (string & NonNullable<unknown>),
    // @ts-expect-error
    U = ActionCallRecord[T],
    // @ts-expect-error
    V = U['result'],
  >(
    actionName: T,
    // @ts-expect-error
    body: U['body'],
    // @ts-expect-error
    params: U['params'],
    // @ts-expect-error
    headers: U['headers'],
    // @ts-expect-error
    query: U['query']
  ): Promise<V>;
  public async call<
    T extends keyof ActionCallRecord | (string & NonNullable<unknown>),
    // @ts-expect-error
    U = ActionCallRecord[T],
    // @ts-expect-error
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
    // @ts-expect-error
    U = ActionCallRecord[T],
    // @ts-expect-error
  >(actionName: T, body: U['body']): boolean;
  public emit<
    T extends keyof ActionCallRecord | (string & NonNullable<unknown>),
    // @ts-expect-error
    U = ActionCallRecord[T],
    // @ts-expect-error
  >(actionName: T, body: U['body'], params: U['params']): boolean;
  public emit<
    T extends keyof ActionCallRecord | (string & NonNullable<unknown>),
    // @ts-expect-error
    U = ActionCallRecord[T],
  >(
    actionName: T,
    // @ts-expect-error
    body: U['body'],
    // @ts-expect-error
    params: U['params'],
    // @ts-expect-error
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
    // @ts-expect-error
    U = EventCallRecord[T],
    // @ts-expect-error
  >(eventName: T, body: U['body']): boolean;
  public event<
    T extends keyof EventCallRecord | (string & NonNullable<unknown>),
  >(eventName: T, ...values: Random[]) {
    const $eventName = [RESERVED_KEYWORD.PREFIX.EVENT, eventName].join('.');

    return BlazeEvent.emit($eventName, ...values);
  }
}
