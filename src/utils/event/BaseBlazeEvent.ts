import EventEmitter, { type ConstructorOptions } from 'eventemitter2';

type EventName = string | symbol | (string | symbol)[];

class BaseBlazeEvent extends EventEmitter {
  constructor(options: ConstructorOptions) {
    super(options);
  }

  // eslint-disable-next-line no-use-before-define, @typescript-eslint/no-shadow
  public async emitAsync<T, U = T extends Array<infer T> ? T : T>(
    event: EventName,
    ...values: unknown[]
  ): Promise<U[]> {
    return super.emitAsync(event, ...values);
  }
}

export default BaseBlazeEvent;
