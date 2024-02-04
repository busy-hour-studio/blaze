import { type ActionCallResult as Result } from '@/types/action';
import { type EventName } from '@/types/event';
import { BlazeEvent } from './BlazeEvent';

export class BlazeBroker {
  // eslint-disable-next-line no-use-before-define, @typescript-eslint/no-shadow
  public async call<T, U = T extends Array<infer T> ? Result<T> : Result<T>>(
    eventName: EventName,
    ...values: unknown[]
  ) {
    return BlazeEvent.emitAsync<T, U>(eventName, ...values);
  }

  // eslint-disable-next-line no-use-before-define, @typescript-eslint/no-shadow
  public async mcall<T, U = T extends Array<infer T> ? Result<T> : Result<T>>(
    ...args: [eventName: EventName, ...values: unknown[]][]
  ) {
    return Promise.all(args.map((values) => this.call<T, U>(...values)));
  }

  public emit(eventName: EventName, ...values: unknown[]) {
    return BlazeEvent.emit(eventName, ...values);
  }

  public eventNames() {
    return BlazeEvent.eventNames();
  }
}
