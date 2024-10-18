import type { ZodError } from 'zod';
import type { GenericStatusCode } from '../../types/rest';
import type { BlazeContext } from '../context/index';
import { BlazeError } from './index';

export class BlazeValidationError extends BlazeError<ZodError> {
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
