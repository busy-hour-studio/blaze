import type { ZodError } from 'zod';
import type { GenericStatusCode } from '../../types/rest.ts';
import type { BlazeContext } from '../context/index.ts';
import { BlazeError } from './index.ts';

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
