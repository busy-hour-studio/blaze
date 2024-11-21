import type { ZodSchema } from 'zod';
import { getReqBody, getReqQuery } from '../extractor/rest/index';
import { BlazeValidationError } from '../internal/errors/validation';
import type { RecordString, RecordUnknown } from '../types/common';
import type { Method } from '../types/rest';
import type { DataValidatorOption } from './types';

export function validateInput<T extends ZodSchema>(input: unknown, schema: T) {
  const result = schema.safeParseAsync(input);

  return result;
}

export async function validateHeader<
  M extends RecordUnknown,
  H extends RecordString,
  P extends RecordUnknown,
  Q extends RecordUnknown,
  B extends RecordUnknown,
>(options: DataValidatorOption<M, H, P, Q, B>) {
  const { ctx, honoCtx, schema, setter } = options;
  // eslint-disable-next-line prefer-destructuring
  let data = options.data;

  if (!data && honoCtx) {
    data = honoCtx.req.header();
  }

  const result = await validateInput(data, schema);

  if (result.success) {
    setter.headers(result.data);
    return;
  }

  throw new BlazeValidationError(ctx, result.error);
}

export async function validateParams<
  M extends RecordUnknown,
  H extends RecordString,
  P extends RecordUnknown,
  Q extends RecordUnknown,
  B extends RecordUnknown,
>(options: DataValidatorOption<M, H, P, Q, B>) {
  const { ctx, honoCtx, schema, setter } = options;
  // eslint-disable-next-line prefer-destructuring
  let data = options.data;

  if (!data && honoCtx) {
    data = honoCtx.req.param();
  }

  const result = await validateInput(data, schema);

  if (result.success) {
    setter.params(result.data);
    return;
  }

  throw new BlazeValidationError(ctx, result.error);
}

export async function validateQuery<
  M extends RecordUnknown,
  H extends RecordString,
  P extends RecordUnknown,
  Q extends RecordUnknown,
  B extends RecordUnknown,
>(options: DataValidatorOption<M, H, P, Q, B>) {
  const { ctx, honoCtx, schema, setter } = options;
  // eslint-disable-next-line prefer-destructuring
  let data = options.data;

  if (!data && honoCtx) {
    data = getReqQuery(honoCtx);
  }

  const result = await validateInput(data, schema);

  if (result.success) {
    setter.query(result.data);
    return;
  }

  throw new BlazeValidationError(ctx, result.error);
}

export async function validateBody<
  M extends RecordUnknown,
  H extends RecordString,
  P extends RecordUnknown,
  Q extends RecordUnknown,
  B extends RecordUnknown,
>(options: DataValidatorOption<M, H, P, Q, B>) {
  const { ctx, honoCtx, schema, setter } = options;
  // eslint-disable-next-line prefer-destructuring
  let data = options.data;

  if (!data && honoCtx) {
    const method = honoCtx.req.method.toUpperCase() as Method;

    switch (method) {
      case 'GET':
      case 'DELETE':
      case 'USE':
        return;

      default:
        data = await getReqBody(honoCtx);
        break;
    }
  }

  const result = await validateInput(data, schema);

  if (result.success) {
    setter.body(result.data);
    return;
  }

  throw new BlazeValidationError(ctx, result.error);
}
