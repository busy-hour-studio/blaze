import { z } from '../../../../src';

export const userSchema = z.object({
  name: z.string().openapi({ example: 'John Doe' }),
  email: z.string().email().openapi({ example: 'john@doe.com' }),
  password: z.string().openapi({ example: '123456' }),
});

export type UserSchema = z.infer<typeof userSchema>;

export const userHeaderSchema = z.object({
  authorization: z.string().email().openapi({ example: 'john@doe.com' }),
});

export type UserHeaderSchema = z.infer<typeof userHeaderSchema>;

export const userParamSchema = z.object({
  email: z.string().email().openapi({ example: 'john@doe.com' }),
});

export type UserParamSchema = z.infer<typeof userParamSchema>;
