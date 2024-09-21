/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable import/no-cycle */
import { BlazeEvent } from '.';
import { BlazeError } from '../errors/BlazeError';
import type {
  ActionCallResult,
  ActionCallResult as Result,
} from '../types/action';
import type { ActionCallRecord, EventCallRecord } from '../types/common';
import type { EventName } from '../types/event';
import type { Random } from '../types/helper';
import { resolvePromise } from '../utils/common';
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

  public async call<
    T extends keyof ActionCallRecord | (string & NonNullable<unknown>),
    // @ts-expect-error
    U = ActionCallRecord[T],
    // @ts-expect-error
    V = Result<U['result']>,
    // @ts-expect-error
  >(eventName: T, body: U['body']): Promise<ActionCallResult<V>>;
  public async call<
    T extends keyof ActionCallRecord | (string & NonNullable<unknown>),
    // @ts-expect-error
    U = ActionCallRecord[T],
    // @ts-expect-error
    V = Result<U['result']>,
  >(
    eventName: T,
    // @ts-expect-error
    body: U['body'],
    // @ts-expect-error
    params: U['params']
  ): Promise<ActionCallResult<V>>;
  public async call<
    T extends keyof ActionCallRecord | (string & NonNullable<unknown>),
    // @ts-expect-error
    U = ActionCallRecord[T],
    // @ts-expect-error
    V = Result<U['result']>,
  >(
    eventName: T,
    // @ts-expect-error
    body: U['body'],
    // @ts-expect-error
    params: U['params'],
    // @ts-expect-error
    headers: U['headers'] // @ts-expect-error
  ): Promise<ActioncallResult<V>>;
  public async call<
    T extends keyof ActionCallRecord | (string & NonNullable<unknown>),
    // @ts-expect-error
    U = ActionCallRecord[T],
    // @ts-expect-error
    V = Result<U['result']>,
  >(
    eventName: T,
    // @ts-expect-error
    body: U['body'],
    // @ts-expect-error
    params: U['params'],
    // @ts-expect-error
    headers: U['headers'],
    // @ts-expect-error
    query: U['query'] // @ts-expect-error
  ): Promise<ActioncallResult<V>>;
  public async call<
    T extends keyof ActionCallRecord | (string & NonNullable<unknown>),
    // @ts-expect-error
    U = ActionCallRecord[T],
    // @ts-expect-error
    V = Result<U['result']>,
  >(eventName: T, ...values: Random[]): Promise<ActionCallResult<V>> {
    this.validateEventName(eventName);

    const [results, error] = await resolvePromise(
      BlazeEvent.emitAsync<never, V>(eventName, ...values)
    );

    if (error || !results) {
      return {
        ok: false,
        error: error as Error,
      };
    }

    return {
      ok: true,
      result: results[0],
    };
  }

  public emit<
    T extends keyof ActionCallRecord | (string & NonNullable<unknown>),
    // @ts-expect-error
    U = ActionCallRecord[T],
    // @ts-expect-error
  >(eventName: T, body: U['body']): boolean;
  public emit<
    T extends keyof ActionCallRecord | (string & NonNullable<unknown>),
    // @ts-expect-error
    U = ActionCallRecord[T],
    // @ts-expect-error
  >(eventName: T, body: U['body'], params: U['params']): boolean;
  public emit<
    T extends keyof ActionCallRecord | (string & NonNullable<unknown>),
    // @ts-expect-error
    U = ActionCallRecord[T],
  >(
    eventName: T,
    // @ts-expect-error
    body: U['body'],
    // @ts-expect-error
    params: U['params'],
    // @ts-expect-error
    headers: U['headers']
  ): boolean;
  public emit<
    T extends keyof ActionCallRecord | (string & NonNullable<unknown>),
  >(eventName: T, ...values: Random[]) {
    return BlazeEvent.emit(eventName, ...values);
  }

  public event<
    T extends keyof EventCallRecord | (string & NonNullable<unknown>),
    // @ts-expect-error
    U = EventCallRecord[T],
    // @ts-expect-error
  >(eventName: T, body: U['body']): boolean;
  public event<
    T extends keyof ActionCallRecord | (string & NonNullable<unknown>),
  >(eventName: T, ...values: Random[]) {
    const evtName = [RESERVED_KEYWORD.PREFIX.EVENT, eventName].join('.');

    return BlazeEvent.emit(evtName, ...values);
  }
}
