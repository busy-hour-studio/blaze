export class BlazeMap<T extends string, U> {
  private $storage: Record<T, U>;

  constructor() {
    this.$storage = Object.create(null); // No prototype inheritance
  }

  set(key: T, value: U): this {
    this.$storage[key] = value;
    return this;
  }

  get(key: T): U | undefined {
    return this.$storage[key];
  }

  has(key: T): boolean {
    return key in this.$storage;
  }

  delete(key: T): boolean {
    if (key in this.$storage) {
      delete this.$storage[key];

      return true;
    }

    return false;
  }

  clear(): void {
    this.$storage = Object.create(null); // Reinitialize storage
  }

  get size(): number {
    return Object.keys(this.$storage).length;
  }

  keys(): Array<T> {
    return Object.keys(this.$storage) as Array<T>;
  }

  values(): Array<T> {
    return Object.values(this.$storage);
  }

  entries(): Array<[T, U]> {
    return Object.entries(this.$storage) as Array<[T, U]>;
  }

  forEach(callback: (value: U, key: T, map: BlazeMap<T, U>) => void): void {
    for (const [key, value] of this.entries()) {
      callback(value, key, this);
    }
  }
}
