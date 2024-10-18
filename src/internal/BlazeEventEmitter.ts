import type { EventListener, EventName } from '../types/event';
import { BlazeMap } from './BlazeMap';

type Option = {
  maxListener?: number | null;
};

export class BlazeEventEmitter {
  private $maxListeners: number;
  private $emitter: BlazeMap<EventName, Set<EventListener>>;

  constructor(options: Option) {
    this.$maxListeners = options?.maxListener ?? 100;
    this.$emitter = new BlazeMap();
  }

  public listenerCount(eventName: EventName) {
    return this.$emitter.get(eventName)?.size ?? 0;
  }

  public get maxListeners() {
    return this.$maxListeners;
  }

  public set maxListeners(value: number) {
    this.$maxListeners = value;
  }

  public emit(eventName: EventName, ...values: unknown[]) {
    if (!this.$emitter.has(eventName)) {
      return false;
    }

    this.$emitter.get(eventName)?.forEach?.((listener) => {
      listener(...values);
    });

    return true;
  }

  // eslint-disable-next-line no-use-before-define, @typescript-eslint/no-shadow
  public async emitAsync<T, U = T extends Array<infer T> ? T : T>(
    eventName: EventName,
    ...values: unknown[]
  ): Promise<U[]> {
    if (!this.$emitter.has(eventName)) {
      return [];
    }

    return Promise.all(
      [...(this.$emitter.get(eventName) ?? [])].map<U>(
        (listener) => listener(...values) as U
      )
    );
  }

  public on(eventName: EventName, listener: EventListener) {
    const listenerCount = this.listenerCount(eventName);

    if (!this.$emitter.has(eventName)) {
      this.$emitter.set(eventName, new Set());
    }

    if (listenerCount >= this.$maxListeners) return;

    this.$emitter.get(eventName)?.add(listener);
  }

  public off(eventName: EventName, listener: EventListener) {
    if (!this.$emitter.has(eventName)) return;

    this.$emitter.get(eventName)?.delete(listener);
  }

  public offAll(): void;
  public offAll(eventName: EventName): void;
  public offAll(eventName?: EventName) {
    if (eventName) {
      this.$emitter.delete(eventName);
      return;
    }

    this.$emitter.clear();
  }

  public eventNames() {
    return [...this.$emitter.keys()];
  }

  public listeners(eventName: EventName) {
    return [...(this.$emitter.get(eventName) ?? [])];
  }

  public rawListeners(eventName: EventName) {
    const listenerSet = new Set<EventListener>();

    if (this.$emitter.has(eventName)) {
      this.$emitter.get(eventName)?.forEach((listener) => {
        listenerSet.add(listener);
      });
    }

    return listenerSet;
  }

  // Aliases
  public addListener = this.on;
  public removeListener = this.off;
  public removeAllListeners = this.offAll;
}
