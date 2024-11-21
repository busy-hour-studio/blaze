import { z } from 'zod';
import type { ActionValidator } from '../../types/action';
import type { TrpcProcedure } from '../../types/trpc';
import type { BlazeServiceAction } from '../action';

export function getValidator<
  H extends z.ZodSchema = z.ZodSchema,
  P extends z.ZodSchema = z.ZodSchema,
  Q extends z.ZodSchema = z.ZodSchema,
  B extends z.ZodSchema = z.ZodSchema,
>(validator: ActionValidator<H, P, Q, B> | null | undefined) {
  const defaultValidation = z.any().nullable().default(null);

  return z.object({
    headers: validator?.header ?? defaultValidation,
    params: validator?.params ?? defaultValidation,
    query: validator?.query ?? defaultValidation,
    body: validator?.body ?? defaultValidation,
  });
}

export function trpcHandler(
  action: BlazeServiceAction,
  input: z.input<ReturnType<typeof getValidator>>
) {
  const { body = {}, headers = {}, params = {}, query = {} } = input;

  return action.actionHandler(body, params, headers, query);
}

export function getTrpcInput(
  procedure: TrpcProcedure,
  action: BlazeServiceAction
) {
  return procedure.input(getValidator(action.action.validator));
}
