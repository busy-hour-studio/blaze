import type { ZodSchema } from 'zod';
import { BlazeError } from '../../internal/error';
import type { BlazeRestMethod } from '../../types/rest';
import { DataValidatorOption } from '../../types/validator';
import { REST_METHOD } from '../constant/rest';
import { getReqBody, getReqQuery } from './context';

export function validateInput<T extends ZodSchema>(input: unknown, schema: T) {
  const result = schema.safeParse(input);

  return result;
}

export function validateHeader(options: DataValidatorOption) {
  const { data, honoCtx, schema, onValidationError } = options;

  if (!data.headers && honoCtx) {
    data.headers = honoCtx.req.header();
  }

  const result = validateInput(data.headers, schema);

  if (result.success) {
    data.headers = result.data;
    return;
  }

  if (onValidationError) {
    onValidationError(result.error);
    return;
  }

  throw new BlazeError({
    errors: result.error,
    message: 'Invalid header',
    status: 400,
    name: 'Invalid header',
  });
}

export function validateParams(options: DataValidatorOption) {
  const { data, honoCtx, schema, onValidationError } = options;

  if (!data.params && honoCtx) {
    data.params = honoCtx.req.param();
  }

  const result = validateInput(data.params, schema);

  if (result.success) {
    data.params = result.data;
    return;
  }

  if (onValidationError) {
    onValidationError(result.error);
    return;
  }

  throw new BlazeError({
    errors: result.error,
    message: 'Invalid params',
    status: 400,
    name: 'Invalid params',
  });
}

export function validateQuery(options: DataValidatorOption) {
  const { data, honoCtx, schema, onValidationError } = options;

  if (!data.query && honoCtx) {
    data.query = getReqQuery(honoCtx);
  }

  const result = validateInput(data.query, schema);

  if (result.success) {
    data.query = result.data;
    return;
  }

  if (onValidationError) {
    onValidationError(result.error);
    return;
  }

  throw new BlazeError({
    errors: result.error,
    message: 'Invalid query',
    status: 400,
    name: 'Invalid query',
  });
}

export async function validateBody(options: DataValidatorOption) {
  const { data, honoCtx, schema, onValidationError } = options;

  if (!data.body && honoCtx) {
    const method = honoCtx.req.method.toUpperCase() as BlazeRestMethod;

    switch (method) {
      case REST_METHOD.GET:
      case REST_METHOD.DELETE:
      case REST_METHOD.OPTIONS:
      case REST_METHOD.HEAD:
        return;

      default:
        data.body = await getReqBody(honoCtx);
        break;
    }
  }

  const result = await validateInput(data.body, schema);

  if (result.success) {
    data.body = result.data;
    return;
  }

  if (onValidationError) {
    onValidationError(result.error);
    return;
  }

  throw new BlazeError({
    errors: result.error,
    message: 'Invalid body',
    status: 400,
    name: 'Invalid body',
  });
}
