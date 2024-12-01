import type { ZodSchema } from 'zod';

export function validateInput<T extends ZodSchema>(input: unknown, schema: T) {
  const result = schema.safeParseAsync(input);

  return result;
}
