import type { ZodError } from 'zod';
import { BlazeContext } from '../internal';
import type { StatusCode } from '../types/rest';
import { BlazeError } from './BlazeError';

export class ValidationError extends BlazeError {
  public ctx: BlazeContext;
  public status: StatusCode;
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
