import type { Random } from '../../types/common.ts';
import type { BlazeEventEmitterOption, BlazeEventListener } from './types.ts';

export class BlazeEventEmitter {
  private $maxListeners: number;
  private $emitter: Map<string, Set<BlazeEventListener>>;

  constructor();
  constructor(options: BlazeEventEmitterOption);
  constructor(maxListeners: number);
  constructor(options: BlazeEventEmitterOption | number = {}) {
    this.$emitter = new Map();

    if (typeof options === 'number') {
      this.$maxListeners = options;
      return;
    }

    this.$maxListeners = options?.maxListener ?? 100;
  }

  public listenerCount(eventName: string) {
    return this.$emitter.get(eventName)?.size ?? 0;
  }

  public get maxListeners() {
    return this.$maxListeners;
  }

  public set maxListeners(value: number) {
    this.$maxListeners = value;
  }

  public emit(eventName: string, ...values: Random[]) {
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
    eventName: string,
    ...values: Random[]
  ): Promise<U[]> {
    if (!this.$emitter.has(eventName)) {
      return [];
    }

    const results = await Promise.all(
      [...(this.$emitter.get(eventName) ?? [])].map(
        (listener) => listener(...values) as U
      )
    );

    return results;
  }

  public on(eventName: string, listener: BlazeEventListener) {
    const listenerCount = this.listenerCount(eventName);

    if (!this.$emitter.has(eventName)) {
      this.$emitter.set(eventName, new Set());
    }

    if (listenerCount >= this.$maxListeners) return;

    this.$emitter.get(eventName)?.add(listener);
  }

  public off(eventName: string, listener: BlazeEventListener) {
    if (!this.$emitter.has(eventName)) return;

    this.$emitter.get(eventName)?.delete(listener);
  }

  public offAll(): void;
  public offAll(eventName: string): void;
  public offAll(name?: string) {
    if (name) {
      this.$emitter.delete(name);
      return;
    }

    this.$emitter.clear();
  }

  public eventNames() {
    return [...this.$emitter.keys()];
  }

  public listeners(eventName: string) {
    return [...(this.$emitter.get(eventName) ?? [])];
  }

  // Aliases
  public addListener = this.on;
  public removeListener = this.off;
  public removeAllListeners = this.offAll;
}
