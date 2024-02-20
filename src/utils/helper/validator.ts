import { Random, RecordUnknown } from '@/types/helper';
import { SafeParseReturnType, ZodObject, ZodRawShape } from 'zod';

export function validateInput<T extends ZodObject<ZodRawShape>>(
  input: unknown,
  schema: T
) {
  const result = schema.passthrough().safeParse(input);

  return result;
}

export function validateAction<
  Input extends { body: RecordUnknown; params: RecordUnknown },
  Validator extends Partial<{
    body: ZodObject<ZodRawShape>;
    params: ZodObject<ZodRawShape>;
  }>,
  Body extends SafeParseReturnType<
    RecordUnknown,
    Random
  > = Validator['body'] extends NonNullable<ZodObject<ZodRawShape>>
    ? SafeParseReturnType<Input['body'], Validator['body']['_output']>
    : SafeParseReturnType<Input['body'], Input['body']>,
  Params extends SafeParseReturnType<
    RecordUnknown,
    Random
  > = Validator['params'] extends NonNullable<ZodObject<ZodRawShape>>
    ? SafeParseReturnType<Input['params'], Validator['params']['_output']>
    : SafeParseReturnType<Input['params'], Input['params']>,
  Result extends {
    body: Body;
    params: Params;
  } = {
    body: Body;
    params: Params;
  },
>(input: Input, validator?: Validator) {
  let validations: Result | null = null;

  if (!validator) return validations;

  if (validator.body) {
    const body = validateInput(input.body, validator.body);

    if (!validations) validations = {} as Result;
    validations.body = body as Result['body'];
  }

  if (validator.params) {
    const params = validateInput(input.params, validator.params);

    if (!validations) validations = {} as Result;
    validations.params = params as Result['params'];
  }

  const body = validations?.body?.success ? validations.body.data : input.body;
  const param = validations?.params?.success
    ? validations.params.data
    : input.params;

  return {
    body,
    param,
    validations,
  };
}
