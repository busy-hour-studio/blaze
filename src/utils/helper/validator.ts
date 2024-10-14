import type { ZodSchema } from 'zod';
import { ValidationError } from '../../errors/ValidationError';
import type {
  AllDataValidatorOption,
  ContextValidation,
  DataValidatorOption,
  RecordString,
  RecordUnknown,
} from '../../types/helper';
import type { Method } from '../../types/rest';
import { isEmpty } from '../common';
import { getReqBody, getReqQuery } from './context';

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

  throw new ValidationError(ctx, result.error);
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

  throw new ValidationError(ctx, result.error);
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

  throw new ValidationError(ctx, result.error);
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

  throw new ValidationError(ctx, result.error);
}

const validationMap = {
  header: {
    validator: validateHeader,
    options: 'headers',
    schema: 'header',
  },
  params: {
    validator: validateParams,
    options: 'params',
    schema: 'params',
  },
  query: {
    validator: validateQuery,
    options: 'query',
    schema: 'query',
  },
  body: {
    validator: validateBody,
    options: 'body',
    schema: 'body',
  },
} as const;

export async function validateAll<
  M extends RecordUnknown,
  H extends RecordString,
  P extends RecordUnknown,
  Q extends RecordUnknown,
  B extends RecordUnknown,
>(options: AllDataValidatorOption<M, H, P, Q, B>) {
  const { ctx, input, validator, honoCtx, setter } = options;

  if (!validator || isEmpty(validator)) return;

  await Promise.all(
    Object.keys(validator).map((key) => {
      const validation = validationMap[key as keyof ContextValidation];
      const schema = validator[validation.schema];
      const data = input[validation.options];

      if (!validation || !schema) return;

      return validation.validator({
        ctx,
        setter,
        data,
        honoCtx,
        schema,
      });
    })
  );
}
