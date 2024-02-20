import type { BlazeErrorOption } from '@/types/error';
import type { RecordUnknown } from '@/types/helper';

export class BlazeError extends Error {
  public status: number;
  public errors: RecordUnknown | unknown | null;

  constructor(err: BlazeErrorOption) {
    if (typeof err === 'string') {
      super(err);
      this.status = 500;
    } else {
      super(err.message);

      this.status = err.status;
      this.errors = err.errors;
    }

    this.name = 'BlazeError';
  }
}
