/* eslint-disable @typescript-eslint/ban-ts-comment */
// deno-lint-ignore-file ban-ts-comment
/* eslint-disable import/no-cycle */
import type { Random } from '../../types/common.ts';
import type {
  BlazeActionCallRecord,
  BlazeEventCallRecord,
} from '../../types/helper.ts';
import { RESERVED_KEYWORD } from '../../utils/constants/broker.ts';
import { BlazeError } from '../errors/index.ts';
import { BlazeEvent } from '../index.ts';

export class BlazeBroker {
  public hasListeners(eventName: string) {
    return BlazeEvent.listenerCount(eventName) > 0;
  }

  private validateEventName(eventName: string) {
    if (this.hasListeners(eventName)) return;

    throw new BlazeError(`Event "${eventName}" does not exist!`);
  }

  public async call<
    T extends keyof BlazeActionCallRecord | (string & NonNullable<unknown>),
    // @ts-expect-error
    U = BlazeActionCallRecord[T],
    // @ts-expect-error
    V = U['result'],
  >(eventName: T): Promise<V>;
  public async call<
    T extends keyof BlazeActionCallRecord | (string & NonNullable<unknown>),
    // @ts-expect-error
    U = BlazeActionCallRecord[T],
    // @ts-expect-error
    V = U['result'],
    // @ts-expect-error
  >(eventName: T, body: U['body']): Promise<V>;
  public async call<
    T extends keyof BlazeActionCallRecord | (string & NonNullable<unknown>),
    // @ts-expect-error
    U = BlazeActionCallRecord[T],
    // @ts-expect-error
    V = U['result'],
  >(
    eventName: T,
    // @ts-expect-error
    body: U['body'],
    // @ts-expect-error
    params: U['params']
  ): Promise<V>;
  public async call<
    T extends keyof BlazeActionCallRecord | (string & NonNullable<unknown>),
    // @ts-expect-error
    U = BlazeActionCallRecord[T],
    // @ts-expect-error
    V = U['result'],
  >(
    eventName: T,
    // @ts-expect-error
    body: U['body'],
    // @ts-expect-error
    params: U['params'],
    // @ts-expect-error
    headers: U['headers']
  ): Promise<V>;
  public async call<
    T extends keyof BlazeActionCallRecord | (string & NonNullable<unknown>),
    // @ts-expect-error
    U = BlazeActionCallRecord[T],
    // @ts-expect-error
    V = U['result'],
  >(
    eventName: T,
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
    T extends keyof BlazeActionCallRecord | (string & NonNullable<unknown>),
    // @ts-expect-error
    U = BlazeActionCallRecord[T],
    // @ts-expect-error
    V = U['result'],
  >(eventName: T, ...values: Random[]): Promise<V> {
    this.validateEventName(eventName);

    const results = await BlazeEvent.emitAsync<never, V>(eventName, ...values);

    return results[0];
  }

  public emit<
    T extends keyof BlazeActionCallRecord | (string & NonNullable<unknown>),
  >(eventName: T): boolean;
  public emit<
    T extends keyof BlazeActionCallRecord | (string & NonNullable<unknown>),
    // @ts-expect-error
    U = BlazeActionCallRecord[T],
    // @ts-expect-error
  >(eventName: T, body: U['body']): boolean;
  public emit<
    T extends keyof BlazeActionCallRecord | (string & NonNullable<unknown>),
    // @ts-expect-error
    U = BlazeActionCallRecord[T],
    // @ts-expect-error
  >(eventName: T, body: U['body'], params: U['params']): boolean;
  public emit<
    T extends keyof BlazeActionCallRecord | (string & NonNullable<unknown>),
    // @ts-expect-error
    U = BlazeActionCallRecord[T],
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
    T extends keyof BlazeActionCallRecord | (string & NonNullable<unknown>),
  >(eventName: T, ...values: Random[]) {
    return BlazeEvent.emit(eventName, ...values);
  }

  public event<
    T extends keyof BlazeEventCallRecord | (string & NonNullable<unknown>),
  >(eventName: T): boolean;
  public event<
    T extends keyof BlazeEventCallRecord | (string & NonNullable<unknown>),
    // @ts-expect-error
    U = BlazeEventCallRecord[T],
    // @ts-expect-error
  >(eventName: T, body: U['body']): boolean;
  public event<
    T extends keyof BlazeEventCallRecord | (string & NonNullable<unknown>),
  >(eventName: T, ...values: Random[]) {
    const evtName = [RESERVED_KEYWORD.PREFIX.EVENT, eventName].join('.');

    return BlazeEvent.emit(evtName, ...values);
  }
}
