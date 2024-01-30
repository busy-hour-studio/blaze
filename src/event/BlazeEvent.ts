import { BaseBlazeEvent } from './BaseBlazeEvent';

class EventStore {
  // eslint-disable-next-line no-use-before-define
  private static _instance: BaseBlazeEvent;

  constructor() {}

  public static get instance() {
    if (!EventStore._instance)
      EventStore._instance = new BaseBlazeEvent({
        wildcard: true,
      });

    return this._instance;
  }
}

export const BlazeEvent = EventStore.instance;
