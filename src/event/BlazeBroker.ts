import { type ActionCallResult as Result } from '@/types/action';
import { type EventArgs, type EventName } from '@/types/event';
import { BlazeEvent } from './BlazeEvent';

export class BlazeBroker {
  // eslint-disable-next-line no-use-before-define, @typescript-eslint/no-shadow
  public async call<T, U = T extends Array<infer T> ? Result<T> : Result<T>>(
    eventName: EventName,
    params: EventArgs
  ) {
    return BlazeEvent.emitAsync<T, U>(eventName, params);
  }

  // eslint-disable-next-line no-use-before-define, @typescript-eslint/no-shadow
  public async mcall<T, U = T extends Array<infer T> ? Result<T> : Result<T>>(
    ...args: [eventName: EventName, params: EventArgs][]
  ) {
    return Promise.all(args.map((a) => this.call<T, U>(...a)));
  }

  public emit(eventName: EventName, params: EventArgs) {
    return BlazeEvent.emit(eventName, params);
  }

  public eventNames() {
    return BlazeEvent.eventNames();
  }
}
