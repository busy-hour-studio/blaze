import { z } from '@busy-hour/blaze';

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

export const userQuerySchema = z
  .object({
    limit: z.coerce.number().default(10).openapi({ example: 10 }),
    page: z.coerce.number().default(1).openapi({ example: 1 }),
    offset: z.number().default(0).openapi({ example: 0 }),
  })
  .transform((params) => {
    const offset = (params.page - 1) * params.limit;

    return { ...params, offset };
  });

export type UserQuerySchema = z.infer<typeof userQuerySchema>;
