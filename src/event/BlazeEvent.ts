import { BlazeEventEmitter } from './BlazeEventEmitter';

class EventStore {
  // eslint-disable-next-line no-use-before-define
  private static _instance: BlazeEventEmitter;

  constructor() {}

  public static get instance() {
    if (!EventStore._instance) {
      EventStore._instance = new BlazeEventEmitter({});
    }

    return this._instance;
  }
}

export const BlazeEvent = EventStore.instance;
