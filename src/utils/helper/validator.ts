import type { ZodObject, ZodRawShape } from 'zod';

export function validateInput<T extends ZodObject<ZodRawShape>>(
  input: unknown,
  schema: T
) {
  const result = schema.passthrough().safeParse(input);

  return result;
}
