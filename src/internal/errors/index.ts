import type { Random } from '../../types/common.ts';
import type { GenericStatusCode } from '../../types/rest';
import type { BlazeErrorOption } from './types.ts';

export class BlazeError<T = Random> extends Error {
  public status: GenericStatusCode;
  public errors: Random;

  constructor(err: BlazeErrorOption);
  constructor(message: string, status?: GenericStatusCode);
  constructor(err: BlazeErrorOption | string, status: GenericStatusCode = 500) {
    super(typeof err === 'string' ? err : err.message);

    if (typeof err === 'string') {
      this.status = status;
      this.name = 'BlazeError';
    } else {
      this.status = err.status;
      this.errors = err.errors;
      this.name = err.name ?? 'BlazeError';
    }
  }

  public toJSON(): T {
    return {
      errors: this.errors,
      message: this.message,
      name: this.name,
      status: this.status,
    } as T;
  }
}
