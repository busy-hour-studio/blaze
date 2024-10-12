import type { RecordUnknown } from '../../types/common.ts';
import type { StatusCode } from '../../types/rest.ts';
import type { BlazeErrorOption } from './types.ts';

export class BlazeError extends Error {
  public status: StatusCode;
  public errors: RecordUnknown | unknown | null;

  constructor(err: BlazeErrorOption);
  constructor(message: string);
  constructor(message: string, status: StatusCode);
  constructor(err: BlazeErrorOption | string, status: StatusCode = 500) {
    if (typeof err === 'string') {
      super(err);
      this.status = status;
      this.name = 'BlazeError';
      return;
    }

    super(err.message);
    this.status = err.status;
    this.errors = err.errors;
    this.name = err.name ?? 'BlazeError';
  }

  public toJSON() {
    return {
      errors: this.errors,
      message: this.message,
      name: this.name,
      status: this.status,
    };
  }
}
