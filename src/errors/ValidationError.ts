import type { ZodError } from 'zod';
import type { BlazeContext } from '../internal/BlazeContext';
import type { GenericStatusCode } from '../types/rest';
import { BlazeError } from './BlazeError';

export class ValidationError extends BlazeError {
  public ctx: BlazeContext;
  public status: GenericStatusCode;
  public errors: ZodError;

  constructor(ctx: BlazeContext, err: ZodError) {
    super('ValidationError');
    this.ctx = ctx;
    this.errors = err;
    this.status = 400;
  }

  public toJSON() {
    return this.errors;
  }
}
