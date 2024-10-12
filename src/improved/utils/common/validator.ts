import type { ZodSchema } from 'zod';
import { BlazeError } from '../../internal/errors/index.ts';
import type { RecordString, RecordUnknown } from '../../types/common.ts';
import type { BlazeRestMethod } from '../../types/rest.ts';
import type { BlazeDataValidatorOption } from '../../types/validator.ts';
import { getReqBody, getReqQuery } from './rest.ts';

export function validateInput<T extends ZodSchema>(input: unknown, schema: T) {
  const result = schema.safeParse(input);

  return result;
}

export function validateHeader<
  M extends RecordUnknown,
  H extends RecordString,
  P extends RecordUnknown,
  Q extends RecordUnknown,
  B extends RecordUnknown,
>(options: BlazeDataValidatorOption<M, H, P, Q, B>) {
  const { ctx, honoCtx, schema, setter, onError } = options;
  // eslint-disable-next-line prefer-destructuring
  let data = options.data;

  if (!data && honoCtx) {
    data = honoCtx.req.header();
  }

  const result = validateInput(data, schema);

  if (result.success) {
    setter.headers(result.data);
    return;
  }

  if (onError) {
    onError(ctx, result.error);
    return;
  }

  throw new BlazeError({
    errors: result.error,
    message: 'Invalid header',
    status: 400,
    name: 'Invalid header',
  });
}

export function validateParams<
  M extends RecordUnknown,
  H extends RecordString,
  P extends RecordUnknown,
  Q extends RecordUnknown,
  B extends RecordUnknown,
>(options: BlazeDataValidatorOption<M, H, P, Q, B>) {
  const { ctx, honoCtx, schema, setter, onError } = options;
  // eslint-disable-next-line prefer-destructuring
  let data = options.data;

  if (!data && honoCtx) {
    data = honoCtx.req.param();
  }

  const result = validateInput(data, schema);

  if (result.success) {
    setter.params(result.data);
    return;
  }

  if (onError) {
    onError(ctx, result.error);
    return;
  }

  throw new BlazeError({
    errors: result.error,
    message: 'Invalid params',
    status: 400,
    name: 'Invalid params',
  });
}

export function validateQuery<
  M extends RecordUnknown,
  H extends RecordString,
  P extends RecordUnknown,
  Q extends RecordUnknown,
  B extends RecordUnknown,
>(options: BlazeDataValidatorOption<M, H, P, Q, B>) {
  const { ctx, honoCtx, schema, setter, onError } = options;
  // eslint-disable-next-line prefer-destructuring
  let data = options.data;

  if (!data && honoCtx) {
    data = getReqQuery(honoCtx);
  }

  const result = validateInput(data, schema);

  if (result.success) {
    setter.query(result.data);
    return;
  }

  if (onError) {
    onError(ctx, result.error);
    return;
  }

  throw new BlazeError({
    errors: result.error,
    message: 'Invalid query',
    status: 400,
    name: 'Invalid query',
  });
}

export async function validateBody<
  M extends RecordUnknown,
  H extends RecordString,
  P extends RecordUnknown,
  Q extends RecordUnknown,
  B extends RecordUnknown,
>(options: BlazeDataValidatorOption<M, H, P, Q, B>) {
  const { ctx, honoCtx, schema, setter, onError } = options;
  // eslint-disable-next-line prefer-destructuring
  let data = options.data;

  if (!data && honoCtx) {
    const method = honoCtx.req.method.toUpperCase() as BlazeRestMethod;

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

  if (onError) {
    onError(ctx, result.error);
    return;
  }

  throw new BlazeError({
    errors: result.error,
    message: 'Invalid body',
    status: 400,
    name: 'Invalid body',
  });
}
