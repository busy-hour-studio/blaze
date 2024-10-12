import type { ZodSchema } from 'zod';
import type { Random } from './common.ts';

export interface BlazeActionValidator<
  H extends ZodSchema = ZodSchema,
  P extends ZodSchema = ZodSchema,
  Q extends ZodSchema = ZodSchema,
  B extends ZodSchema = ZodSchema,
> {
  header?: H | null;
  params?: P | null;
  query?: Q | null;
  body?: B | null;
}

export type AnyBlazeActionValidator = BlazeActionValidator<
  Random,
  Random,
  Random,
  Random
>;
