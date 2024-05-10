/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable import/no-cycle */
import { BlazeEvent } from '.';
import { BlazeError } from '../errors/BlazeError';
import type { ActionCallResult as Result } from '../types/action';
import type {
  ActionCallRecord,
  ActionEventCallRequest,
  EventCallRecord,
} from '../types/common';
import type { EventName } from '../types/event';
import type { Random, RecordString, RecordUnknown } from '../types/helper';
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
    U extends ActionEventCallRequest<
      RecordString,
      RecordUnknown,
      Random,
      Random
      // @ts-expect-error
    > = ActionCallRecord[T],
    V = Result<U['result']>,
  >(eventName: T, body: U['body']): Promise<V>;
  public async call<
    T extends keyof ActionCallRecord | (string & NonNullable<unknown>),
    U extends ActionEventCallRequest<
      RecordString,
      RecordUnknown,
      Random,
      Random
      // @ts-expect-error
    > = ActionCallRecord[T],
    V = Result<U['result']>,
  >(eventName: T, body: U['body'], params: U['params']): Promise<V>;
  public async call<
    T extends keyof ActionCallRecord | (string & NonNullable<unknown>),
    U extends ActionEventCallRequest<
      RecordString,
      RecordUnknown,
      Random,
      Random
      // @ts-expect-error
    > = ActionCallRecord[T],
    V = Result<U['result']>,
  >(
    eventName: T,
    body: U['body'],
    params: U['params'],
    headers: U['headers']
  ): Promise<V>;
  public async call<
    T extends keyof ActionCallRecord | (string & NonNullable<unknown>),
    U extends ActionEventCallRequest<
      RecordString,
      RecordUnknown,
      Random,
      Random
      // @ts-expect-error
    > = ActionCallRecord[T],
    V = Result<U['result']>,
  >(eventName: T, ...values: unknown[]) {
    this.validateEventName(eventName);

    const results = await BlazeEvent.emitAsync<never, V>(eventName, ...values);

    return results[0];
  }

  public emit<
    T extends keyof ActionCallRecord | (string & NonNullable<unknown>),
    U extends ActionEventCallRequest<
      RecordString,
      RecordUnknown,
      Random,
      Random
      // @ts-expect-error
    > = ActionCallRecord[T],
  >(eventName: T, body: U['body']): boolean;
  public emit<
    T extends keyof ActionCallRecord | (string & NonNullable<unknown>),
    U extends ActionEventCallRequest<
      RecordString,
      RecordUnknown,
      Random,
      Random
      // @ts-expect-error
    > = ActionCallRecord[T],
  >(eventName: T, body: U['body'], params: U['params']): boolean;
  public emit<
    T extends keyof ActionCallRecord | (string & NonNullable<unknown>),
    U extends ActionEventCallRequest<
      RecordString,
      RecordUnknown,
      Random,
      Random
      // @ts-expect-error
    > = ActionCallRecord[T],
  >(
    eventName: T,
    body: U['body'],
    params: U['params'],
    headers: U['headers']
  ): boolean;
  public emit<
    T extends keyof ActionCallRecord | (string & NonNullable<unknown>),
  >(eventName: T, ...values: unknown[]) {
    return BlazeEvent.emit(eventName, ...values);
  }

  public event<
    T extends keyof EventCallRecord | (string & NonNullable<unknown>),
    U extends ActionEventCallRequest<
      RecordString,
      RecordUnknown,
      Random,
      Random
      // @ts-expect-error
    > = EventCallRecord[T],
  >(eventName: T, body: U['body']): boolean;
  public event<
    T extends keyof ActionCallRecord | (string & NonNullable<unknown>),
  >(eventName: T, ...values: unknown[]) {
    const evtName = [RESERVED_KEYWORD.PREFIX.EVENT, eventName].join('.');

    return BlazeEvent.emit(evtName, ...values);
  }
}
